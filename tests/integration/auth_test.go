package integration

import (
	"context"
	"database/sql"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/opentel"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/storages/postgres"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/users"
	"github.com/stretchr/testify/assert"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"log"
	"os"
	"testing"

	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/config"

	pkgErrors "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/errors"
	pkgHasher "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/hasher/bcrypt"
	pkgZap "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/log/zap"
	pkgDb "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/storages"

	pkgAuth "git.iu7.bmstu.ru/shva20u1517/web/internal/auth"
	authUC "git.iu7.bmstu.ru/shva20u1517/web/internal/auth/usecase"
	sessionsRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/sessions/repository/redis"
	usersRepository "git.iu7.bmstu.ru/shva20u1517/web/internal/users/repository/postgres"
)

type AuthSuite struct {
	suite.Suite
	db        *sql.DB
	rdb       *redis.Client
	log       *zap.Logger
	logfile   *os.File
	usersRepo users.Repository
	uc        pkgAuth.Usecase
	tp        *sdktrace.TracerProvider
	mp        *sdkmetric.MeterProvider
	ctx       context.Context
}

func (s *AuthSuite) SetupSuite() {
	s.ctx = context.Background()

	var err error
	s.log, s.logfile, err = pkgZap.NewTestLogger("/logs/auth.log")
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}

	config.SetTestPostgresConfig()
	s.db, err = postgres.NewStd(s.log)
	s.Require().NoError(err)

	config.SetTestRedisConfig()
	ctx := context.Background()
	s.rdb, err = pkgDb.NewRedis(s.log, ctx)
	s.Require().NoError(err)

	// Set up OpenTelemetry.
	serviceName := "test"
	serviceVersion := "0.1.0"
	s.tp, s.mp, err = opentel.SetupOTelSDK(context.Background(), s.log, serviceName, serviceVersion)
	if err != nil {
		return
	}

	s.usersRepo = usersRepository.New(s.db, s.log)
	sessionsRepo := sessionsRepository.New(s.rdb, ctx, s.log)
	hasher := pkgHasher.New()
	s.uc = authUC.New(s.usersRepo, sessionsRepo, hasher, s.log)
}

func (s *AuthSuite) TearDownSuite() {
	err := s.db.Close()
	s.Require().NoError(err)
	s.log.Info("DB connection closed")

	err = s.rdb.Close()
	s.Require().NoError(err)
	s.log.Info("Redis connection closed")

	err = s.log.Sync()
	if err != nil {
		log.Println(err)
	}
	err = s.logfile.Close()
	if err != nil {
		log.Println(err)
	}

	_ = s.tp.Shutdown(s.ctx)
	_ = s.mp.Shutdown(s.ctx)
	s.log.Info("OpenTelemetry shutdown")
}

func (s *AuthSuite) TestSignIn() {
	type testCase struct {
		params *pkgAuth.SignInParams
		user   models.User
		err    error
	}

	tests := map[string]testCase{
		"normal": {
			params: &pkgAuth.SignInParams{
				Username: "slava",
				Password: "12345678",
			},
			user: models.User{
				ID:       1,
				Username: "slava",
				Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
				Email:    "slava@vk.com",
				Name:     "Slava",
			},
			err: nil,
		},
		"wrong password": {
			params: &pkgAuth.SignInParams{
				Username: "slava",
				Password: "12345679",
			},
			user: models.User{},
			err:  pkgErrors.ErrWrongLoginOrPassword,
		},
		"user not found": {
			params: &pkgAuth.SignInParams{
				Username: "noname",
				Password: "12345678",
			},
			user: models.User{},
			err:  pkgErrors.ErrUserNotFound,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			ctx, span := opentel.Tracer.Start(context.Background(), "TestSignIn "+name)
			defer span.End()

			user, authToken, err := s.uc.SignIn(ctx, test.params)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			assert.Equal(s.T(), test.user.ID, user.ID, "incorrect user ID")
			assert.Equal(s.T(), test.user.Username, user.Username, "incorrect Username")
			assert.Equal(s.T(), test.user.Password, user.Password, "incorrect Password")
			assert.Equal(s.T(), test.user.Email, user.Email, "incorrect Email")
			assert.Equal(s.T(), test.user.Name, user.Name, "incorrect Name")

			if err == nil {
				assert.NotEmpty(s.T(), authToken, "incorrect AuthToken")

				_, err = s.uc.CheckAuth(ctx, user.ID, authToken)
				assert.NoError(s.T(), err, "unexpected unauthorized")

				err = s.uc.Logout(ctx, user.ID, authToken)
				assert.NoError(s.T(), err, "failed to logout user")
			}
		})
	}
}

func (s *AuthSuite) TestSignUp() {
	type testCase struct {
		params *pkgAuth.SignUpParams
		user   models.User
		err    error
	}

	tests := map[string]testCase{
		"normal": {
			params: &pkgAuth.SignUpParams{
				Name:     "New User",
				Username: "new_user",
				Email:    "new_user@vk.com",
				Password: "12345678",
			},
			user: models.User{
				Username: "new_user",
				Email:    "new_user@vk.com",
				Name:     "New User",
			},
			err: nil,
		},
		"user with such username already exists": {
			params: &pkgAuth.SignUpParams{
				Name:     "New Slava",
				Username: "slava",
				Email:    "new_slava@vk.com",
				Password: "123456789",
			},
			user: models.User{},
			err:  pkgErrors.ErrUserAlreadyExists,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			ctx, span := opentel.Tracer.Start(context.Background(), "TestSignUp "+name)
			defer span.End()

			user, authToken, err := s.uc.SignUp(ctx, test.params)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			assert.Equal(s.T(), test.user.Username, user.Username, "incorrect Username")
			assert.Equal(s.T(), test.user.Email, user.Email, "incorrect Email")
			assert.Equal(s.T(), test.user.Name, user.Name, "incorrect Name")

			if err == nil {
				assert.NotEmpty(s.T(), authToken, "incorrect AuthToken")

				_, err = s.uc.CheckAuth(ctx, user.ID, authToken)
				assert.NoError(s.T(), err, "unexpected unauthorized")

				err = s.uc.Logout(ctx, user.ID, authToken)
				assert.NoError(s.T(), err, "failed to logout user")

				err = s.usersRepo.Delete(user.ID)
				assert.NoError(s.T(), err, "failed to delete user")
			}
		})
	}
}

func (s *AuthSuite) TestCheckAuth() {
	type testCase struct {
		userID    int
		authToken string
		err       error
	}

	// prepare session for tests
	user, validAuthToken, err := s.uc.SignIn(context.Background(), &pkgAuth.SignInParams{
		Username: "slava",
		Password: "12345678",
	})
	assert.NoError(s.T(), err, "unexpected error")

	tests := map[string]testCase{
		"normal": {
			userID:    1,
			authToken: validAuthToken,
			err:       nil,
		},
		"session not found due to incorrect token": {
			userID:    1,
			authToken: "invalid_token",
			err:       pkgErrors.ErrSessionNotFound,
		},
		"session not found due to incorrect user id": {
			userID:    2,
			authToken: validAuthToken,
			err:       pkgErrors.ErrSessionNotFound,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			ctx, span := opentel.Tracer.Start(context.Background(), "TestCheckAuth "+name)
			defer span.End()

			userID, err := s.uc.CheckAuth(ctx, test.userID, test.authToken)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				assert.Equal(s.T(), test.userID, userID, "incorrect user ID")
			}
		})
	}

	// delete prepared session
	err = s.uc.Logout(context.Background(), user.ID, validAuthToken)
	assert.NoError(s.T(), err, "failed to logout user")
}

func (s *AuthSuite) TestLogout() {
	type testCase struct {
		userID    int
		authToken string
		err       error
	}

	// prepare session for tests
	user, validAuthToken, err := s.uc.SignIn(context.Background(), &pkgAuth.SignInParams{
		Username: "slava",
		Password: "12345678",
	})
	assert.NoError(s.T(), err, "unexpected error")

	tests := map[string]testCase{
		"session not found due to incorrect token": {
			userID:    1,
			authToken: "invalid_token",
			err:       pkgErrors.ErrSessionNotFound,
		},
		"session not found due to incorrect user id": {
			userID:    2,
			authToken: validAuthToken,
			err:       pkgErrors.ErrSessionNotFound,
		},
		"normal": {
			userID:    1,
			authToken: validAuthToken,
			err:       nil,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			ctx, span := opentel.Tracer.Start(context.Background(), "TestLogout "+name)
			defer span.End()

			err = s.uc.Logout(ctx, test.userID, test.authToken)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				_, err = s.uc.CheckAuth(ctx, user.ID, test.authToken)
				assert.ErrorIs(s.T(), err, pkgErrors.ErrSessionNotFound, "unexpected error")
			}
		})
	}
}

func TestAuthSuite(t *testing.T) {
	suite.Run(t, new(AuthSuite))
}
