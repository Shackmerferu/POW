document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  if (form) form.addEventListener("submit", login);
  const salir = document.getElementById("btn-salir");
  if (salir) salir.addEventListener("click", cerrarSesion);

  if (location.pathname.endsWith("panel.html")) verificarSesion();
});

async function login(event) {
  event.preventDefault();
  const mensaje = document.getElementById("mensaje-login");
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value;
  try {
    const data = await api.post(APP.ENDPOINTS.login, {
      [APP.AUTH.userField]: usuario,
      [APP.AUTH.passwordField]: clave
    }, false);
    const token = data[APP.AUTH.tokenResponseKey];
    if (!token) throw new Error("La respuesta no contiene la clave de token configurada.");
    sessionStorage.setItem(APP.AUTH.tokenStorageKey, token);
    location.href = "panel.html";
  } catch (e) {
    mensaje.textContent = e.message;
    mensaje.className = "small mt-3 text-danger";
  }
}

async function verificarSesion() {
  const token = sessionStorage.getItem(APP.AUTH.tokenStorageKey);
  if (!token) { location.href = "index.html"; return false; }
  try {
    const params = APP.AUTH.tokenMode === "query" ? {[APP.AUTH.tokenParameter]:token} : {};
    if (APP.AUTH.tokenMode === "body") {
      await api.post(APP.ENDPOINTS.verify, {}, true);
    } else {
      await api.get(APP.ENDPOINTS.verify, params, APP.AUTH.tokenMode === "header");
    }
    return true;
  } catch (e) {
    console.error("Token inválido:", e);
    sessionStorage.removeItem(APP.AUTH.tokenStorageKey);
    location.href = "index.html";
    return false;
  }
}

function cerrarSesion() {
  sessionStorage.removeItem(APP.AUTH.tokenStorageKey);
  location.href = "index.html";
}
