// =====================================================
// 7. EVENTOS DE LA INTERFAZ
// =====================================================

// Espera a que el HTML esté disponible antes de registrar
// los eventos de los elementos de la interfaz.
document.addEventListener("DOMContentLoaded", function () {
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
  document.getElementById("btnLogout").addEventListener("click", cerrarSesion);

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
          "warning",
        );
        return;
      }

      // Vacía el array del carrito.
      carrito = [];

      // Actualiza la vista y los botones del catálogo.
      renderizarCarrito();
      actualizarBotonesCarrito();
    });
});
