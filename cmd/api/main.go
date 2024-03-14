package main

import (
	"context"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/boards"
	boardsRepositoryPgx "git.iu7.bmstu.ru/shva20u1517/web/internal/boards/repository/pgx"
	boardsRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/boards/repository/std"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/cards"
	cardsRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/cards/repository/postgres"
	imagesRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/images/repository/s3"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/lists"
	listsRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/lists/repository/postgres"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/config"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/constants"
	pHasher "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/hasher/bcrypt"
	pLog "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/log/zap"
	pMetrics "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/metrics"
	pStorages "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/storages"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/storages/postgres"
	sessionsRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/sessions/repository/redis"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/users"
	usersRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/users/repository/postgres"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces"
	workspacesRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces/repository/postgres"
	"log"
	"net/http"
	"os"

	authUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/auth/usecase"
	boardsUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/boards/usecase"
	cardsUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/cards/usecase"
	listsUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/lists/usecase"
	usersUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/users/usecase"
	workspacesUsecase "git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces/usecase"

	authDel "git.iu7.bmstu.ru/shva20u1517/web/internal/auth/delivery/http"
	boardsDel "git.iu7.bmstu.ru/shva20u1517/web/internal/boards/delivery/http"
	cardsDel "git.iu7.bmstu.ru/shva20u1517/web/internal/cards/delivery/http"
	listsDel "git.iu7.bmstu.ru/shva20u1517/web/internal/lists/delivery/http"
	mw "git.iu7.bmstu.ru/shva20u1517/web/internal/middleware"
	usersDel "git.iu7.bmstu.ru/shva20u1517/web/internal/users/delivery/http"
	workspacesDel "git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces/delivery/http"

	_ "git.iu7.bmstu.ru/shva20u1517/web/docs"
	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	httpSwagger "github.com/swaggo/http-swagger/v2"
	"go.uber.org/zap"
)

// main godoc
//
//	@title						MyTrello API
//
//	@version					1.0
//	@description				MyTrello API documentation.
//	@termsOfService				http://127.0.0.1/terms
//
//	@contact.name				MyTrello API Support
//	@contact.url				http://127.0.0.1/support
//	@contact.email				my-trello-support@vk.com
//
//	@host						127.0.0.1
//	@BasePath					/api/v1
//	@securitydefinitions.apikey	cookieAuth
//
//	@in							cookie
//	@name						JSESSIONID
func main() {
	ctx := context.Background()

	// ===== Configuration =====
	config.SetDefaultPostgresConfig()
	config.SetDefaultRedisConfig()
	config.SetDefaultS3Config()
	config.SetDefaultValidationConfig()
	viper.SetConfigName("api")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("/configs")
	err := viper.ReadInConfig()
	if err != nil {
		log.Printf("Failed to read configuration: %v\n", err)
		os.Exit(1)
	}
	log.Printf("Configuration read successfully")

	// ===== Logger =====
	logger, logfile, err := pLog.NewProdLogger("/logs/" + viper.GetString(config.ServerName) + ".log")
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	defer func() {
		err = logger.Sync()
		if err != nil {
			log.Println(err)
		}
		err = logfile.Close()
		if err != nil {
			log.Println(err)
		}
	}()
	logger.Info("API service starting...")

	// ===== Data Storage =====
	db, err := postgres.NewStd(logger)
	if err != nil {
		os.Exit(1)
	}
	defer func() {
		err = db.Close()
		if err != nil {
			logger.Error("Failed to close Postgres connection", zap.Error(err))
		}
		logger.Info("Postgres connection closed")
	}()

	// ===== Sessions Storage =====
	redisClient, err := pStorages.NewRedis(logger, ctx)
	if err != nil {
		os.Exit(1)
	}
	defer func() {
		err = redisClient.Close()
		if err != nil {
			logger.Error("Failed to close Redis client", zap.Error(err))
		}
		logger.Info("Redis client closed")
	}()

	// ===== S3 =====
	s3Client, err := pStorages.NewS3(logger)
	if err != nil {
		os.Exit(1)
	}

	// ===== Prometheus =====
	mt := pMetrics.NewPrometheusMetrics("api")
	err = mt.SetupMetrics()
	if err != nil {
		logger.Error("failed to setup prometheus", zap.Error(err))
		os.Exit(1)
	}

	// ===== Hasher =====
	hasher := pHasher.New()

	// ===== Repositories =====
	var usersRepo users.Repository
	var workspacesRepo workspaces.Repository
	var boardsRepo boards.Repository
	var listsRepo lists.Repository
	var cardsRepo cards.Repository
	usersRepo = usersRepository.New(db, logger)
	workspacesRepo = workspacesRepository.New(db, logger)
	listsRepo = listsRepository.New(db, logger)
	cardsRepo = cardsRepository.New(db, logger)

	serverType := viper.GetString(config.ServerType)

	mode := "std"
	if mode == "std" {
		boardsRepo = boardsRepository.New(db, logger)
	} else if mode == "pgx" {
		pgxPool, err := postgres.NewPgx(logger)
		if err != nil {
			os.Exit(1)
		}

		boardsRepo = boardsRepositoryPgx.New(pgxPool, logger)
	}

	imagesRepo := imagesRepository.New(s3Client, logger)
	sessionsRepo := sessionsRepository.New(redisClient, context.Background(), logger)

	// ===== Usecases =====
	authUC := authUsecase.New(usersRepo, sessionsRepo, hasher, logger)
	usersUC := usersUsecase.New(usersRepo, imagesRepo)
	workspacesUC := workspacesUsecase.New(workspacesRepo)
	boardsUC := boardsUsecase.New(boardsRepo, imagesRepo)
	listsUC := listsUsecase.New(listsRepo)
	cardsUC := cardsUsecase.New(cardsRepo)

	// ===== Middleware =====
	checkAuth := mw.NewCheckAuth(authUC, logger)
	accessLog := mw.NewAccessLog(serverType, logger)
	cors := mw.NewCors()
	metrics := mw.NewMetrics(mt)

	router := mux.NewRouter()

	// ===== Delivery =====
	authDel.RegisterHandlers(router, authUC, usersUC, logger, checkAuth, metrics)
	usersDel.RegisterHandlers(router, usersUC, logger, checkAuth, metrics)
	workspacesDel.RegisterHandlers(router, workspacesUC, boardsUC, logger, checkAuth, metrics)
	boardsDel.RegisterHandlers(router, boardsUC, logger, checkAuth, metrics)
	listsDel.RegisterHandlers(router, listsUC, cardsUC, logger, checkAuth, metrics)
	cardsDel.RegisterHandlers(router, cardsUC, logger, checkAuth, metrics)

	// ===== Swagger =====
	router.PathPrefix(constants.ApiPrefix + "/swagger/").Handler(httpSwagger.WrapHandler).Methods(http.MethodGet)

	// ===== Router =====
	server := http.Server{
		Addr:    ":" + viper.GetString(config.ServerPort),
		Handler: accessLog(cors(router)),
	}

	logger.Info("Starting metrics...", zap.String("address", "0.0.0.0:9001"))
	go pMetrics.ServePrometheusHTTP("0.0.0.0:9001")
	logger.Info("Metrics started")

	// ===== Start =====
	logger.Info("API service started", zap.String("port", viper.GetString(config.ServerPort)))
	if err = server.ListenAndServe(); err != nil {
		logger.Error("API server stopped", zap.Error(err))
	}
}
