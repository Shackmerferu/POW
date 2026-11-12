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
    stock: boton.dataset.stock,
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
