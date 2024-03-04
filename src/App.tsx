import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';

import SignInPage from './components/pages/SignInPage';
import SignUpPage from './components/pages/SignUpPage';
import WorkspacesPage from './components/pages/WorkspacesPage';
import BoardPage from './components/pages/BoardPage';
import SettingsPage from './components/pages/SettingsPage';
import CardPage from './components/pages/CardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
        <Route path="/cards/:id" element={<CardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<WorkspacesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
