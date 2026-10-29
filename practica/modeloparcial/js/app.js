
// js/app.js

// =====================================================
// 1. VARIABLES GLOBALES
// =====================================================

let token = "";
let rolUsuario = "INVITADO";  
let carrito = [];

// Referencias a los elementos principales del HTML.
const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carritoItems");
const alertas = document.getElementById("alertas");

// =====================================================
// 2. MENSAJES Y SEGURIDAD HTML
// =====================================================

// Muestra mensajes de éxito, advertencia o error.
function mostrarMensaje(texto, tipo = "success") {
  const mensajeSeguro = escaparHTML(texto);

  alertas.innerHTML = `
    <div class="alert alert-${tipo}" role="alert">
      ${mensajeSeguro}
    </div>
  `;
}

// Escapa valores antes de insertarlos en HTML.
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

// =====================================================
// 3. CATÁLOGO DE PRODUCTOS
// =====================================================

async function cargarProductos() {
  const categoria = document.getElementById("filtroCategoria").value;

  try {
    const respuesta = await fetch(
      `api/productos.php?action=listar&categoria=${encodeURIComponent(categoria)}`,
      { credentials: "same-origin" }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.status !== 200) {
      throw new Error(
        resultado.message || "No se pudieron cargar los productos."
      );
    }

    renderizarCatalogo(resultado.data || []);

    // El administrador actualiza su listado de gestión.
    if (
      rolUsuario === "admin" &&
      typeof window.cargarProductosAdmin === "function"
    ) {
      await window.cargarProductosAdmin();
    }
  } catch (error) {
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-danger">No se pudo cargar el catálogo.</p>
      </div>
    `;

    console.error("Error al cargar productos:", error);
  }
}

// Genera las tarjetas del catálogo.
function renderizarCatalogo(productos) {
  if (productos.length === 0) {
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-muted">No hay productos disponibles.</p>
      </div>
    `;
    return;
  }

  productosDiv.innerHTML = productos
    .map(function (producto) {
      const stock = Number(producto.stock);
      const precio = Number(producto.precio);
      const esCliente = rolUsuario === "cliente";

      let botonCompra = "";

      // Solo los clientes pueden agregar productos.
      if (esCliente && stock > 0) {
        botonCompra = `
          <button
            type="button"
            class="agregar-carrito btn btn-warning w-100"
            data-id="${Number(producto.id)}"
            data-nombre="${escaparHTML(producto.nombre)}"
            data-precio="${precio}"
            data-stock="${stock}">
            Agregar al carrito
          </button>
        `;
      } else if (esCliente && stock <= 0) {
        botonCompra = `
          <button
            type="button"
            class="btn btn-secondary w-100"
            disabled>
            Sin stock
          </button>
        `;
      }

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="producto-card card h-100">
            ${
              producto.imagen
                ? `
                  <img
                    src="${escaparHTML(producto.imagen)}"
                    class="card-img-top"
                    alt="${escaparHTML(producto.nombre)}"
                    loading="lazy">
                `
                : `
                  <div class="product-image-placeholder">
                    <span>Termo Store</span>
                  </div>
                `
            }

            <div class="card-body">
              <h3 class="card-title">
                ${escaparHTML(producto.nombre)}
              </h3>

              <p class="card-text">
                ${escaparHTML(producto.descripcion)}
              </p>

              <p class="precio">
                $${precio.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>

              <p class="product-stock">
                Stock disponible: ${stock}
              </p>

              ${botonCompra}
            </div>
          </article>
        </div>
      `;
    })
    .join("");

  actualizarBotonesCarrito();
}

// Deshabilita agregar más unidades cuando se alcanza el stock.
function actualizarBotonesCarrito() {
  document.querySelectorAll(".agregar-carrito").forEach(function (boton) {
    const id = Number(boton.dataset.id);
    const productoCarrito = carrito.find((p) => p.id === id);
    const cantidad = productoCarrito ? productoCarrito.cantidad : 0;
    const stock = Number(boton.dataset.stock);

    boton.disabled = rolUsuario !== "cliente" || cantidad >= stock;

    boton.textContent =
      cantidad >= stock
        ? "Stock agregado al carrito"
        : "Agregar al carrito";
  });
}

// =====================================================
// 4. SESIÓN Y AUTENTICACIÓN
// =====================================================

async function cargarSesion() {
  try {
    const respuesta = await fetch("api/sesion.php", {
      credentials: "same-origin"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo consultar la sesión.");
    }

    const texto = (await respuesta.text()).trim();

    if (texto === "INVITADO" || texto === "") {
      rolUsuario = "INVITADO";
      document.getElementById("usuarioInfo").textContent = "Invitado";
    } else {
      const partes = texto.split("|");

      rolUsuario = partes[0] || "INVITADO";
      document.getElementById("usuarioInfo").textContent =
        partes[1] || rolUsuario;
    }

    const esAdmin = rolUsuario === "admin";
    const esInvitado = rolUsuario === "INVITADO";
    const esCliente = rolUsuario === "cliente";

    // Elementos de navegación y administración.
    document.getElementById("adminPanel")
      .classList.toggle("d-none", !esAdmin);

    document.getElementById("btnLogin")
      .classList.toggle("d-none", !esInvitado);

    document.getElementById("btnLogout")
      .classList.toggle("d-none", esInvitado);

    document.getElementById("navCatalogo")
      .classList.remove("d-none");

    document.getElementById("navCarrito")
      .classList.toggle("d-none", esAdmin);

    document.getElementById("carrito")
      .classList.toggle("d-none", esAdmin);

    // La compra solo está disponible para clientes.
    document.getElementById("btnComprar")
      .classList.toggle("d-none", !esCliente || carrito.length === 0);

    document.getElementById("btnVaciarCarrito")
      .classList.toggle("d-none", !esCliente || carrito.length === 0);

    // Si no es cliente, eliminamos cualquier carrito local.
    if (!esCliente && carrito.length > 0) {
      carrito = [];
    }

    renderizarCarrito();
  } catch (error) {
    console.error("Error al consultar la sesión:", error);
    mostrarMensaje("No se pudo consultar la sesión.", "danger");
  }
}

// Obtiene el token CSRF del servidor.
async function obtenerToken() {
  try {
    const respuesta = await fetch("api/token.php", {
      credentials: "same-origin"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el token.");
    }

    token = (await respuesta.text()).trim();

    document.getElementById("tokenForm").value = token;
  } catch (error) {
    console.error("Error al obtener el token:", error);
  }
}

// Inicia sesión mediante api/login.php.
async function iniciarSesion(evento) {
  evento.preventDefault();

  const formulario = document.getElementById("formLogin");
  const alertasLogin = document.getElementById("alertasLogin");

  alertasLogin.replaceChildren();

  const datos = new FormData(formulario);

  try {
    const respuesta = await fetch("api/login.php", {
      method: "POST",
      body: datos,
      credentials: "same-origin"
    });

    const resultado = (await respuesta.text()).trim();

    if (
      !respuesta.ok ||
      resultado.toLowerCase().includes("error")
    ) {
      throw new Error(
        resultado || "Correo o contraseña incorrectos."
      );
    }

    formulario.reset();

    const modal = document.getElementById("modalLogin");
    bootstrap.Modal.getOrCreateInstance(modal).hide();

    // Actualizamos la sesión antes de cargar el catálogo.
    await cargarSesion();
    await obtenerToken();
    await cargarProductos();

    mostrarMensaje("Sesión iniciada correctamente.");
  } catch (error) {
    const alerta = document.createElement("div");

    alerta.className = "alert alert-danger";
    alerta.setAttribute("role", "alert");
    alerta.textContent = error.message;

    alertasLogin.appendChild(alerta);
  }
}

// Cierra la sesión.
async function cerrarSesion() {
  const datos = new FormData();
  datos.append("token", token);

  try {
    const respuesta = await fetch("api/logout.php", {
      method: "POST",
      body: datos,
      credentials: "same-origin"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo cerrar la sesión.");
    }

    carrito = [];

    await cargarSesion();
    await obtenerToken();
    await cargarProductos();

    mostrarMensaje("Sesión cerrada correctamente.");
  } catch (error) {
    mostrarMensaje(error.message, "danger");
  }
}

// =====================================================
// 5. CARRITO
// =====================================================

// Agrega un producto únicamente si el usuario es cliente.
function agregarAlCarrito(datosProducto) {
  if (rolUsuario !== "cliente") {
    mostrarMensaje(
      "Debés iniciar sesión con una cuenta de cliente para comprar.",
      "warning"
    );
    return;
  }

  const id = Number(datosProducto.id);
  const stock = Number(datosProducto.stock);
  const precio = Number(datosProducto.precio);

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !Number.isFinite(stock) ||
    stock <= 0 ||
    !Number.isFinite(precio) ||
    precio < 0
  ) {
    mostrarMensaje("Los datos del producto no son válidos.", "danger");
    return;
  }

  let producto = carrito.find((p) => p.id === id);

  if (producto) {
    if (producto.cantidad >= producto.stock) {
      mostrarMensaje("No hay más unidades disponibles.", "warning");
      return;
    }

    producto.cantidad++;
  } else {
    carrito.push({
      id: id,
      nombre: datosProducto.nombre,
      precio: precio,
      stock: stock,
      cantidad: 1
    });
  }

  renderizarCarrito();
  actualizarBotonesCarrito();
}

// Dibuja el carrito y calcula su total.

// Dibuja el carrito, permite modificar cantidades
// de a una unidad y calcula el total.
function renderizarCarrito() {
  const hayProductos = carrito.length > 0;
  const esCliente = rolUsuario === "cliente";

  // Los botones generales solo aparecen para clientes
  // cuando el carrito contiene productos.
  document.getElementById("btnVaciarCarrito")
    .classList.toggle("d-none", !esCliente || !hayProductos);

  document.getElementById("btnComprar")
    .classList.toggle("d-none", !esCliente || !hayProductos);

  carritoDiv.replaceChildren();

  if (!hayProductos) {
    const mensaje = document.createElement("p");
    mensaje.className = "empty-cart";
    mensaje.textContent = "Todavía no agregaste productos.";
    carritoDiv.appendChild(mensaje);
  }

  let total = 0;

  carrito.forEach((item) => {
    total += item.precio * item.cantidad;

    // Contenedor de la fila del producto.
    const fila = document.createElement("div");
    fila.className =
      "d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap";

    // Nombre y subtotal.
    const detalle = document.createElement("div");

    const nombre = document.createElement("strong");
    nombre.textContent = item.nombre;

    const importe = document.createElement("p");
    importe.className = "mb-0";
    importe.textContent =
      `Subtotal: $${(item.precio * item.cantidad).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;

    detalle.append(nombre, importe);
    fila.appendChild(detalle);

    if (esCliente) {
      // Controles para modificar la cantidad.
      const controles = document.createElement("div");
      controles.className = "d-flex align-items-center gap-2";

      // Botón para restar una unidad.
      const restar = document.createElement("button");
      restar.type = "button";
      restar.className = "btn btn-sm btn-outline-secondary";
      restar.textContent = "−";
      restar.setAttribute("aria-label", `Restar una unidad de ${item.nombre}`);
      restar.disabled = item.cantidad <= 1;

      restar.addEventListener("click", () => {
        if (rolUsuario !== "cliente") return;

        const producto = carrito.find((p) => p.id === item.id);

        if (producto && producto.cantidad > 1) {
          producto.cantidad--;
          renderizarCarrito();
          actualizarBotonesCarrito();
        }
      });

      // Cantidad actual.
      const cantidad = document.createElement("span");
      cantidad.className = "fw-bold";
      cantidad.textContent = item.cantidad;

      // Botón para sumar una unidad.
      const sumar = document.createElement("button");
      sumar.type = "button";
      sumar.className = "btn btn-sm btn-outline-secondary";
      sumar.textContent = "+";
      sumar.setAttribute("aria-label", `Agregar una unidad de ${item.nombre}`);
      sumar.disabled = item.cantidad >= item.stock;

      sumar.addEventListener("click", () => {
        if (rolUsuario !== "cliente") return;

        const producto = carrito.find((p) => p.id === item.id);

        if (producto && producto.cantidad < producto.stock) {
          producto.cantidad++;
          renderizarCarrito();
          actualizarBotonesCarrito();
        } else {
          mostrarMensaje(
            "No hay más unidades disponibles.",
            "warning"
          );
        }
      });

      // Botón para eliminar todo el producto del carrito.
      const quitar = document.createElement("button");
      quitar.type = "button";
      quitar.className = "btn btn-sm btn-outline-danger";
      quitar.textContent = "Quitar";

      quitar.addEventListener("click", () => {
        if (rolUsuario !== "cliente") return;

        carrito = carrito.filter((p) => p.id !== item.id);
        renderizarCarrito();
        actualizarBotonesCarrito();
      });

      controles.append(restar, cantidad, sumar, quitar);
      fila.appendChild(controles);
    }

    carritoDiv.appendChild(fila);
  });

  // Actualiza el total general.
  document.getElementById("totalCarrito").textContent =
    `Total: $${total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
}


// =====================================================
// 6. EVENTOS DEL CATÁLOGO Y DEL CARRITO
// =====================================================

productosDiv.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".agregar-carrito");

  if (!boton) {
    return;
  }

  agregarAlCarrito({
    id: boton.dataset.id,
    nombre: boton.dataset.nombre,
    precio: boton.dataset.precio,
    stock: boton.dataset.stock
  });
});

// Permite sumar, restar o quitar productos si existen
// botones con data-carrito-accion en el HTML.
carritoDiv.addEventListener("click", function (evento) {
  if (rolUsuario !== "cliente") {
    return;
  }

  const boton = evento.target.closest("[data-carrito-accion]");

  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.carritoAccion;
  const producto = carrito.find((p) => p.id === id);

  if (!producto) {
    return;
  }

  if (accion === "sumar") {
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
    } else {
      mostrarMensaje("No hay más unidades disponibles.", "warning");
    }
  } else if (accion === "restar") {
    producto.cantidad--;

    if (producto.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }
  } else if (accion === "quitar") {
    carrito = carrito.filter((p) => p.id !== id);
  }

  renderizarCarrito();
  actualizarBotonesCarrito();
});

// =====================================================
// 7. EVENTOS DE LA INTERFAZ
// =====================================================

document
  .getElementById("filtroCategoria")
  .addEventListener("change", cargarProductos);

document
  .getElementById("formLogin")
  .addEventListener("submit", iniciarSesion);

document
  .getElementById("btnLogout")
  .addEventListener("click", cerrarSesion);

// Vacía el carrito solamente para clientes.
document
  .getElementById("btnVaciarCarrito")
  .addEventListener("click", function () {
    if (rolUsuario !== "cliente") {
      mostrarMensaje(
        "Debés iniciar sesión con una cuenta de cliente.",
        "warning"
      );
      return;
    }

    carrito = [];

    renderizarCarrito();
    actualizarBotonesCarrito();
  });

// Envía la compra al servidor.
document
  .getElementById("btnComprar")
  .addEventListener("click", async function () {
    // La validación del rol se repite antes de enviar la petición.
    if (rolUsuario !== "cliente") {
      mostrarMensaje(
        "Debés iniciar sesión con una cuenta de cliente para comprar.",
        "warning"
      );
      return;
    }

    if (carrito.length === 0) {
      mostrarMensaje("El carrito está vacío.", "warning");
      return;
    }

    const datos = new FormData();

    datos.append("token", token);

    // Enviamos únicamente identificadores y cantidades.
    // El servidor debe verificar precios y stock desde la base de datos.
    datos.append(
      "carrito",
      JSON.stringify(
        carrito.map((p) => ({
          id: p.id,
          cantidad: p.cantidad
        }))
      )
    );

    try {
      const respuesta = await fetch("api/comprar.php", {
        method: "POST",
        body: datos,
        credentials: "same-origin"
      });

      const texto = (await respuesta.text()).trim();

      if (!respuesta.ok) {
        throw new Error(
          texto || "No se pudo completar la compra."
        );
      }

      carrito = [];

      renderizarCarrito();

      await cargarProductos();

      mostrarMensaje(
        texto || "Compra realizada correctamente."
      );
    } catch (error) {
      mostrarMensaje(error.message, "danger");
    }
  });

// =====================================================
// 8. INICIALIZACIÓN
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {
  await cargarSesion();
  await obtenerToken();
  await cargarProductos();
});

// Permite que admin-productos.js actualice el catálogo.
window.cargarProductos = cargarProductos;
