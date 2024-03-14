package users

import (
	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
)

type Usecase interface {
	List() ([]models.User, error)
	Get(id int) (models.User, error)
	GetByUsername(username string) (models.User, error)
	FullUpdate(params *FullUpdateParams) (models.User, error)
	PartialUpdate(params *PartialUpdateParams) (models.User, error)
	UpdateAvatar(id int, imgData []byte, filename string) (*models.User, error)
	Delete(id int) error
}
