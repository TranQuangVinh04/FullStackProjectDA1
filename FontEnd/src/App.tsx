import React from "react";
import Login from './components/login'
import Register from './components/register'
import Profile from './components/Profile'
import { Routes,Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from './store/authe.store';
import Loading from './components/Loading'; 
import './App.css'
import { useEffect } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/protectedRoute';
import Home from "./components/Home";
import Edit from "./components/Edit";
import ChangePasswordForm from "./components/changePassword";
function App() {
  const {autherChecking ,isLoading ,authUser ,isLogin} = useAuthStore();
  useEffect(() => {
    autherChecking();
  }, []);
  
  if(isLoading && !authUser){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }
  return (
    <>
  <Routes>
      {/* Trang không dùng Layout */}
      <Route path="/login" element={isLogin ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isLogin ? <Navigate to="/" replace /> : <Register />} />

      {/* Trang dùng Layout */}
      {isLogin ? (
        <Route path="/" element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />

          <Route
            path="/:username"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
              
            }
            
          />
          <Route
            path={`${authUser._id}/edit`}
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${authUser._id}/change-password`}
            element={
              <ProtectedRoute>
                <ChangePasswordForm />
              </ProtectedRoute>
            }
          />
        </Route>
        
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* Redirect nếu không khớp */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      <Toaster/>
    </>
  )
}

export default App
