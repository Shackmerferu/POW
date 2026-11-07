import React from "react";
import { puedeAdministrarUsuarios } from "../utils/permisos";
import "./componentes.css";

/**
 * MENU LATERAL — navegación izquierda con 4 incisos. Cambia el contenido
 * del main a la derecha y resalta la pestaña activa con un tono sutil y
 * claro del azul institucional (#1f4f99).
 */
const ICONOS = {
  metricas: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="12" width="5" height="9" />
      <rect x="10" y="6" width="5" height="15" />
      <rect x="17" y="9" width="5" height="12" />
    </svg>
  ),
  administracion: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="5" />
      <rect x="3" y="10" width="8" height="10" />
      <rect x="13" y="10" width="8" height="10" />
    </svg>
  ),
  vencimientos: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" />
      <rect x="7" y="9" width="4" height="4" />
      <rect x="13" y="9" width="4" height="4" />
      <rect x="7" y="15" width="4" height="4" />
    </svg>
  ),
};

export default function MenuLateral({ pestañaActiva, alSeleccionar, usuario, onCerrar }) {
  const incisos = [
    { id: "metricas", texto: "Métricas" },
    { id: "administracion", texto: "Administración" },
    ...(puedeAdministrarUsuarios(usuario)
      ? [{ id: "roles", texto: "Roles" }]
      : []),
    { id: "vencimientos", texto: "Vencimientos" },
  ];

  return (
    <aside className="menu-lateral">
      <div className="menu-lateral__sup">
        <p className="menu-lateral__marca-sub">Panel de gestión</p>
      </div>

      <nav className="menu-lateral__nav" aria-label="Secciones del panel">
        <ul>
          {incisos.map((inciso) => (
            <li key={inciso.id}>
              <button
                type="button"
                className={`menu-lateral__inciso${
                  inciso.id === pestañaActiva ? " menu-lateral__inciso--activo" : ""
                }`}
                onClick={() => alSeleccionar(inciso.id)}
                aria-current={inciso.id === pestañaActiva ? "page" : undefined}
              >
                <span className="menu-lateral__icono">{ICONOS[inciso.id]}</span>
                <span>{inciso.texto}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu-lateral__pie">
        <p className="menu-lateral__usuario-nombre">{usuario?.nombre_completo ?? "— sin usuario —"}</p>
        <p className="menu-lateral__usuario-dato">
          {usuario?.legajo ?? "invitado"}{usuario?.rol ? ` · ${usuario.rol}` : ""}
        </p>
        <button type="button" className="menu-lateral__salir" onClick={onCerrar}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
