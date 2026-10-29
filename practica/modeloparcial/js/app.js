let token = "";
let rolUsuario = "INVITADO";
let carrito = [];

const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carritoItems");
const alertas = document.getElementById("alertas");

function mostrarMensaje(mensaje, tipo = "success") {
  alertas.textContent = mensaje;
  alertas.className = "alert alert-" + tipo;
}

async function cargarProductos() {
  const categoria = document.getElementById("filtroCategoria").value;

  const respuesta = await fetch(
    "api/productos.php?categoria=" + encodeURIComponent(categoria),
  );

  productosDiv.innerHTML = await respuesta.text();

  if (rolUsuario === "admin") {
    document.getElementById("adminProductos").innerHTML =
      productosDiv.innerHTML;
  }
}

async function cargarSesion() {
  const respuesta = await fetch("api/sesion.php");
  const texto = await respuesta.text();

  const info = document.getElementById("usuarioInfo");
  const btnLogin = document.getElementById("btnLogin");
  const btnLogout = document.getElementById("btnLogout");
  const panel = document.getElementById("adminPanel");

  if (texto === "INVITADO") {
    rolUsuario = "INVITADO";
    token = "";
    info.textContent = "Invitado";
    btnLogin.classList.remove("d-none");
    btnLogout.classList.add("d-none");
    panel.classList.add("d-none");
    return;
  }

  const partes = texto.split("|");
  rolUsuario = partes[0];
  info.textContent = partes[1];

  btnLogin.classList.add("d-none");
  btnLogout.classList.remove("d-none");

  if (rolUsuario === "admin") {
    panel.classList.remove("d-none");
  } else {
    panel.classList.add("d-none");
  }
}

async function iniciarSesion(evento) {
  evento.preventDefault();

  const formulario = document.getElementById("formLogin");
  const datos = new FormData(formulario);

  const respuesta = await fetch("api/login.php", {
    method: "POST",
    body: datos,
  });

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    mostrarMensaje(texto, "danger");
    return;
  }

  bootstrap.Modal.getInstance(document.getElementById("modalLogin")).hide();

  formulario.reset();
  mostrarMensaje("Sesión iniciada.");
  await cargarSesion();

  // El token se solicita por separado a un endpoint PHP.
  await obtenerToken();
  await cargarProductos();
}

async function obtenerToken() {
  const respuesta = await fetch("api/token.php");
  token = await respuesta.text();
  document.getElementById("tokenForm").value = token;
}

async function cerrarSesion() {
  const datos = new FormData();
  datos.append("token", token);

  const respuesta = await fetch("api/logout.php", {
    method: "POST",
    body: datos,
  });

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    mostrarMensaje(texto, "danger");
    return;
  }

  token = "";
  rolUsuario = "INVITADO";
  mostrarMensaje("Sesión cerrada.");
  await cargarSesion();
  await cargarProductos();
}

function renderizarCarrito() {
  carritoDiv.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, indice) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = document.createElement("div");
    fila.className = "carrito-fila";

    const nombre = document.createElement("span");
    nombre.textContent = producto.nombre + " x " + producto.cantidad;

    const precio = document.createElement("span");
    precio.textContent = "$" + subtotal.toFixed(2);

    const quitar = document.createElement("button");
    quitar.className = "btn btn-sm btn-danger";
    quitar.textContent = "Quitar";
    quitar.addEventListener("click", () => {
      const id = producto.id;

      carrito.splice(indice, 1);

      actualizarStockVisual(id);
      renderizarCarrito();
    });

    fila.append(nombre, precio, quitar);
    carritoDiv.appendChild(fila);
  });

  document.getElementById("totalCarrito").textContent =
    "Total: $" + total.toFixed(2);
}

function agregarAlCarrito(id, nombre, precio, stock) {
  const existente = carrito.find((p) => p.id === id);

  if (existente) {
    if (existente.cantidad >= existente.stock) {
      mostrarMensaje("No hay más stock disponible.", "warning");
      return;
    }

    existente.cantidad++;
  } else {
    if (stock <= 0) {
      mostrarMensaje("Producto sin stock.", "warning");
      return;
    }

    carrito.push({
      id,
      nombre,
      precio,
      cantidad: 1,
      stock,
    });
  }

  actualizarStockVisual(id);
  renderizarCarrito();
}

function actualizarStockVisual(id) {
  const boton = productosDiv.querySelector(`.agregar-carrito[data-id="${id}"]`);

  if (!boton) return;

  const producto = carrito.find((p) => p.id === id);
  const stockInicial = producto ? producto.stock : Number(boton.dataset.stock);
  const cantidadEnCarrito = producto ? producto.cantidad : 0;
  const stockDisponible = stockInicial - cantidadEnCarrito;

  const tarjeta = boton.closest(".producto-card");

  if (!tarjeta) return;

  const textoStock = Array.from(tarjeta.querySelectorAll("p, span")).find(
    (elemento) => elemento.textContent.includes("Stock"),
  );

  if (textoStock) {
    textoStock.textContent = "Stock disponible: " + stockDisponible;
  }

  boton.dataset.stock = stockInicial;

  if (stockDisponible <= 0) {
    boton.disabled = true;
    boton.textContent = "Sin stock disponible";
  } else {
    boton.disabled = false;
    boton.textContent = "Agregar al carrito";
  }
}

productosDiv.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".agregar-carrito");

  if (!boton) return;

  agregarAlCarrito(
    Number(boton.dataset.id),
    boton.dataset.nombre,
    Number(boton.dataset.precio),
    Number(boton.dataset.stock),
  );
});

document
  .getElementById("filtroCategoria")
  .addEventListener("change", cargarProductos);

document.getElementById("formLogin").addEventListener("submit", iniciarSesion);

document.getElementById("btnLogout").addEventListener("click", cerrarSesion);

document.getElementById("btnVaciarCarrito")
    .addEventListener("click", () => {
        const ids = carrito.map(producto => producto.id);

        carrito = [];

        ids.forEach(id => actualizarStockVisual(id));

        renderizarCarrito();
    });

document
  .getElementById("formProducto")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (rolUsuario !== "admin") {
      mostrarMensaje("No autorizado.", "danger");
      return;
    }

    const datos = new FormData(evento.target);

    const respuesta = await fetch("api/guardar_producto.php", {
      method: "POST",
      body: datos,
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
      mostrarMensaje(texto, "danger");
      return;
    }

    mostrarMensaje(texto);
    evento.target.reset();
    document.getElementById("productoId").value = "";

    await cargarProductos();
  });

document.getElementById("btnCancelarEdicion").addEventListener("click", () => {
  document.getElementById("formProducto").reset();
  document.getElementById("productoId").value = "";
});

document
  .getElementById("adminProductos")
  .addEventListener("click", async (evento) => {
    const boton = evento.target.closest("[data-admin-accion]");

    if (!boton) return;

    const tarjeta = boton.closest(".producto-card");
    const id = Number(boton.dataset.id);

    if (boton.dataset.adminAccion === "editar") {
      document.getElementById("productoId").value = id;
      document.getElementById("nombreProducto").value =
        tarjeta.querySelector("h3").textContent;

      mostrarMensaje("Completá los demás campos antes de guardar.", "info");
      return;
    }

    const datos = new FormData();
    datos.append("id", id);
    datos.append("token", token);

    const respuesta = await fetch("api/eliminar_producto.php", {
      method: "POST",
      body: datos,
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
      mostrarMensaje(texto, "danger");
      return;
    }

    mostrarMensaje(texto);
    await cargarProductos();
  });

async function iniciar() {
  await cargarSesion();

  if (rolUsuario !== "INVITADO") {
    await obtenerToken();
  }

  await cargarProductos();
}

iniciar();
