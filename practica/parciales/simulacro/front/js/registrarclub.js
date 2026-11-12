
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

inputLogo.addEventListener("change", function () {

    const archivo = this.files[0];

    if (!archivo) {
        vistaLogo.classList.add("d-none");
        return;
    }

    vistaLogo.src = URL.createObjectURL(archivo);

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

        const response = await fetch(
            window.API + "equipos_insertar.php",
            {
                method: "POST",
                body: datos
            }
        );

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const respuesta = await response.json();

        if (respuesta.status !== 200 &&
            respuesta.status !== "200") {

            throw new Error(
                respuesta.mensaje ||
                respuesta.message ||
                "No se pudo registrar el equipo."
            );
        }

        mensajeClub.textContent =
            respuesta.mensaje ||
            respuesta.message ||
            "Equipo registrado correctamente.";

        formularioClub.reset();

        vistaLogo.src = "";
        vistaLogo.classList.add("d-none");

    } catch (error) {

        console.error("Error al registrar equipo:", error);

        mensajeClub.textContent = error.message;

    }

});
