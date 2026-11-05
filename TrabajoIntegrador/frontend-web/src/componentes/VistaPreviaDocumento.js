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

import React from "react";
import MenuAcciones from "./MenuAcciones";
import "./componentes.css";

const ETIQUETAS_ACCION = {
  editar: "Editar en Office / web",
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

export default function VistaPreviaDocumento({ documento, alElegirAccion, aviso }) {
  const esUrlReal =
    documento?.ruta_archivo && /^(https?:|blob:|data:)/.test(documento.ruta_archivo);

  return (
    <section className="vista-previa">
      <header className="vista-previa__cabecera">
        <div>
          <p className="vista-previa__tipo">
            {NOMBRES_DOCUMENTO[documento?.tipo_documento] ?? "Documento"}
            {documento?.version ? ` · versión ${documento.version}` : ""}
          </p>
          <p className="vista-previa__nombre">{documento?.nombre_archivo ?? "—"}</p>
          <p className="vista-previa__meta">
            {documento
              ? `${formatoTamano(documento.tamano_kb)} · subido el ${documento.fecha_subida} · ${documento.subido_por ?? "—"}`
              : "Sin documento seleccionado"}
          </p>
        </div>
        <MenuAcciones
          etiqueta="Acciones"
          opciones={Object.entries(ETIQUETAS_ACCION).map(([id, texto]) => ({
            id,
            texto,
            separadorAntes: id === "aprobar", // línea antes de aprobar/rechazar
          }))}
          alElegir={(id) => alElegirAccion(id, documento)}
          deshabilitado={!documento}
        />
      </header>

      <div className="vista-previa__marco">
        {esUrlReal ? (
          <iframe
            className="vista-previa__iframe"
            src={documento.ruta_archivo}
            title={`Vista previa de ${documento.nombre_archivo}`}
          />
        ) : documento ? (
          <HojaSimulada />
        ) : (
          <p className="vista-previa__vacio">Sin archivo asociado</p>
        )}
      </div>

      {aviso && <p className="vista-previa__aviso">{aviso}</p>}

      {/* Nota de integridad, igual que exige el registro de documentos */}
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
