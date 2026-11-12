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
      "warning",
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
      cantidad: 1,
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
  document
    .getElementById("btnVaciarCarrito")
    .classList.toggle("d-none", !esCliente || !hayProductos);

  document
    .getElementById("btnComprar")
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
    importe.textContent = `Subtotal: $${(
      item.precio * item.cantidad
    ).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
      restar.setAttribute("aria-label", `Restar una unidad de ${item.nombre}`);

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
      sumar.setAttribute("aria-label", `Agregar una unidad de ${item.nombre}`);

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

          // Actualiza el carrito y el catálogo.
          renderizarCarrito();
          actualizarBotonesCarrito();
        } else {
          // Informa que no quedan más unidades disponibles.
          mostrarMensaje("No hay más unidades disponibles.", "warning");
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
      maximumFractionDigits: 2,
    })}`;
}

// =====================================================
