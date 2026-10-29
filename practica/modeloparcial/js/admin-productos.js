// ============================================================
// 1. ESCUCHAR LOS CLICS EN EL DOCUMENTO
// ============================================================

// Registra un evento de clic en todo el documento HTML.
// Se utiliza async porque dentro de la función se espera
// una respuesta del servidor mediante await.
document.addEventListener("click", async function (evento) {
  // Busca el botón con la clase "btn-eliminar-producto"
  // que recibió el clic o que contiene al elemento clickeado.
  //
  // closest() permite detectar el botón incluso si se hace
  // clic sobre un icono o un texto que esté dentro del botón.
  const boton = evento.target.closest(".btn-eliminar-producto");

  // Si el clic no corresponde a un botón de eliminar,
  // no hay nada que hacer.
  if (!boton) {
    return; // Finaliza la función.
  }

  // ========================================================
  // 2. OBTENER EL ID DEL PRODUCTO
  // ========================================================

  // Obtiene el identificador desde el atributo HTML data-id.
  // Ejemplo de botón:
  // <button class="btn-eliminar-producto" data-id="15">
  //
  // boton.dataset.id devolvería el texto "15".
  const id = boton.dataset.id;

  // Comprueba que el botón tenga un identificador.
  // Sin el ID, el servidor no sabría qué producto eliminar.
  if (!id) {
    alert("No se encontró el identificador del producto.");
    return; // Detiene la operación.
  }

  // ========================================================
  // 3. PEDIR CONFIRMACIÓN AL USUARIO
  // ========================================================

  // Muestra una ventana de confirmación del navegador.
  // confirm() devuelve:
  // true  -> el usuario acepta.
  // false -> el usuario cancela.
  const confirmar = confirm(
    "¿Seguro que querés eliminar este producto del catálogo?",
  );

  // Si el usuario cancela, no se realiza ninguna petición.
  if (!confirmar) {
    return;
  }

  // ========================================================
  // 4. INDICAR QUE LA OPERACIÓN ESTÁ EN CURSO
  // ========================================================

  // Deshabilita el botón para evitar que se presione varias
  // veces mientras se procesa la eliminación.
  boton.disabled = true;

  // Cambia el texto para informar que se está eliminando.
  boton.textContent = "Eliminando...";

  // ========================================================
  // 5. ENVIAR LA SOLICITUD AL SERVIDOR
  // ========================================================

  // try permite ejecutar código que podría generar errores.
  // Si ocurre un error capturado, se ejecutará el catch.
  try {
    // Crea un objeto para agrupar los datos que se enviarán.
    const datos = new FormData();

    // Agrega el ID del producto al formulario.
    // En PHP se podrá recuperar mediante $_POST["id"].
    datos.append("id", id);

    // Envía una petición HTTP al archivo PHP.
    const respuesta = await fetch("./api/eliminar_producto.php", {
      // POST se utiliza para enviar datos al servidor.
      method: "POST",

      // Envía el FormData con el ID del producto.
      body: datos,

      // Incluye las credenciales de la misma página,
      // como las cookies de sesión.
      // Esto permite que PHP pueda reconocer la sesión
      // del usuario si está configurada mediante cookies.
      credentials: "same-origin",
    });

    // Lee el contenido de la respuesta como texto.
    // Por ejemplo, PHP podría devolver:
    // "Producto eliminado correctamente."
    const mensaje = await respuesta.text();

    // ====================================================
    // 6. COMPROBAR SI EL SERVIDOR DEVOLVIÓ UN ERROR HTTP
    // ====================================================

    // respuesta.ok es true para estados HTTP entre 200 y 299.
    // Es false para estados como 400, 403 o 500.
    if (!respuesta.ok) {
      // Muestra el mensaje del servidor.
      // Si no hay mensaje, muestra uno predeterminado.
      alert(mensaje || "No se pudo eliminar el producto.");

      // Vuelve a habilitar el botón porque la operación falló.
      boton.disabled = false;

      // Restaura el texto del botón.
      boton.textContent = "Eliminar producto";

      // Termina la función para no ejecutar el código de éxito.
      return;
    }

    // ====================================================
    // 7. INFORMAR QUE LA OPERACIÓN FUE EXITOSA
    // ====================================================

    // Muestra el mensaje devuelto por el servidor PHP.
    alert(mensaje);

    // Recarga la página completa.
    // Al volver a cargar el catálogo desde el servidor,
    // el producto eliminado debería dejar de aparecer.
    window.location.reload();

    // ========================================================
    // 8. MANEJAR ERRORES DE COMUNICACIÓN O EJECUCIÓN
    // ========================================================
  } catch (error) {
    // Registra el error en la consola del navegador.
    // Sirve para que el desarrollador pueda investigar el problema.
    console.error("Error al eliminar el producto:", error);

    // Informa al usuario que no se pudo establecer
    // la comunicación correctamente con el servidor.
    alert("No se pudo conectar con el servidor.");

    // Vuelve a habilitar el botón para permitir otro intento.
    boton.disabled = false;

    // Restaura el texto original del botón.
    boton.textContent = "Eliminar producto";
  }
});
