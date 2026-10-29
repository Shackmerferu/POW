// ============================================================
// 1. VARIABLES GLOBALES
// ============================================================

// Token de seguridad que se envía al servidor PHP para validar
// determinadas operaciones, como comprar, cerrar sesión o eliminar productos.
let token = "";

// Rol del usuario actual.
// Comienza como INVITADO y puede cambiar a "cliente" o "admin".
let rolUsuario = "INVITADO";

// Array que almacena los productos agregados al carrito.
// Cada producto contiene id, nombre, precio, cantidad y stock.
let carrito = [];


// ============================================================
// 2. REFERENCIAS A ELEMENTOS DEL HTML
// ============================================================

// Busca el elemento HTML con id="productos".
// Ahí se mostrarán las tarjetas de productos para el cliente.
const productosDiv = document.getElementById("productos");

// Busca el contenedor donde se mostrarán los productos del carrito.
const carritoDiv = document.getElementById("carritoItems");

// Busca el elemento donde se mostrarán mensajes de éxito, error o advertencia.
const alertas = document.getElementById("alertas");


// ============================================================
// 3. MOSTRAR MENSAJES
// ============================================================

function mostrarMensaje(mensaje, tipo = "success") {
  // Coloca el texto recibido dentro del elemento de alertas.
  alertas.textContent = mensaje;

  // Asigna las clases de Bootstrap para darle estilo al mensaje.
  // Ejemplos:
  // alert alert-success = mensaje de éxito.
  // alert alert-danger  = mensaje de error.
  // alert alert-warning = advertencia.
  alertas.className = "alert alert-" + tipo;
}


// ============================================================
// 4. CARGAR PRODUCTOS DESDE EL SERVIDOR
// ============================================================

async function cargarProductos() {
  // Obtiene la categoría seleccionada en el filtro del HTML.
  const categoria = document.getElementById("filtroCategoria").value;

  // Realiza una petición HTTP GET al archivo PHP.
  // encodeURIComponent() permite enviar correctamente caracteres
  // especiales que pueda contener el nombre de la categoría.
  const respuesta = await fetch(
    "api/productos.php?categoria=" + encodeURIComponent(categoria),
  );

  // Lee el cuerpo de la respuesta como texto.
  // En este caso, el PHP devuelve contenido HTML.
  const html = await respuesta.text();

  // Comprueba si la respuesta HTTP indica un error.
  // Por ejemplo, un estado 400 o 500.
  if (!respuesta.ok) {
    mostrarMensaje(html, "danger");
    return; // Termina la función sin continuar.
  }

  // Si el usuario es administrador, los productos se muestran
  // en el panel de administración.
  if (rolUsuario === "admin") {
    document.getElementById("adminProductos").innerHTML = html;
  } else {
    // Si no es administrador, se muestran en el catálogo.
    productosDiv.innerHTML = html;

    // Oculta los botones para agregar al carrito cuando el usuario
    // no tiene el rol de cliente.
    actualizarBotonesCarrito();
  }
}


// ============================================================
// 5. CONTROLAR LOS BOTONES DEL CARRITO
// ============================================================

function actualizarBotonesCarrito() {
  // Busca todos los botones con la clase "agregar-carrito"
  // que estén dentro del contenedor de productos.
  const botones = productosDiv.querySelectorAll(".agregar-carrito");

  // Recorre cada botón encontrado.
  botones.forEach((boton) => {
    // Si el usuario NO es cliente, elimina el botón del HTML.
    // Así un invitado no verá la opción de agregar productos.
    if (rolUsuario !== "cliente") {
      boton.remove();
    }
  });
}


// ============================================================
// 6. CONSULTAR LA SESIÓN Y CONFIGURAR LA INTERFAZ
// ============================================================

async function cargarSesion() {
  // Consulta al servidor quién tiene la sesión iniciada.
  const respuesta = await fetch("api/sesion.php");

  // El PHP devuelve un texto con el rol y la información del usuario.
  const texto = await respuesta.text();

  // Guardamos referencias a los elementos que deben mostrarse
  // u ocultarse dependiendo del rol.
  const catalogo = document.getElementById("catalogo");
  const carrito = document.getElementById("carrito");
  const navCatalogo = document.getElementById("navCatalogo");
  const navCarrito = document.getElementById("navCarrito");
  const info = document.getElementById("usuarioInfo");
  const btnLogin = document.getElementById("btnLogin");
  const btnLogout = document.getElementById("btnLogout");
  const panel = document.getElementById("adminPanel");

  // ----------------------------------------------------------
  // CASO A: NO HAY UNA SESIÓN INICIADA
  // ----------------------------------------------------------

  if (texto === "INVITADO") {
    // Restablece el rol y el token al estado de invitado.
    rolUsuario = "INVITADO";
    token = "";

    // Oculta los botones para comprar y vaciar el carrito.
    document.getElementById("btnComprar").classList.add("d-none");
    document.getElementById("btnVaciarCarrito").classList.add("d-none");

    // Muestra la información del usuario como invitado.
    info.textContent = "Invitado";

    // Muestra el botón para iniciar sesión.
    btnLogin.classList.remove("d-none");

    // Oculta el botón para cerrar sesión.
    btnLogout.classList.add("d-none");

    // Oculta el panel administrativo.
    panel.classList.add("d-none");

    // Muestra el catálogo y el carrito.
    catalogo.classList.remove("d-none");
    carrito.classList.remove("d-none");

    // Finaliza la función porque ya se resolvió el caso de invitado.
    return;
  }

  // ----------------------------------------------------------
  // CASO B: EXISTE UNA SESIÓN INICIADA
  // ----------------------------------------------------------

  // Separa el texto que devuelve PHP usando "|" como delimitador.
  // Ejemplo: "cliente|Luciano".
  // partes[0] = "cliente".
  // partes[1] = "Luciano".
  const partes = texto.split("|");

  // Guarda el rol recibido del servidor.
  rolUsuario = partes[0];

  // Muestra el nombre u otro dato del usuario recibido.
  info.textContent = partes[1];

  // Oculta el botón de login y muestra el de logout.
  btnLogin.classList.add("d-none");
  btnLogout.classList.remove("d-none");

  // ----------------------------------------------------------
  // CASO B1: EL USUARIO ES ADMINISTRADOR
  // ----------------------------------------------------------

  if (rolUsuario === "admin") {
    // Muestra el panel administrativo.
    panel.classList.remove("d-none");

    // Oculta el catálogo y el carrito de compras.
    catalogo.classList.add("d-none");
    carrito.classList.add("d-none");

    // Oculta también sus enlaces de navegación.
    navCatalogo.classList.add("d-none");
    navCarrito.classList.add("d-none");
  } else {
    // --------------------------------------------------------
    // CASO B2: EL USUARIO NO ES ADMINISTRADOR
    // --------------------------------------------------------

    // Guarda si el rol es exactamente "cliente".
    const esCliente = rolUsuario === "cliente";

    // toggle(clase, condición):
    // - Si la condición es true, agrega la clase.
    // - Si la condición es false, quita la clase.
    //
    // Bootstrap usa "d-none" para ocultar elementos.
    // Por eso los botones se ocultan cuando NO es cliente.
    document
      .getElementById("btnComprar")
      .classList.toggle("d-none", !esCliente);

    document
      .getElementById("btnVaciarCarrito")
      .classList.toggle("d-none", !esCliente);

    // Oculta el panel de administración.
    panel.classList.add("d-none");

    // Muestra el catálogo y el carrito.
    catalogo.classList.remove("d-none");
    carrito.classList.remove("d-none");

    // Muestra los enlaces de navegación.
    navCatalogo.classList.remove("d-none");
    navCarrito.classList.remove("d-none");
  }
}


// ============================================================
// 7. INICIAR SESIÓN
// ============================================================

async function iniciarSesion(evento) {
  // Evita que el formulario recargue la página automáticamente.
  evento.preventDefault();

  // Obtiene el formulario de inicio de sesión.
  const formulario = document.getElementById("formLogin");

  // Recopila los campos del formulario para enviarlos al servidor.
  // FormData permite enviar los datos como formulario HTTP.
  const datos = new FormData(formulario);

  // Envía las credenciales al archivo PHP mediante POST.
  const respuesta = await fetch("api/login.php", {
    method: "POST",
    body: datos,
  });

  // Lee el mensaje de respuesta del servidor.
  const texto = await respuesta.text();

  // Si el servidor devuelve un error HTTP, muestra el mensaje
  // y no continúa con el inicio de sesión.
  if (!respuesta.ok) {
    mostrarMensaje(texto, "danger");
    return;
  }

  // Obtiene la instancia del modal de Bootstrap y la oculta.
  bootstrap.Modal.getInstance(
    document.getElementById("modalLogin"),
  ).hide();

  // Limpia los campos del formulario.
  formulario.reset();

  // Informa que el inicio de sesión fue exitoso.
  mostrarMensaje("Sesión iniciada.");

  // Consulta nuevamente el rol y los datos del usuario.
  await cargarSesion();

  // Solicita el token de seguridad al servidor.
  await obtenerToken();

  // Recarga los productos para mostrar la interfaz correspondiente
  // al rol que acaba de iniciar sesión.
  await cargarProductos();
}


// ============================================================
// 8. OBTENER EL TOKEN DE SEGURIDAD
// ============================================================

async function obtenerToken() {
  // Solicita al servidor el token asociado a la sesión actual.
  const respuesta = await fetch("api/token.php");

  // Guarda el token recibido como texto en la variable global.
  token = await respuesta.text();

  // Copia el token en el campo oculto o campo correspondiente
  // del formulario de productos.
  document.getElementById("tokenForm").value = token;
}


// ============================================================
// 9. CERRAR SESIÓN
// ============================================================

async function cerrarSesion() {
  // Crea un formulario vacío para enviar los datos por POST.
  const datos = new FormData();

  // Incluye el token para que el servidor pueda validar la operación.
  datos.append("token", token);

  // Envía la petición de cierre de sesión.
  const respuesta = await fetch("api/logout.php", {
    method: "POST",
    body: datos,
  });

  // Lee el mensaje que devuelve el servidor.
  const texto = await respuesta.text();

  // Si hubo un error HTTP, lo muestra y termina.
  if (!respuesta.ok) {
    mostrarMensaje(texto, "danger");
    return;
  }

  // Limpia los datos locales de la sesión y del carrito.
  token = "";
  rolUsuario = "INVITADO";
  carrito = [];

  // Actualiza la representación visual del carrito vacío.
  renderizarCarrito();

  // Informa que la sesión se cerró correctamente.
  mostrarMensaje("Sesión cerrada.");

  // Actualiza la interfaz según el nuevo estado de invitado.
  await cargarSesion();

  // Recarga los productos con las opciones correspondientes al invitado.
  await cargarProductos();
}


// ============================================================
// 10. DIBUJAR EL CARRITO EN EL HTML
// ============================================================

function renderizarCarrito() {
  // Borra el contenido anterior para dibujarlo nuevamente desde cero.
  carritoDiv.innerHTML = "";

  // Acumulará el importe de todos los productos del carrito.
  let total = 0;

  // Recorre cada producto y también obtiene su posición en el array.
  carrito.forEach((producto, indice) => {
    // Calcula el subtotal del producto:
    // precio unitario multiplicado por cantidad.
    const subtotal = producto.precio * producto.cantidad;

    // Suma el subtotal al importe general del carrito.
    total += subtotal;

    // Crea un contenedor HTML para representar una fila del carrito.
    const fila = document.createElement("div");
    fila.className = "carrito-fila";

    // Crea un elemento para mostrar el nombre y la cantidad.
    const nombre = document.createElement("span");
    nombre.textContent = producto.nombre + " x " + producto.cantidad;

    // Crea un elemento para mostrar el subtotal.
    const precio = document.createElement("span");
    precio.textContent = "$" + subtotal.toFixed(2);

    // Crea el botón que permite quitar el producto del carrito.
    const quitar = document.createElement("button");
    quitar.className = "btn btn-sm btn-danger";
    quitar.textContent = "Quitar";

    // Registra qué hacer cuando se presiona el botón.
    quitar.addEventListener("click", () => {
      // Conserva el identificador del producto que se va a quitar.
      const id = producto.id;

      // Elimina un elemento del array en la posición "indice".
      // splice(indice, 1) elimina exactamente un elemento.
      carrito.splice(indice, 1);

      // Actualiza el stock que se muestra en la tarjeta del producto.
      actualizarStockVisual(id);

      // Vuelve a dibujar el carrito y recalcula el total.
      renderizarCarrito();
    });

    // Agrega el nombre, precio y botón a la fila.
    fila.append(nombre, precio, quitar);

    // Agrega la fila al contenedor del carrito.
    carritoDiv.appendChild(fila);
  });

  // Muestra el total general con dos decimales.
  document.getElementById("totalCarrito").textContent =
    "Total: $" + total.toFixed(2);
}


// ============================================================
// 11. AGREGAR UN PRODUCTO AL CARRITO
// ============================================================

function agregarAlCarrito(id, nombre, precio, stock) {
  // Verifica el rol antes de permitir la operación.
  // Es una validación de interfaz; el servidor también debe validar
  // los permisos cuando se realiza la compra.
  if (rolUsuario !== "cliente") {
    mostrarMensaje(
      "Iniciá sesión como cliente para agregar productos al carrito.",
      "warning",
    );
    return;
  }

  // Busca si el producto ya existe en el carrito.
  // find() devuelve el primer elemento que cumple la condición,
  // o undefined si no encuentra ninguno.
  const existente = carrito.find((p) => p.id === id);

  // ----------------------------------------------------------
  // CASO A: EL PRODUCTO YA ESTÁ EN EL CARRITO
  // ----------------------------------------------------------

  if (existente) {
    // Comprueba que no se supere el stock disponible.
    if (existente.cantidad >= existente.stock) {
      mostrarMensaje("No hay más stock disponible.", "warning");
      return;
    }

    // Si hay stock, incrementa la cantidad en una unidad.
    existente.cantidad++;
  } else {
    // --------------------------------------------------------
    // CASO B: EL PRODUCTO TODAVÍA NO ESTÁ EN EL CARRITO
    // --------------------------------------------------------

    // Si no hay unidades disponibles, no permite agregarlo.
    if (stock <= 0) {
      mostrarMensaje("Producto sin stock.", "warning");
      return;
    }

    // Agrega un nuevo objeto al array del carrito.
    carrito.push({
      id,              // Identificador del producto.
      nombre,          // Nombre del producto.
      precio,          // Precio unitario.
      cantidad: 1,     // Comienza con una unidad.
      stock,           // Stock informado por el catálogo.
    });
  }

  // Actualiza el stock que se muestra en la tarjeta.
  actualizarStockVisual(id);

  // Vuelve a dibujar el carrito y actualizar el total.
  renderizarCarrito();
}


// ============================================================
// 12. ACTUALIZAR EL STOCK MOSTRADO EN UNA TARJETA
// ============================================================

function actualizarStockVisual(id) {
  // Busca el botón del producto cuyo atributo data-id coincide
  // con el identificador recibido.
  const boton = productosDiv.querySelector(
    `.agregar-carrito[data-id="${id}"]`,
  );

  // Si no existe el botón, termina la función.
  // Puede ocurrir si el producto ya no está visible en el catálogo.
  if (!boton) return;

  // Busca el producto dentro del carrito.
  const producto = carrito.find((p) => p.id === id);

  // Determina el stock original:
  // - Si el producto está en el carrito, usa su stock guardado.
  // - Si no está, obtiene el stock del atributo data-stock del botón.
  const stockInicial = producto
    ? producto.stock
    : Number(boton.dataset.stock);

  // Si está en el carrito, usa su cantidad.
  // Si no está, la cantidad reservada localmente es cero.
  const cantidadEnCarrito = producto ? producto.cantidad : 0;

  // Calcula el stock que se mostrará como disponible.
  const stockDisponible = stockInicial - cantidadEnCarrito;

  // Busca el contenedor de la tarjeta que contiene el botón.
  const tarjeta = boton.closest(".producto-card");

  // Si no se encuentra la tarjeta, termina.
  if (!tarjeta) return;

  // Busca el primer párrafo o span cuyo texto contiene "Stock".
  // Array.from convierte la lista de elementos en un array
  // para poder utilizar find().
  const textoStock = Array.from(
    tarjeta.querySelectorAll("p, span"),
  ).find((elemento) => elemento.textContent.includes("Stock"));

  // Si encontró el texto del stock, lo actualiza.
  if (textoStock) {
    textoStock.textContent = "Stock disponible: " + stockDisponible;
  }

  // Conserva el stock inicial en el atributo del botón.
  // Así puede recuperarse cuando el producto se quita del carrito.
  boton.dataset.stock = stockInicial;

  // Si no quedan unidades, deshabilita el botón.
  if (stockDisponible <= 0) {
    boton.disabled = true;
    boton.textContent = "Sin stock disponible";
  } else {
    // Si quedan unidades, habilita nuevamente el botón.
    boton.disabled = false;
    boton.textContent = "Agregar al carrito";
  }
}


// ============================================================
// 13. DETECTAR CLICS EN LOS BOTONES DEL CATÁLOGO
// ============================================================

// Se registra un solo listener para todo el contenedor de productos.
// Esto se conoce como delegación de eventos.
productosDiv.addEventListener("click", (evento) => {
  // Busca el botón de agregar al carrito que recibió el clic
  // o que contiene al elemento exacto que recibió el clic.
  const boton = evento.target.closest(".agregar-carrito");

  // Si el clic no provino de un botón de agregar, no hace nada.
  if (!boton) return;

  // Obtiene los datos del producto desde los atributos data-* del botón.
  // Number() convierte los identificadores, precios y stock a números.
  agregarAlCarrito(
    Number(boton.dataset.id),
    boton.dataset.nombre,
    Number(boton.dataset.precio),
    Number(boton.dataset.stock),
  );
});


// ============================================================
// 14. REGISTRAR EVENTOS DE LA INTERFAZ
// ============================================================

// Cuando cambia la categoría seleccionada, vuelve a cargar el catálogo.
document
  .getElementById("filtroCategoria")
  .addEventListener("change", cargarProductos);

// Cuando se envía el formulario de login, inicia la sesión.
document
  .getElementById("formLogin")
  .addEventListener("submit", iniciarSesion);

// Cuando se presiona el botón de cerrar sesión, la finaliza.
document
  .getElementById("btnLogout")
  .addEventListener("click", cerrarSesion);


// ============================================================
// 15. REALIZAR LA COMPRA
// ============================================================

document.getElementById("btnComprar").addEventListener("click", async () => {
  // No se puede comprar si el carrito está vacío.
  if (carrito.length === 0) {
    mostrarMensaje("Tu carrito está vacío.", "warning");
    return;
  }

  // Exige una sesión válida y un token disponible.
  if (rolUsuario === "INVITADO" || !token) {
    mostrarMensaje("Iniciá sesión para realizar la compra.", "warning");
    return;
  }

  // Guarda la referencia al botón para modificar su estado visual.
  const boton = document.getElementById("btnComprar");

  // Deshabilita el botón para evitar clics repetidos durante la compra.
  boton.disabled = true;

  // Cambia el texto para informar que la operación está en curso.
  boton.textContent = "Procesando...";

  // try/catch permite manejar errores durante la petición.
  // finally se ejecuta tanto si la operación termina bien como si falla.
  try {
    // Prepara los datos que se enviarán al servidor.
    const datos = new FormData();

    // Incluye el token de seguridad.
    datos.append("token", token);

    // Convierte los productos del carrito a un formato más pequeño:
    // solo envía el ID y la cantidad de cada producto.
    // JSON.stringify convierte el array de objetos en texto JSON.
    datos.append(
      "carrito",
      JSON.stringify(
        carrito.map((producto) => ({
          id: producto.id,
          cantidad: producto.cantidad,
        })),
      ),
    );

    // Envía la compra al archivo PHP mediante POST.
    const respuesta = await fetch("api/comprar.php", {
      method: "POST",
      body: datos,
    });

    // Lee el mensaje que devuelve PHP.
    const mensaje = await respuesta.text();

    // Si la respuesta HTTP indica un error, muestra el mensaje.
    if (!respuesta.ok) {
      mostrarMensaje(mensaje, "danger");
      return;
    }

    // La compra fue aceptada por el servidor:
    // vacía el carrito local y actualiza su representación.
    carrito = [];
    renderizarCarrito();

    // Recarga el catálogo para obtener los productos y el stock actualizados.
    await cargarProductos();

    // Muestra el mensaje de éxito devuelto por el servidor.
    mostrarMensaje(mensaje, "success");
  } catch (error) {
    // Se ejecuta si falla la comunicación u ocurre otro error capturado.
    mostrarMensaje("No se pudo conectar con el servidor.", "danger");
  } finally {
    // Vuelve a habilitar el botón incluso si hubo un error.
    boton.disabled = false;

    // Restaura el texto original del botón.
    boton.textContent = "Comprar";
  }
});


// ============================================================
// 16. CREAR O MODIFICAR UN PRODUCTO (ADMINISTRADOR)
// ============================================================

document
  .getElementById("formProducto")
  .addEventListener("submit", async (evento) => {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    // Comprueba el rol antes de enviar el formulario.
    // El servidor también debe verificar los permisos.
    if (rolUsuario !== "admin") {
      mostrarMensaje("No autorizado.", "danger");
      return;
    }

    // Obtiene los campos del formulario que se está enviando.
    const datos = new FormData(evento.target);

    // Envía los datos al servidor para guardar el producto.
    // El PHP debe distinguir entre creación y modificación
    // según los datos recibidos, por ejemplo, el ID del producto.
    const respuesta = await fetch("api/guardar_producto.php", {
      method: "POST",
      body: datos,
    });

    // Lee el mensaje de respuesta del servidor.
    const texto = await respuesta.text();

    // Si hubo un error HTTP, muestra el mensaje y termina.
    if (!respuesta.ok) {
      mostrarMensaje(texto, "danger");
      return;
    }

    // Muestra el mensaje de éxito del servidor.
    mostrarMensaje(texto);

    // Limpia los campos del formulario.
    evento.target.reset();

    // Limpia el ID para que la próxima operación no use
    // accidentalmente el ID del producto que se estaba editando.
    document.getElementById("productoId").value = "";

    // Actualiza el catálogo o panel con los productos guardados.
    await cargarProductos();
  });


// ============================================================
// 17. CANCELAR LA EDICIÓN DE UN PRODUCTO
// ============================================================

document
  .getElementById("btnCancelarEdicion")
  .addEventListener("click", () => {
    // Limpia todos los campos del formulario.
    document.getElementById("formProducto").reset();

    // Borra el ID para volver al modo de creación de producto.
    document.getElementById("productoId").value = "";
  });


// ============================================================
// 18. ACCIONES DE ADMINISTRACIÓN: EDITAR O ELIMINAR
// ============================================================

// Se registra un único listener para todas las acciones
// dentro del panel administrativo.
document
  .getElementById("adminProductos")
  .addEventListener("click", async (evento) => {
    // Busca un botón que tenga el atributo data-admin-accion.
    const boton = evento.target.closest("[data-admin-accion]");

    // Si el clic no corresponde a una acción administrativa, termina.
    if (!boton) return;

    // Busca la tarjeta del producto correspondiente.
    // En este código la variable tarjeta no se utiliza después.
    const tarjeta = boton.closest(".producto-card");

    // Obtiene el ID del producto y lo convierte a número.
    const id = Number(boton.dataset.id);

    // --------------------------------------------------------
    // CASO A: EDITAR PRODUCTO
    // --------------------------------------------------------

    if (boton.dataset.adminAccion === "editar") {
      // Carga el ID en el formulario para identificar qué producto editar.
      document.getElementById("productoId").value = boton.dataset.id;

      // Completa los campos con los datos guardados en data-*.
      document.getElementById("nombreProducto").value = boton.dataset.nombre;

      document.getElementById("categoriaProducto").value =
        boton.dataset.categoria;

      document.getElementById("descripcionProducto").value =
        boton.dataset.descripcion;

      document.getElementById("imagenProducto").value = boton.dataset.imagen;

      document.getElementById("precioProducto").value = boton.dataset.precio;

      document.getElementById("stockProducto").value = boton.dataset.stock;

      // Coloca el token en el formulario para que también se envíe
      // al guardar el producto, si el backend espera ese campo.
      document.getElementById("tokenForm").value = token;

      // Desplaza la página suavemente hasta el formulario.
      document.getElementById("formProducto").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Informa al administrador que puede modificar los campos.
      mostrarMensaje(
        "Producto cargado. Modificá los campos y presioná Guardar producto.",
        "info",
      );

      // Termina aquí: no debe continuar hacia la eliminación.
      return;
    }

    // --------------------------------------------------------
    // CASO B: ELIMINAR PRODUCTO
    // --------------------------------------------------------

    // Prepara los datos para solicitar la eliminación.
    const datos = new FormData();

    // Envía el ID del producto que se desea eliminar.
    datos.append("id", id);

    // Incluye el token de seguridad.
    datos.append("token", token);

    // Envía la solicitud al servidor mediante POST.
    const respuesta = await fetch("api/eliminar_producto.php", {
      method: "POST",
      body: datos,
    });

    // Lee la respuesta del servidor.
    const texto = await respuesta.text();

    // Si el servidor devuelve un error HTTP, muestra el mensaje.
    if (!respuesta.ok) {
      mostrarMensaje(texto, "danger");
      return;
    }

    // Muestra el resultado de la eliminación.
    mostrarMensaje(texto);

    // Recarga la lista de productos para reflejar los cambios.
    await cargarProductos();
  });


// ============================================================
// 19. INICIALIZAR LA APLICACIÓN
// ============================================================

async function iniciar() {
  // Primero consulta la sesión para saber si el usuario es invitado,
  // cliente o administrador.
  await cargarSesion();

  // Si hay una sesión iniciada, solicita el token de seguridad.
  if (rolUsuario !== "INVITADO") {
    await obtenerToken();
  }

  // Finalmente, carga los productos usando el rol ya determinado.
  await cargarProductos();
}

// Ejecuta la inicialización al llegar a esta instrucción.
// Es el punto de entrada de este archivo JavaScript.
iniciar();