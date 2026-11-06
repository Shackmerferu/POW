import React from "react";
import "./componentes.css";

/**
 * ETIQUETAS — pastillas neutras (sin colores semafóricos) para estado y tipo.
 * Solo texto y un fondo gris azuladísimo que no opaca la lectura.
 */
const ETIQUETAS_ESTADO = {
  borrador: "Borrador",
  revision: "Revisión",
  aprobado: "Aprobado",
  firmado: "Firmado",
  rescindido: "Rescindido",
  archivado: "Archivado",
};

const ETIQUETAS_TIPO = {
  marco_colaboracion: "Marco de colaboración",
  especifico_colaboracion: "Colaboración específica",
  marco_pasantia: "Marco de pasantía",
  especifico_pasantia: "Pasantía específica",
  adenda: "Adenda",
};

export function EtiquetaEstado({ estado }) {
  return <span className="etiqueta">{ETIQUETAS_ESTADO[estado] ?? estado ?? "—"}</span>;
}

export function EtiquetaTipo({ tipo }) {
  return <span className="etiqueta etiqueta--tipo">{ETIQUETAS_TIPO[tipo] ?? tipo ?? "—"}</span>;
}

export function EtiquetaRol({ rol }) {
  const textos = {
    administracion: "Administración",
    gestion: "Gestión",
    revision: "Revisión",
    consulta: "Consulta",
  };
  return <span className="etiqueta etiqueta--rol">{textos[rol] ?? rol ?? "—"}</span>;
}
