import React from "react";
import DatosVacios from "./DatosVacios";
import "./componentes.css";

/**
 * TABLA — grilla genérica de grilla rectangular sin rayas de colores.
 * Las columnas se declaran una sola vez: { titulo, ancho?, mostrar? propia.
 *
 * @param {Array<{titulo: string, ancho?: string}>} columnas
 * @param {Function} filaRender (fila, indice) => <tr> ya armado
 * @param {Array} filas datos ya paginados/filtrados
 */
export default function Tabla({ columnas, filas, filaRender, mensajeVacio }) {
  return (
    <div className="tabla-envoltura">
      {filas.length > 0 ? (
        <table className="tabla">
          <thead>
            <tr>
              {columnas.map((columna) => (
                <th key={columna.titulo} style={columna.ancho ? { width: columna.ancho } : undefined}>
                  {columna.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, indice) => filaRender(fila, indice))}
          </tbody>
        </table>
      ) : (
        <DatosVacios mensaje={mensajeVacio} />
      )}
    </div>
  );
}
