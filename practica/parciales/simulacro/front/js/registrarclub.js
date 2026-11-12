// ======================================
// ELEMENTOS HTML
// ======================================

const formularioClub = document.getElementById("form-club");

const inputLogo = document.getElementById("logo-club");

const vistaLogo = document.getElementById("vista-logo");

const mensajeClub = document.getElementById("mensaje-club");

// ======================================
// VISTA PREVIA DEL LOGO
// ======================================

if (formularioClub && inputLogo && vistaLogo && mensajeClub) {
  let urlLogo = null;

  inputLogo.addEventListener("change", function () {
    const archivo = this.files[0];

    if (urlLogo) {
      URL.revokeObjectURL(urlLogo);

      urlLogo = null;
    }

    if (!archivo) {
      vistaLogo.classList.add("d-none");

      vistaLogo.src = "";

      return;
    }

    urlLogo = URL.createObjectURL(archivo);

    vistaLogo.src = urlLogo;

    vistaLogo.classList.remove("d-none");
  });

  // ======================================
  // REGISTRAR EQUIPO
  // ======================================

  formularioClub.addEventListener("submit", async function (event) {
    event.preventDefault();

    mensajeClub.textContent = "Registrando equipo...";

    try {
      const datos = new FormData(formularioClub);

      const respuesta = await consultarAPI(
        window.API + "equipos_insertar.php",
        {
          method: "POST",
          body: datos,
        },
      );

      mensajeClub.textContent =
        respuesta.mensaje ||
        respuesta.message ||
        "Equipo registrado correctamente.";

      formularioClub.reset();

      vistaLogo.src = "";

      vistaLogo.classList.add("d-none");

      if (urlLogo) {
        URL.revokeObjectURL(urlLogo);

        urlLogo = null;
      }
    } catch (error) {
      console.error("Error al registrar equipo:", error);

      mensajeClub.textContent = error.message;
    }
  });
}
