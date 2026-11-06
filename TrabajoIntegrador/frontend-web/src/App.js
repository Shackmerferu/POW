import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { puedeAccederA, rutaInicioPorRol, RUTAS } from "./utils/permisos";
import { obtenerUsuario } from "./utils/sesion";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Convenios from "./pages/convenios/convenios";
import Config from "./pages/config/config";
import "./App.css";

const RutaProtegida = ({ ruta }) => {
  const usuario = obtenerUsuario();

  if (!usuario) {
    return <Navigate to={RUTAS.LOGIN} replace />;
  }

  if (!puedeAccederA(ruta, usuario)) {
    return <Navigate to={rutaInicioPorRol(usuario)} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={rutaInicioPorRol(obtenerUsuario())} replace />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RutaProtegida ruta={RUTAS.PANEL} />}>
          <Route path={RUTAS.PANEL} element={<Dashboard />} />
        </Route>

        <Route element={<RutaProtegida ruta={RUTAS.CONVENIOS} />}>
          <Route path={RUTAS.CONVENIOS} element={<Convenios />} />
        </Route>

        <Route element={<RutaProtegida ruta={RUTAS.CONFIGURACION} />}>
          <Route path={RUTAS.CONFIGURACION} element={<Config />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
