import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userName = useUserStore((state) => state.name);
  if (!userName) return <Navigate to="/" replace />;
  return <>{children}</>;
}