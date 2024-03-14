package integration

import (
	"context"
	"database/sql"
	imgMocks "git.iu7.bmstu.ru/shva20u1517/web/internal/images/mocks"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/opentel"
	pkgDb "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/storages/postgres"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.uber.org/zap"
	"log"
	"os"
	"testing"

	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/config"

	pkgErrors "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/errors"
	pkgZap "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/log/zap"
	pkgUsers "git.iu7.bmstu.ru/shva20u1517/web/internal/users"
	usersRepo "git.iu7.bmstu.ru/shva20u1517/web/internal/users/repository/postgres"
	usersUC "git.iu7.bmstu.ru/shva20u1517/web/internal/users/usecase"
)

type UsersSuite struct {
	suite.Suite
	db      *sql.DB
	log     *zap.Logger
	logfile *os.File
	repo    pkgUsers.Repository
	uc      pkgUsers.Usecase
	tp      *sdktrace.TracerProvider
	mp      *sdkmetric.MeterProvider
	ctx     context.Context
}

func (s *UsersSuite) SetupSuite() {
	s.ctx = context.Background()

	var err error
	s.log, s.logfile, err = pkgZap.NewTestLogger("/logs/users.log")
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}

	config.SetTestPostgresConfig()
	config.SetDefaultValidationConfig()
	s.db, err = pkgDb.NewStd(s.log)
	s.Require().NoError(err)

	// Set up OpenTelemetry.
	serviceName := "test"
	serviceVersion := "0.1.0"
	s.tp, s.mp, err = opentel.SetupOTelSDK(context.Background(), s.log, serviceName, serviceVersion)
	if err != nil {
		return
	}

	ctrl := gomock.NewController(s.T())
	defer ctrl.Finish()

	s.repo = usersRepo.New(s.db, s.log)
	imgRepo := imgMocks.NewMockRepository(ctrl)
	s.uc = usersUC.New(s.repo, imgRepo)
}

func (s *UsersSuite) TearDownSuite() {
	err := s.db.Close()
	s.Require().NoError(err)
	s.log.Info("DB connection closed")

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
}

func (s *UsersSuite) TestList() {
	type testCase struct {
		users []models.User
		err   error
	}

	tests := map[string]testCase{
		"normal": {
			users: []models.User{
				{
					ID:       1,
					Username: "slava",
					Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
					Email:    "slava@vk.com",
					Name:     "Slava",
				},
				{
					ID:       2,
					Username: "kirill",
					Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
					Email:    "kirill@vk.com",
					Name:     "Kirill",
				},
				{
					ID:       3,
					Username: "petya",
					Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
					Email:    "petya@vk.com",
					Name:     "Petya",
				},
				{
					ID:       4,
					Username: "evgenii",
					Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
					Email:    "evgenii@vk.com",
					Name:     "Evgenii",
				},
			},
			err: nil,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			users, err := s.uc.List()
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				assert.Equal(s.T(), len(test.users), len(users), "incorrect users length")
				for i := 0; i < len(test.users); i++ {
					assert.Equal(s.T(), test.users[i].ID, users[i].ID, "incorrect userID")
					assert.Equal(s.T(), test.users[i].Username, users[i].Username, "incorrect Username")
					assert.Equal(s.T(), test.users[i].Password, users[i].Password, "incorrect Password")
					assert.Equal(s.T(), test.users[i].Email, users[i].Email, "incorrect Email")
					assert.Equal(s.T(), test.users[i].Name, users[i].Name, "incorrect Name")
				}
			}
		})
	}
}

func (s *UsersSuite) TestGet() {
	type testCase struct {
		userID int
		user   models.User
		err    error
	}

	tests := map[string]testCase{
		"normal": {
			userID: 3,
			user: models.User{
				ID:       3,
				Username: "petya",
				Password: "$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS",
				Email:    "petya@vk.com",
				Name:     "Petya",
			},
			err: nil,
		},
		"user not found": {
			userID: 999,
			user:   models.User{},
			err:    pkgErrors.ErrUserNotFound,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			user, err := s.uc.Get(test.userID)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				assert.Equal(s.T(), test.user.ID, user.ID, "incorrect userID")
				assert.Equal(s.T(), test.user.Username, user.Username, "incorrect Username")
				assert.Equal(s.T(), test.user.Password, user.Password, "incorrect Password")
				assert.Equal(s.T(), test.user.Email, user.Email, "incorrect Email")
				assert.Equal(s.T(), test.user.Name, user.Name, "incorrect Name")
			}
		})
	}
}

func (s *UsersSuite) TestFullUpdate() {
	type testCase struct {
		params *pkgUsers.FullUpdateParams
		err    error
	}

	tests := map[string]testCase{
		"normal": {
			params: &pkgUsers.FullUpdateParams{
				Username: "new_username",
				Email:    "new_email@vk.com",
				Name:     "New Name",
			},
			err: nil,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			tempUser, err := s.repo.Create(context.Background(), &pkgUsers.CreateParams{
				Name:           "Temp User",
				Username:       "temp_user",
				Email:          "temp_user@vk.com",
				HashedPassword: "hashed_pswd",
			})
			assert.NoError(s.T(), err, "failed to create temp user")

			test.params.ID = tempUser.ID
			user, err := s.uc.FullUpdate(test.params)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				// check updated user
				assert.Equal(s.T(), test.params.ID, user.ID, "incorrect ID")
				assert.Equal(s.T(), test.params.Name, user.Name, "incorrect Name")
				assert.Equal(s.T(), test.params.Username, user.Username, "incorrect Username")
				assert.Equal(s.T(), test.params.Email, user.Email, "incorrect Email")

				// check user in storages
				getUser, err := s.uc.Get(user.ID)
				assert.NoError(s.T(), err, "failed to fetch user from the database")
				assert.Equal(s.T(), user.ID, getUser.ID, "incorrect userID")
				assert.Equal(s.T(), user.Name, getUser.Name, "incorrect Name")
				assert.Equal(s.T(), user.Username, getUser.Username, "incorrect Username")
				assert.Equal(s.T(), user.Email, getUser.Email, "incorrect Email")
			}

			err = s.uc.Delete(tempUser.ID)
			require.NoError(s.T(), err, "failed to delete temp user")
		})
	}
}

func (s *UsersSuite) TestPartialUpdate() {
	type testCase struct {
		params *pkgUsers.PartialUpdateParams
		user   models.User
		err    error
	}

	tests := map[string]testCase{
		"full update": {
			params: &pkgUsers.PartialUpdateParams{
				Username:       "new_username",
				UpdateUsername: true,
				Email:          "new_email@vk.com",
				UpdateEmail:    true,
				Name:           "New Name",
				UpdateName:     true,
			},
			user: models.User{
				Username: "new_username",
				Email:    "new_email@vk.com",
				Name:     "New Name",
			},
			err: nil,
		},
		"only name update": {
			params: &pkgUsers.PartialUpdateParams{
				Name:       "New Name",
				UpdateName: true,
			},
			user: models.User{
				Name:     "New Name",
				Username: "temp_user",
				Email:    "temp_user@vk.com",
			},
			err: nil,
		},
		"only username update": {
			params: &pkgUsers.PartialUpdateParams{
				Username:       "new_username",
				UpdateUsername: true,
			},
			user: models.User{
				Name:     "Temp User",
				Username: "new_username",
				Email:    "temp_user@vk.com",
			},
			err: nil,
		},
		"only email update": {
			params: &pkgUsers.PartialUpdateParams{
				Email:       "new_email@vk.com",
				UpdateEmail: true,
			},
			user: models.User{
				Name:     "Temp User",
				Username: "temp_user",
				Email:    "new_email@vk.com",
			},
			err: nil,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			tempUser, err := s.repo.Create(context.Background(), &pkgUsers.CreateParams{
				Name:           "Temp User",
				Username:       "temp_user",
				Email:          "temp_user@vk.com",
				HashedPassword: "hashed_pswd",
			})
			require.NoError(s.T(), err, "failed to create temp user")

			test.params.ID = tempUser.ID
			user, err := s.uc.PartialUpdate(test.params)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if err == nil {
				// check updated user
				assert.Equal(s.T(), test.params.ID, user.ID, "incorrect userID")
				assert.Equal(s.T(), test.user.Name, user.Name, "incorrect Name")
				assert.Equal(s.T(), test.user.Username, user.Username, "incorrect Username")
				assert.Equal(s.T(), test.user.Email, user.Email, "incorrect Email")

				// check user in storages
				getUser, err := s.uc.Get(user.ID)
				assert.NoError(s.T(), err, "failed to fetch user from the database")
				assert.Equal(s.T(), test.user.Name, getUser.Name, "incorrect Name")
				assert.Equal(s.T(), test.user.Username, getUser.Username, "incorrect Username")
				assert.Equal(s.T(), test.user.Email, getUser.Email, "incorrect Email")
			}

			err = s.uc.Delete(tempUser.ID)
			require.NoError(s.T(), err, "failed to delete temp user")
		})
	}
}

func (s *UsersSuite) TestDelete() {
	type testCase struct {
		setupUser func() (models.User, error)
		err       error
	}

	tests := map[string]testCase{
		"normal": {
			setupUser: func() (models.User, error) {
				return s.repo.Create(context.Background(), &pkgUsers.CreateParams{
					Name:           "Temp User",
					Username:       "temp_user",
					Email:          "temp_user@vk.com",
					HashedPassword: "hashed_pswd",
				})
			},
			err: nil,
		},
		"user not found": {
			setupUser: func() (models.User, error) {
				return models.User{ID: 999}, nil
			},
			err: pkgErrors.ErrUserNotFound,
		},
	}

	for name, test := range tests {
		s.Run(name, func() {
			user, err := test.setupUser()
			s.Require().NoError(err)

			err = s.uc.Delete(user.ID)
			assert.ErrorIs(s.T(), err, test.err, "unexpected error")

			if test.err == nil {
				_, err = s.uc.Get(user.ID)
				assert.ErrorIs(s.T(), err, pkgErrors.ErrUserNotFound, "user should be deleted")
			}
		})
	}
}

func TestUserSuite(t *testing.T) {
	suite.Run(t, new(UsersSuite))
}
