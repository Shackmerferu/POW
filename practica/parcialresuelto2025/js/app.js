/* ============================================================
   app.js  —  Utilidades compartidas (Opción A: JS tradicional)
   ------------------------------------------------------------
   Funciones comunes a todas las páginas: petición a la API,
   armado del header/menú/WhatsApp y helpers de DOM.
   ============================================================ */

/**
 * Pide un endpoint de la API y devuelve SIEMPRE un array de filas.
 * La API responde { status, cantidad, productos }.
 *  - Si status es 200, devuelve data.productos (array).
 *  - Si no, devuelve [] y avisa por consola.
 */
async function pedirApi(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.status !== 200 || !Array.isArray(data.productos)) {
      console.warn("La API no devolvió datos:", url, data);
      return [];
    }
    return data.productos;
  } catch (e) {
    console.error("Error al consultar", url, e);
    return [];
  }
}

/** Crea un elemento con clase, texto y atributos opcionales. */
function crear(tag, { clase, texto, html, attrs } = {}) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto != null) el.textContent = texto;
  if (html != null) el.innerHTML = html;
  if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/**
 * Arma el menú de navegación desde la BASE DE DATOS (api/menu.php).
 * Reglas del parcial:
 *   - Solo los ítems con visible === 'SI'.
 *   - Los nombres se muestran en MAYÚSCULA.
 *   - Cada enlace lleva su id_categoria (0 = inicio).
 */
async function armarMenu() {
  const contenedor = document.getElementById("nav");
  if (!contenedor) return;

  const items = await pedirApi(API.menu);
  const linkHome = crear("a", {
    clase: "nav__link",
    texto: "INICIO",
    attrs: { href: "index.html" },
  });
  contenedor.appendChild(linkHome);

  items
    .filter((it) => String(it.visible).trim().toUpperCase() === "SI")
    // No duplicar el inicio si viniera en la tabla
    .filter((it) => Number(it.id_categoria) !== 0)
    .forEach((it) => {
      const cat = Number(it.id_categoria);
      const href =
        cat === CATEGORIA.MASCULINO
          ? "canicas_masculino.html"
          : cat === CATEGORIA.FEMENINO
          ? "canicas_femenino.html"
          : it.src;

      const marcado =
        (cat === CATEGORIA.MASCULINO && paginaActual === "canicas_masculino.html") ||
        (cat === CATEGORIA.FEMENINO && paginaActual === "canicas_femenino.html");

      contenedor.appendChild(
        crear("a", {
          clase: "nav__link" + (marcado ? " nav__link--activo" : ""),
          texto: String(it.titulo).toUpperCase(),
          attrs: { href },
        })
      );
    });

  // Marcar INICIO como activo en la home
  if (paginaActual === "index.html") linkHome.classList.add("nav__link--activo");
}

/** Botón flotante de WhatsApp, siempre en la esquina inferior derecha. */
function armarWhatsapp() {
  const a = crear("a", {
    clase: "whatsapp",
    attrs: {
      href: `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
        "Hola! Quiero consultar por las Canicas de La Tania"
      )}`,
      target: "_blank",
      rel: "noopener",
      "aria-label": "Abrir WhatsApp",
    },
  });
  a.appendChild(crear("img", { attrs: { src: "assets/whatsapp.png", alt: "WhatsApp" } }));
  document.body.appendChild(a);
}

/** Nombre del archivo HTML actual (ej. "index.html"). */
const paginaActual = (location.pathname.split("/").pop() || "index.html").toLowerCase();

// Arranque común de todas las páginas
document.addEventListener("DOMContentLoaded", () => {
  armarMenu();
  armarWhatsapp();
});
