// ======================================
// FORMULARIO DE ACTUALIZACIÓN
// ======================================

const formActualizarPersona = document.getElementById(
  "form-actualizar-persona",
);

// ======================================
// ACTUALIZAR PERSONA
// ======================================

formActualizarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!window.verificarSesion()) {
    return;
  }

  try {
    // Comprobar que exista una persona consultada
    if (!window.personaActual || !window.personaActual.id) {
      throw new Error("No se encontró el ID de la persona.");
    }

    // Obtener ID de la persona
    const id = window.personaActual.id;

    // Obtener datos del formulario
    const nombre = document.getElementById("nombre-actualizar").value;

    const apellido = document.getElementById("apellido-actualizar").value;

    const direccion = document.getElementById("direccion-actualizar").value;

    const ciudad = document.getElementById("ciudad-actualizar").value;

    const provincia = 5;

    const email = document.getElementById("email-actualizar").value;

    const telefono = document.getElementById("telefono-actualizar").value;

    // Crear parámetros
    const parametros = new URLSearchParams();

    parametros.append("id", id);
    parametros.append("nombre", nombre);
    parametros.append("apellido", apellido);
    parametros.append("direccion", direccion);
    parametros.append("ciudad", ciudad);
    parametros.append("provincia", provincia);
    parametros.append("email", email);
    parametros.append("telefono", telefono);

    // Enviar actualización a PHP
    const response = await fetch(
      window.API + "personas_guardar_editar.php?" + parametros.toString(),
    );

    if (!response.ok) {
      throw new Error("Error HTTP al actualizar persona: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta al actualizar:", respuesta);

    // Comprobar respuesta
    if (respuesta.status !== undefined && respuesta.status !== 200) {
      throw new Error(
        respuesta.mensaje || "No se pudieron actualizar los datos.",
      );
    }

    // Mostrar mensaje de éxito
    mostrarMensajePersona(
      "Los datos de " + nombre + " " + apellido + " fueron actualizados",
    );

    // Ocultar formulario
    document.getElementById("vista-actualizar-persona").classList.add("d-none");

    // Limpiar persona consultada
    window.personaActual = null;
  } catch (error) {
    console.error("Error al actualizar persona:", error);

    alert(error.message);
  }
});
