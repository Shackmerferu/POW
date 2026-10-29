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

  const html = await respuesta.text();

  if (!respuesta.ok) {
    mostrarMensaje(html, "danger");
    return;
  }

  if (rolUsuario === "admin") {
    document.getElementById("adminProductos").innerHTML = html;
  } else {
    productosDiv.innerHTML = html;
  }
}

async function cargarSesion() {
  const respuesta = await fetch("api/sesion.php");
  const texto = await respuesta.text();
  const catalogo = document.getElementById("catalogo");
  const carrito = document.getElementById("carrito");
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
    catalogo.classList.remove("d-none");
    carrito.classList.remove("d-none");
    return;
  }

  const partes = texto.split("|");
  rolUsuario = partes[0];
  info.textContent = partes[1];

  btnLogin.classList.add("d-none");
  btnLogout.classList.remove("d-none");

  if (rolUsuario === "admin") {
    panel.classList.remove("d-none");
    catalogo.classList.add("d-none");
    carrito.classList.add("d-none");
  } else {
    panel.classList.add("d-none");
    catalogo.classList.remove("d-none");
    carrito.classList.remove("d-none");
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

document.getElementById("btnComprar").addEventListener("click", async () => {
  if (carrito.length === 0) {
    mostrarMensaje("Tu carrito está vacío.", "warning");
    return;
  }

  if (rolUsuario === "INVITADO" || !token) {
    mostrarMensaje("Iniciá sesión para realizar la compra.", "warning");
    return;
  }

  const boton = document.getElementById("btnComprar");

  boton.disabled = true;
  boton.textContent = "Procesando...";

  try {
    const datos = new FormData();

    datos.append("token", token);
    datos.append(
      "carrito",
      JSON.stringify(
        carrito.map((producto) => ({
          id: producto.id,
          cantidad: producto.cantidad,
        })),
      ),
    );

    const respuesta = await fetch("api/comprar.php", {
      method: "POST",
      body: datos,
    });

    const mensaje = await respuesta.text();

    if (!respuesta.ok) {
      mostrarMensaje(mensaje, "danger");
      return;
    }

    // Vaciar el carrito y actualizar el total.
    carrito = [];
    renderizarCarrito();

    // Recargar los productos con el stock actualizado.
    await cargarProductos();

    mostrarMensaje(mensaje, "success");
  } catch (error) {
    mostrarMensaje("No se pudo conectar con el servidor.", "danger");
  } finally {
    boton.disabled = false;
    boton.textContent = "Comprar";
  }
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
      document.getElementById("productoId").value = boton.dataset.id;
      document.getElementById("nombreProducto").value = boton.dataset.nombre;
      document.getElementById("categoriaProducto").value =
        boton.dataset.categoria;
      document.getElementById("descripcionProducto").value =
        boton.dataset.descripcion;
      document.getElementById("imagenProducto").value = boton.dataset.imagen;
      document.getElementById("precioProducto").value = boton.dataset.precio;
      document.getElementById("stockProducto").value = boton.dataset.stock;
      document.getElementById("tokenForm").value = token;

      document.getElementById("formProducto").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      mostrarMensaje(
        "Producto cargado. Modificá los campos y presioná Guardar producto.",
        "info",
      );

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
