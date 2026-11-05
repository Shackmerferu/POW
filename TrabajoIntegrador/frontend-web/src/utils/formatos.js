/**
 * FORMATOS — Funciones de formato y cálculo compartidas en todo el panel.
 * Trabajamos con fechas ISO ("aaaa-mm-dd") porque así las guarda MySQL.
 */

// Etiquetas legibles para los valores de los ENUM de la base de datos.
export const ETIQUETAS_TIPO = {
  marco_colaboracion: "Marco de colaboración",
  especifico_colaboracion: "Específico de colaboración",
  marco_pasantia: "Marco de pasantía",
  especifico_pasantia: "Específico de pasantía",
  adenda: "Adenda",
};

export const ETIQUETAS_ESTADO = {
  borrador: "Borrador",
  revision: "Revisión",
  aprobado: "Aprobado",
  firmado: "Firmado",
  rescindido: "Rescindido",
  archivado: "Archivado",
};

/**
 * Convierte "aaaa-mm-dd" en "dd/mm/aaaa". Devuelve "—" si no hay dato.
 * @param {string|null} valor fecha en formato ISO
 */
export function formatoFecha(valor) {
  if (!valor) return "—";
  const fecha = new Date(`${String(valor).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return "—";
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

/** "2024-08-12" → { dia, mes, año }. Devuelve null si la fecha no sirve. */
export function desglosarFecha(valor) {
  if (!valor) return null;
  const fecha = new Date(`${String(valor).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;
  return { año: fecha.getFullYear(), dia: fecha.getDate(), mes: fecha.getMonth() };
}

/** Convierte un entero en texto con separadores de miles es-AR. */
export function formatoEntero(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return Number(valor).toLocaleString("es-AR");
}

/** true/false → "Sí"/"No" (para confidencialidad, por ejemplo). */
export function formatoBoolean(valor) {
  return valor ? "Sí" : "No";
}

/** Recorte de textos largos para tablas y fichas compactas. */
export function recortarTexto(texto, maximo = 90) {
  if (!texto) return "—";
  const limpio = String(texto).trim();
  if (limpio.length <= maximo) return limpio;
  return `${limpio.slice(0, maximo).trimEnd()}…`;
}

/**
 * Suma (o resta) días a una fecha ISO y devuelve otra fecha ISO.
 * @param {string} iso fecha base "aaaa-mm-dd"
 * @param {number} dias puede ser negativo
 */
export function sumarDias(iso, dias) {
  const fecha = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  fecha.setDate(fecha.getDate() + Number(dias));
  return fecha.toISOString().slice(0, 10);
}

/** Fecha de hoy en formato ISO (sin hora). */
export function hoyIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Cantidad de días entre dos fechas ISO (fin − inicio). */
export function diasEntre(isoInicio, isoFin) {
  if (!isoInicio || !isoFin) return null;
  const inicio = new Date(`${isoInicio.slice(0, 10)}T00:00:00`);
  const fin = new Date(`${isoFin.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return null;
  return Math.round((fin - inicio) / 86400000);
}

/**
 * Clasifica la vigencia de un convenio según la fecha final registrada.
 *
 * @param {object} convenio con fecha_vencimiento y dias_preaviso
 * @param {string} [referenciaIso] fecha de cálculo; por defecto hoy
 * @returns {{estado: "proximo"|"vigente"|"vencido"|"sin_vencimiento",
 *            diasRestantes: number|null, fechaPreaviso: string|null,
 *            diasPreaviso: number|null}}
 */
export function calcularVigencia(convenio, referenciaIso = hoyIso()) {
  const fin = convenio.fecha_vencimiento;

  // Si no hay fecha final, no existe plazo: se informa tal cual.
  if (!fin) {
    return {
      estado: "sin_vencimiento",
      diasRestantes: null,
      fechaPreaviso: null,
      diasPreaviso: convenio.dias_preaviso ?? null,
    };
  }

  const diasRestantes = diasEntre(referenciaIso, fin);

  // El preaviso nace del plazo: fecha final − días de preaviso registrados.
  const diasPreaviso = convenio.dias_preaviso ?? null;
  const fechaPreaviso =
    diasPreaviso !== null ? sumarDias(fin, -diasPreaviso) : null;

  let estado;
  if (diasRestantes < 0) estado = "vencido";
  else if (diasRestantes <= 45) estado = "proximo";
  else estado = "vigente";

  return { estado, diasRestantes, fechaPreaviso, diasPreaviso };
}

/** Texto corto del estado de vigencia para etiquetas en tablas. */
export function textoVigencia(vigencia) {
  switch (vigencia.estado) {
    case "vencido":
      return "Vencido";
    case "proximo":
      return `Vence en ${formatoEntero(vigencia.diasRestantes)} días`;
    case "vigente":
      return `Vigente · ${formatoEntero(vigencia.diasRestantes)} días`;
    default:
      return "Sin vencimiento registrado";
  }
}

/** Mapea un id de unidad en su nombre. Devuelve el texto si no está en el mapa. */
export function nombreUnidad(unidades, id) {
  if (id === null || id === undefined) return "Global (todas las unidades)";
  const unidad = unidades.find((item) => item.id === id);
  return unidad ? unidad.nombre : `Unidad ${id}`;
}

/** Nombre corto para la etiqueta de alcance en la pestaña Roles. */
export function etiquetaAlcance(idUnidad) {
  return idUnidad === null || idUnidad === undefined
    ? "Global"
    : "Unidad asignada";
}
