/**
 * VISTA PREVIA DOCUMENTO — muestra una vista previa del archivo asociado al
 * convenio y un menú desplegable ("dropdown") con acciones:
 *   · Editar en Office / web
 *   · Comparar cambios
 *   · Descargar
 *   · Subir nueva versión
 *   · Aprobar o rechazar
 *
 * Si `documento.ruta_archivo` es una URL real (http/blob/data) se incrusta
 * el PDF en un iframe; en el demo (rutas internas ficticias) se muestra una
 * hoja simulada con los datos del archivo, para no depender del backend.
 */

import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import MenuAcciones from "../MenuAcciones/MenuAcciones";
import "./VistaPreviaDocumento.css";

const ETIQUETAS_ACCION = {
  editar: "Ver en Office / web",
  comparar: "Comparar cambios",
  descargar: "Descargar",
  subir: "Subir nueva versión",
  aprobar: "Aprobar o rechazar",
};

const NOMBRES_DOCUMENTO = {
  principal: "Principal",
  anexo: "Anexo",
  dictamen: "Dictamen",
  resolucion: "Resolución",
  otro: "Otro",
};

export default function VistaPreviaDocumento({
  documento,
  alElegirAccion,
  aviso,
  rolUsuario,
}) {
  const [urlPdf, setUrlPdf] = useState(null);
  const [cargandoPdf, setCargandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState("");

  const documentoId = documento?.id ?? null;

  useEffect(() => {
    const controlador = new AbortController();
    let urlTemporal = null;

    setUrlPdf(null);
    setErrorPdf("");

    if (documentoId === null) {
      setCargandoPdf(false);
      return () => controlador.abort();
    }

    async function cargarPdf() {
      setCargandoPdf(true);

      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `${API_URL}/documents/${documentoId}/view`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            signal: controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(`La API respondió con estado ${respuesta.status}.`);
        }

        const archivo = await respuesta.blob();
        urlTemporal = URL.createObjectURL(archivo);
        setUrlPdf(urlTemporal);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("No se pudo cargar la vista previa:", error);
          setErrorPdf("No se pudo cargar la vista previa del documento.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoPdf(false);
        }
      }
    }

    cargarPdf();

    return () => {
      controlador.abort();
      if (urlTemporal) {
        URL.revokeObjectURL(urlTemporal);
      }
    };
  }, [documentoId]);

  return (
    <section className="vista-previa">
      <header className="vista-previa__cabecera">
        <div>
          <p className="vista-previa__tipo">
            {NOMBRES_DOCUMENTO[documento?.tipo_documento] ?? "Documento"}
            {documento?.version ? ` · versión ${documento.version}` : ""}
          </p>
          <p className="vista-previa__nombre">
            {documento?.nombre_archivo ?? "—"}
          </p>
          <p className="vista-previa__meta">
            {documento
              ? `${formatoTamano(documento.tamano_kb)} · subido el ${documento.fecha_subida} · ${documento.subido_por ?? "—"}`
              : "Sin documento seleccionado"}
          </p>
        </div>

        <MenuAcciones
  etiqueta="Acciones"
  opciones={Object.entries(ETIQUETAS_ACCION).map(([id, texto]) => {
    const esConsulta =
      String(rolUsuario ?? "").trim().toLowerCase() === "consulta";

    return {
      id,
      texto,
      separadorAntes: id === "aprobar",

      // Consulta no puede aprobar/rechazar ni subir versiones.
      deshabilitada:
        esConsulta && (id === "aprobar" || id === "subir"),
    };
  })}
  alElegir={(id) => alElegirAccion(id, documento)}
  deshabilitado={!documento}
/>
      </header>

      <div className="vista-previa__marco">
        {cargandoPdf ? (
          <p className="vista-previa__vacio">Cargando documento…</p>
        ) : errorPdf ? (
          <p className="vista-previa__vacio" role="alert">{errorPdf}</p>
        ) : urlPdf ? (
          <iframe
            className="vista-previa__iframe"
            src={urlPdf}
            title={`Vista previa de ${documento?.nombre_archivo ?? "documento"}`}
          />
        ) : documento ? (
          <HojaSimulada />
        ) : (
          <p className="vista-previa__vacio">Sin archivo asociado</p>
        )}
      </div>

      {aviso && <p className="vista-previa__aviso">{aviso}</p>}

      {documento?.hash_sha256 && (
        <p className="vista-previa__nota">
          Integridad SHA-256: {documento.hash_sha256}
        </p>
      )}
    </section>
  );
}

/** Hoja simulada: contiene la ficha del archivo en el mock, sin backends. */
function HojaSimulada() {
  return (
    <div className="vista-previa__hoja" role="img" aria-label="Vista previa simulada del documento">
      <span className="vista-previa__linea vista-previa__linea--titulo" />
      <span className="vista-previa__linea" style={{ width: "88%" }} />
      <span className="vista-previa__linea" style={{ width: "74%" }} />
      <span className="vista-previa__linea" style={{ width: "92%" }} />
      <span className="vista-previa__linea" style={{ width: "60%" }} />
      <span className="vista-previa__linea vista-previa__linea--firma" />
      <p className="vista-previa__band">Vista previa simulada</p>
    </div>
  );
}

/** Formatea el tamaño (kb) del documento. */
function formatoTamano(kb) {
  if (!kb && kb !== 0) return "Tamaño —";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}
