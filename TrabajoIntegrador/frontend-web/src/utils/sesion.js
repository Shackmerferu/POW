const CLAVE_USUARIO = "active_user";
const CLAVE_TOKEN = "token";
const CLAVE_USUARIO_ANTIGUA = "usuario";

export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO) || "null");
  } catch {
    return null;
  }
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function guardarSesion(usuario, token) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));

  if (token) {
    localStorage.setItem(CLAVE_TOKEN, token);
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_USUARIO);
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO_ANTIGUA);
}

export function haySesion() {
  return Boolean(obtenerUsuario());
}
