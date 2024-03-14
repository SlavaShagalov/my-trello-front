package usecase

import (
	"git.iu7.bmstu.ru/shva20u1517/web/internal/models"
	pkgErrors "git.iu7.bmstu.ru/shva20u1517/web/internal/pkg/errors"
	pkgWorkspaces "git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces"
	"git.iu7.bmstu.ru/shva20u1517/web/internal/workspaces/mocks"
	"github.com/golang/mock/gomock"
	"github.com/pkg/errors"
	"reflect"
	"testing"
)

func TestUsecase_Create(t *testing.T) {
	type fields struct {
		repo      *mocks.MockRepository
		params    *pkgWorkspaces.CreateParams
		workspace *models.Workspace
	}

	type testCase struct {
		prepare   func(f *fields)
		params    *pkgWorkspaces.CreateParams
		workspace models.Workspace
		err       error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Create(f.params).Return(*f.workspace, nil)
			},
			params:    &pkgWorkspaces.CreateParams{Title: "University", Description: "BMSTU workspace", UserID: 27},
			workspace: models.Workspace{ID: 21, UserID: 27, Title: "University", Description: "BMSTU workspace"},
			err:       nil,
		},
		"user not found": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Create(f.params).Return(*f.workspace, pkgErrors.ErrUserNotFound)
			},
			params:    &pkgWorkspaces.CreateParams{Title: "University", Description: "BMSTU workspace", UserID: 27},
			workspace: models.Workspace{},
			err:       pkgErrors.ErrUserNotFound,
		},
		"storages error": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Create(f.params).Return(*f.workspace, pkgErrors.ErrDb)
			},
			params:    &pkgWorkspaces.CreateParams{Title: "University", Description: "BMSTU workspace", UserID: 27},
			workspace: models.Workspace{},
			err:       pkgErrors.ErrDb,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), params: test.params, workspace: &test.workspace}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			workspace, err := uc.Create(test.params)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
			if workspace != test.workspace {
				t.Errorf("\nExpected: %v\nGot: %v", test.workspace, workspace)
			}
		})
	}
}

func TestUsecase_List(t *testing.T) {
	type fields struct {
		repo       *mocks.MockRepository
		userID     int
		workspaces []models.Workspace
	}

	type testCase struct {
		prepare    func(f *fields)
		userID     int
		workspaces []models.Workspace
		err        error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().List(f.userID).Return(f.workspaces, nil)
			},
			userID: 27,
			workspaces: []models.Workspace{
				{ID: 21, UserID: 27, Title: "University", Description: "BMSTU workspace"},
				{ID: 22, UserID: 27, Title: "Work", Description: "Work workspace"},
				{ID: 23, UserID: 27, Title: "Life", Description: "Life workspace"},
			},
			err: nil,
		},
		"empty result": {
			prepare: func(f *fields) {
				f.repo.EXPECT().List(f.userID).Return(f.workspaces, nil)
			},
			userID:     27,
			workspaces: []models.Workspace{},
			err:        nil,
		},
		"user not found": {
			prepare: func(f *fields) {
				f.repo.EXPECT().List(f.userID).Return(f.workspaces, pkgErrors.ErrUserNotFound)
			},
			userID:     27,
			workspaces: nil,
			err:        pkgErrors.ErrUserNotFound,
		},
		"db error": {
			prepare: func(f *fields) {
				f.repo.EXPECT().List(f.userID).Return(f.workspaces, pkgErrors.ErrDb)
			},
			userID:     27,
			workspaces: nil,
			err:        pkgErrors.ErrDb,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), userID: test.userID, workspaces: test.workspaces}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			workspaces, err := uc.List(test.userID)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
			if !reflect.DeepEqual(workspaces, test.workspaces) {
				t.Errorf("\nExpected: %v\nGot: %v", test.workspaces, workspaces)
			}
		})
	}
}

func TestUsecase_Get(t *testing.T) {
	type fields struct {
		repo        *mocks.MockRepository
		workspaceID int
		workspace   *models.Workspace
	}

	type testCase struct {
		prepare     func(f *fields)
		workspaceID int
		workspace   models.Workspace
		err         error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Get(f.workspaceID).Return(*f.workspace, nil)
			},
			workspaceID: 21,
			workspace:   models.Workspace{ID: 21, UserID: 27, Title: "University", Description: "BMSTU workspace"},
			err:         nil,
		},
		"user not found": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Get(f.workspaceID).Return(*f.workspace, pkgErrors.ErrUserNotFound)
			},
			workspaceID: 21,
			workspace:   models.Workspace{},
			err:         pkgErrors.ErrUserNotFound,
		},
		"storages error": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Get(f.workspaceID).Return(*f.workspace, pkgErrors.ErrDb)
			},
			workspaceID: 21,
			workspace:   models.Workspace{},
			err:         pkgErrors.ErrDb,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), workspaceID: test.workspaceID, workspace: &test.workspace}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			workspace, err := uc.Get(test.workspaceID)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
			if workspace != test.workspace {
				t.Errorf("\nExpected: %v\nGot: %v", test.workspace, workspace)
			}
		})
	}
}

func TestFullUpdate(t *testing.T) {
	type fields struct {
		repo      *mocks.MockRepository
		params    *pkgWorkspaces.FullUpdateParams
		workspace *models.Workspace
	}

	type testCase struct {
		prepare   func(f *fields)
		params    *pkgWorkspaces.FullUpdateParams
		workspace models.Workspace
		err       error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().FullUpdate(f.params).Return(*f.workspace, nil)
			},
			params:    &pkgWorkspaces.FullUpdateParams{ID: 21, Title: "University", Description: "BMSTU workspace"},
			workspace: models.Workspace{ID: 21, UserID: 27, Title: "University", Description: "BMSTU workspace"},
			err:       nil,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), params: test.params, workspace: &test.workspace}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			workspace, err := uc.FullUpdate(test.params)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
			if workspace != test.workspace {
				t.Errorf("\nExpected: %v\nGot: %v", test.workspace, workspace)
			}
		})
	}
}

func TestPartialUpdate(t *testing.T) {
	type fields struct {
		repo      *mocks.MockRepository
		params    *pkgWorkspaces.PartialUpdateParams
		workspace *models.Workspace
	}

	type testCase struct {
		prepare   func(f *fields)
		params    *pkgWorkspaces.PartialUpdateParams
		workspace models.Workspace
		err       error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().PartialUpdate(f.params).Return(*f.workspace, nil)
			},
			params: &pkgWorkspaces.PartialUpdateParams{
				ID:                21,
				Title:             "University",
				UpdateTitle:       true,
				Description:       "BMSTU workspace",
				UpdateDescription: true,
			},
			workspace: models.Workspace{ID: 21, UserID: 27, Title: "University", Description: "BMSTU workspace"},
			err:       nil,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), params: test.params, workspace: &test.workspace}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			workspace, err := uc.PartialUpdate(test.params)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
			if workspace != test.workspace {
				t.Errorf("\nExpected: %v\nGot: %v", test.workspace, workspace)
			}
		})
	}
}

func TestUsecase_Delete(t *testing.T) {
	type fields struct {
		repo        *mocks.MockRepository
		workspaceID int
	}

	type testCase struct {
		prepare     func(f *fields)
		workspaceID int
		err         error
	}

	tests := map[string]testCase{
		"normal": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Delete(f.workspaceID).Return(nil)
			},
			workspaceID: 21,
			err:         nil,
		},
		"workspace not found": {
			prepare: func(f *fields) {
				f.repo.EXPECT().Delete(f.workspaceID).Return(pkgErrors.ErrWorkspaceNotFound)
			},
			workspaceID: 21,
			err:         pkgErrors.ErrWorkspaceNotFound,
		},
	}

	for name, test := range tests {
		test := test
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			f := fields{repo: mocks.NewMockRepository(ctrl), workspaceID: test.workspaceID}
			if test.prepare != nil {
				test.prepare(&f)
			}

			uc := New(f.repo)
			err := uc.Delete(test.workspaceID)
			if !errors.Is(err, test.err) {
				t.Errorf("\nExpected: %s\nGot: %s", test.err, err)
			}
		})
	}
}
