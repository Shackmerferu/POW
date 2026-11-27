import React, { useEffect, useState } from "react";
import "./config.css";
import HeaderPrincipal from "../../componentes/HeaderPrincipal/HeaderPrincipal";
import {
  leerPreferencias,
  guardarPreferencias,
  PREFS_POR_DEFECTO,
  TAMANOS_TEXTO,
} from "../../utils/accesibilidad";
import { obtenerUsuario } from "../../utils/sesion";

/** Página de Configuración.
 *  Aplica los estándares del TPI (WCAG 2.1 / ISO 9241-210) con controles
 *  reales: tamaño de texto, alto contraste y reducción de animaciones.
 *  Las preferencias se guardan en localStorage y afectan a toda la app. */
function Config() {
  const [prefs, setPrefs] = useState(PREFS_POR_DEFECTO);
  const [aviso, setAviso] = useState("");

  // Carga las preferencias guardadas al abrir la página.
  useEffect(() => {
    setPrefs(leerPreferencias());
  }, []);

  const cambiar = (preferencias, texto) => {
    setPrefs(preferencias);
    guardarPreferencias(preferencias);
    // 3.3.1 / 4.1.3: la región aria-live anuncia el cambio en voz alta.
    setAviso(texto);
  };

  const cambiarTexto = (tamanoTexto) =>
    cambiar(
      { ...prefs, tamanoTexto },
      `Tamaño de texto: ${TAMANOS_TEXTO[tamanoTexto].etiqueta}.`,
    );

  const cambiarContraste = (contrasteAlto) =>
    cambiar(
      { ...prefs, contrasteAlto },
      contrasteAlto
        ? "Alto contraste activado."
        : "Contraste estándar activado.",
    );

  const cambiarAnimaciones = (animacionesReducidas) =>
    cambiar(
      { ...prefs, animacionesReducidas },
      animacionesReducidas
        ? "Animaciones reducidas activadas."
        : "Animaciones activadas.",
    );

  return (
    <div className="config-page">
      <HeaderPrincipal usuario={obtenerUsuario()} />

      <main className="config-page__contenido">
        <h1>Configuración</h1>
        <p className="config-page__intro">
          Ajustá la presentación del sistema a tus necesidades. Los cambios se
          aplican al instante y quedan guardados para tus próximas sesiones.
          Podés moverte por esta página con la tecla Tab y activar cada opción
          con Espacio o Enter.
        </p>

        {/* --- Accesibilidad (WCAG 2.1) ---------------------------------- */}
        <section aria-labelledby="config-accesibilidad">
          <h2 id="config-accesibilidad">Accesibilidad</h2>

          <fieldset className="config-grupo">
            <legend>Tamaño del texto</legend>
            <div className="config-opciones">
              {Object.entries(TAMANOS_TEXTO).map(([clave, opcion]) => (
                <label
                  className="config-opcion"
                  htmlFor={`texto-${clave}`}
                  key={clave}
                >
                  <input
                    type="radio"
                    id={`texto-${clave}`}
                    name="tamaño-texto"
                    checked={prefs.tamanoTexto === clave}
                    onChange={() => cambiarTexto(clave)}
                  />
                  <span>{opcion.etiqueta}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="config-grupo">
            <legend>Contraste y movimiento</legend>
            <div className="config-opciones config-opciones--columna">
              <label className="config-opcion" htmlFor="contraste-alto">
                <input
                  type="checkbox"
                  id="contraste-alto"
                  checked={prefs.contrasteAlto}
                  onChange={(e) => cambiarContraste(e.target.checked)}
                />
                <span>
                  Alto contraste
                  <small>
                    Colores con contraste máximo para leer mejor (WCAG 1.4.3).
                  </small>
                </span>
              </label>
              <label className="config-opcion" htmlFor="animaciones-reducidas">
                <input
                  type="checkbox"
                  id="animaciones-reducidas"
                  checked={prefs.animacionesReducidas}
                  onChange={(c) => cambiarAnimaciones(c.target.checked)}
                />
                <span>
                  Reducir animaciones
                  <small>
                    Quita transiciones y efectos de movimiento (WCAG 2.3.3).
                  </small>
                </span>
              </label>
            </div>
          </fieldset>

          {/* Región viva: anuncia cada cambio de configuración. */}
          <p className="config-aviso" aria-live="polite">
            {aviso}
          </p>
        </section>

        {/* --- Privacidad y datos (ISO 9241-210) ------------------------- */}
        <section aria-labelledby="config-datos">
          <h2 id="config-datos">Tus datos en este equipo</h2>
          <fieldset className="config-grupo">
            <legend>Sesión</legend>
            <div className="config-opciones config-opciones--columna">
              <label className="config-opcion" htmlFor="mostrar-datos">
                <input
                  type="checkbox"
                  id="mostrar-datos"
                  onChange={(e) => {
                    if (!e.target.checked) return;
                    const usuario = obtenerUsuario();
                    const nombre =
                      usuario?.nombre_completo ?? usuario?.legajo ?? null;
                    setAviso(
                      nombre
                        ? `Sesión iniciada como ${nombre}. Solo en este equipo.`
                        : "No hay sesión activa en este equipo.",
                    );
                  }}
                />
                <span>
                  Ver mis datos guardados
                  <small>
                    Muestra qué información de sesión guarda este navegador
                    (privacidad: ningún dato viaja a la API).
                  </small>
                </span>
              </label>
            </div>
          </fieldset>
        </section>
      </main>
    </div>
  );
}

export default Config;
