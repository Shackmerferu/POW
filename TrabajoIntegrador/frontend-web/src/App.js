import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Convenios from "./pages/convenios/convenios";
import "./App.css";


const PrivateRoute = () => {
  const activeUser = localStorage.getItem("active_user");

  
  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }


  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Navigate to="/login" replace />} />

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/convenios" element={<Convenios />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;