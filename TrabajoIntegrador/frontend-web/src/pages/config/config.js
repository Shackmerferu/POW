import React from "react";
import HeaderGeneral from "../../componentes/HeaderGeneral";
import "./config.css";

export const API_URL = "http://localhost:8000/api";

export default function Config() {
  return (
    <div className="config-page">
      <HeaderGeneral />
      <main className="config-page__contenido">
        <h1>Configuración</h1>
        <p>Módulo de configuración del sistema.</p>
      </main>
    </div>
  );
}
