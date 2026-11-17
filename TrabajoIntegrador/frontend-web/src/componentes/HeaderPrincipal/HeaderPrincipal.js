// Barra superior compartida por las páginas (búsqueda de convenios,
// configuración, …). Logo + título + menú desplegable con las opciones
// que el rol del usuario tiene permitido ver, y cierre de sesión.
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderPrincipal.css";
import { limpiarSesion } from "../../utils/sesion";
import { puedeVerConfiguracion, puedeVerPanel } from "../../utils/permisos";
import logoFacultad from "../../utils/imagenes/logo.png";
import menu from "../../utils/imagenes/list.svg";

function HeaderPrincipal({ usuario }) {
  const navigate = useNavigate();

  function handleLogout() {
    limpiarSesion();
    navigate("/login", { replace: true });
  }

  return (
    <header className="top-navigation">
      <div className="brand">
        <img
          className="brand__logo"
          src={logoFacultad}
          alt="Facultad de Ingeniería"
        />
        <p className="brand__title">SISTEMA CONVENIOS</p>

        <nav className="navigation" aria-label="Navegación principal">
          <div className="dropdown flex-direction-row ">
            <button
              className="btn dropdown-toggle m-auto"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={menu}
                className="pe-2"
                alt="Flecha indicativa Label"
              />{" "}
              Menu
            </button>
            <ul className="dropdown-menu">
              <li>
                <h6 className="dropdown-header">Menu</h6>
              </li>
              <li>
                <a className="dropdown-item" href="/convenios">
                  Busqueda
                </a>
              </li>
              {puedeVerPanel(usuario) && (
                <li>
                  <a className="dropdown-item" href="/dashboard">
                    Panel Administrativo
                  </a>
                </li>
              )}
              {puedeVerConfiguracion(usuario) && (
                <li>
                  <a className="dropdown-item" href="/config">
                    Configuración
                  </a>
                </li>
              )}
              <li>
                <button
                  className="dropdown-item logout-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default HeaderPrincipal;
