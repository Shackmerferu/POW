export const ROLES = Object.freeze({
  ADMINISTRACION: "administracion",
  GESTION: "gestion",
  REVISION: "revision",
  CONSULTA: "consulta",
});

export const RUTAS = Object.freeze({
  LOGIN: "/login",
  PANEL: "/dashboard",
  CONVENIOS: "/convenios",
  CONFIGURACION: "/config",
});

const PERMISOS_POR_ROL = Object.freeze({
  [ROLES.ADMINISTRACION]: Object.freeze({
    verConvenios: true,
    verPanel: true,
    gestionarConvenios: true,
    firmarConvenios: true,
    administrarUsuarios: true,
    cambiarRoles: true,
    verConfiguracion: true,
    descargarDocumentos: true,
    alcanceGlobal: true,
    rutaInicio: RUTAS.PANEL,
  }),

  [ROLES.GESTION]: Object.freeze({
    verConvenios: true,
    verPanel: true,
    gestionarConvenios: true,
    firmarConvenios: true,
    administrarUsuarios: false,
    cambiarRoles: true,
    verConfiguracion: false,
    descargarDocumentos: true,
    alcanceGlobal: false,
    rutaInicio: RUTAS.PANEL,
  }),

  [ROLES.REVISION]: Object.freeze({
    verConvenios: true,
    verPanel: true,
    // Si revisión NO debe editar, cambiá estos dos a false.
    gestionarConvenios: true,
    firmarConvenios: true,
    administrarUsuarios: false,
    cambiarRoles: false,
    verConfiguracion: false,
    descargarDocumentos: true,
    alcanceGlobal: false,
    rutaInicio: RUTAS.PANEL,
  }),

  [ROLES.CONSULTA]: Object.freeze({
    verConvenios: true,
    verPanel: false,
    gestionarConvenios: false,
    firmarConvenios: false,
    administrarUsuarios: false,
    cambiarRoles: false,
    verConfiguracion: false,
    descargarDocumentos: true,
    alcanceGlobal: false,
    rutaInicio: RUTAS.CONVENIOS,
  }),
});

export const MATRIZ_PERMISOS = Object.freeze([
  {
    rol: "administracion",
    descripcion: "Administración total del sistema: alta, cierre y gestión de usuarios.",
    alcance: "Global (todas las unidades)",
    permisos: ["Alta, edición y cierre de convenios", "Gestión de usuarios y roles", "Exportación completa"],
  },
  {
    rol: "gestion",
    descripcion: "Gestión de instrumentos dentro de su unidad asignada.",
    alcance: "Unidad asignada",
    permisos: ["Alta y edición de convenios de su unidad", "Carga de documentos", "Cambio de roles de usuarios de su unidad", "Exportación dentro del alcance"],
  },
  {
    rol: "revision",
    descripcion: "Revisa y dictamina instrumentos antes de su aprobación.",
    alcance: "Unidad asignada",
    permisos: ["Lectura completa", "Dictámenes y observaciones", "Exportación de lectura"],
  },
  {
    rol: "consulta",
    descripcion: "Consulta información dentro de la unidad asignada, sin modificarla.",
    alcance: "Unidad asignada",
    permisos: ["Solo lectura", "Exportación de lo visible"],
  },
]);

// Normaliza el rol para tolerar mayúsculas o espacios que puedan venir de la API.
export function rolNormalizado(usuario) {
  if (!usuario || !usuario.rol) return null;
  return String(usuario.rol).trim().toLowerCase();
}

export function esRolValido(usuario) {
  const rol = rolNormalizado(usuario);
  return Boolean(rol && PERMISOS_POR_ROL[rol]);
}

export function tienePermiso(usuario, permiso) {
  const permisos = PERMISOS_POR_ROL[rolNormalizado(usuario)];
  return Boolean(permisos?.[permiso]);
}

export const puedeVerConvenios = (usuario) =>
  tienePermiso(usuario, "verConvenios");

export const puedeVerPanel = (usuario) => tienePermiso(usuario, "verPanel");

export const puedeGestionarConvenios = (usuario) =>
  tienePermiso(usuario, "gestionarConvenios");

export const puedeFirmarConvenios = (usuario) =>
  tienePermiso(usuario, "firmarConvenios");

export const puedeAdministrarUsuarios = (usuario) =>
  tienePermiso(usuario, "administrarUsuarios");

export const puedeCambiarRoles = (usuario) =>
  tienePermiso(usuario, "cambiarRoles");

export const puedeVerConfiguracion = (usuario) =>
  tienePermiso(usuario, "verConfiguracion");

export const puedeDescargarDocumentos = (usuario) =>
  tienePermiso(usuario, "descargarDocumentos");

export const puedeTenerAlcanceGlobal = (usuario) =>
  tienePermiso(usuario, "alcanceGlobal");

export const esConsulta = (usuario) => rolNormalizado(usuario) === ROLES.CONSULTA;

export function rutaInicioPorRol(usuario) {
  return PERMISOS_POR_ROL[rolNormalizado(usuario)]?.rutaInicio ?? RUTAS.LOGIN;
}

// Sirve para filtrar convenios por unidad.
export function puedeVerUnidad(usuario, idUnidad) {
  if (!usuario) return false;
  if (puedeTenerAlcanceGlobal(usuario)) return true;

  if (usuario.id_unidad === null || usuario.id_unidad === undefined) {
    return false;
  }

  return Number(usuario.id_unidad) === Number(idUnidad);
}

const PERMISO_POR_RUTA = Object.freeze({
  [RUTAS.PANEL]: "verPanel",
  [RUTAS.CONVENIOS]: "verConvenios",
  [RUTAS.CONFIGURACION]: "verConfiguracion",
});

export function puedeAccederA(ruta, usuario) {
  const permiso = PERMISO_POR_RUTA[ruta];
  return permiso ? tienePermiso(usuario, permiso) : false;
}
