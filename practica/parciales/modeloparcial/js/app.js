
// js/app.js

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

// =====================================================
// 3. CATÁLOGO DE PRODUCTOS
// =====================================================

// Solicita al servidor los productos correspondientes
// a la categoría seleccionada y actualiza el catálogo.
async function cargarProductos() {

  // Obtiene el valor seleccionado en el filtro de categorías.
  const categoria = document.getElementById("filtroCategoria").value;

  try {

    // Envía una petición GET al endpoint de productos.
    // encodeURIComponent permite enviar la categoría en la URL
    // sin romperla si contiene espacios u otros caracteres.
    const respuesta = await fetch(
      `api/productos.php?action=listar&categoria=${encodeURIComponent(categoria)}`,
      { credentials: "same-origin" }
    );

    // Convierte la respuesta JSON en un objeto de JavaScript.
    const resultado = await respuesta.json();

    // Comprueba que la petición haya sido exitosa
    // y que el servidor informe el estado esperado.
    if (!respuesta.ok || resultado.status !== 200) {
      throw new Error(
        resultado.message || "No se pudieron cargar los productos."
      );
    }

    // Dibuja las tarjetas con los productos recibidos.
    // Si data no existe, utiliza un array vacío.
    renderizarCatalogo(resultado.data || []);

    // Si el usuario es administrador, también actualiza
    // el listado de productos de su panel de gestión.
    if (
      rolUsuario === "admin" &&
      typeof window.cargarProductosAdmin === "function"
    ) {
      await window.cargarProductosAdmin();
    }

  } catch (error) {

    // Si falla la consulta, informa el problema en el catálogo.
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-danger">No se pudo cargar el catálogo.</p>
      </div>
    `;

    // Registra el error técnico en la consola del navegador.
    console.error("Error al cargar productos:", error);
  }
}

// Genera las tarjetas HTML de todos los productos recibidos.
function renderizarCatalogo(productos) {

  // Si no existen productos, muestra un mensaje y termina.
  if (productos.length === 0) {
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-muted">No hay productos disponibles.</p>
      </div>
    `;
    return;
  }

  // Recorre los productos y genera una tarjeta por cada uno.
  productosDiv.innerHTML = productos
    .map(function (producto) {

      // Convierte los valores recibidos a números.
      const stock = Number(producto.stock);
      const precio = Number(producto.precio);

      // Solo los usuarios con rol cliente pueden comprar.
      const esCliente = rolUsuario === "cliente";

      // Almacena el botón que se mostrará en cada tarjeta.
      // Por defecto, no se muestra ningún botón de compra.
      let botonCompra = "";

      // Si el usuario es cliente y hay stock,
      // permite agregar el producto al carrito.
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

      // Si el cliente consulta un producto sin stock,
      // muestra un botón deshabilitado.
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

      // Construye la tarjeta del producto.
      // Los datos de texto se escapan antes de insertarse en HTML.
      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="producto-card card h-100">

            ${
              // Si el producto tiene imagen, la muestra.
              // Si no tiene, utiliza un espacio de imagen alternativo.
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

              <!-- Nombre del producto. -->
              <h3 class="card-title">
                ${escaparHTML(producto.nombre)}
              </h3>

              <!-- Descripción del producto. -->
              <p class="card-text">
                ${escaparHTML(producto.descripcion)}
              </p>

              <!-- Precio formateado para Argentina. -->
              <p class="precio">
                $${precio.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>

              <!-- Cantidad de unidades disponibles. -->
              <p class="product-stock">
                Stock disponible: ${stock}
              </p>

              <!-- Botón correspondiente al rol y al stock. -->
              ${botonCompra}

            </div>
          </article>
        </div>
      `;
    })
    .join(""); // Une todas las tarjetas en una sola cadena HTML.

  // Actualiza el estado de los botones de agregar al carrito.
  actualizarBotonesCarrito();
}

// Actualiza los botones del catálogo según las cantidades
// que ya están agregadas al carrito.
function actualizarBotonesCarrito() {

  // Selecciona todos los botones para agregar productos.
  document.querySelectorAll(".agregar-carrito").forEach(function (boton) {

    // Obtiene el ID del producto asociado al botón.
    const id = Number(boton.dataset.id);

    // Busca si ese producto ya está en el carrito.
    const productoCarrito = carrito.find((p) => p.id === id);

    // Si está en el carrito, obtiene su cantidad actual.
    // Si no está, la cantidad se considera cero.
    const cantidad = productoCarrito ? productoCarrito.cantidad : 0;

    // Obtiene el stock asociado al botón.
    const stock = Number(boton.dataset.stock);

    // Deshabilita el botón si el usuario no es cliente
    // o si ya agregó todas las unidades disponibles.
    boton.disabled = rolUsuario !== "cliente" || cantidad >= stock;

    // Cambia el texto para informar si se alcanzó el límite.
    boton.textContent =
      cantidad >= stock
        ? "Stock agregado al carrito"
        : "Agregar al carrito";
  });
}

// =====================================================
// 4. SESIÓN Y AUTENTICACIÓN
// =====================================================

// Consulta la sesión del usuario en el servidor
// y adapta la interfaz según su rol.
async function cargarSesion() {

  try {

    // Solicita el estado actual de la sesión.
    const respuesta = await fetch("api/sesion.php", {
      credentials: "same-origin"
    });

    // Comprueba que el servidor haya respondido correctamente.
    if (!respuesta.ok) {
      throw new Error("No se pudo consultar la sesión.");
    }

    // Obtiene la respuesta como texto.
    // Se espera "INVITADO" o un formato como "cliente|Nombre".
    const texto = (await respuesta.text()).trim();

    // Si el servidor indica que no existe una sesión autenticada,
    // establece el rol de invitado.
    if (texto === "INVITADO" || texto === "") {
      rolUsuario = "INVITADO";
      document.getElementById("usuarioInfo").textContent = "Invitado";

    } else {

      // Separa el rol y el nombre utilizando el carácter |.
      const partes = texto.split("|");

      // La primera parte contiene el rol.
      rolUsuario = partes[0] || "INVITADO";

      // La segunda parte contiene el nombre para mostrar.
      document.getElementById("usuarioInfo").textContent =
        partes[1] || rolUsuario;
    }

    // Variables que facilitan las comprobaciones de permisos.
    const esAdmin = rolUsuario === "admin";
    const esInvitado = rolUsuario === "INVITADO";
    const esCliente = rolUsuario === "cliente";

    // Muestra el panel administrativo únicamente a los administradores.
    document.getElementById("adminPanel")
      .classList.toggle("d-none", !esAdmin);

    // Muestra el botón de login únicamente a los invitados.
    document.getElementById("btnLogin")
      .classList.toggle("d-none", !esInvitado);

    // Muestra el botón de logout a los usuarios autenticados.
    document.getElementById("btnLogout")
      .classList.toggle("d-none", esInvitado);

    // Mantiene visible el acceso al catálogo para todos.
    document.getElementById("navCatalogo")
      .classList.remove("d-none");

    // Oculta el acceso al carrito para administradores.
    document.getElementById("navCarrito")
      .classList.toggle("d-none", esAdmin);

    // Oculta el panel del carrito para administradores.
    document.getElementById("carrito")
      .classList.toggle("d-none", esAdmin);

    // Solo los clientes pueden comprar.
    // Los botones también requieren que haya productos en el carrito.
    document.getElementById("btnComprar")
      .classList.toggle("d-none", !esCliente || carrito.length === 0);

    document.getElementById("btnVaciarCarrito")
      .classList.toggle("d-none", !esCliente || carrito.length === 0);

    // Si el usuario no es cliente, no conserva el carrito local.
    if (!esCliente && carrito.length > 0) {
      carrito = [];
    }

    // Vuelve a dibujar el carrito con los permisos actualizados.
    renderizarCarrito();

  } catch (error) {

    // Registra el problema y muestra un mensaje al usuario.
    console.error("Error al consultar la sesión:", error);
    mostrarMensaje("No se pudo consultar la sesión.", "danger");
  }
}

// Solicita al servidor el token CSRF necesario para las peticiones.
async function obtenerToken() {

  try {

    // Consulta el endpoint que genera o devuelve el token.
    const respuesta = await fetch("api/token.php", {
      credentials: "same-origin"
    });

    // Si falla la respuesta, genera un error.
    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el token.");
    }

    // Guarda el token recibido para utilizarlo en otras peticiones.
    token = (await respuesta.text()).trim();

    // Sincroniza el campo oculto del formulario, si existe.
    document.getElementById("tokenForm").value = token;

  } catch (error) {

    // Informa el problema en la consola.
    console.error("Error al obtener el token:", error);
  }
}

// Envía el formulario de login al servidor.
async function iniciarSesion(evento) {

  // Evita que el navegador envíe el formulario
  // y recargue la página de manera tradicional.
  evento.preventDefault();

  // Obtiene el formulario y el contenedor de errores del modal.
  const formulario = document.getElementById("formLogin");
  const alertasLogin = document.getElementById("alertasLogin");

  // Elimina los mensajes de errores anteriores.
  alertasLogin.replaceChildren();

  // Recopila los campos del formulario.
  const datos = new FormData(formulario);

  try {

    // Envía las credenciales mediante POST.
    const respuesta = await fetch("api/login.php", {
      method: "POST",
      body: datos,
      credentials: "same-origin"
    });

    // Lee la respuesta del servidor como texto.
    const resultado = (await respuesta.text()).trim();

    // Comprueba el estado HTTP y la respuesta del login.
    if (
      !respuesta.ok ||
      resultado.toLowerCase().includes("error")
    ) {
      throw new Error(
        resultado || "Correo o contraseña incorrectos."
      );
    }

    // Limpia los campos del formulario después del login exitoso.
    formulario.reset();

    // Cierra el modal de login.
    const modal = document.getElementById("modalLogin");
    bootstrap.Modal.getOrCreateInstance(modal).hide();

    // Actualiza los datos de sesión, el token y el catálogo.
    await cargarSesion();
    await obtenerToken();
    await cargarProductos();

    // Informa que el inicio de sesión fue exitoso.
    mostrarMensaje("Sesión iniciada correctamente.");

  } catch (error) {

    // Crea una alerta de error dentro del modal.
    const alerta = document.createElement("div");

    alerta.className = "alert alert-danger";
    alerta.setAttribute("role", "alert");
    alerta.textContent = error.message;

    // Inserta el mensaje sin interpretar su contenido como HTML.
    alertasLogin.appendChild(alerta);
  }
}

// Cierra la sesión del usuario en el servidor.
async function cerrarSesion() {

  // Prepara los datos que se enviarán al endpoint de logout.
  const datos = new FormData();
  datos.append("token", token);

  try {

    // Envía la petición POST para cerrar la sesión.
    const respuesta = await fetch("api/logout.php", {
      method: "POST",
      body: datos,
      credentials: "same-origin"
    });

    // Si la respuesta no fue exitosa, informa el error.
    if (!respuesta.ok) {
      throw new Error("No se pudo cerrar la sesión.");
    }

    // Limpia el carrito local para no conservar datos
    // de la sesión anterior.
    carrito = [];

    // Actualiza el rol, el token y el catálogo.
    await cargarSesion();
    await obtenerToken();
    await cargarProductos();

    // Confirma que la sesión se cerró.
    mostrarMensaje("Sesión cerrada correctamente.");

  } catch (error) {

    // Muestra cualquier error producido durante el logout.
    mostrarMensaje(error.message, "danger");
  }
}

// =====================================================
// 5. CARRITO
// =====================================================

// Agrega una unidad de un producto al carrito.
// Solo permite realizar esta operación a clientes.
function agregarAlCarrito(datosProducto) {

  // Comprobación de permisos antes de modificar el carrito.
  if (rolUsuario !== "cliente") {
    mostrarMensaje(
      "Debés iniciar sesión con una cuenta de cliente para comprar.",
      "warning"
    );
    return;
  }

  // Convierte y valida los datos recibidos desde la tarjeta.
  const id = Number(datosProducto.id);
  const stock = Number(datosProducto.stock);
  const precio = Number(datosProducto.precio);

  // Rechaza valores que no tengan el formato esperado.
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

  // Busca el producto en el carrito por su ID.
  let producto = carrito.find((p) => p.id === id);

  // Si ya existe, aumenta su cantidad en una unidad.
  if (producto) {

    // No permite superar el stock disponible.
    if (producto.cantidad >= producto.stock) {
      mostrarMensaje("No hay más unidades disponibles.", "warning");
      return;
    }

    producto.cantidad++;

  } else {

    // Si no existe, lo agrega con una cantidad inicial de uno.
    carrito.push({
      id: id,
      nombre: datosProducto.nombre,
      precio: precio,
      stock: stock,
      cantidad: 1
    });
  }

  // Actualiza la vista del carrito y los botones del catálogo.
  renderizarCarrito();
  actualizarBotonesCarrito();
}

// Dibuja el contenido del carrito, sus controles de cantidad
// y el importe total de todos los productos.
function renderizarCarrito() {

  // Comprueba si el carrito contiene al menos un producto.
  const hayProductos = carrito.length > 0;

  // Determina si el usuario actual tiene permiso para comprar.
  const esCliente = rolUsuario === "cliente";

  // Muestra los botones generales únicamente a clientes
  // cuando existe al menos un producto en el carrito.
  document.getElementById("btnVaciarCarrito")
    .classList.toggle("d-none", !esCliente || !hayProductos);

  document.getElementById("btnComprar")
    .classList.toggle("d-none", !esCliente || !hayProductos);

  // Elimina las filas anteriores para reconstruir el carrito.
  carritoDiv.replaceChildren();

  // Si no hay productos, muestra un mensaje informativo.
  if (!hayProductos) {
    const mensaje = document.createElement("p");

    mensaje.className = "empty-cart";
    mensaje.textContent = "Todavía no agregaste productos.";

    carritoDiv.appendChild(mensaje);
  }

  // Acumula el precio de todos los productos multiplicado
  // por la cantidad seleccionada de cada uno.
  let total = 0;

  // Recorre los productos para construir una fila por producto.
  carrito.forEach((item) => {

    // Calcula el subtotal y lo suma al total general.
    total += item.precio * item.cantidad;

    // Contenedor principal de la fila.
    const fila = document.createElement("div");

    // Clases de Bootstrap para alinear y adaptar los elementos.
    fila.className =
      "d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap";

    // Contenedor para el nombre y el subtotal.
    const detalle = document.createElement("div");

    // Muestra el nombre del producto como texto.
    const nombre = document.createElement("strong");
    nombre.textContent = item.nombre;

    // Calcula y muestra el subtotal de ese producto.
    const importe = document.createElement("p");

    importe.className = "mb-0";
    importe.textContent =
      `Subtotal: $${(item.precio * item.cantidad).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;

    // Incorpora el nombre y el subtotal al detalle.
    detalle.append(nombre, importe);

    // Agrega el detalle a la fila.
    fila.appendChild(detalle);

    // Los controles de cantidad solo aparecen para clientes.
    if (esCliente) {

      // Agrupa los botones y la cantidad actual.
      const controles = document.createElement("div");

      controles.className = "d-flex align-items-center gap-2";

      // ---------------------------------------------------
      // BOTÓN RESTAR
      // ---------------------------------------------------

      // Crea el botón que resta una unidad.
      const restar = document.createElement("button");

      restar.type = "button";
      restar.className = "btn btn-sm btn-outline-secondary";
      restar.textContent = "−";

      // Etiqueta accesible para lectores de pantalla.
      restar.setAttribute(
        "aria-label",
        `Restar una unidad de ${item.nombre}`
      );

      // No permite bajar de una unidad.
      // Para eliminar el producto se utiliza el botón Quitar.
      restar.disabled = item.cantidad <= 1;

      // Ejecuta la operación cuando se pulsa el botón.
      restar.addEventListener("click", () => {

        // Comprueba nuevamente los permisos.
        if (rolUsuario !== "cliente") return;

        // Busca el producto actual en el carrito.
        const producto = carrito.find((p) => p.id === item.id);

        // Resta una unidad únicamente si hay más de una.
        if (producto && producto.cantidad > 1) {
          producto.cantidad--;

          // Actualiza el carrito y el catálogo.
          renderizarCarrito();
          actualizarBotonesCarrito();
        }
      });

      // ---------------------------------------------------
      // CANTIDAD ACTUAL
      // ---------------------------------------------------

      // Muestra la cantidad seleccionada.
      const cantidad = document.createElement("span");

      cantidad.className = "fw-bold";
      cantidad.textContent = item.cantidad;

      // ---------------------------------------------------
      // BOTÓN SUMAR
      // ---------------------------------------------------

      // Crea el botón que suma una unidad.
      const sumar = document.createElement("button");

      sumar.type = "button";
      sumar.className = "btn btn-sm btn-outline-secondary";
      sumar.textContent = "+";

      // Etiqueta accesible para lectores de pantalla.
      sumar.setAttribute(
        "aria-label",
        `Agregar una unidad de ${item.nombre}`
      );

      // Deshabilita el botón cuando se alcanza el stock.
      sumar.disabled = item.cantidad >= item.stock;

      // Ejecuta la operación cuando se pulsa el botón.
      sumar.addEventListener("click", () => {

        // Comprueba nuevamente los permisos.
        if (rolUsuario !== "cliente") return;

        // Busca el producto actual en el carrito.
        const producto = carrito.find((p) => p.id === item.id);

        // Suma una unidad si todavía hay stock disponible.
        if (producto && producto.cantidad < producto.stock) {
          producto.cantidad++;

          // Actualiza el carrito y los botones del catálogo.
          renderizarCarrito();
          actualizarBotonesCarrito();

        } else {

          // Informa que no quedan más unidades disponibles.
          mostrarMensaje(
            "No hay más unidades disponibles.",
            "warning"
          );
        }
      });

      // ---------------------------------------------------
      // BOTÓN QUITAR
      // ---------------------------------------------------

      // Crea el botón que elimina todas las unidades
      // de este producto del carrito.
      const quitar = document.createElement("button");

      quitar.type = "button";
      quitar.className = "btn btn-sm btn-outline-danger";
      quitar.textContent = "Quitar";

      // Elimina el producto cuando se pulsa el botón.
      quitar.addEventListener("click", () => {

        // Comprueba los permisos antes de modificar el carrito.
        if (rolUsuario !== "cliente") return;

        // Conserva todos los productos excepto el seleccionado.
        carrito = carrito.filter((p) => p.id !== item.id);

        // Actualiza el carrito y el catálogo.
        renderizarCarrito();
        actualizarBotonesCarrito();
      });

      // Agrega los controles en el orden en que se mostrarán:
      // restar, cantidad, sumar y quitar.
      controles.append(restar, cantidad, sumar, quitar);

      // Incorpora los controles a la fila del producto.
      fila.appendChild(controles);
    }

    // Agrega la fila completa al contenedor del carrito.
    carritoDiv.appendChild(fila);
  });

  // Calcula y muestra el total general con formato argentino.
  document.getElementById("totalCarrito").textContent =
    `Total: $${total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
}

// =====================================================
// 6. EVENTOS DEL CATÁLOGO Y DEL CARRITO
// =====================================================

// Detecta los clics dentro del catálogo.
// Se utiliza un único listener en el contenedor,
// aunque las tarjetas se generen dinámicamente.
productosDiv.addEventListener("click", function (evento) {

  // Busca el botón de agregar al carrito que originó el clic
  // o que contiene al elemento pulsado.
  const boton = evento.target.closest(".agregar-carrito");

  // Si el clic no provino de ese botón, no hace nada.
  if (!boton) {
    return;
  }

  // Envía los datos del producto a la función del carrito.
  agregarAlCarrito({
    id: boton.dataset.id,
    nombre: boton.dataset.nombre,
    precio: boton.dataset.precio,
    stock: boton.dataset.stock
  });
});

// Gestiona los botones que utilicen el atributo
// data-carrito-accion="sumar", "restar" o "quitar".
// La función renderizarCarrito() actual ya crea sus propios
// eventos para los botones +, − y Quitar.
carritoDiv.addEventListener("click", function (evento) {

  // No permite modificar el carrito a otros roles.
  if (rolUsuario !== "cliente") {
    return;
  }

  // Busca un botón que tenga el atributo esperado.
  const boton = evento.target.closest("[data-carrito-accion]");

  // Si el elemento pulsado no tiene ese atributo, termina.
  if (!boton) {
    return;
  }

  // Obtiene el ID del producto y la acción solicitada.
  const id = Number(boton.dataset.id);
  const accion = boton.dataset.carritoAccion;

  // Busca el producto correspondiente en el carrito.
  const producto = carrito.find((p) => p.id === id);

  // Si el producto ya no existe, no hay nada que modificar.
  if (!producto) {
    return;
  }

  // Ejecuta la operación solicitada.
  if (accion === "sumar") {

    // Suma una unidad solo si no supera el stock.
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
    } else {
      mostrarMensaje("No hay más unidades disponibles.", "warning");
    }

  } else if (accion === "restar") {

    // Resta una unidad.
    producto.cantidad--;

    // Si la cantidad llega a cero, elimina el producto.
    if (producto.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }

  } else if (accion === "quitar") {

    // Elimina el producto completo del carrito.
    carrito = carrito.filter((p) => p.id !== id);
  }

  // Actualiza las cantidades, los subtotales y los botones.
  renderizarCarrito();
  actualizarBotonesCarrito();
});

// =====================================================
// 7. EVENTOS DE LA INTERFAZ
// =====================================================

// Cuando cambia la categoría seleccionada,
// vuelve a consultar y dibujar el catálogo.
document
  .getElementById("filtroCategoria")
  .addEventListener("change", cargarProductos);

// Cuando se envía el formulario de login,
// ejecuta la función de inicio de sesión.
document
  .getElementById("formLogin")
  .addEventListener("submit", iniciarSesion);

// Cuando se pulsa el botón de logout,
// ejecuta la función de cierre de sesión.
document
  .getElementById("btnLogout")
  .addEventListener("click", cerrarSesion);

// -----------------------------------------------------
// EVENTO: VACIAR CARRITO
// -----------------------------------------------------

// Elimina todos los productos del carrito local.
document
  .getElementById("btnVaciarCarrito")
  .addEventListener("click", function () {

    // Comprueba que el usuario tenga permiso para comprar.
    if (rolUsuario !== "cliente") {
      mostrarMensaje(
        "Debés iniciar sesión con una cuenta de cliente.",
        "warning"
      );
      return;
    }

    // Vacía el array del carrito.
    carrito = [];

    // Actualiza la vista y los botones del catálogo.
    renderizarCarrito();
    actualizarBotonesCarrito();
  });

// -----------------------------------------------------
// EVENTO: COMPRAR
// -----------------------------------------------------

// Envía al servidor los productos y las cantidades
// seleccionadas por el cliente.
document
  .getElementById("btnComprar")
  .addEventListener("click", async function () {

    // Verifica el rol antes de iniciar la petición.
    if (rolUsuario !== "cliente") {
      mostrarMensaje(
        "Debés iniciar sesión con una cuenta de cliente para comprar.",
        "warning"
      );
      return;
    }

    // Impide enviar una compra sin productos.
    if (carrito.length === 0) {
      mostrarMensaje("El carrito está vacío.", "warning");
      return;
    }

    // Crea el formulario que se enviará al servidor.
    const datos = new FormData();

    // Adjunta el token CSRF para validar la petición.
    datos.append("token", token);

    // Envía únicamente los identificadores y las cantidades.
    // El servidor debe recuperar los precios y el stock reales
    // desde la base de datos; no debe confiar en los datos del navegador.
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

      // Envía la petición POST al endpoint de compra.
      const respuesta = await fetch("api/comprar.php", {
        method: "POST",
        body: datos,
        credentials: "same-origin"
      });

      // Obtiene el mensaje que devuelve el servidor.
      const texto = (await respuesta.text()).trim();

      // Si el servidor devuelve un estado HTTP de error,
      // muestra el mensaje recibido.
      if (!respuesta.ok) {
        throw new Error(
          texto || "No se pudo completar la compra."
        );
      }

      // Vacía el carrito únicamente si la petición fue exitosa.
      carrito = [];

      // Actualiza el carrito y vuelve a consultar los productos,
      // ya que el stock puede haber cambiado en la base de datos.
      renderizarCarrito();
      await cargarProductos();

      // Informa el resultado de la operación.
      mostrarMensaje(
        texto || "Compra realizada correctamente."
      );

    } catch (error) {

      // Si falla la petición, conserva el carrito para que
      // el cliente pueda revisar o volver a intentar la compra.
      mostrarMensaje(error.message, "danger");
    }
  });

// =====================================================
// 8. INICIALIZACIÓN DE LA APLICACIÓN
// =====================================================

// Ejecuta estas operaciones cuando el HTML ya está cargado.
// Se respeta el orden para conocer primero el rol del usuario,
// obtener el token y después cargar el catálogo.
document.addEventListener("DOMContentLoaded", async function () {

  // Consulta si existe una sesión autenticada.
  await cargarSesion();

  // Obtiene el token necesario para peticiones protegidas.
  await obtenerToken();

  // Carga los productos según la categoría seleccionada.
  await cargarProductos();
});

// Expone la función para que admin-productos.js pueda
// volver a cargar el catálogo después de modificar productos.
window.cargarProductos = cargarProductos;
