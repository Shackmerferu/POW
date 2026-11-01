/* ============================================================
   login.js - Logica exclusiva de index.html
   ------------------------------------------------------------
   Flujo:
   1. Si ya hay un token válido en sessionStorage, redirige a
      panel.html (el usuario ya está logueado).
   2. Si no, muestra el formulario.
   3. Al enviar, llama a login.php con usuario y password.
   4. Guarda el token y redirige a panel.html.

   La API espera los parametros "usuario" y "password".
   OJO: en el desarrollo original se enviaban "user" y "pass",
   por eso el login nunca funcionaba.
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("form-login");
  const alertas = document.getElementById("login-alert");
  const boton = document.getElementById("btn-ingresar");
  const campoPassword = document.getElementById("password");
  const botonVer = document.getElementById("btn-ver-password");

  /* ----------------------------------------------------------
     1. Si ya hay sesión, no mostrar el login.
     ---------------------------------------------------------- */
  async function comprobarSesionExistente() {
    const token = App.getToken();
    if (!token) return;

    App.setLoading(boton, true, "Verificando sesión...");

    const valido = await App.verifyToken(token);

    if (valido) {
      window.location.replace("panel.html");
      return;
    }

    // Token vencido, borrado de la base o invalido: se limpia.
    App.clearSession();
    App.setLoading(boton, false);
  }

  /* ----------------------------------------------------------
     2. Mostrar / ocultar contrasena (detalle de UX).
     ---------------------------------------------------------- */
  if (botonVer && campoPassword) {
    botonVer.addEventListener("click", () => {
      const mostrando = campoPassword.type === "text";

      campoPassword.type = mostrando ? "password" : "text";
      botonVer.textContent = mostrando ? "Mostrar" : "Ocultar";
      botonVer.setAttribute(
        "aria-label",
        mostrando ? "Mostrar contraseña" : "Ocultar contraseña"
      );
    });
  }

  /* ----------------------------------------------------------
     3. Envio del formulario.
     ---------------------------------------------------------- */
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    App.clearAlert(alertas);

    // Validacion del navegador: required, minlength, etc.
    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");
      return;
    }

    const usuario = formulario.elements.usuario.value.trim();
    const password = formulario.elements.password.value;

    App.setLoading(boton, true, "Ingresando...");

    try {
      // POST es mas seguro que poner la clave en la URL.
      // La API usa extract($_REQUEST), asi que acepta POST sin problemas.
      const datos = await App.postUrlEncoded(API.login, {
        usuario: usuario,
        password: password
      });

      if (datos.status !== 200 || !datos.token) {
        throw new Error(
          datos.menssage ||
          datos.mensaje ||
          "Usuario o contraseña incorrectos."
        );
      }

      App.saveSession(datos.token, {
        nombre: datos.nombre,
        apellido: datos.apellido,
        id: datos.id_usurio || datos.id_usuario || null
      });

      window.location.replace("panel.html");

    } catch (error) {
      App.showAlert(
        alertas,
        error.message || "No se pudo iniciar sesión. Intente nuevamente.",
        "danger"
      );

      App.setLoading(boton, false);
      campoPassword.focus();
      campoPassword.select();
    }
  });

  // El navegador recuerda el usuario, pero no la clave.
  comprobarSesionExistente();
});
