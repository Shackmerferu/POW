/**
 * MENU ACCIONES — botón desplegable genérico (sin Bootstrap).
 * Se cierra con clic afuera o Escape. Cada opción es { id, texto } y se
 * resuelve desde afuera con `alElegir(id)`.
 */

import React, { useEffect, useRef, useState } from "react";
import "./componentes.css";

export default function MenuAcciones({ etiqueta = "Acciones", opciones = [], alElegir, deshabilitado = false }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;

    const clicAfuera = (evento) => {
      if (ref.current && !ref.current.contains(evento.target)) setAbierto(false);
    };
    const teclaEscape = (evento) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", clicAfuera);
    document.addEventListener("keydown", teclaEscape);
    return () => {
      document.removeEventListener("mousedown", clicAfuera);
      document.removeEventListener("keydown", teclaEscape);
    };
  }, [abierto]);

  return (
    <div className="menu-acciones" ref={ref}>
      <button
        type="button"
        className="menu-acciones__toggle"
        onClick={() => setAbierto(!abierto)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        disabled={deshabilitado}
      >
        {etiqueta} ▾
      </button>

      {abierto && (
        <ul className="menu-acciones__lista" role="menu">
          {opciones.map((opcion) => (
            <li key={opcion.id} role="none">
              <button
                type="button"
                role="menuitem"
                className={`menu-acciones__item${opcion.separadorAntes ? " menu-acciones__item--separador" : ""}`}
                onClick={() => {
                  setAbierto(false);
                  alElegir(opcion.id);
                }}
              >
                {opcion.texto}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
