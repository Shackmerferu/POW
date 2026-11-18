// Toda la lógica del panel vive en un único componente React.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./dashboard.css";

import logoFacultad from "../../utils/imagenes/logo.png";

import menu from "../../utils/imagenes/list.svg";
import MenuLateral from "../../componentes/MenuLateral/MenuLateral";
import TarjetaDato from "../../componentes/TarjetaDato/TarjetaDato";
import BloqueDistribucion from "../../componentes/BloqueDistribucion/BloqueDistribucion";
import Tabla from "../../componentes/Tabla/Tabla";
import Paginacion from "../../componentes/Paginacion/Paginacion";
import FiltroBusqueda from "../../componentes/FiltroBusqueda/FiltroBusqueda";
import BotonExportar from "../../componentes/BotonExportar/BotonExportar";
import FichaDetalle from "../../componentes/FichaDetalle/FichaDetalle";
import {
  EtiquetaEstado,
  EtiquetaTipo,
  EtiquetaRol,
} from "../../componentes/Etiqueta/Etiqueta";

import {
  MATRIZ_PERMISOS,
  ROLES,
  puedeCambiarRoles,
  puedeTenerAlcanceGlobal,
  puedeVerConfiguracion,
  puedeVerPanel,
  rutaInicioPorRol,
} from "../../utils/permisos";
import { API_URL } from "../../config/api";
import { exportarCsv, exportarPdf } from "../../utils/exportaciones";
import { limpiarSesion, obtenerUsuario } from "../../utils/sesion";
import {
  calcularVigencia,
  formatoEntero,
  formatoFecha,
  hoyIso,
  nombreUnidad,
  recortarTexto,
  textoVigencia,
  ETIQUETAS_TIPO,
  ETIQUETAS_ESTADO,
} from "../../utils/formatos";
import VentanaModal from "../../componentes/VentanaModal/VentanaModal";
import AvisoFlotante from "../../componentes/AvisoFlotante/AvisoFlotante";
import {
  ALMACENES,
  guardarCache,
  leerCache,
  guardarPendiente,
  listarPendientes,
  eliminarPendiente,
  marcarPendienteEnConflicto,
} from "../../utils/cacheOffline";

const FILAS_POR_PAGINA = 8;

const ETIQUETA_PESTAÑA = {
  metricas: "Métricas",
  administracion: "Administración",
  roles: "Roles",
  vencimientos: "Vencimientos",
};

function Dashboard() {
  const navigate = useNavigate();

  const usuario = useMemo(() => {
    const data = obtenerUsuario();
    return data && data.rol ? data : null;
  }, []);

  const alcanceGlobal = puedeTenerAlcanceGlobal(usuario);

  // DATOS REALES DE LA API
  // Convenios, unidades, usuarios y personas se traen del backend. Cada
  // respuesta exitosa se guarda en IndexedDB (un almacén por pestaña); si
  // la API no responde, se muestra la última copia local guardada.
  const [convenios, setConvenios] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);
  const [alertasServidor, setAlertasServidor] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);
  const sincronizandoRef = useRef(false);

  // --- Notificaciones emergentes (popups de alta/modificación/baja) ---------
  const [avisos, setAvisos] = useState([]);
  const lanzarAviso = (titulo, texto, tipo = "info") => {
    const id = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    setAvisos((anterior) => [...anterior, { id, titulo, texto, tipo }]);
    // Se retira solo a los 6 segundos (y puede cerrarse a mano).
    setTimeout(() => {
      setAvisos((anterior) => anterior.filter((aviso) => aviso.id !== id));
    }, 6000);
  };
  const descartarAviso = (id) =>
    setAvisos((anterior) => anterior.filter((aviso) => aviso.id !== id));

  const cargarAlertasServidor = async () => {
    if (!navigator.onLine) return;

    const token = localStorage.getItem("token");
    const respuesta = await fetch(`${API_URL}/agreements/alerts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!respuesta.ok) {
      throw new Error(`No se pudieron cargar las alertas (${respuesta.status}).`);
    }

    const resultado = await respuesta.json();
    setAlertasServidor(Array.isArray(resultado?.data) ? resultado.data : []);
  };

  useEffect(() => {
    cargarAlertasServidor().catch((error) =>
      console.warn("No se pudieron cargar las alertas:", error),
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    Promise.allSettled([
      fetch(`${API_URL}/agreements`, { headers }).then((res) => res.json()),
      fetch(`${API_URL}/units`, { headers }).then((res) => res.json()),
      fetch(`${API_URL}/usuarios`, { headers }).then((res) => res.json()),
      fetch(`${API_URL}/people`, { headers }).then((res) => res.json()),
    ])
      .then(([conveniosRes, unidadesRes, usuariosRes, personasRes]) => {
        if (
          conveniosRes.status === "fulfilled" &&
          Array.isArray(conveniosRes.value?.data)
        ) {
          setConvenios(conveniosRes.value.data);
          guardarCache(ALMACENES.convenios, conveniosRes.value.data);
        }
        if (
          unidadesRes.status === "fulfilled" &&
          Array.isArray(unidadesRes.value?.data)
        ) {
          setUnidades(unidadesRes.value.data);
          guardarCache(ALMACENES.unidades, unidadesRes.value.data);
        }
        if (
          usuariosRes.status === "fulfilled" &&
          Array.isArray(usuariosRes.value?.data)
        ) {
          setUsuarios(usuariosRes.value.data);
          guardarCache(ALMACENES.usuarios, usuariosRes.value.data);
        }
        if (
          personasRes.status === "fulfilled" &&
          Array.isArray(personasRes.value?.data)
        ) {
          setPersonas(personasRes.value.data);
          guardarCache(ALMACENES.personas, personasRes.value.data);
        }

        const falloAlguno =
          conveniosRes.status === "rejected" ||
          unidadesRes.status === "rejected" ||
          usuariosRes.status === "rejected" ||
          personasRes.status === "rejected";

        if (falloAlguno) {
          // Sin conexión (o API caída): recuperamos la última copia local
          // por almacén y avisamos con un popup que los datos son locales.
          Promise.all([
            leerCache(ALMACENES.convenios),
            leerCache(ALMACENES.unidades),
            leerCache(ALMACENES.usuarios),
            leerCache(ALMACENES.personas),
          ]).then(
            ([cConvenios, cUnidades, cUsuarios, cPersonas]) => {
              if (cConvenios) setConvenios(cConvenios);
              if (cUnidades) setUnidades(cUnidades);
              if (cUsuarios) setUsuarios(cUsuarios);
              if (cPersonas) setPersonas(cPersonas);
              if (cConvenios || cUnidades || cUsuarios || cPersonas) {
                lanzarAviso(
                  "Modo sin conexión",
                  "No se pudo contactar la API: se muestra la última copia guardada en este dispositivo.",
                  "error",
                );
              } else {
                setErrorApi(
                  "No se pudieron traer los datos desde la API y no hay copia local guardada.",
                );
              }
            },
          );
        }
      })
      .finally(() => setCargando(false));
  }, []);

  // Recarga solo los convenios (se llama después de dar de alta uno nuevo o
  // de cambiar un estado, para que el panel y las métricas reflejen la base
  // al instante). Guarda el caché local, refresca la ficha abierta con la
  // versión fresca y, si la API no responde, vuelve a la última copia local.
  const recargarConvenios = () => {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/agreements`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((datos) => {
        if (Array.isArray(datos?.data)) {
          setConvenios(datos.data);
          guardarCache(ALMACENES.convenios, datos.data);
          cargarAlertasServidor().catch((error) =>
            console.warn("No se pudieron refrescar las alertas:", error),
          );
          // La ficha abierta pasa a mostrar el objeto fresco (estado nuevo,
          // fecha_actualización, documentos actualizados).
          setConvenioFicha((actual) => {
            if (!actual) return actual;
            return (
              datos.data.find((c) => Number(c.id) === Number(actual.id)) ??
              actual
            );
          });
        }
      })
      .catch(() => {
        leerCache(ALMACENES.convenios).then((cache) => {
          if (cache) {
            setConvenios(cache);
            lanzarAviso(
              "Modo sin conexión",
              "No se pudo actualizar desde la API: se muestra la última copia guardada en este dispositivo.",
              "error",
            );
          } else {
            setErrorApi("No se pudo actualizar el listado de convenios.");
          }
        });
      });
  };

  // Recarga solo los usuarios para reflejar al instante un cambio de rol.
  const recargarUsuarios = () => {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/usuarios`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((datos) => {
        if (Array.isArray(datos?.data)) setUsuarios(datos.data);
      });
  };

  // Reenvía operaciones JSON guardadas en IndexedDB. Los conflictos 409
  // permanecen en la cola para que se revisen contra la versión del servidor.
  const sincronizarPendientes = async () => {
    if (!navigator.onLine || sincronizandoRef.current) return;

    sincronizandoRef.current = true;
    setSincronizando(true);
    let huboCambios = false;

    try {
      const token = localStorage.getItem("token");
      const pendientes = await listarPendientes();

      for (const operacion of pendientes) {
        if (operacion.conflicto) continue;

        let respuesta;
        try {
          respuesta = await fetch(`${API_URL}${operacion.ruta}`, {
            method: operacion.method,
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(operacion.datos),
          });
        } catch (errorRed) {
          if (errorRed instanceof TypeError || !navigator.onLine) break;
          throw errorRed;
        }

        const resultado = await respuesta.json().catch(() => ({}));

        if (respuesta.status === 409) {
          await marcarPendienteEnConflicto(
            operacion.id,
            resultado.mensaje || "El convenio cambió en el servidor.",
          );
          lanzarAviso(
            "Hay un cambio para revisar",
            `La operación sobre ${operacion.ruta} encontró una versión más nueva.`,
            "error",
          );
          continue;
        }

        if (!respuesta.ok) {
          // Se conserva en la cola para reintentar después de corregir el error.
          break;
        }

        await eliminarPendiente(operacion.id);
        huboCambios = true;
      }

      if (huboCambios) {
        await recargarConvenios();
        await cargarAlertasServidor().catch(() => {});
        lanzarAviso(
          "Cambios sincronizados",
          "Las operaciones pendientes se guardaron en el servidor.",
          "exito",
        );
      }
    } catch (error) {
      console.error("No se pudieron sincronizar las operaciones:", error);
    } finally {
      sincronizandoRef.current = false;
      setSincronizando(false);
    }
  };

  useEffect(() => {
    const alVolverLaConexion = () => sincronizarPendientes();
    window.addEventListener("online", alVolverLaConexion);

    if (navigator.onLine) alVolverLaConexion();

    return () => window.removeEventListener("online", alVolverLaConexion);
  }, []);

  const ejecutarOEncolar = async (operacion, avisoOffline) => {
    if (!navigator.onLine) {
      await guardarPendiente(operacion);
      lanzarAviso("Guardado pendiente", avisoOffline, "info");
      return { pendiente: true };
    }

    const token = localStorage.getItem("token");
    let respuesta;

    try {
      respuesta = await fetch(`${API_URL}${operacion.ruta}`, {
        method: operacion.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(operacion.datos),
      });
    } catch (errorRed) {
      if (!(errorRed instanceof TypeError) && navigator.onLine) throw errorRed;

      await guardarPendiente(operacion);
      lanzarAviso("Guardado pendiente", avisoOffline, "info");
      return { pendiente: true };
    }

    const resultado = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || `Error ${respuesta.status}.`);
    }

    return { pendiente: false, resultado };
  };

  const guardarEdicionFicha = async (id, cambios, convenio) => {
    const operacion = {
      method: "PUT",
      ruta: `/agreements/${id}`,
      datos: {
        ...cambios,
        fecha_actualizacion_cliente: convenio?.fecha_actualizacion ?? null,
      },
    };

    const resultado = await ejecutarOEncolar(
      operacion,
      "La edición de la ficha se guardará cuando vuelva la conexión.",
    );

    if (resultado.pendiente) return;

    await recargarConvenios();
    await cargarAlertasServidor().catch(() => {});
    lanzarAviso("Ficha actualizada", "Los cambios quedaron guardados.", "exito");
  };

  // Llama al endpoint propio de cambio de rol. Si el afectado es el usuario
  // actual, el JWT y el localStorage quedaron viejos: cerramos sesión.
  const cambiarRolUsuario = async (id, rolNuevo) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/usuarios/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ rol: rolNuevo }),
    });

    const datos = await res.json();
    if (!res.ok) {
      throw new Error(datos.mensaje || "No se pudo cambiar el rol.");
    }

    await recargarUsuarios();

    if (Number(id) === Number(usuario.id)) {
      limpiarSesion();
      navigate("/login", { replace: true });
      return;
    }

    lanzarAviso(
      "Modificación registrada",
      `El usuario ahora tiene el rol ${rolNuevo}. El cambio quedó guardado en la base.`,
      "exito",
    );
  };

  // Cambia el estado de un convenio (transición del circuito del trámite).
  // Concurrencia optimista: manda la fecha_actualizacion que leyó la ficha;
  // si otro usuario movió el convenio primero, la API responde 409 y el
  // panel de la ficha muestra el conflicto. El fundamento queda en auditoría.
  const cambiarEstadoConvenio = async (
    id,
    estadoNuevo,
    observacion,
    convenio,
    fechaFirma,
  ) => {
    const operacion = {
      method: "PUT",
      ruta: `/agreements/${id}/estado`,
      datos: {
        estado_nuevo: estadoNuevo,
        observacion,
        fecha_firma: fechaFirma || null,
        fecha_actualizacion_cliente: convenio?.fecha_actualizacion ?? null,
      },
    };

    const envio = await ejecutarOEncolar(
      operacion,
      "El cambio de estado se guardará cuando vuelva la conexión.",
    );
    if (envio.pendiente) return;

    await recargarConvenios();
    await cargarAlertasServidor().catch(() => {});

    // Popup de la modificación (o de la baja, si el estado es final).
    const esBaja = estadoNuevo === "rescindido" || estadoNuevo === "archivado";
    const etiquetaActual =
      ETIQUETAS_ESTADO[convenio?.estado] ?? convenio?.estado ?? "—";
    const etiquetaNueva = ETIQUETAS_ESTADO[estadoNuevo] ?? estadoNuevo;
    lanzarAviso(
      esBaja ? "Baja registrada" : "Modificación registrada",
      `${convenio?.codigo_unico ?? `#${id}`}: ${etiquetaActual} → ${etiquetaNueva}. El fundamento quedó en la auditoría.`,
      esBaja ? "baja" : "exito",
    );
  };

  const [pestaña, setPestaña] = useState("metricas");
  const [convenioFicha, setConvenioFicha] = useState(null);

  // --- Alta de convenio (botón "Agregar" + modal con formulario y PDF) ----
  const [modalAltaAbierto, setModalAltaAbierto] = useState(false);
  const [enviandoAlta, setEnviandoAlta] = useState(false);
  const [errorAlta, setErrorAlta] = useState("");
  const [avisoAlta, setAvisoAlta] = useState("");
  const VACIO_ALTA = {
    titulo: "",
    tipo: "",
    id_unidad: "",
    objeto: "",
    marco_legal: "",
    confidencialidad: false,
    fecha_inicio: "",
    fecha_vencimiento: "",
    dias_preaviso: "",
  };
  const [formAlta, setFormAlta] = useState(VACIO_ALTA);
  const [archivoAlta, setArchivoAlta] = useState(null);

  const cambiarCampoAlta = (campo, valor) =>
    setFormAlta((anterior) => ({ ...anterior, [campo]: valor }));

  const abrirModalAlta = () => {
    setFormAlta(VACIO_ALTA);
    setArchivoAlta(null);
    setErrorAlta("");
    setModalAltaAbierto(true);
  };

  const tomarArchivoAlta = (evento) => {
    const archivo = evento.target.files?.[0] ?? null;
    setErrorAlta("");
    if (!archivo) {
      setArchivoAlta(null);
      return;
    }
    if (archivo.type !== "application/pdf") {
      setErrorAlta("El documento debe ser un archivo PDF.");
      evento.target.value = "";
      setArchivoAlta(null);
      return;
    }
    if (archivo.size > 20 * 1024 * 1024) {
      setErrorAlta("El PDF supera el máximo de 20 MB.");
      evento.target.value = "";
      setArchivoAlta(null);
      return;
    }
    setArchivoAlta(archivo);
  };

  const enviarAlta = (evento) => {
    evento.preventDefault();
    setErrorAlta("");

    if (
      !formAlta.titulo.trim() ||
      !formAlta.tipo ||
      !formAlta.id_unidad ||
      !formAlta.objeto.trim()
    ) {
      setErrorAlta(
        "Completá título, tipo, unidad responsable y objeto (obligatorios).",
      );
      return;
    }

    const datos = new FormData();
    datos.append("titulo", formAlta.titulo.trim());
    datos.append("tipo", formAlta.tipo);
    datos.append("id_unidad_responsable", formAlta.id_unidad);
    datos.append("objeto", formAlta.objeto.trim());
    datos.append("estado", "revision"); // el alta entra directo al circuito de revisión
    datos.append(
      "confidencialidad",
      formAlta.confidencialidad ? "true" : "false",
    );
    if (formAlta.marco_legal.trim())
      datos.append("marco_legal", formAlta.marco_legal.trim());
    if (formAlta.fecha_inicio)
      datos.append("fecha_inicio", formAlta.fecha_inicio);
    if (formAlta.fecha_vencimiento)
      datos.append("fecha_vencimiento", formAlta.fecha_vencimiento);
    if (formAlta.dias_preaviso)
      datos.append("dias_preaviso", formAlta.dias_preaviso);
    if (archivoAlta) datos.append("archivo", archivoAlta);

    const token = localStorage.getItem("token");
    setEnviandoAlta(true);
    fetch(`${API_URL}/agreements`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: datos,
    })
      .then(async (res) => {
        const cuerpo = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            cuerpo?.mensaje || `La API respondió con estado ${res.status}`,
          );
        }
        return cuerpo;
      })
      .then(() => {
        setModalAltaAbierto(false);
        setFormAlta(VACIO_ALTA);
        setArchivoAlta(null);
        setAvisoAlta(
          `Convenio "${formAlta.titulo.trim()}" creado y enviado a revisión.`,
        );
        lanzarAviso(
          "Alta registrada",
          `"${formAlta.titulo.trim()}" se creó en estado Revisión y entró al circuito del trámite.`,
          "exito",
        );
        recargarConvenios();
      })
      .catch((err) => setErrorAlta(err.message))
      .finally(() => setEnviandoAlta(false));
  };

  const [filtros, setFiltros] = useState({
    texto: "",
    tipo: "",
    estado: "",
    unidad: "",
    desde: "",
    hasta: "",
  });

  const [pagina, setPagina] = useState(1);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    setPagina(1);
  };

  const conveniosAlcance = useMemo(() => {
    if (alcanceGlobal) return convenios;
    return convenios.filter(
      (c) => Number(c.id_unidad_responsable) === Number(usuario?.id_unidad),
    );
  }, [alcanceGlobal, usuario, convenios]);

  const conveniosFiltrados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return conveniosAlcance.filter((c) => {
      if (
        texto &&
        !(c.titulo || "").toLowerCase().includes(texto) &&
        !(c.codigo_unico || "").toLowerCase().includes(texto)
      )
        return false;
      if (filtros.tipo && c.tipo !== filtros.tipo) return false;
      if (filtros.estado && c.estado !== filtros.estado) return false;
      if (filtros.unidad && String(c.id_unidad_responsable) !== filtros.unidad)
        return false;
      if (filtros.desde && (!c.fecha_firma || c.fecha_firma < filtros.desde))
        return false;
      if (filtros.hasta && (!c.fecha_firma || c.fecha_firma > filtros.hasta))
        return false;
      return true;
    });
  }, [conveniosAlcance, filtros]);

  const filasPagina = useMemo(() => {
    const inicio = (pagina - 1) * FILAS_POR_PAGINA;
    return conveniosFiltrados.slice(inicio, inicio + FILAS_POR_PAGINA);
  }, [conveniosFiltrados, pagina]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(conveniosFiltrados.length / FILAS_POR_PAGINA),
  );

  const metricas = useMemo(() => {
    const hoy = hoyIso();
    const firmados = conveniosAlcance.filter((c) => c.estado === "firmado");
    const vigentes = firmados.filter(
      (c) => !c.fecha_vencimiento || c.fecha_vencimiento >= hoy,
    );
    const porEstado = {};
    const porTipo = {};
    const porUnidad = {};
    const porAño = {};

    conveniosAlcance.forEach((c) => {
      porEstado[c.estado] = (porEstado[c.estado] ?? 0) + 1;
      porTipo[c.tipo] = (porTipo[c.tipo] ?? 0) + 1;
      const unidad = nombreUnidad(unidades, c.id_unidad_responsable);
      porUnidad[unidad] = (porUnidad[unidad] ?? 0) + 1;
      if (c.fecha_firma) {
        const año = c.fecha_firma.slice(0, 4);
        porAño[año] = (porAño[año] ?? 0) + 1;
      }
    });

    // Personas únicas dentro del alcance: se deduplica por nombre porque la
    // misma persona puede figurar en un convenio y en su renovación (ej.:
    // Sofía Robles en el convenio 2 y el 10).
    const idsAlcance = new Set(conveniosAlcance.map((c) => Number(c.id)));
    const nombresUnicos = new Set(
      personas
        .filter((p) => idsAlcance.has(Number(p.id_convenio)))
        .map((p) => p.nombre_completo),
    );

    return {
      total: conveniosAlcance.length,
      firmados: firmados.length,
      vigentes: vigentes.length,
      personasUnicas: nombresUnicos.size,
      porEstado,
      porTipo,
      porUnidad,
      porAño,
    };
  }, [conveniosAlcance, unidades, personas]);

  const vencimientos = useMemo(() => {
    const agrupado = {
      vencidos: [],
      proximos: [],
      sinVencimiento: [],
    };

    conveniosAlcance.forEach((c) => {
      const vigencia = calcularVigencia(c);
      const fila = { convenio: c, vigencia };
      if (vigencia.estado === "vencido") agrupado.vencidos.push(fila);
      else if (vigencia.estado === "proximo") agrupado.proximos.push(fila);
      else agrupado.sinVencimiento.push(fila);
    });

    agrupado.proximos.sort(
      (a, b) => a.vigencia.diasRestantes - b.vigencia.diasRestantes,
    );
    agrupado.vencidos.sort(
      (a, b) => a.vigencia.diasRestantes - b.vigencia.diasRestantes,
    );
    return agrupado;
  }, [conveniosAlcance]);

  const COLUMNAS_EXPORTAR = [
    { titulo: "Código", clave: "codigo_unico" },
    { titulo: "Título", clave: "titulo" },
    { titulo: "Tipo", clave: "tipo_etiqueta" },
    { titulo: "Estado", clave: "estado" },
    { titulo: "Unidad", clave: "unidad_nombre" },
    { titulo: "Fecha de firma", clave: "fecha_firma_texto" },
    { titulo: "Vencimiento", clave: "fecha_vencimiento_texto" },
  ];

  const filasParaExportar = useMemo(
    () =>
      conveniosFiltrados.map((c) => ({
        codigo_unico: c.codigo_unico,
        titulo: c.titulo,
        tipo_etiqueta: c.tipo,
        estado: c.estado,
        unidad_nombre: nombreUnidad(unidades, c.id_unidad_responsable),
        fecha_firma_texto: formatoFecha(c.fecha_firma),
        fecha_vencimiento_texto: c.fecha_vencimiento
          ? formatoFecha(c.fecha_vencimiento)
          : "Sin vencimiento registrado",
      })),
    [conveniosFiltrados, unidades],
  );

  const exportarCsvFiltrado = () => {
    const alcanceTexto = alcanceGlobal
      ? "Alcance: global (todas las unidades)"
      : `Alcance: ${nombreUnidad(unidades, usuario.id_unidad)}`;
    exportarCsv("convenios_filtrados", COLUMNAS_EXPORTAR, filasParaExportar);
    console.info(
      `Exportación CSV · ${alcanceTexto} · ${filasParaExportar.length} filas`,
    );
  };

  const exportarPdfFiltrado = () => {
    const alcanceTexto = alcanceGlobal
      ? "Alcance: global (todas las unidades)"
      : `Alcance: ${nombreUnidad(unidades, usuario.id_unidad)}`;
    exportarPdf(
      "Convenios filtrados",
      `${alcanceTexto} · Estado: ${filtros.estado || "todos"} · Tipo: ${filtros.tipo || "todos"}`,
      COLUMNAS_EXPORTAR,
      filasParaExportar,
    );
  };

  const cerrarSesion = () => {
    limpiarSesion();
    navigate("/login", { replace: true });
  };

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Defensa extra: si un rol sin acceso al panel llega hasta acá, lo devolvemos
  // a su pantalla de inicio (por ejemplo, consulta -> /convenios).
  if (!puedeVerPanel(usuario)) {
    return <Navigate to={rutaInicioPorRol(usuario)} replace />;
  }

  return (
    <div className="dashboard">
      <header className="top-navigation">
        <div className="brand">
          <img
            className="brand__logo"
            src={logoFacultad}
            alt="Facultad de Ingeniería"
          />
          <p className="brand__title">SISTEMA CONVENIOS</p>

          <nav className="navigation" aria-label="Navegación principal">
            <div className="dropdown flex-direction-row ">
              <button
                className="btn dropdown-toggle m-auto"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={menu}
                  className="pe-2"
                  alt="Flecha indicativa Label"
                />
                {""}Menu
              </button>
              <ul className="dropdown-menu">
                <li>
                  <h6 className="dropdown-header">Menu</h6>
                </li>
                <li>
                  <a className="dropdown-item" href="/convenios">
                    Busqueda
                  </a>
                </li>
                {puedeVerPanel(usuario) && (
                  <li>
                    <a className="dropdown-item" href="/dashboard">
                      Panel Administrativo
                    </a>
                  </li>
                )}
                {puedeVerConfiguracion(usuario) && (
                  <li>
                    <a className="dropdown-item" href="/config">
                      Configuración
                    </a>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item logout-button"
                    type="button"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <div className="dashboard__cuerpo">
        <MenuLateral
          pestañaActiva={pestaña}
          alSeleccionar={setPestaña}
          usuario={usuario}
          
        />

        <main className="dashboard__contenido">
          <header className="dashboard__encabezado">
            <h1>{ETIQUETA_PESTAÑA[pestaña]}</h1>
            <p className="dashboard__alcance">
              {alcanceGlobal
                ? "Alcance: global (todas las unidades)"
                : `Alcance: ${nombreUnidad(unidades, usuario?.id_unidad)}`}
            </p>
            {sincronizando && (
              <p className="dashboard__aviso" role="status" aria-live="polite">
                Sincronizando cambios pendientes…
              </p>
            )}
          </header>

          {pestaña === "administracion" && avisoAlta && (
            <p className="dashboard__aviso" role="status" aria-live="polite">
              {avisoAlta}
            </p>
          )}

          {cargando ? (
            <p className="dashboard__aviso">Cargando datos desde la API…</p>
          ) : errorApi ? (
            <p className="dashboard__aviso dashboard__aviso--error">
              {errorApi}
            </p>
          ) : (
            <>
              {pestaña === "metricas" && <Metricas metricas={metricas} />}
              {pestaña === "administracion" && (
                <Administracion
                  filas={filasPagina}
                  total={conveniosFiltrados.length}
                  pagina={pagina}
                  totalPaginas={totalPaginas}
                  cambiarPagina={setPagina}
                  filtros={filtros}
                  cambiarFiltro={cambiarFiltro}
                  limpiarFiltros={() => {
                    setFiltros({
                      texto: "",
                      tipo: "",
                      estado: "",
                      unidad: "",
                      desde: "",
                      hasta: "",
                    });
                    setPagina(1);
                  }}
                  abrirFicha={setConvenioFicha}
                  agregarAlta={abrirModalAlta}
                  unidades={unidades}
                  exportarCsv={exportarCsvFiltrado}
                  exportarPdf={exportarPdfFiltrado}
                  deshabilitado={filasParaExportar.length === 0}
                />
              )}
              {pestaña === "roles" && (
                <Roles
                  usuario={usuario}
                  alcances={{ usoAlcance: alcanceGlobal }}
                  unidades={unidades}
                  usuarios={usuarios}
                  personas={personas}
                  puedeCambiarRoles={puedeCambiarRoles(usuario)}
                  cambiarRolUsuario={cambiarRolUsuario}
                />
              )}
              {pestaña === "vencimientos" && (
                <Vencimientos
                  agrupado={vencimientos}
                  alertasServidor={alertasServidor}
                  convenios={convenios}
                  abrirFicha={setConvenioFicha}
                />
              )}
            </>
          )}
        </main>
      </div>

      <FichaDetalle
        convenio={convenioFicha}
        convenios={convenios}
        unidades={unidades}
        onCerrar={() => setConvenioFicha(null)}
        rolUsuario={usuario?.rol}
        onCambioEstado={cambiarEstadoConvenio}
        onGuardarFicha={guardarEdicionFicha}
        alNotificar={lanzarAviso}
        onRefrescar={recargarConvenios}
      />

      {/* Modal de alta: formulario con toda la info del instrumento + PDF.
          El convenio se crea en estado "revision" para entrar al circuito. */}
      <VentanaModal
        abierto={modalAltaAbierto}
        titulo="Agregar convenio"
        onCerrar={() => setModalAltaAbierto(false)}
      >
        <form className="form-alta" onSubmit={enviarAlta} noValidate>
          <p className="form-alta__nota">
            Los campos marcados con * son obligatorios. El convenio se crea en
            estado <strong>Revisión</strong> y el código único se genera solo.
          </p>

          <div className="form-alta__campo">
            <label htmlFor="alta-titulo">Título *</label>
            <input
              id="alta-titulo"
              type="text"
              value={formAlta.titulo}
              onChange={(evento) =>
                cambiarCampoAlta("titulo", evento.target.value)
              }
              placeholder="Ej.: Convenio específico de pasantías — Ejemplo S.R.L."
              required
            />
          </div>

          <div className="form-alta__campos-dobles">
            <div className="form-alta__campo">
              <label htmlFor="alta-tipo">Tipo de instrumento *</label>
              <select
                id="alta-tipo"
                value={formAlta.tipo}
                onChange={(evento) =>
                  cambiarCampoAlta("tipo", evento.target.value)
                }
                required
              >
                <option value="">Seleccioná un tipo</option>
                {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-alta__campo">
              <label htmlFor="alta-unidad">Unidad responsable *</label>
              <select
                id="alta-unidad"
                value={formAlta.id_unidad}
                onChange={(evento) =>
                  cambiarCampoAlta("id_unidad", evento.target.value)
                }
                required
              >
                <option value="">Seleccioná una unidad</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-alta__campo">
            <label htmlFor="alta-objeto">Objeto *</label>
            <textarea
              id="alta-objeto"
              rows="4"
              value={formAlta.objeto}
              onChange={(evento) =>
                cambiarCampoAlta("objeto", evento.target.value)
              }
              placeholder="Qué establece el instrumento, alcance y obligaciones principales."
              required
            />
          </div>

          <div className="form-alta__campo">
            <label htmlFor="alta-marco">
              Marco legal / resolución / expediente
            </label>
            <input
              id="alta-marco"
              type="text"
              value={formAlta.marco_legal}
              onChange={(evento) =>
                cambiarCampoAlta("marco_legal", evento.target.value)
              }
              placeholder="Ej.: Resolución CD FI N° 000/26 (opcional)"
            />
          </div>

          <div className="form-alta__campos-dobles">
            <div className="form-alta__campo">
              <label htmlFor="alta-inicio">Fecha de inicio</label>
              <input
                id="alta-inicio"
                type="date"
                value={formAlta.fecha_inicio}
                onChange={(evento) =>
                  cambiarCampoAlta("fecha_inicio", evento.target.value)
                }
              />
            </div>
            <div className="form-alta__campo">
              <label htmlFor="alta-vencimiento">Fecha de vencimiento</label>
              <input
                id="alta-vencimiento"
                type="date"
                value={formAlta.fecha_vencimiento}
                onChange={(evento) =>
                  cambiarCampoAlta("fecha_vencimiento", evento.target.value)
                }
              />
            </div>
          </div>

          <div className="form-alta__campos-dobles">
            <div className="form-alta__campo">
              <label htmlFor="alta-preaviso">Días de preaviso</label>
              <input
                id="alta-preaviso"
                type="number"
                min="0"
                max="365"
                value={formAlta.dias_preaviso}
                onChange={(evento) =>
                  cambiarCampoAlta("dias_preaviso", evento.target.value)
                }
                placeholder="Ej.: 60"
              />
            </div>
            <div className="form-alta__campo form-alta__campo--checkbox">
              <label htmlFor="alta-confidencialidad">
                <input
                  id="alta-confidencialidad"
                  type="checkbox"
                  checked={formAlta.confidencialidad}
                  onChange={(evento) =>
                    cambiarCampoAlta("confidencialidad", evento.target.checked)
                  }
                />
                Documento con confidencialidad
              </label>
            </div>
          </div>

          <div className="form-alta__campo">
            <label htmlFor="alta-archivo">
              Documento principal (PDF, hasta 20 MB)
            </label>
            <input
              id="alta-archivo"
              type="file"
              accept=".pdf,application/pdf"
              onChange={tomarArchivoAlta}
            />
            {archivoAlta && (
              <p className="form-alta__archivo-nombre">
                Adjunto: {archivoAlta.name} (
                {Math.round(archivoAlta.size / 1024)} KB)
              </p>
            )}
          </div>

          {errorAlta && (
            <p
              className="dashboard__aviso dashboard__aviso--error"
              role="alert"
            >
              {errorAlta}
            </p>
          )}

          <div className="form-alta__acciones">
            <button
              type="button"
              className="boton-secundario"
              onClick={() => setModalAltaAbierto(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-panel" disabled={enviandoAlta}>
              {enviandoAlta ? "Guardando…" : "Crear convenio en revisión"}
            </button>
          </div>
        </form>
      </VentanaModal>

      {/* Popups de notificación: alta, modificación, baja y errores de operación. */}
      <AvisoFlotante avisos={avisos} alDescartar={descartarAviso} />
    </div>
  );
}

function Metricas({ metricas }) {
  const franjasDe = (mapa) =>
    Object.entries(mapa).map(([item, cantidad]) => ({ item, cantidad }));

  const distribucionUnidad = franjasDe(metricas.porUnidad).sort(
    (a, b) => b.cantidad - a.cantidad,
  );
  const distribucionAño = franjasDe(metricas.porAño).sort((a, b) =>
    a.item.localeCompare(b.item),
  );

  return (
    <div className="metricas">
      <section className="panel-seccion">
        <VistaSeccion
          titulo="Panel de estadísticas"
          ayuda="Cantidades por estado y tipo, firmados y vigentes, y personas únicas dentro del alcance."
        />
        <div className="panel-fichas panel-fichas--fila">
          <TarjetaDato
            titulo="Convenios en el alcance"
            cantidad={formatoEntero(metricas.total)}
            detalle="instrumentos visibles"
          />
          <TarjetaDato
            titulo="Firmados"
            cantidad={formatoEntero(metricas.firmados)}
            detalle="con firma efectiva"
          />
          <TarjetaDato
            titulo="Vigentes"
            cantidad={formatoEntero(metricas.vigentes)}
            detalle="firmados y en vigencia"
          />
          <TarjetaDato
            titulo="Personas únicas"
            cantidad={
              metricas.personasUnicas === null
                ? "—"
                : formatoEntero(metricas.personasUnicas)
            }
            detalle="personas distintas vinculadas a los instrumentos del alcance"
          />
        </div>
        <div className="panel-fichas panel-fichas--distribucion">
          <BloqueDistribucion
            titulo="Por estado"
            franjas={franjasDe(metricas.porEstado)}
          />
          <BloqueDistribucion
            titulo="Por tipo"
            franjas={franjasDe(metricas.porTipo)}
          />
          <BloqueDistribucion
            titulo="Distribución por unidad"
            franjas={distribucionUnidad}
          />
          <BloqueDistribucion
            titulo="Distribución por año de firma"
            franjas={distribucionAño}
          />
        </div>
      </section>
    </div>
  );
}

function Administracion({
  filas,
  total,
  pagina,
  totalPaginas,
  cambiarPagina,
  filtros,
  cambiarFiltro,
  limpiarFiltros,
  abrirFicha,
  agregarAlta,
  unidades,
  exportarCsv,
  exportarPdf,
  deshabilitado,
}) {
  return (
    <div className="administracion">
      <section className="panel-seccion">
        <div className="panel-seccion__fila">
          <VistaSeccion
            titulo="Registro de convenios"
            ayuda="Búsqueda por texto, filtros y acceso a la ficha de detalle de cada instrumento."
          />
          <div className="panel-seccion__acciones">
            <button type="button" className="btn-panel" onClick={agregarAlta}>
              + Agregar convenio
            </button>
            <BotonExportar
              onCsv={exportarCsv}
              onPdf={exportarPdf}
              deshabilitado={deshabilitado}
            />
          </div>
        </div>

        <FiltroBusqueda
          filtros={filtros}
          onChange={cambiarFiltro}
          unidades={unidades}
          onLimpiar={limpiarFiltros}
        />

        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Título" },
            { titulo: "Tipo" },
            { titulo: "Estado" },
            { titulo: "Unidad" },
            { titulo: "Firma" },
            { titulo: "Ficha" },
          ]}
          filas={filas}
          mensajeVacio="Ningún convenio cumple con los filtros seleccionados."
          filaRender={(c) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td>
                <EtiquetaTipo tipo={c.tipo} />
              </td>
              <td>
                <EtiquetaEstado estado={c.estado} />
              </td>
              <td className="tabla__celda-neutra">
                {nombreUnidad(unidades, c.id_unidad_responsable)}
              </td>
              <td className="tabla__celda-neutra">
                {formatoFecha(c.fecha_firma)}
              </td>
              <td>
                <button
                  type="button"
                  className="tabla__accion"
                  onClick={() => abrirFicha(c)}
                >
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />

        <div className="administracion__pie">
          <p className="administracion__total">
            {formatoEntero(total)} convenio(s) listo(s) en el alcance
          </p>
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onChange={cambiarPagina}
          />
        </div>
      </section>
    </div>
  );
}

// Selector por fila: el botón abre el select de roles y confirma el cambio.
function SelectorRol({ usuarioFila, puedeCambiarRoles, onCambiar }) {
  const [abierto, setAbierto] = useState(false);
  const [rolNuevo, setRolNuevo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!confirmado) return undefined;
    const temporizador = setTimeout(() => setConfirmado(false), 4000);
    return () => clearTimeout(temporizador);
  }, [confirmado]);

  if (!puedeCambiarRoles) return null;

  const abrir = () => {
    setRolNuevo("");
    setError("");
    setConfirmado(false);
    setAbierto(true);
  };

  const cancelar = () => {
    setAbierto(false);
    setError("");
  };

  const confirmar = async () => {
    if (!rolNuevo || rolNuevo === usuarioFila.rol) {
      cancelar();
      return;
    }

    setGuardando(true);
    setError("");
    try {
      await onCambiar(usuarioFila.id, rolNuevo);
      setAbierto(false);
      setConfirmado(true);
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setGuardando(false);
    }
  };

  if (confirmado) {
    return (
      <span className="roles__confirmacion" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span> Actualizado
      </span>
    );
  }

  if (!abierto) {
    return (
      <button
        type="button"
        className="roles__boton-rol"
        onClick={abrir}
        aria-label={`Cambiar rol de ${usuarioFila.nombre_completo}`}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M11.5 2.5l2 2L6 12l-2.5.5L4 10l7.5-7.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M10.5 3.5l2 2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Cambiar
      </button>
    );
  }

  return (
    <>
      <span className="roles__editor-rol">
        <select
          aria-label={`Nuevo rol para ${usuarioFila.nombre_completo}`}
          value={rolNuevo}
          onChange={(e) => setRolNuevo(e.target.value)}
          disabled={guardando}
        >
          <option value="" disabled>
            Seleccionar rol…
          </option>
          {Object.values(ROLES)
            .filter((rol) => rol !== usuarioFila.rol)
            .map((rol) => (
              <option key={rol} value={rol}>
                {
                  {
                    administracion: "Administración",
                    gestion: "Gestión",
                    revision: "Revisión",
                    consulta: "Consulta",
                  }[rol]
                }
              </option>
            ))}
        </select>
        <button
          type="button"
          className="roles__accion-rol roles__accion-rol--guardar"
          onClick={confirmar}
          disabled={guardando || !rolNuevo}
          aria-label="Guardar rol"
          title="Guardar"
        >
          {guardando ? (
            "…"
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8.5l3.2 3.2L13 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="roles__accion-rol"
          onClick={cancelar}
          disabled={guardando}
          aria-label="Cancelar"
          title="Cancelar"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
      {error && (
        <span className="roles__error-rol" role="alert">
          {error}
        </span>
      )}
    </>
  );
}

function Roles({
  usuario,
  alcances: { usoAlcance },
  unidades,
  usuarios,
  personas,
  puedeCambiarRoles,
  cambiarRolUsuario,
}) {
  // Búsqueda de usuarios por texto (nombre, legajo o DNI), igual que en
  // Administración pero con un solo campo.
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const textoBusqueda = busquedaUsuario.trim().toLowerCase();

  const usuariosVisibles = usuarios.filter((u) => {
    const enAlcance = usoAlcance
      ? true
      : String(u.legajo) === String(usuario.legajo) ||
        u.id_unidad === usuario.id_unidad;
    if (!enAlcance) return false;

    if (!textoBusqueda) return true;
    return (
      u.nombre_completo.toLowerCase().includes(textoBusqueda) ||
      String(u.legajo).includes(textoBusqueda) ||
      String(u.dni ?? "").includes(textoBusqueda)
    );
  });

  return (
    <div className="roles">
      <section className="panel-seccion">
        <VistaSeccion
          titulo="Roles y alcance"
          ayuda="Cada usuario opera según su rol y su alcance: global o la unidad asignada."
        />

        <div className="panel-fichas panel-fichas--matriz">
          {MATRIZ_PERMISOS.map((permiso) => (
            <article className="panel-permiso" key={permiso.rol}>
              <header className="panel-permiso__encabezado">
                <EtiquetaRol rol={permiso.rol} />
                <span className="panel-permiso__alcance">
                  {permiso.alcance}
                </span>
              </header>
              <p className="panel-permiso__descripcion">
                {permiso.descripcion}
              </p>
              <ul className="panel-permiso__permisos">
                {permiso.permisos.map((texto) => (
                  <li key={texto}>{texto}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="panel-seccion__fila panel-seccion__fila--explode">
          <p className="roles__nota">
            {usoAlcance
              ? "Tu usuario tiene alcance global: ves todas las unidades."
              : `Tu usuario (${usuario.rol}) solo consulta la unidad asignada.`}
          </p>
        </div>
      </section>

      <section className="panel-seccion">
        <div className="panel-seccion__fila">
          <VistaSeccion
            titulo="Usuarios y alcance"
            ayuda="Listado de usuarios registrado en la base, asociado a cada rol y su unidad."
          />
          <input
            type="search"
            className="roles__buscador"
            value={busquedaUsuario}
            placeholder="Usuario"
            aria-label="Buscar usuario por nombre, legajo o DNI"
            onChange={(evento) => setBusquedaUsuario(evento.target.value)}
          />
        </div>
        <Tabla
          columnas={[
            { titulo: "Legajo", contenido: <span className="tabla__encabezado-centrado">Legajo</span> },
            {
              titulo: "Nombre y apellido",
              contenido: (
                <span className="tabla__encabezado-centrado">
                  Nombre y apellido
                </span>
              ),
            },
            { titulo: "Alcance", contenido: <span className="tabla__encabezado-centrado">Alcance</span> },
            {
              titulo: "Rol",
              contenido: <span className="roles__columna-rol">Rol</span>,
            },
          ]}
          filas={usuariosVisibles}
          mensajeVacio={
            textoBusqueda
              ? "Ningún usuario coincide con la búsqueda."
              : "Sin usuarios visibles dentro de tu alcance."
          }
          filaRender={(u) => (
            <tr key={u.id}>
              <td className="tabla__celda-principal tabla__celda-centrada">
                {u.legajo}
              </td>
              <td className="tabla__celda-centrada">{u.nombre_completo}</td>
              <td className="tabla__celda-neutra tabla__celda-centrada">
                {u.id_unidad === null
                  ? "Global (todas las unidades)"
                  : nombreUnidad(unidades, u.id_unidad)}
              </td>
              <td>
                <div className="roles__celda-rol">
                  <EtiquetaRol rol={u.rol} />
                  <SelectorRol
                    usuarioFila={u}
                    puedeCambiarRoles={puedeCambiarRoles}
                    onCambiar={cambiarRolUsuario}
                  />
                </div>
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Personas y pasantías"
          ayuda="Personas vinculadas a los instrumentos del alcance, con rol, periodo y datos complementarios de las pasantías (la misma persona puede figurar en más de un convenio)."
        />
        <Tabla
          columnas={[
            { titulo: "Persona" },
            { titulo: "Rol" },
            { titulo: "Convenio" },
            { titulo: "Carrera" },
            { titulo: "Carga horaria" },
            { titulo: "Periodo" },
            { titulo: "Tutoría" },
            { titulo: "Asignación" },
            { titulo: "Seguro" },
          ]}
          filas={personas}
          mensajeVacio="Sin personas vinculadas en tu alcance todavía."
          filaRender={(p) => (
            <tr key={p.id}>
              <td className="tabla__celda-principal">{p.nombre_completo}</td>
              <td className="tabla__celda">{p.rol ?? "—"}</td>
              <td className="tabla__celda">
                {p.codigo_unico ?? "—"}
                {p.convenio_titulo ? (
                  <span className="tabla__celda-neutra">
                    {" "}
                    · {recortarTexto(p.convenio_titulo, 40)}
                  </span>
                ) : null}
              </td>
              <td className="tabla__celda">{p.carrera ?? "—"}</td>
              <td className="tabla__celda-neutra">
                {p.carga_horaria != null ? `${p.carga_horaria} h/semana` : "—"}
              </td>
              <td className="tabla__celda-neutra">{p.periodo ?? "—"}</td>
              <td className="tabla__celda">{p.tutoria ?? "—"}</td>
              <td className="tabla__celda-neutra">{p.asignacion ?? "—"}</td>
              <td className="tabla__celda-neutra">{p.seguro ?? "—"}</td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}

function Vencimientos({
  agrupado,
  alertasServidor = [],
  convenios = [],
  abrirFicha,
}) {
  return (
    <div className="vencimientos">
      {alertasServidor.length > 0 && (
        <section className="panel-seccion">
          <VistaSeccion
            titulo="Alertas de preaviso"
            ayuda="Se muestran según los días de preaviso registrados para cada convenio."
          />
          <ul className="vencimientos__alertas">
            {alertasServidor.map((alerta) => {
              const convenio = convenios.find(
                (item) => Number(item.id) === Number(alerta.id),
              );
              const vencido = Number(alerta.dias_restantes) < 0;

              return (
                <li key={alerta.id}>
                  <strong>{alerta.codigo_unico}</strong>
                  {" · "}
                  {alerta.titulo}
                  {" · "}
                  {vencido
                    ? `Vencido hace ${Math.abs(alerta.dias_restantes)} días`
                    : `Vence en ${alerta.dias_restantes} días`}
                  {convenio && (
                    <button
                      type="button"
                      className="tabla__accion"
                      onClick={() => abrirFicha(convenio)}
                    >
                      Abrir ficha
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Plazos de cada instrumento"
          ayuda="El vencimiento y el preaviso se calculan con los datos registrados."
        />

        <div className="panel-fichas panel-fichas--fila">
          <TarjetaDato
            titulo="Vencidos"
            cantidad={agrupado.vencidos.length}
            detalle="fecha ya pasada"
          />
          <TarjetaDato
            titulo="Próximos a vencer"
            cantidad={agrupado.proximos.length}
            detalle="dentro de 45 días"
          />
          <TarjetaDato
            titulo="Vigentes"
            cantidad={
              agrupado.sinVencimiento.filter(
                (f) => f.vigencia.estado === "vigente",
              ).length
            }
            detalle="mas allá de 45 días"
          />
          <TarjetaDato
            titulo="Sin vencimiento"
            cantidad={
              agrupado.sinVencimiento.filter(
                (f) => f.vigencia.estado === "sin_vencimiento",
              ).length
            }
            detalle="sin fecha final registrada"
          />
        </div>
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Próximos a vencer"
          ayuda="Preaviso calculado a partir de la fecha final y los días registrados."
        />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Vencimiento" },
            { titulo: "Preaviso" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.proximos}
          mensajeVacio="Nada próximo a vencer dentro de los próximos 45 días."
          filaRender={({ convenio: c, vigencia }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 50)}</td>
              <td className="tabla__celda-neutra">
                {formatoFecha(c.fecha_vencimiento)} · {textoVigencia(vigencia)}
              </td>
              <td className="tabla__celda-neutra">
                {vigencia.fechaPreaviso
                  ? `${formatoFecha(vigencia.fechaPreaviso)} (${vigencia.diasPreaviso} días)`
                  : "—"}
              </td>
              <td>
                <button
                  type="button"
                  className="tabla__accion"
                  onClick={() => abrirFicha(c)}
                >
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Vencidos"
          ayuda="Instrumentos cuya fecha final ya pasó."
        />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Vencimiento" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.vencidos}
          mensajeVacio="Sin instrumentos vencidos en el alcance actual."
          filaRender={({ convenio: c, vigencia }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td className="tabla__celda-neutra">
                {formatoFecha(c.fecha_vencimiento)} · {textoVigencia(vigencia)}
              </td>
              <td>
                <button
                  type="button"
                  className="tabla__accion"
                  onClick={() => abrirFicha(c)}
                >
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Sin vencimiento registrado"
          ayuda="Instrumentos sin fecha final registrada: se informa tal cual, sin inventar plazos."
        />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Estado" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.sinVencimiento}
          mensajeVacio="Todos los instrumentos del alcance tienen fecha final registrada."
          filaRender={({ convenio: c }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td className="tabla__celda-neutra">
                Sin vencimiento registrado
              </td>
              <td>
                <button
                  type="button"
                  className="tabla__accion"
                  onClick={() => abrirFicha(c)}
                >
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}

function VistaSeccion({ titulo, ayuda }) {
  return (
    <div className="vista-seccion">
      <h2>{titulo}</h2>
      {ayuda && <p>{ayuda}</p>}
    </div>
  );
}

export default Dashboard;
