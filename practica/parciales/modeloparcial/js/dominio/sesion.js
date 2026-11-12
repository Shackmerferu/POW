// =====================================================
// 4. SESIÓN Y AUTENTICACIÓN
// =====================================================

// Consulta la sesión del usuario en el servidor
// y adapta la interfaz según su rol.
async function cargarSesion() {
  try {
    // Solicita el estado actual de la sesión.
    const respuesta = await fetch("api/sesion.php", {
      credentials: "same-origin",
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
    document.getElementById("adminPanel").classList.toggle("d-none", !esAdmin);

    // Muestra el botón de login únicamente a los invitados.
    document.getElementById("btnLogin").classList.toggle("d-none", !esInvitado);

    // Muestra el botón de logout a los usuarios autenticados.
    document.getElementById("btnLogout").classList.toggle("d-none", esInvitado);

    // Mantiene visible el acceso al catálogo para todos.
    document.getElementById("navCatalogo").classList.remove("d-none");

    // Oculta el acceso al carrito para administradores.
    document.getElementById("navCarrito").classList.toggle("d-none", esAdmin);

    // Oculta el panel del carrito para administradores.
    document.getElementById("carrito").classList.toggle("d-none", esAdmin);

    // Solo los clientes pueden comprar.
    // Los botones también requieren que haya productos en el carrito.
    document
      .getElementById("btnComprar")
      .classList.toggle("d-none", !esCliente || carrito.length === 0);

    document
      .getElementById("btnVaciarCarrito")
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
      credentials: "same-origin",
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
      credentials: "same-origin",
    });

    // Lee la respuesta del servidor como texto.
    const resultado = (await respuesta.text()).trim();

    // Comprueba el estado HTTP y la respuesta del login.
    if (!respuesta.ok || resultado.toLowerCase().includes("error")) {
      throw new Error(resultado || "Correo o contraseña incorrectos.");
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
      credentials: "same-origin",
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
