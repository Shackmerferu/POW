/**
 * HEADER GENERAL — barra navegacional superior compartida por TODAS las
 * páginas (convenios, panel de gestión, configuración).
 * Toma el header de convenios.js (logo + marca + Mi Perfil) y le agrega
 * accesos directos entre las pestañas generales.
 */

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoFacultad from "../cosas/imagenes/logo.png";
import persona from "../cosas/imagenes/persona.png";
import {
  puedeVerConfiguracion,
  puedeVerPanel,
} from "../utils/permisos";
import { limpiarSesion, obtenerUsuario } from "../utils/sesion";
import "./headerGeneral.css";

export default function HeaderGeneral() {
  const navigate = useNavigate();
  const usuario = obtenerUsuario();

  const cerrarSesion = () => {
    limpiarSesion();
    navigate("/login", { replace: true });
  };

  const claseSegun = ({ isActive }) =>
    `header-bar__link${isActive ? " header-bar__link--activo" : ""}`;

  return (
    <header className="header-bar">
      <Link className="header-bar__marca" to="/convenios">
        <img className="header-bar__logo" src={logoFacultad} alt="Facultad de Ingeniería" />
        <span>SISTEMA CONVENIOS</span>
      </Link>

      {/* Accesos directos entre pestañas generales */}
      <nav className="header-bar__nav" aria-label="Pestañas generales">
        <NavLink to="/convenios" className={claseSegun}>
          Convenios
        </NavLink>
        {puedeVerPanel(usuario) && (
          <NavLink to="/dashboard" className={claseSegun}>
            Panel de gestión
          </NavLink>
        )}
      </nav>

      {/* Menú de perfil (despliega con Bootstrap, ya cargado globalmente) */}
      <div className="dropdown header-bar__perfil-zona">
        <button
          type="button"
          className="header-bar__perfil dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img className="header-bar__persona" src={persona} alt="" />
          Mi Perfil
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <h6 className="dropdown-header">Menu</h6>
          </li>
          {puedeVerConfiguracion(usuario) && (
            <li>
              <Link className="dropdown-item" to="/config">
                Configuración
              </Link>
            </li>
          )}
          {puedeVerPanel(usuario) && (
            <li>
              <Link className="dropdown-item" to="/dashboard">
                Panel Administrativo
              </Link>
            </li>
          )}
          <li>
            <button type="button" className="dropdown-item" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
