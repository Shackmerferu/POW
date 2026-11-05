import React from "react";
import "./componentes.css";

/**
 * FILTRO BUSQUEDA — controles de filtro usados por Administración:
 * búsqueda por texto + select tipo + select estado + select unidad +
 * rango de fechas de firma. Todos son controlados.
 *
 * @param {object} filtros objeto de estado: { texto, tipo, estado, unidad, desde, hasta }
 * @param {Function} onChange (campo, valor) => setFiltros
 * @param {Array<{id: number, nombre: string}>} unidades para el select
 * @param {Function} onLimpiar botón "Limpiar"
 */
export default function FiltroBusqueda({ filtros, onChange, unidades, onLimpiar }) {
  const TIPOS = [
    { valor: "", texto: "Todos los tipos" },
    { valor: "marco_colaboracion", texto: "Marco de colaboración" },
    { valor: "especifico_colaboracion", texto: "Colaboración específica" },
    { valor: "marco_pasantia", texto: "Marco de pasantía" },
    { valor: "especifico_pasantia", texto: "Pasantía específica" },
    { valor: "adenda", texto: "Adenda" },
  ];

  const ESTADOS = [
    { valor: "", texto: "Todos los estados" },
    { valor: "borrador", texto: "Borrador" },
    { valor: "revision", texto: "Revisión" },
    { valor: "aprobado", texto: "Aprobado" },
    { valor: "firmado", texto: "Firmado" },
    { valor: "rescindido", texto: "Rescindido" },
    { valor: "archivado", texto: "Archivado" },
  ];

  return (
    <div className="filtro-busqueda">
      <label className="filtro-busqueda__campo filtro-busqueda__campo--texto">
        <span>Buscar por texto</span>
        <input
          type="search"
          value={filtros.texto}
          placeholder="Buscar por código único o título…"
          onChange={(evento) => onChange("texto", evento.target.value)}
        />
      </label>

      <label className="filtro-busqueda__campo">
        <span>Tipo</span>
        <select value={filtros.tipo} onChange={(evento) => onChange("tipo", evento.target.value)}>
          {TIPOS.map((op) => (
            <option key={op.valor} value={op.valor}>{op.texto}</option>
          ))}
        </select>
      </label>

      <label className="filtro-busqueda__campo">
        <span>Estado</span>
        <select value={filtros.estado} onChange={(evento) => onChange("estado", evento.target.value)}>
          {ESTADOS.map((op) => (
            <option key={op.valor} value={op.valor}>{op.texto}</option>
          ))}
        </select>
      </label>

      <label className="filtro-busqueda__campo">
        <span>Unidad</span>
        <select value={filtros.unidad} onChange={(evento) => onChange("unidad", evento.target.value)}>
          <option value="">Todas las unidades</option>
          {unidades.map((unidad) => (
            <option key={unidad.id} value={String(unidad.id)}>{unidad.nombre}</option>
          ))}
        </select>
      </label>

      <label className="filtro-busqueda__campo">
        <span>Firma desde</span>
        <input
          type="date"
          value={filtros.desde}
          onChange={(evento) => onChange("desde", evento.target.value)}
        />
      </label>

      <label className="filtro-busqueda__campo">
        <span>Firma hasta</span>
        <input
          type="date"
          value={filtros.hasta}
          onChange={(evento) => onChange("hasta", evento.target.value)}
        />
      </label>

      <button type="button" className="btn-panel btn-panel--neutro" onClick={onLimpiar}>
        Limpiar
      </button>
    </div>
  );
}
