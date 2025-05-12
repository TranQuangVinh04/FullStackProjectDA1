import Login from './components/login'
import Register from './components/register'
import { Routes,Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from './store/authe.store';
import Loading from './components/Loading'; 
import './App.css'
import { useEffect } from 'react';

function App() {
  const {autherChecking ,isLoading ,authUser ,isLogin} = useAuthStore();
  useEffect(() => {
    autherChecking();
  }, [autherChecking]);
  if(isLoading && !authUser){
    return <Loading />
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={ isLogin ? <h1>Home</h1> : <Navigate to ="/Login" />}/>
        <Route path="/Login" element={isLogin ? <Navigate to="/" /> : <Login />}/>
        <Route path="/Register" element={isLogin ? <Navigate to="/" /> : <Register />}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
