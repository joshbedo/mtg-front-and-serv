import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserNameEntry } from '../pages/UserNameEntry';
import { LobbyList } from '../pages/LobbyList';
import { GameRoom } from '../pages/GameRoom';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserNameEntry />} />
      <Route
        path="/lobbies"
        element={
          <ProtectedRoute>
            <LobbyList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/:roomId"
        element={
          <ProtectedRoute>
            <GameRoom />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}