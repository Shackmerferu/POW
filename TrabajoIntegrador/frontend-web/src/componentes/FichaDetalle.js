import React, { useEffect, useMemo, useState } from "react";
import VentanaModal from "./VentanaModal";
import { EtiquetaEstado, EtiquetaTipo } from "./Etiqueta";
import VistaPreviaDocumento from "./VistaPreviaDocumento";
import "./componentes.css";
import {
  formatoBoolean,
  formatoEntero,
  formatoFecha,
  nombreUnidad,
  textoVigencia,
  calcularVigencia,
} from "../utils/formatos";

const NOMBRES_DOCUMENTO = {
  principal: "Principal",
  anexo: "Anexo",
  dictamen: "Dictamen",
  resolucion: "Resolución",
  otro: "Otro",
};

const ETIQUETAS_ACCION = {
  editar: "Editar en Office / web",
  comparar: "Comparar cambios",
  descargar: "Descargar",
  subir: "Subir nueva versión",
  aprobar: "Aprobar o rechazar",
};

/**
 * FICHA DETALLE — modal legible de un convenio. Muestra la parametrización
 * completa: código, título, tipo, unidad, estado, objeto, alcance,
 * obligaciones, condiciones de rescisión, marco legal, resolución,
 * expediente, renovación, confidencialidad, notas, fechas (firma, inicio,
 * vencimiento, preaviso), partes/representantes, relaciones entre
 * instrumentos y documentos asociados.
 *
 * @param {object|null} convenio null cierra el modal
 * @param {Array} convenios la lista completa (para resolver relaciones)
 * @param {Array} unidades lista de unidades
 * @param {Function} onCerrar callback para cerrar la ficha
 */
export default function FichaDetalle({ convenio, convenios, unidades, onCerrar, onAccionDocumento }) {
  // ------------------------------------------------------------------
  // Vista previa del documento asociado: por defecto se muestra el
  // primero de la lista; el usuario puede alternar entre los cargados.
  // ------------------------------------------------------------------
  const [documentoActual, setDocumentoActual] = useState(null);
  const [avisoAccion, setAvisoAccion] = useState(null);

  const documentos = useMemo(
    () => convenio?.documentos ?? [],
    [convenio]
  );

  // Al cambiar de convenio se resetea la vista previa y el aviso.
  useEffect(() => {
    setDocumentoActual(null);
    setAvisoAccion(null);
  }, [convenio?.id]);

  const documentoEnVista =
    documentoActual && documentos.includes(documentoActual)
      ? documentoActual
      : documentos[0] ?? null;

  /** Acciones del dropdown sobre la vista previa. */
  const manejarAccionDocumento = (id, documento) => {
    // Descarga real solo si existe una URL servida por alguien; en el demo
    // no hay backend, queda registrada igualmente.
    if (
      id === "descargar" &&
      documento?.ruta_archivo &&
      /^(https?:|blob:|data:)/.test(documento.ruta_archivo)
    ) {
      const enlace = document.createElement("a");
      enlace.href = documento.ruta_archivo;
      enlace.download = documento.nombre_archivo || "documento";
      enlace.rel = "noopener";
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    }

    if (typeof onAccionDocumento === "function") {
      onAccionDocumento({ accion: id, convenio, documento });
      return;
    }

    setAvisoAccion(
      `Acción «${ETIQUETAS_ACCION[id] ?? id}» registrada sobre ${
        documento?.nombre_archivo ?? "el documento"
      } (demo sin backend).`
    );
  };

  if (!convenio) return null;

  const vigencia = calcularVigencia(convenio);
  const antecedente =
    convenio.id_antecedente !== null && convenio.id_antecedente !== undefined
      ? convenios.find((otro) => otro.id === convenio.id_antecedente)
      : null;
  const marca_original =
    convenio.id_instrumento_modificado !== null && convenio.id_instrumento_modificado !== undefined
      ? convenios.find((otro) => otro.id === convenio.id_instrumento_modificado)
      : null;
  const marcosCompatibles = (convenio.id_marcos_compatibles || [])
    .map((id) => convenios.find((otro) => otro.id === id))
    .filter(Boolean);

  return (
    <VentanaModal abierto={Boolean(convenio)} titulo={convenio.titulo} onCerrar={onCerrar}>
      {/* Encabezado: identidad del instrumento */}
      <div className="ficha__encabezado">
        <EtiquetaTipo tipo={convenio.tipo} />
        <EtiquetaEstado estado={convenio.estado} />
        <span className="ficha__codigo">{convenio.codigo_unico}</span>
      </div>

      {/* Datos principales de la ficha */}
      <dl className="ficha__datos">
        <div>
          <dt>Código único</dt>
          <dd>{convenio.codigo_unico}</dd>
        </div>
        <div>
          <dt>Unidad responsable</dt>
          <dd>{nombreUnidad(unidades, convenio.id_unidad_responsable)}</dd>
        </div>
        <div>
          <dt>Vigencia</dt>
          <dd>
            {textoVigencia(vigencia)}
            {vigencia.estado !== "sin_vencimiento" && <> · vence el {formatoFecha(convenio.fecha_vencimiento)}</>}
          </dd>
        </div>
        <div>
          <dt>Firma / inicio</dt>
          <dd>
            {formatoFecha(convenio.fecha_firma)} → {formatoFecha(convenio.fecha_inicio)}
          </dd>
        </div>
        <div>
          <dt>Vencimiento</dt>
          <dd>{formatoFecha(convenio.fecha_vencimiento)}</dd>
        </div>
        <div>
          <dt>Preaviso</dt>
          <dd>
            {vigencia.diasPreaviso !== null
              ? `${formatoEntero(convenio.diasPreaviso)} días antes${vigencia.fechaPreaviso ? ` (el ${formatoFecha(vigencia.fechaPreaviso)})` : ""}`
              : "Sin preaviso registrado"}
          </dd>
        </div>
        <div>
          <dt>Marco legal</dt>
          <dd>{convenio.marco_legal || "—"}</dd>
        </div>
        <div>
          <dt>Resolución</dt>
          <dd>{convenio.resolucion || "—"}</dd>
        </div>
        <div>
          <dt>Expediente / referencia</dt>
          <dd>{convenio.expediente || "—"}</dd>
        </div>
        <div>
          <dt>Confidencialidad</dt>
          <dd>{formatoBoolean(convenio.confidencialidad)}</dd>
        </div>
      </dl>

      {/* Textos largos */}
      <p className="ficha__seccion">Objeto</p>
      <p className="ficha__texto">{convenio.objeto || "Sin objeto registrado"}</p>

      <p className="ficha__seccion">Alcance</p>
      <p className="ficha__texto">{convenio.alcance || "—"}</p>

      <p className="ficha__seccion">Obligaciones</p>
      <p className="ficha__texto">{convenio.obligaciones || "—"}</p>

      <p className="ficha__seccion">Condiciones de rescisión</p>
      <p className="ficha__texto">{convenio.condiciones_rescision || "—"}</p>

      <p className="ficha__seccion">Condiciones de renovación</p>
      <p className="ficha__texto">{convenio.condiciones_renovacion || "—"}</p>

      <p className="ficha__seccion">Notas</p>
      <p className="ficha__texto">{convenio.notas || "—"}</p>

      {/* Relaciones con otros instrumentos */}
      <p className="ficha__seccion">Relaciones entre instrumentos</p>
      <ul className="ficha__partes">
        {marca_original && (
          <li>
            <strong>Adenda de</strong>
            <span>
              {marca_original.codigo_unico} — {marca_original.titulo}
            </span>
          </li>
        )}
        {marcosCompatibles.length > 0 && (
          <li>
            <strong>Marcos compatibles</strong>
            <span>{marcosCompatibles.map((marco) => marco.codigo_unico).join(" · ")}</span>
          </li>
        )}
        {antecedente && (
          <li>
            <strong>Antecedente</strong>
            <span>
              {antecedente.codigo_unico} — {antecedente.titulo}
            </span>
          </li>
        )}
        {!marca_original && marcosCompatibles.length === 0 && !antecedente && (
          <li>
            <strong>Sin relaciones</strong>
            <span>Instrumento raíz, sin instrumento modificado ni antecedentes.</span>
          </li>
        )}
      </ul>

      {/* Partes firmantes */}
      <p className="ficha__seccion">Partes firmantes y representantes</p>
      {(convenio.partes || []).length > 0 ? (
        <ul className="ficha__partes">
          {convenio.partes.map((parte, indice) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={indice}>
              <strong>{parte.nombre_institucion}</strong>
              {parte.representante_nombre && (
                <span>
                  {parte.representante_nombre}
                  {parte.representante_cargo ? ` · ${parte.representante_cargo}` : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ficha__texto">Sin partes registradas aún.</p>
      )}

      {/* Vista previa del documento y sus acciones */}
      <p className="ficha__seccion">Vista previa</p>
      <VistaPreviaDocumento
        documento={documentoEnVista}
        alElegirAccion={manejarAccionDocumento}
        aviso={avisoAccion}
      />

      {/* Documentos: alternar cuál se previsualiza */}
      <p className="ficha__seccion">Documentos cargados</p>
      {documentos.length > 0 ? (
        <ul className="ficha__documentos">
          {documentos.map((documento) => (
            <li
              key={documento.id}
              className={documento === documentoEnVista ? "ficha__documento--seleccionado" : undefined}
            >
              <span className="ficha__documento-tipo">
                {NOMBRES_DOCUMENTO[documento.tipo_documento] ?? documento.tipo_documento}
                { documento?.version ? ` · v${documento.version}` : ""}
              </span>
              <span className="ficha__documento-nombre">{documento.nombre_archivo}</span>
              <span className="ficha__documento-fecha">{formatoFecha(documento.fecha_subida)}</span>
              <button
                type="button"
                className="tabla__accion"
                onClick={() => {
                  setDocumentoActual(documento);
                  setAvisoAccion(null);
                }}
              >
                Vista previa
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ficha__texto">Sin documentos cargados aún.</p>
      )}
    </VentanaModal>
  );
}
