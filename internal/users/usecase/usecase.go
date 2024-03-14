package usecase

import (
	"context"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/images"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/config"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/constants"
	pkgErrors "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/errors"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/users"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
	"path/filepath"
)

const (
	avatarsFolder = "avatars"
)

type usecase struct {
	usersRepo users.Repository
	imgRepo   images.Repository
}

func New(rep users.Repository, imgRepo images.Repository) users.Usecase {
	return &usecase{
		usersRepo: rep,
		imgRepo:   imgRepo,
	}
}

func (uc *usecase) List() ([]models.User, error) {
	return uc.usersRepo.List()
}

func (uc *usecase) Get(id int) (models.User, error) {
	return uc.usersRepo.Get(id)
}

func (uc *usecase) GetByUsername(username string) (models.User, error) {
	return uc.usersRepo.GetByUsername(context.TODO(), username)
}

func (uc *usecase) FullUpdate(params *users.FullUpdateParams) (models.User, error) {
	if err := validateUsername(params.Username); err != nil {
		return models.User{}, err
	} else if err = validateName(params.Name); err != nil {
		return models.User{}, err
	}

	_, err := uc.usersRepo.GetByUsername(context.TODO(), params.Username)
	if !errors.Is(err, pkgErrors.ErrUserNotFound) {
		if err != nil {
			return models.User{}, err
		}
		return models.User{}, pkgErrors.ErrUserAlreadyExists
	}

	return uc.usersRepo.FullUpdate(params)
}

func (uc *usecase) PartialUpdate(params *users.PartialUpdateParams) (models.User, error) {
	if params.UpdateUsername {
		if err := validateUsername(params.Username); err != nil {
			return models.User{}, err
		}

		user, err := uc.usersRepo.GetByUsername(context.TODO(), params.Username)
		if !errors.Is(err, pkgErrors.ErrUserNotFound) && user.ID != params.ID {
			if err != nil {
				return models.User{}, err
			}
			return models.User{}, pkgErrors.ErrUserAlreadyExists
		}
	} else if params.UpdateName {
		if err := validateName(params.Name); err != nil {
			return models.User{}, err
		}
	}

	return uc.usersRepo.PartialUpdate(params)
}

func (uc *usecase) UpdateAvatar(id int, imgData []byte, filename string) (*models.User, error) {
	user, err := uc.usersRepo.Get(id)
	if err != nil {
		return nil, err
	}

	if user.Avatar == nil {
		imgName := avatarsFolder + "/" + uuid.NewString() + filepath.Ext(filename)
		imgPath, err := uc.imgRepo.Create(imgName, imgData)
		if err == nil {
			err = uc.usersRepo.UpdateAvatar(id, imgPath)
			if err == nil {
				user.Avatar = &imgPath
			}
		}
	} else {
		err = uc.imgRepo.Update(*user.Avatar, imgData)
	}

	return &user, err
}

func (uc *usecase) Delete(id int) error {
	return uc.usersRepo.Delete(id)
}

func validateUsername(username string) error {
	if len(username) < viper.GetInt(config.MinUsernameLen) {
		return pkgErrors.ErrTooShortUsername
	} else if len(username) > viper.GetInt(config.MaxUsernameLen) {
		return pkgErrors.ErrTooLongUsername
	}
	return nil
}

func validateName(name string) error {
	if len(name) < constants.MinNameLen {
		return pkgErrors.ErrEmptyName
	} else if len(name) > constants.MaxNameLen {
		return pkgErrors.ErrTooLongName
	}
	return nil
}
