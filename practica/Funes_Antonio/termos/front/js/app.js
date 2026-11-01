/* ============================================================
   app.js - Utilidades compartidas por index.html y panel.html
   ------------------------------------------------------------
   Responsabilidades:
   - Guardar / leer / borrar el token de sessionStorage.
   - Armar URLs con parametros (siempre encodeados).
   - Hacer fetch y convertir la respuesta a JSON con errores claros.
   - Escapar texto antes de insertarlo con innerHTML (evita XSS).
   - Mostrar alertas Bootstrap.
   - Verificar el token contra verifica_token.php.
   ============================================================ */

"use strict";

const App = (() => {

  /* ----------------------------------------------------------
     1. SESION
     ---------------------------------------------------------- */

  function getToken() {
    return sessionStorage.getItem(APP_STORAGE.token);
  }

  function getUsuario() {
    const guardado = sessionStorage.getItem(APP_STORAGE.usuario);
    if (!guardado) return null;

    try {
      return JSON.parse(guardado);
    } catch (error) {
      return null;
    }
  }

  function saveSession(token, usuario) {
    sessionStorage.setItem(APP_STORAGE.token, token);
    sessionStorage.setItem(APP_STORAGE.usuario, JSON.stringify(usuario || {}));
  }

  function clearSession() {
    sessionStorage.removeItem(APP_STORAGE.token);
    sessionStorage.removeItem(APP_STORAGE.usuario);
  }

  /* ----------------------------------------------------------
     2. SEGURIDAD / TEXTO
     ---------------------------------------------------------- */

  // Convierte caracteres peligrosos en entidades HTML.
  // Se usa SIEMPRE que un dato de la API se inserta con innerHTML.
  function escapeHtml(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, (caracter) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[caracter];
    });
  }

  // La API guarda las imagenes con el nombre que trae el archivo.
  // encodeURIComponent evita romper la URL si tiene espacios o acentos.
  function imageUrl(nombreArchivo) {
    if (!nombreArchivo) return "";
    return `${API.imagenes}/${encodeURIComponent(nombreArchivo)}`;
  }

  /* ----------------------------------------------------------
     3. URLS Y PETICIONES
     ---------------------------------------------------------- */

  function withParams(url, params) {
    const destino = new URL(url);

    Object.entries(params || {}).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== "") {
        destino.searchParams.set(clave, String(valor));
      }
    });

    return destino.toString();
  }

  // Algunas respuestas de PHP pueden traer un warning antes del JSON.
  // Esta funcion intenta leer el JSON aunque haya ruido alrededor.
  function parseJson(texto) {
    if (!texto || !texto.trim()) return {};

    try {
      return JSON.parse(texto);
    } catch (error) {
      const inicio = texto.indexOf("{");
      const fin = texto.lastIndexOf("}");

      if (inicio >= 0 && fin > inicio) {
        try {
          return JSON.parse(texto.slice(inicio, fin + 1));
        } catch (errorInterno) {
          // Se resuelve abajo con un mensaje util.
        }
      }

      const falla = new Error(
        "La API no devolvió JSON válido. Respuesta recibida: " +
        texto.trim().slice(0, 220)
      );
      falla.respuestaCruda = texto;
      throw falla;
    }
  }

  async function leerRespuesta(response) {
    const texto = await response.text();
    const datos = parseJson(texto);

    if (!response.ok) {
      const mensaje =
        datos.menssage ||
        datos.mensaje ||
        datos.message ||
        `Error HTTP ${response.status}`;
      throw new Error(mensaje);
    }

    return datos;
  }

  async function getJSON(url, params) {
    const response = await fetch(withParams(url, params), {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    return leerRespuesta(response);
  }

  async function postForm(url, formData, params) {
    const response = await fetch(withParams(url, params), {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    return leerRespuesta(response);
  }

  // Para endpoints que leen $_REQUEST alcanza con
  // application/x-www-form-urlencoded.
  async function postUrlEncoded(url, valores, params) {
    const datos = new URLSearchParams();

    Object.entries(valores || {}).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null) {
        datos.append(clave, String(valor));
      }
    });

    return postForm(url, datos, params);
  }

  /* ----------------------------------------------------------
     4. ALERTAS
     ---------------------------------------------------------- */

  function showAlert(contenedor, mensaje, tipo = "success") {
    if (!contenedor) return;

    const icono = {
      success: "OK",
      danger: "Error",
      warning: "Atención",
      info: "Info"
    }[tipo] || "Info";

    contenedor.innerHTML = `
      <div class="alert alert-${escapeHtml(tipo)} d-flex gap-2 align-items-start"
           role="${tipo === "danger" ? "alert" : "status"}">
        <strong class="alert-tag">${escapeHtml(icono)}</strong>
        <span>${escapeHtml(mensaje)}</span>
      </div>
    `;
  }

  function clearAlert(contenedor) {
    if (contenedor) contenedor.innerHTML = "";
  }

  /* ----------------------------------------------------------
     5. CONTROL DE SESION
     ---------------------------------------------------------- */

  async function verifyToken(token) {
    if (!token) return false;

    try {
      const datos = await getJSON(API.verificaToken, { token: token });

      // La API tiene el typo "tpken_presente"; se aceptan ambos nombres.
      const presente =
        datos.tpken_presente === true ||
        datos.token_presente === true;

      return datos.status === 200 && presente;
    } catch (error) {
      console.error("No se pudo verificar el token:", error);
      return false;
    }
  }

  function redirectToLogin() {
    const ruta = window.location.pathname;

    // Evita un bucle si ya estamos en index.html.
    if (!/index\.html?$/i.test(ruta)) {
      window.location.replace("index.html");
    }
  }

  // Devuelve el token si la sesion es valida. Si no, redirige.
  async function requireSession() {
    const token = getToken();

    if (!token) {
      redirectToLogin();
      return null;
    }

    const valido = await verifyToken(token);

    if (!valido) {
      clearSession();
      redirectToLogin();
      return null;
    }

    return token;
  }

  /* ----------------------------------------------------------
     6. UI
     ---------------------------------------------------------- */

  function setLoading(boton, cargando, textoCargando = "Procesando...") {
    if (!boton) return;

    if (cargando) {
      boton.dataset.textoOriginal = boton.innerHTML;
      boton.disabled = true;
      boton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        ${escapeHtml(textoCargando)}
      `;
    } else {
      boton.disabled = false;
      if (boton.dataset.textoOriginal) {
        boton.innerHTML = boton.dataset.textoOriginal;
      }
    }
  }

  // Expone solo lo que necesitan las paginas.
  return {
    getToken,
    getUsuario,
    saveSession,
    clearSession,
    escapeHtml,
    imageUrl,
    withParams,
    getJSON,
    postForm,
    postUrlEncoded,
    showAlert,
    clearAlert,
    verifyToken,
    requireSession,
    redirectToLogin,
    setLoading
  };
})();
