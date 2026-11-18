import React, { useEffect, useMemo, useRef, useState } from "react";
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

// Transiciones de estado válidas por rol (circuito del enunciado):
//   · gestión: envía a revisión, registra la firma y cierra el trámite.
//   · revisión: aprueba o devuelve con observación.
//   · administración: todas las transiciones.
// Roles sin entrada (consulta) no pueden cambiar estados.
const TRANSICIONES_POR_ROL = {
  administracion: {
    borrador: ["revision", "archivado"],
    revision: ["aprobado", "borrador"],
    aprobado: ["firmado"],
    firmado: ["rescindido", "archivado"],
  },
  gestion: {
    borrador: ["revision"],
    aprobado: ["firmado"],
    firmado: ["rescindido", "archivado"],
  },
  revision: {
    revision: ["aprobado", "borrador"],
  },
};

// Etiqueta de cada transición con el lenguaje del enunciado: el equipo
// revisor "aprueba o devuelve para corrección"; gestión envía a revisión
// y registra la firma; los estados finales cierran el trámite.
const ETIQUETA_TRANSICION = {
  aprobado: "Aprobar",
  borrador: "Rechazar y devolver para corrección",
  revision: "Enviar a revisión",
  firmado: "Registrar firma",
  rescindido: "Rescindir",
  archivado: "Archivar",
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
  rolUsuario = null,
  onCambioEstado = null,
  alNotificar = null,
  onRefrescar = null,
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

  // Personas y pasantías del convenio (endpoint GET /people/convenio/:id).
  const [personasConvenio, setPersonasConvenio] = useState([]);
  const [cargandoPersonas, setCargandoPersonas] = useState(false);
  const [errorPersonas, setErrorPersonas] = useState("");

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

  // Personas y pasantías vinculadas a este convenio.
  useEffect(() => {
    if (!convenio?.id) {
      setPersonasConvenio([]);
      return undefined;
    }

    const controlador = new AbortController();

    async function cargarPersonas() {
      setCargandoPersonas(true);
      setErrorPersonas("");

      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `${API_URL}/people/convenio/${convenio.id}`,
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
          throw new Error("La respuesta de personas no contiene una lista.");
        }

        setPersonasConvenio(datos.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("No se pudieron cargar las personas:", error);
          setErrorPersonas("No se pudieron cargar las personas y pasantías.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoPersonas(false);
        }
      }
    }

    cargarPersonas();

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

  // --- Acciones reales sobre el documento -----------------------------------
  const [ejecutando, setEjecutando] = useState(false);
  const inputArchivoRef = useRef(null);

  // --- Circuito del trámite (panel de revisión del enunciado) ---------------
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [estadoNuevo, setEstadoNuevo] = useState("");
  const [observacionEstado, setObservacionEstado] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [enviandoEstado, setEnviandoEstado] = useState(false);

  // Estados destino permitidos según el rol y el estado actual.
  const estadosDisponibles = useMemo(
    () => (TRANSICIONES_POR_ROL[rolUsuario] ?? {})[convenio?.estado] ?? [],
    [rolUsuario, convenio?.estado],
  );

  // --- Comparar cambios entre versiones del documento -----------------------
  const [modalCompararAbierto, setModalCompararAbierto] = useState(false);

  // Versiones del mismo tipo de documento (ordenadas por carga): la actual
  // primero y las anteriores después (el enunciado exige mantenerlas).
  const versionesDocumento = useMemo(() => {
    if (!documentoEnVista) return [];
    return documentos
      .filter((d) => d.tipo_documento === documentoEnVista.tipo_documento)
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [documentos, documentoEnVista]);

  // Resetea el panel de revisión y el de comparación al cambiar de convenio.
  useEffect(() => {
    setModalEstadoAbierto(false);
    setModalCompararAbierto(false);
    setEstadoNuevo("");
    setObservacionEstado("");
    setErrorEstado("");
  }, [convenio?.id]);

  const notificar = (titulo, texto, tipo) => {
    if (typeof alNotificar === "function") alNotificar(titulo, texto, tipo);
  };

  /** Trae el PDF desde la API con el token (descarga o vista). */
  async function obtenerPdf(documento, modo) {
    const token = localStorage.getItem("token");
    const ruta =
      modo === "download"
        ? `${API_URL}/documents/${documento.id}/download`
        : `${API_URL}/documents/${documento.id}/view`;
    const respuesta = await fetch(ruta, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!respuesta.ok) {
      throw new Error(`La API respondió con estado ${respuesta.status}.`);
    }
    return respuesta.blob();
  }

  /** Nombre de archivo para guardar el PDF descargado. */
  function nombreDescarga(documento) {
    return `${convenio?.codigo_unico ?? "convenio"}-${
      documento?.tipo_documento ?? "documento"
    }.pdf`;
  }

  function descargarEnlace(blob, documento) {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreDescarga(documento);
    enlace.rel = "noopener";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function abrirEnPestana(blob) {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  /** Abre un documento servido por la API en una pestaña nueva. */
  async function abrirPdfEnPestana(documento) {
    const blob = await obtenerPdf(documento, "view");
    abrirEnPestana(blob);
  }

  /** Acciones del dropdown sobre la vista previa. */
  const manejarAccionDocumento = async (id, documento) => {
    if (!documento || ejecutando) return;

    // "Aprobar / cambiar estado": abre el panel de revisión (no toca el PDF).
    if (id === "aprobar") {
      if (estadosDisponibles.length === 0) {
        notificar(
          "Sin transiciones disponibles",
          "Tu rol no permite mover este instrumento desde su estado actual.",
          "info",
        );
        return;
      }
      setEstadoNuevo("");
      setObservacionEstado("");
      setErrorEstado("");
      setModalEstadoAbierto(true);
      return;
    }

    // "Subir nueva versión": dispara el selector de archivos oculto.
    if (id === "subir") {
      inputArchivoRef.current?.click();
      return;
    }

    setEjecutando(true);
    try {
      if (id === "descargar") {
        const blob = await obtenerPdf(documento, "download");
        descargarEnlace(blob, documento);
        notificar(
          "Documento descargado",
          `Se guardó ${nombreDescarga(documento)} y quedó registrado en la trazabilidad.`,
          "exito",
        );
      } else if (id === "editar") {
        await abrirPdfEnPestana(documento);
        notificar(
          "Documento abierto",
          "El PDF se abrió en una pestaña nueva para revisarlo en el navegador.",
          "info",
        );
      } else if (id === "comparar") {
        // El enunciado exige mantener las cargas anteriores: se comparan
        // las versiones del mismo tipo desde el panel de versiones.
        setModalCompararAbierto(true);
      } else if (typeof onAccionDocumento === "function") {
        onAccionDocumento({ accion: id, convenio, documento });
        return;
      }
    } catch (error) {
      console.error("Falló la acción sobre el documento:", error);
      notificar(
        "No se pudo completar la acción",
        error.message || "Error inesperado al procesar el documento.",
        "error",
      );
    } finally {
      setEjecutando(false);
    }
  };

  /** Sube el archivo elegido como nueva versión del tipo en vista. */
  const subirNuevaVersion = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo || !documentoEnVista || !convenio) return;

    if (archivo.type !== "application/pdf") {
      notificar("Archivo inválido", "Solo se permiten archivos PDF.", "error");
      return;
    }
    if (archivo.size > 20 * 1024 * 1024) {
      notificar(
        "Archivo demasiado grande",
        "El PDF supera el máximo de 20 MB.",
        "error",
      );
      return;
    }

    setEjecutando(true);
    try {
      const token = localStorage.getItem("token");
      const datos = new FormData();
      datos.append("id_convenio", convenio.id);
      datos.append("tipo_documento", documentoEnVista.tipo_documento);
      datos.append("archivo", archivo);

      const respuesta = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: datos,
      });
      const cuerpo = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) {
        throw new Error(
          cuerpo?.mensaje || `La API respondió con estado ${respuesta.status}.`,
        );
      }

      notificar(
        "Nueva versión cargada",
        `Se agregó "${archivo.name}" y la carga anterior se conserva.`,
        "exito",
      );
      if (typeof onRefrescar === "function") onRefrescar();
    } catch (error) {
      console.error("No se pudo subir la nueva versión:", error);
      notificar(
        "No se pudo subir la nueva versión",
        error.message || "Error inesperado al subir el archivo.",
        "error",
      );
    } finally {
      setEjecutando(false);
    }
  };

  /** Confirma la transición de estado con su fundamento (auditoría). */
  const confirmarCambioEstado = async () => {
    if (!estadoNuevo) {
      setErrorEstado("Elegí la transición a registrar.");
      return;
    }
    if (!observacionEstado.trim()) {
      setErrorEstado(
        "El fundamento es obligatorio: cada transición queda registrada en la auditoría.",
      );
      return;
    }
    // Regla del enunciado: antes de aprobar un convenio deben existir
    // al menos dos partes firmantes registradas.
    if (estadoNuevo === "aprobado" && partes.length < 2) {
      setErrorEstado(
        "No se puede aprobar: el convenio necesita al menos dos partes firmantes registradas.",
      );
      return;
    }

    setEnviandoEstado(true);
    setErrorEstado("");
    try {
      await onCambioEstado?.(
        convenio.id,
        estadoNuevo,
        observacionEstado.trim(),
        convenio,
      );
      setModalEstadoAbierto(false);
      setEstadoNuevo("");
      setObservacionEstado("");
    } catch (error) {
      setErrorEstado(error.message || "No se pudo actualizar el estado.");
    } finally {
      setEnviandoEstado(false);
    }
  };

  /** Abre una versión puntual del documento en pestaña nueva. */
  const verVersion = async (version) => {
    setEjecutando(true);
    try {
      await abrirPdfEnPestana(version);
    } catch (error) {
      console.error("No se pudo abrir la versión:", error);
      notificar(
        "No se pudo abrir la versión",
        error.message || "Error inesperado al abrir el PDF.",
        "error",
      );
    } finally {
      setEjecutando(false);
    }
  };

  /** Abre las dos versiones a comparar (actual y anterior) en pestañas. */
  const compararConAnterior = async () => {
    const actual = versionesDocumento[versionesDocumento.length - 1];
    const anterior = versionesDocumento[versionesDocumento.length - 2];
    if (!anterior) {
      notificar(
        "Nada para comparar",
        "Este documento no tiene una carga anterior del mismo tipo.",
        "info",
      );
      return;
    }

    setEjecutando(true);
    try {
      await Promise.all([
        abrirPdfEnPestana(actual),
        abrirPdfEnPestana(anterior),
      ]);
      notificar(
        "Comparación lista",
        "Se abrieron la versión en vista y la carga anterior del mismo tipo para cotejarlas.",
        "info",
      );
    } catch (error) {
      console.error("No se pudo comparar:", error);
      notificar(
        "No se pudo comparar",
        error.message || "Error inesperado al abrir las versiones.",
        "error",
      );
    } finally {
      setEjecutando(false);
    }
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

      {/* Selector de archivo oculto que dispara "Subir nueva versión" */}
      <input
        ref={inputArchivoRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={subirNuevaVersion}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Panel de revisión del trámite (enunciado: aprobar o devolver para
          corrección, con validación de partes y fundamento obligatorio). */}
      <VentanaModal
        abierto={modalEstadoAbierto}
        titulo={`Panel de revisión — ${convenio.codigo_unico}`}
        onCerrar={() => setModalEstadoAbierto(false)}
      >
        <div className="ficha__cambio-estado">
          <p className="ficha__cambio-estado__titulo">
            {convenio.estado === "revision"
              ? "¿Querés aprobar este convenio?"
              : `El instrumento está en estado ${
                  ETIQUETAS_ESTADO[convenio.estado] ?? convenio.estado
                }. ¿Qué transición querés registrar?`}
          </p>
          <p className="ficha__cambio-estado__sub">
            {convenio.titulo} · Estado actual:{" "}
            {ETIQUETAS_ESTADO[convenio.estado] ?? convenio.estado}
            {estadoNuevo
              ? ` → destino: ${ETIQUETAS_ESTADO[estadoNuevo] ?? estadoNuevo}`
              : ""}
          </p>
          <div className="ficha__cambio-estado__destinos">
            {estadosDisponibles.map((estado) => (
              <button
                key={estado}
                type="button"
                className={`tabla__accion${
                  estadoNuevo === estado ? " tabla__accion--activa" : ""
                }`}
                onClick={() => setEstadoNuevo(estado)}
                disabled={enviandoEstado}
              >
                {ETIQUETA_TRANSICION[estado] ??
                  ETIQUETAS_ESTADO[estado] ??
                  estado}
              </button>
            ))}
          </div>
          <label className="ficha__cambio-estado__campo">
            <span>Fundamento de la transición (obligatorio, queda en la auditoría)</span>
            <textarea
              rows="3"
              value={observacionEstado}
              onChange={(evento) => setObservacionEstado(evento.target.value)}
              placeholder="Ej.: aprobado por Resolución CD N° 172/26; se verificaron las dos partes firmantes."
              disabled={enviandoEstado}
            />
          </label>
          {estadoNuevo === "aprobado" && partes.length < 2 && (
            <p className="ficha__cambio-estado__error" role="alert">
              Antes de aprobar deben existir al menos dos partes firmantes
              registradas en el convenio.
            </p>
          )}
          {errorEstado && (
            <p className="ficha__cambio-estado__error" role="alert">
              {errorEstado}
            </p>
          )}
          <div className="ficha__cambio-estado__acciones">
            <button
              type="button"
              className="tabla__accion"
              onClick={() => setModalEstadoAbierto(false)}
              disabled={enviandoEstado}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="tabla__accion"
              onClick={confirmarCambioEstado}
              disabled={
                enviandoEstado ||
                !estadoNuevo ||
                (estadoNuevo === "aprobado" && partes.length < 2)
              }
            >
              {enviandoEstado ? "Registrando…" : "Registrar transición"}
            </button>
          </div>
        </div>
      </VentanaModal>

      {/* Comparar cambios: versiones registradas del mismo tipo de documento */}
      <VentanaModal
        abierto={modalCompararAbierto}
        titulo="Comparar cambios entre versiones"
        onCerrar={() => setModalCompararAbierto(false)}
      >
        <div className="ficha__comparar">
          <p className="ficha__texto">
            Documento:{" "}
            <strong>
              {NOMBRES_DOCUMENTO[documentoEnVista.tipo_documento] ??
                documentoEnVista.tipo_documento}
            </strong>{" "}
            · {versionesDocumento.length}{" "}
            {versionesDocumento.length === 1
              ? "versión registrada"
              : "versiones registradas"}.
          </p>
          <ul className="ficha__partes">
            {versionesDocumento.map((version, indice) => (
              <li key={version.id}>
                <strong>
                  Versión {indice + 1}
                  {version.id === documentoEnVista.id ? " (en vista)" : ""}
                </strong>
                <span>
                  {version.fecha_subida
                    ? `Cargada el ${formatoFecha(
                        String(version.fecha_subida).slice(0, 10),
                      )}`
                    : "Fecha de carga no registrada"}{" "}
                  · documento #{version.id}
                </span>
                <button
                  type="button"
                  className="tabla__accion"
                  onClick={() => verVersion(version)}
                  disabled={ejecutando}
                >
                  Ver PDF
                </button>
              </li>
            ))}
          </ul>
          {versionesDocumento.length < 2 && (
            <p className="ficha__texto">
              Este documento todavía no tiene una carga anterior del mismo
              tipo: subí una nueva versión para poder comparar los cambios.
            </p>
          )}
          <div className="ficha__cambio-estado__acciones">
            <button
              type="button"
              className="tabla__accion"
              onClick={compararConAnterior}
              disabled={ejecutando || versionesDocumento.length < 2}
            >
              Abrir actual y anterior en pestañas
            </button>
            <button
              type="button"
              className="tabla__accion"
              onClick={() => setModalCompararAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </VentanaModal>

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

      {/* Personas y pasantías del convenio (endpoint /people/convenio/:id) */}
      <p className="ficha__seccion">Personas y pasantías</p>
      {cargandoPersonas ? (
        <p className="ficha__texto">Cargando personas y pasantías…</p>
      ) : errorPersonas ? (
        <p className="ficha__texto" role="alert">
          {errorPersonas}
        </p>
      ) : personasConvenio.length > 0 ? (
        <ul className="ficha__partes">
          {personasConvenio.map((persona) => (
            <li key={persona.id}>
              <strong>{persona.nombre_completo}</strong>
              <span>
                {[persona.rol, persona.carrera].filter(Boolean).join(" · ") ||
                  "Sin rol registrado"}
                {persona.carga_horaria != null
                  ? ` · ${persona.carga_horaria} h/semana`
                  : ""}
              </span>
              {(persona.periodo ||
                persona.tutoria ||
                persona.asignacion ||
                persona.seguro) && (
                <span className="ficha__persona-detalle">
                  {[
                    persona.periodo && `Periodo: ${persona.periodo}`,
                    persona.tutoria && `Tutoría: ${persona.tutoria}`,
                    persona.asignacion && `Asignación: ${persona.asignacion}`,
                    persona.seguro && `Seguro: ${persona.seguro}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ficha__texto">
          Sin personas vinculadas a este instrumento todavía.
        </p>
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
