import React from "react";
import "./componentes.css";

/**
 * DATOS VACIOS — estado neutro cuando la búsqueda, los filtros o la
 * paginación no arrojan resultados.
 */
export default function DatosVacios({ mensaje = "No hay resultados para mostrar." }) {
  return (
    <div className="datos-vacios">
      <p>{mensaje}</p>
    </div>
  );
}
