// =====================================================
// 8. INICIALIZACIÓN DE LA APLICACIÓN
// =====================================================

// Expone la función para que admin-productos.js pueda
// volver a cargar el catálogo después de modificar productos.
window.cargarProductos = cargarProductos;

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
