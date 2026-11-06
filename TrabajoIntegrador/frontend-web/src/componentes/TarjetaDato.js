import React from "react";
import "./componentes.css";

/**
 * TARJETA DATO — ficha chica de estadística para el panel de métricas.
 * Número grande arriba, descripción corta abajo, sin adornos.
 */
export default function TarjetaDato({ titulo, cantidad, detalle }) {
  return (
    <article className="tarjeta-dato">
      <p className="tarjeta-dato__titulo">{titulo}</p>
      <p className="tarjeta-dato__cantidad">{cantidad}</p>
      {detalle && <p className="tarjeta-dato__detalle">{detalle}</p>}
    </article>
  );
}
