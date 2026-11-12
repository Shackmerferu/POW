// =====================================================
// 1. VARIABLES GLOBALES
// =====================================================

// Guarda el token CSRF que se utiliza para validar
// las peticiones que modifican información en el servidor.
let token = "";

// Guarda el rol del usuario que está utilizando la página.
// Por defecto, todos comienzan como invitados hasta consultar
// la sesión existente en el servidor.
let rolUsuario = "INVITADO";

// Array que contiene los productos agregados al carrito.
// Cada producto almacena: id, nombre, precio, stock y cantidad.
let carrito = [];

// Guardamos referencias a los elementos HTML que se utilizan
// frecuentemente para evitar buscarlos en cada función.
const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carritoItems");
const alertas = document.getElementById("alertas");

// =====================================================
// 2. MENSAJES Y SEGURIDAD HTML
// =====================================================

// Muestra un mensaje en la página.
// texto: contenido del mensaje.
// tipo: estilo de Bootstrap, por ejemplo success, danger o warning.
function mostrarMensaje(texto, tipo = "success") {
  // Escapamos el texto para impedir que se interprete como HTML.
  const mensajeSeguro = escaparHTML(texto);

  // Insertamos el mensaje dentro del contenedor de alertas.
  alertas.innerHTML = `
    <div class="alert alert-${tipo}" role="alert">
      ${mensajeSeguro}
    </div>
  `;
}

// Convierte caracteres especiales en entidades HTML.
// Esto evita que valores de usuarios o de productos
// se interpreten como etiquetas o atributos HTML.
function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c];
  });
}
