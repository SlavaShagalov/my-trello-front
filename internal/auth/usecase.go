package auth

import (
	"context"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
)

type SignInParams struct {
	Username string
	Password string
}

type SignUpParams struct {
	Name     string
	Username string
	Email    string
	Password string
}

type Usecase interface {
	SignIn(ctx context.Context, params *SignInParams) (models.User, string, error)
	SignUp(ctx context.Context, params *SignUpParams) (models.User, string, error)
	CheckAuth(ctx context.Context, userID int, authToken string) (int, error)
	Logout(ctx context.Context, userID int, authToken string) error
}
