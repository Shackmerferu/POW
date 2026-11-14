// ======================================
// VERIFICAR SESIÓN EXISTENTE
// ======================================

const token = sessionStorage.getItem("termos_token");

if (token) {
  window.location.replace("panel.html");
}

// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

// Formularios
const formulario = document.getElementById("formLogin");
const formularioRegistro = document.getElementById("formRegistro");

// Vistas
const vistaLogin = document.getElementById("vistaLogin");
const vistaRegistro = document.getElementById("vistaRegistro");

// Enlaces
const irRegistro = document.getElementById("irRegistro");
const irLogin = document.getElementById("irLogin");

// Mensaje
const mensaje = document.getElementById("mensaje");

// ======================================
// CAMBIAR ENTRE VISTAS
// ======================================

// Mostrar registro
irRegistro.addEventListener("click", function (event) {
  event.preventDefault();

  vistaLogin.classList.add("d-none");
  vistaRegistro.classList.remove("d-none");
});

// Volver al inicio de sesión
irLogin.addEventListener("click", function (event) {
  event.preventDefault();

  vistaRegistro.classList.add("d-none");
  vistaLogin.classList.remove("d-none");
});

// ======================================
// INICIAR SESIÓN
// ======================================

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtener valores
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("contrasenia").value;

  // Validar campos
  if (usuario === "" || password === "") {
    mensaje.textContent = "Complete todos los campos.";
    return;
  }

  // Preparar parámetros
  const parametros = new URLSearchParams();

  parametros.append("usuario", usuario);
  parametros.append("password", password);

  // Consultar API
  fetch(
    "http://localhost/Proyectos/pow/practica/parciales/prueba1/termos/api/login.php?" +
      parametros.toString(),
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error HTTP: " + response.status);
      }

      return response.json();
    })

    .then(function (data) {
      console.log("Respuesta de PHP:", data);

      if (data.status === 200 && data.token) {
        // Guardar token
        sessionStorage.setItem("termos_token", data.token);

        // Guardar información del usuario
        sessionStorage.setItem("termos_nombre", data.nombre);
        sessionStorage.setItem("termos_apellido", data.apellido);

        // Ir al panel
        window.location.replace("panel.html");
      } else {
        mensaje.textContent = "Usuario o contraseña incorrectos.";
      }
    })

    .catch(function (error) {
      console.error("Error:", error);

      mensaje.textContent = "Error al comunicarse con el servidor.";
    });
});

// ======================================
// REGISTRAR USUARIO
// ======================================

formularioRegistro.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtener valores
  const usuario = document.getElementById("nuevoUsuario").value.trim();
  const password = document.getElementById("nuevaContrasenia").value;
  const repetirPassword = document.getElementById("repetirContrasenia").value;

  // Validar campos
  if (usuario === "" || password === "" || repetirPassword === "") {
    alert("Complete todos los campos.");
    return;
  }

  // Comprobar contraseñas
  if (password !== repetirPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // El registro todavía requiere conectar una API PHP.
  console.log("Datos preparados para registrar:", usuario);
});
