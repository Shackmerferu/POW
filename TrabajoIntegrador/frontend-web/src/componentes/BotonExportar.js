import React from "react";
import "./componentes.css";

/**
 * BOTON EXPORTAR — par de botones CSV / PDF que usan las utilidades de
 * exportaciones. Se desactivan cuando no hay filas que exportar.
 */
export default function BotonExportar({ onCsv, onPdf, deshabilitado = false }) {
  return (
    <div className="boton-exportar">
      <button type="button" className="btn-panel" onClick={onCsv} disabled={deshabilitado}>
        Exportar CSV
      </button>
      <button type="button" className="btn-panel btn-panel--neutro" onClick={onPdf} disabled={deshabilitado}>
        Exportar PDF
      </button>
    </div>
  );
}
