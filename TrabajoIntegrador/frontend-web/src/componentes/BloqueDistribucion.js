import React from "react";
import "./componentes.css";

/**
 * BLOQUE DISTRIBUCION — mini gráfico de barras (divs, sin librerías) para
 * mostrar cuántos convenios hay por estado/tipo/unidad/año.
 *
 * @param {string} titulo  encabezado del bloque
 * @param {Array<{item: string, cantidad: number}>} franjas
 */
export default function BloqueDistribucion({ titulo, franjas = [] }) {
  const maximo = Math.max(1, ...franjas.map((franja) => franja.cantidad));

  return (
    <section className="bloque-distribucion">
      <h3 className="bloque-distribucion__titulo">{titulo}</h3>
      {franjas.length === 0 && (
        <p className="bloque-distribucion__vacio">Sin datos para mostrar</p>
      )}
      <ul className="bloque-distribucion__lista">
        {franjas.map((franja) => (
          <li className="bloque-distribucion__franja" key={franja.item}>
            <span className="bloque-distribucion__item">{franja.item}</span>
            <span className="bloque-distribucion__pista">
              <span
                className="bloque-distribucion__barra"
                style={{ width: `${(franja.cantidad / maximo) * 100}%` }}
              />
            </span>
            <span className="bloque-distribucion__cantidad">{franja.cantidad}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
