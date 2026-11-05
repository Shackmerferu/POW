import React from "react";
import "./componentes.css";

/**
 * VENTANA MODAL — sobre de la ficha de detalle. Cierra con la cruz o con
 * la tecla Escape; también clic afuera.
 */
export default function VentanaModal({ abierto, titulo, onCerrar, children }) {
  React.useEffect(() => {
    if (!abierto) return undefined;
    const cerrar = (evento) => {
      if (evento.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-fondo" onClick={onCerrar} role="presentation">
      <section
        className="modal-ficha"
        role="dialog"
        aria-modal="true"
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="modal-ficha__cabecera">
          <h2>{titulo}</h2>
          <button type="button" className="modal-ficha__cerrar" onClick={onCerrar} aria-label="Cerrar ficha">
            ✕
          </button>
        </header>
        <div className="modal-ficha__cuerpo">{children}</div>
      </section>
    </div>
  );
}
