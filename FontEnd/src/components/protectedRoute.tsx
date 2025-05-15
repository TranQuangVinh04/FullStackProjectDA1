import React from 'react';
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authe.store';
import Loading from './Loading';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLogin, isLoading, authUser } = useAuthStore();
  const location = useLocation();

  // Đợi autherChecking hoàn tất
  if (isLoading) {
    return <Loading />;
  }

  // Chỉ redirect khi đã check auth xong và không có user
  if (!isLoading && !isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;