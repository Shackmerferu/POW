import React from "react";
import "./componentes.css";

/**
 * PAGINACION — barra simple: anterior, páginas numeradas, siguiente.
 * Mantiene la cantidad de filas por página controlada desde fuera.
 */
export default function Paginacion({ pagina, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null;

  const paginas = [];
  for (let numero = 1; numero <= totalPaginas; numero += 1) {
    paginas.push(numero);
  }

  return (
    <nav className="paginacion" aria-label="Paginación de resultados">
      <button
        type="button"
        className="paginacion__flecha"
        onClick={() => onChange(pagina - 1)}
        disabled={pagina <= 1}
      >
        ‹ Anterior
      </button>

      {paginas.map((numero) => (
        <button
          type="button"
          key={numero}
          className={`paginacion__pagina${numero === pagina ? " paginacion__pagina--activa" : ""}`}
          onClick={() => onChange(numero)}
          aria-current={numero === pagina ? "page" : undefined}
        >
          {numero}
        </button>
      ))}

      <button
        type="button"
        className="paginacion__flecha"
        onClick={() => onChange(pagina + 1)}
        disabled={pagina >= totalPaginas}
      >
        Siguiente ›
      </button>
    </nav>
  );
}
