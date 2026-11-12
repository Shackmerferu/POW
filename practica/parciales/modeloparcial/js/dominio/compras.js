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
        "warning",
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
          cantidad: p.cantidad,
        })),
      ),
    );

    try {
      // Envía la petición POST al endpoint de compra.
      const respuesta = await fetch("api/comprar.php", {
        method: "POST",
        body: datos,
        credentials: "same-origin",
      });

      // Obtiene el mensaje que devuelve el servidor.
      const texto = (await respuesta.text()).trim();

      // Si el servidor devuelve un estado HTTP de error,
      // muestra el mensaje recibido.
      if (!respuesta.ok) {
        throw new Error(texto || "No se pudo completar la compra.");
      }

      // Vacía el carrito únicamente si la petición fue exitosa.
      carrito = [];

      // Actualiza el carrito y vuelve a consultar los productos,
      // ya que el stock puede haber cambiado en la base de datos.
      renderizarCarrito();
      await cargarProductos();

      // Informa el resultado de la operación.
      mostrarMensaje(texto || "Compra realizada correctamente.");
    } catch (error) {
      // Si falla la petición, conserva el carrito para que
      // el cliente pueda revisar o volver a intentar la compra.
      mostrarMensaje(error.message, "danger");
    }
  });
