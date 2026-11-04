import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Convenios from "./pages/convenios/convenios";
import "./App.css";

// COMPONENTE GUARDIÁN (Protege las rutas privadas)
const PrivateRoute = () => {
  const activeUser = localStorage.getItem("active_user");

  // Si no hay un usuario activo guardado en localStorage, redirige al Login
  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  // Si la sesión existe, permite el paso hacia la pantalla solicitada
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto: al ingresar a la raíz '/', lleva al Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ----------------- RUTAS PÚBLICAS ----------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ----------------- RUTAS PROTEGIDAS ----------------- */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/convenios" element={<Convenios />} />
        </Route>

        {/* Ruta para capturar cualquier dirección inexistente */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;