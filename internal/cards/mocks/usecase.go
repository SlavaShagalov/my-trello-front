// Code generated by MockGen. DO NOT EDIT.
// Source: internal/cards/usecase.go

// Package mocks is a generated GoMock package.
package mocks

import (
	reflect "reflect"

	cards "git.iu7.bmstu.ru/shva20u1517/web/internal/cards"
	models "git.iu7.bmstu.ru/shva20u1517/web/internal/models"
	gomock "github.com/golang/mock/gomock"
)

// MockUsecase is a mock of Usecase interface.
type MockUsecase struct {
	ctrl     *gomock.Controller
	recorder *MockUsecaseMockRecorder
}

// MockUsecaseMockRecorder is the mock recorder for MockUsecase.
type MockUsecaseMockRecorder struct {
	mock *MockUsecase
}

// NewMockUsecase creates a new mock instance.
func NewMockUsecase(ctrl *gomock.Controller) *MockUsecase {
	mock := &MockUsecase{ctrl: ctrl}
	mock.recorder = &MockUsecaseMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockUsecase) EXPECT() *MockUsecaseMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockUsecase) Create(params *cards.CreateParams) (models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", params)
	ret0, _ := ret[0].(models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Create indicates an expected call of Create.
func (mr *MockUsecaseMockRecorder) Create(params interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockUsecase)(nil).Create), params)
}

// Delete mocks base method.
func (m *MockUsecase) Delete(id int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Delete", id)
	ret0, _ := ret[0].(error)
	return ret0
}

// Delete indicates an expected call of Delete.
func (mr *MockUsecaseMockRecorder) Delete(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Delete", reflect.TypeOf((*MockUsecase)(nil).Delete), id)
}

// FullUpdate mocks base method.
func (m *MockUsecase) FullUpdate(params *cards.FullUpdateParams) (models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FullUpdate", params)
	ret0, _ := ret[0].(models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FullUpdate indicates an expected call of FullUpdate.
func (mr *MockUsecaseMockRecorder) FullUpdate(params interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FullUpdate", reflect.TypeOf((*MockUsecase)(nil).FullUpdate), params)
}

// Get mocks base method.
func (m *MockUsecase) Get(id int) (models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Get", id)
	ret0, _ := ret[0].(models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Get indicates an expected call of Get.
func (mr *MockUsecaseMockRecorder) Get(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Get", reflect.TypeOf((*MockUsecase)(nil).Get), id)
}

// ListByList mocks base method.
func (m *MockUsecase) ListByList(listID int) ([]models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListByList", listID)
	ret0, _ := ret[0].([]models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListByList indicates an expected call of ListByList.
func (mr *MockUsecaseMockRecorder) ListByList(listID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListByList", reflect.TypeOf((*MockUsecase)(nil).ListByList), listID)
}

// ListByTitle mocks base method.
func (m *MockUsecase) ListByTitle(title string, userID int) ([]models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListByTitle", title, userID)
	ret0, _ := ret[0].([]models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListByTitle indicates an expected call of ListByTitle.
func (mr *MockUsecaseMockRecorder) ListByTitle(title, userID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListByTitle", reflect.TypeOf((*MockUsecase)(nil).ListByTitle), title, userID)
}

// PartialUpdate mocks base method.
func (m *MockUsecase) PartialUpdate(params *cards.PartialUpdateParams) (models.Card, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "PartialUpdate", params)
	ret0, _ := ret[0].(models.Card)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// PartialUpdate indicates an expected call of PartialUpdate.
func (mr *MockUsecaseMockRecorder) PartialUpdate(params interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "PartialUpdate", reflect.TypeOf((*MockUsecase)(nil).PartialUpdate), params)
}
