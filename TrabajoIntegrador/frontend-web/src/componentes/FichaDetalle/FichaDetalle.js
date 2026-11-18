import React, { useEffect, useMemo, useState } from "react";
import VentanaModal from "../VentanaModal/VentanaModal";
import { EtiquetaEstado, EtiquetaTipo } from "../Etiqueta/Etiqueta";
import { API_URL } from "../../config/api";
import VistaPreviaDocumento from "../VistaPreviaDocumento/VistaPreviaDocumento";
import "./FichaDetalle.css";
import {
  ETIQUETAS_ESTADO,
  formatoBoolean,
  formatoEntero,
  formatoFecha,
  nombreUnidad,
  textoVigencia,
  calcularVigencia,
} from "../../utils/formatos";

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
export default function FichaDetalle({
  convenio,
  convenios,
  unidades,
  onCerrar,
  onAccionDocumento,
}) {
  // ------------------------------------------------------------------
  // Vista previa del documento asociado: por defecto se muestra el
  // primero de la lista; el usuario puede alternar entre los cargados.
  // ------------------------------------------------------------------
  const [documentoActual, setDocumentoActual] = useState(null);
  const [avisoAccion, setAvisoAccion] = useState(null);

  const documentos = useMemo(() => convenio?.documentos ?? [], [convenio]);

  // Al cambiar de convenio se resetea la vista previa y el aviso.
  useEffect(() => {
    setDocumentoActual(null);
    setAvisoAccion(null);
  }, [convenio?.id]);

  const [partes, setPartes] = useState([]);
  const [cargandoPartes, setCargandoPartes] = useState(false);
  const [errorPartes, setErrorPartes] = useState("");

  const [auditoria, setAuditoria] = useState([]);
  const [cargandoAuditoria, setCargandoAuditoria] = useState(false);
  const [errorAuditoria, setErrorAuditoria] = useState("");

  useEffect(() => {
    if (!convenio?.id) {
      setPartes([]);
      return undefined;
    }

    const controlador = new AbortController();

    async function cargarPartes() {
      setCargandoPartes(true);
      setErrorPartes("");

      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `${API_URL}/parties/convenio/${convenio.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(`La API respondió con estado ${respuesta.status}.`);
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos.data)) {
          throw new Error("La respuesta de partes no contiene una lista.");
        }

        setPartes(
          datos.data.map((parte) => ({
            id: parte.id,
            nombre_institucion:
              parte.nombre_institucion ?? parte.nombre ?? "Institución",
            representante_nombre:
              parte.representante_nombre ?? parte.representante ?? "",
            representante_cargo: parte.representante_cargo ?? "",
          })),
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("No se pudieron cargar las partes:", error);
          setErrorPartes("No se pudieron cargar las partes firmantes.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoPartes(false);
        }
      }
    }

    cargarPartes();

    return () => controlador.abort();
  }, [convenio?.id]);

  // Trazabilidad del trámite: historial de auditoría del convenio (altas,
  // cambios de estado, observaciones y accesos a documentos).
  useEffect(() => {
    if (!convenio?.id) {
      setAuditoria([]);
      return undefined;
    }

    const controlador = new AbortController();

    async function cargarAuditoria() {
      setCargandoAuditoria(true);
      setErrorAuditoria("");

      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `${API_URL}/agreements/${convenio.id}/auditoria`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(`La API respondió con estado ${respuesta.status}.`);
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos.data)) {
          throw new Error("La respuesta de auditoría no contiene una lista.");
        }

        setAuditoria(datos.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("No se pudo cargar la trazabilidad:", error);
          setErrorAuditoria("No se pudo cargar la trazabilidad del trámite.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoAuditoria(false);
        }
      }
    }

    cargarAuditoria();

    return () => controlador.abort();
  }, [convenio?.id]);

  const documentoEnVista =
    documentoActual && documentos.includes(documentoActual)
      ? documentoActual
      : (documentos[0] ?? null);

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
      } (demo sin backend).`,
    );
  };

  if (!convenio) return null;

  const vigencia = calcularVigencia(convenio);
  const antecedente =
    convenio.id_antecedente !== null && convenio.id_antecedente !== undefined
      ? convenios.find((otro) => otro.id === convenio.id_antecedente)
      : null;
  const marca_original =
    convenio.id_instrumento_modificado !== null &&
    convenio.id_instrumento_modificado !== undefined
      ? convenios.find((otro) => otro.id === convenio.id_instrumento_modificado)
      : null;
  const marcosCompatibles = (convenio.id_marcos_compatibles || [])
    .map((id) => convenios.find((otro) => otro.id === id))
    .filter(Boolean);

  return (
    <VentanaModal
      abierto={Boolean(convenio)}
      titulo={convenio.titulo}
      onCerrar={onCerrar}
    >
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
            {vigencia.estado !== "sin_vencimiento" && (
              <> · vence el {formatoFecha(convenio.fecha_vencimiento)}</>
            )}
          </dd>
        </div>
        <div>
          <dt>Firma / inicio</dt>
          <dd>
            {formatoFecha(convenio.fecha_firma)} →{" "}
            {formatoFecha(convenio.fecha_inicio)}
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

      {/* Vista previa del documento y sus acciones */}
      <p className="ficha__seccion">Vista previa</p>
      <VistaPreviaDocumento
        documento={documentoEnVista}
        alElegirAccion={manejarAccionDocumento}
        aviso={avisoAccion}
      />

      {/* Documentos: alternar cuál se previsualiza */}
      <p className="ficha__seccion ficha__seccion--documentos">
        Documentos cargados
      </p>
      {documentos.length > 0 ? (
        <ul className="ficha__documentos">
          {documentos.map((documento) => (
            <li
              key={documento.id}
              className={
                documento === documentoEnVista
                  ? "ficha__documento--seleccionado"
                  : undefined
              }
            >
              <span className="ficha__documento-tipo">
                {NOMBRES_DOCUMENTO[documento.tipo_documento] ??
                  documento.tipo_documento}
                {documento?.version ? ` · v${documento.version}` : ""}
              </span>
              <span className="ficha__documento-nombre">
                {documento.nombre_archivo}
              </span>
              <span className="ficha__documento-fecha">
                {formatoFecha(documento.fecha_subida)}
              </span>
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
        <p className="ficha__texto ficha__documentos-vacio">
          Sin documentos cargados aún.
        </p>
      )}

      {/* Textos largos (debajo de la vista previa) */}
      <p className="ficha__seccion">Objeto</p>
      <p className="ficha__texto">
        {convenio.objeto || "Sin objeto registrado"}
      </p>

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
            <span>
              {marcosCompatibles.map((marco) => marco.codigo_unico).join(" · ")}
            </span>
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
            <span>
              Instrumento raíz, sin instrumento modificado ni antecedentes.
            </span>
          </li>
        )}
      </ul>

      {/* Partes firmantes */}
      <p className="ficha__seccion">Partes firmantes y representantes</p>
      {cargandoPartes ? (
        <p className="ficha__texto">Cargando partes firmantes…</p>
      ) : errorPartes ? (
        <p className="ficha__texto" role="alert">
          {errorPartes}
        </p>
      ) : partes.length > 0 ? (
        <ul className="ficha__partes">
          {partes.map((parte) => (
            <li key={parte.id}>
              <strong>{parte.nombre_institucion}</strong>
              {parte.representante_nombre && (
                <span>
                  {parte.representante_nombre}
                  {parte.representante_cargo
                    ? ` · ${parte.representante_cargo}`
                    : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ficha__texto">Sin partes registradas aún.</p>
      )}

      {/* Trazabilidad del trámite: historial de auditoría */}
      <p className="ficha__seccion">Trazabilidad del trámite</p>
      {cargandoAuditoria ? (
        <p className="ficha__texto">Cargando trazabilidad…</p>
      ) : errorAuditoria ? (
        <p className="ficha__texto" role="alert">
          {errorAuditoria}
        </p>
      ) : auditoria.length > 0 ? (
        <ol className="ficha__historial">
          {auditoria.map((registro) => (
            <li key={registro.id}>
              <span className="ficha__historial-fecha">
                {formatoFechaHora(registro.fecha_registro)}
              </span>
              <span className="ficha__historial-transicion">
                {etiquetaTransicion(registro)}
              </span>
              <span className="ficha__historial-responsable">
                {registro.nombre_completo ?? `Usuario #${registro.id_usuario}`}
              </span>
              {registro.observacion && (
                <span className="ficha__historial-detalle">
                  {registro.observacion}
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="ficha__texto">Sin registros de auditoría todavía.</p>
      )}
    </VentanaModal>
  );
}

/** Formatea la fecha y hora de un registro de auditoría (dd/mm/aaaa hh:mm). */
function formatoFechaHora(valor) {
  if (!valor) return "—";
  // mysql2 puede entregar Date ya parseado o el texto "aaaa-mm-dd hh:mm:ss".
  const fecha =
    valor instanceof Date
      ? valor
      : new Date(String(valor).replace(" ", "T"));
  if (Number.isNaN(fecha.getTime())) return "—";
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${fecha.getFullYear()} ${hora}:${minutos}`;
}

/** Texto de la transición de estado de un registro de auditoría. */
function etiquetaTransicion(registro) {
  const previo = registro.estado_previo ?? "—";
  const nuevo = registro.estado_nuevo ?? "—";

  // Accesos (descargas, vistas previas): no tienen transición de estado.
  if (previo === "—" && nuevo === "—") return "Acción registrada";

  const nombreEstado = (clave) =>
    ETIQUETAS_ESTADO[clave] ?? clave ?? "—";
  return `${nombreEstado(previo)} → ${nombreEstado(nuevo)}`;
}
