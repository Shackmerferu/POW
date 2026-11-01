/* ============================================================
   config.js - Configuracion central del front
   ------------------------------------------------------------
   Toda la aplicacion toma las rutas de la API desde este archivo.
   Si el proyecto se mueve de carpeta, normalmente NO hay que
   tocar el resto de los .js: alcanza con revisar API_BASE.

   Por defecto se calcula la carpeta "api" hermana de "front":
      .../termos/front/index.html  ->  .../termos/api
   Eso funciona tanto en C:\xampp\htdocs\termos como en
   C:\xampp\htdocs\facultad\...\termos.

   Casos especiales:
   - Si el front se abre con doble clic (file://), no existe una
     ruta relativa posible. Se usa la URL clasica del parcial.
   - Si el front se publica en otro host/puerto, definir antes de
     cargar este archivo:
         <script>window.API_BASE_OVERRIDE = "http://localhost/termos/api";</script>
   ============================================================ */

"use strict";

const API_BASE = (() => {
  // 1) Override manual (util para entregar el front en otro servidor).
  if (window.API_BASE_OVERRIDE) {
    return String(window.API_BASE_OVERRIDE).replace(/\/+$/, "");
  }

  // 2) Si se abrio como archivo local, no se puede usar ../api.
  if (window.location.protocol === "file:") {
    return "http://localhost/termos/api";
  }

  // 3) Ruta relativa: front/ y api/ son carpetas hermanas.
  return new URL("../api/", window.location.href).href.replace(/\/+$/, "");
})();

/* Mapa unico de endpoints. Se usa siempre API.xxx para evitar
   errores de tipeo y para tener una sola fuente de verdad. */
const API = {
  login:               `${API_BASE}/login.php`,
  verificaToken:       `${API_BASE}/verifica_token.php`,
  listarProductos:     `${API_BASE}/listar_productos.php`,
  registrarProducto:   `${API_BASE}/registrar_productos.php`,
  personasCantidad:    `${API_BASE}/personas_cantidad.php`,
  personasListar:      `${API_BASE}/personas_listar.php`,
  personasGuardar:     `${API_BASE}/personas_guardar.php`,
  personasEditar:      `${API_BASE}/personas_guardar_editar.php`,
  ciudades:            `${API_BASE}/ciudades.php`,
  imagenes:            `${API_BASE}/imagenes`
};

/* Claves de sessionStorage. */
const APP_STORAGE = {
  token: "termos_token",
  usuario: "termos_usuario"
};
