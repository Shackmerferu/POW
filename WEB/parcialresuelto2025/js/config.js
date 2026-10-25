/* ============================================================
   config.js  —  Configuración central de la aplicación
   ------------------------------------------------------------
   Todo lo que depende del entorno (dónde vive la API) está acá.
   Si movés la carpeta del proyecto, solo cambia API_BASE.

   La API del parcial vive en:
     http://localhost/la_tania/api/
   Pero como este proyecto de estudio puede estar en otra carpeta,
   se define el base una sola vez y se reutiliza en todo el código.
   ============================================================ */

// Punto único de configuración: ruta base de la API (sin barra final).
// Ajustá esta línea si tu Apache sirve la API en otra URL.
const API_BASE = "http://localhost/la_tania/api";

// Endpoints de la API (todos devuelven JSON { status, cantidad, productos }).
const API = {
  menu:            `${API_BASE}/menu.php`,
  equipos:         `${API_BASE}/equipos.php`,
  jugadores:       `${API_BASE}/jugadores.php`,
  partidos:        `${API_BASE}/partidos.php`,
  palmaresListar:  `${API_BASE}/palmares_listar.php`,
  palmaresGuardar: `${API_BASE}/palmares_guardar.php`,
  equiposInsertar: `${API_BASE}/equipos_insertar.php`,
  // Carpeta de imágenes servida por la API
  imgJugadores:    `${API_BASE}/img/fotos_jugadores`,
  imgLogos:        `${API_BASE}/img/logos`,
};

// Categorías del deporte Canicas
const CATEGORIA = {
  MASCULINO: 1,
  FEMENINO:  3,
};

// WhatsApp del club (para el botón flotante)
const WHATSAPP_NUMERO = "5492302123456";
