// ======================================
// ELEMENTOS DEL FORMULARIO DE PERSONAS
// ======================================

// Formulario de búsqueda
const formBuscarPersona = document.getElementById("form-buscar-persona");

// Formulario de registro
const formRegistrarPersona = document.getElementById("form-registrar-persona");

// Vistas
const vistaActualizarPersona = document.getElementById(
  "vista-actualizar-persona",
);

const vistaRegistrarPersona = document.getElementById(
  "vista-registrar-persona",
);

// Mensaje
const mensajePersona = document.getElementById("mensaje-persona");

// Persona encontrada
window.personaActual = null;

// ======================================
// BUSCAR PERSONA
// ======================================

formBuscarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!window.verificarSesion()) {
    return;
  }

  const dni = Number(document.getElementById("dni-buscar").value);

  if (!Number.isInteger(dni) || dni < 3000000 || dni > 50000000) {
    alert("Ingresá un DNI válido.");

    return;
  }

  vistaActualizarPersona.classList.add("d-none");
  vistaRegistrarPersona.classList.add("d-none");
  mensajePersona.classList.add("d-none");

  window.personaActual = null;

  await buscarPersona(dni);
});

// ======================================
// OBTENER CANTIDAD DE PERSONAS
// ======================================

async function obtenerCantidadPersonas() {
  const response = await fetch(window.API + "personas_cantidad.php");

  if (!response.ok) {
    throw new Error("Error al consultar la cantidad de personas.");
  }

  const respuesta = await response.json();

  console.log("Cantidad de personas:", respuesta);

  if (respuesta.status !== undefined && respuesta.status !== 200) {
    throw new Error("No se pudo obtener la cantidad de personas.");
  }

  const cantidad = Number(
    respuesta.cantidad !== undefined
      ? respuesta.cantidad
      : respuesta.total !== undefined
        ? respuesta.total
        : respuesta.data,
  );

  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error("La API no devolvió una cantidad válida.");
  }

  return cantidad;
}

// ======================================
// CONSULTAR PERSONA POR ID
// ======================================

async function consultarPersonaPorId(id) {
  const response = await fetch(window.API + "personas_listar.php?id=" + id);

  if (!response.ok) {
    throw new Error("Error HTTP al consultar persona: " + response.status);
  }

  const respuesta = await response.json();

  console.log("Persona consultada:", respuesta);

  if (respuesta.status !== undefined && respuesta.status !== 200) {
    throw new Error("Error al consultar la persona con ID " + id);
  }

  let persona = respuesta.persona;

  if (persona === undefined) {
    persona = respuesta.data;
  }

  if (Array.isArray(persona)) {
    persona = persona[0];
  }

  if (!persona || persona.dni === undefined) {
    throw new Error("La API no devolvió una persona válida.");
  }

  return persona;
}

// ======================================
// BÚSQUEDA BINARIA
// ======================================

async function buscarPersona(dniBuscado) {
  try {
    const cantidad = await obtenerCantidadPersonas();

    let inicio = 1;
    let fin = cantidad;

    let personaEncontrada = null;

    while (inicio <= fin) {
      const medio = Math.floor((inicio + fin) / 2);

      const persona = await consultarPersonaPorId(medio);

      const dniActual = Number(persona.dni);

      if (dniActual === dniBuscado) {
        personaEncontrada = persona;

        break;
      } else if (dniActual < dniBuscado) {
        inicio = medio + 1;
      } else {
        fin = medio - 1;
      }
    }

    if (personaEncontrada !== null) {
      await mostrarPersonaEncontrada(personaEncontrada);
    } else {
      await mostrarPersonaNoEncontrada(dniBuscado);
    }
  } catch (error) {
    console.error("Error al buscar persona:", error);

    alert(error.message);
  }
}

// ======================================
// CARGAR CIUDADES
// ======================================

let ciudadesCargadas = null;

async function cargarCiudades() {
  if (ciudadesCargadas !== null) {
    return ciudadesCargadas;
  }

  const response = await fetch(window.API + "ciudades.php");

  if (!response.ok) {
    throw new Error("Error HTTP: " + response.status);
  }

  const respuesta = await response.json();

  console.log("Respuesta de ciudades:", respuesta);

  if (respuesta.status !== 200) {
    throw new Error("No se pudieron cargar las ciudades.");
  }

  const ciudades = respuesta.localidades;

  if (!Array.isArray(ciudades)) {
    throw new Error("La API no devolvió una lista de ciudades.");
  }

  ciudades.sort(function (a, b) {
    return a.nombre_ciudad.localeCompare(b.nombre_ciudad);
  });

  ciudadesCargadas = ciudades;

  return ciudadesCargadas;
}

// ======================================
// COMPLETAR SELECT DE CIUDADES
// ======================================

async function completarSelectCiudades(idSelect, ciudadSeleccionada = "") {
  const select = document.getElementById(idSelect);

  const ciudades = await cargarCiudades();

  select.innerHTML = "";

  const opcionInicial = document.createElement("option");

  opcionInicial.value = "";
  opcionInicial.textContent = "Seleccione una ciudad";
  opcionInicial.disabled = true;
  opcionInicial.selected = true;

  select.appendChild(opcionInicial);

  ciudades.forEach(function (ciudad) {
    const opcion = document.createElement("option");

    opcion.value = ciudad.id;
    opcion.textContent = ciudad.nombre_ciudad;

    select.appendChild(opcion);
  });

  if (ciudadSeleccionada !== "") {
    select.value = String(ciudadSeleccionada);
  }
}

// ======================================
// MOSTRAR PERSONA ENCONTRADA
// ======================================

async function mostrarPersonaEncontrada(persona) {
  // Guardar persona para el archivo de actualización
  window.personaActual = persona;

  vistaRegistrarPersona.classList.add("d-none");

  await completarSelectCiudades("ciudad-actualizar", persona.ciudad);

  document.getElementById("dni-actualizar").value = persona.dni;

  document.getElementById("nombre-actualizar").value = persona.nombre;

  document.getElementById("apellido-actualizar").value = persona.apellido;

  document.getElementById("direccion-actualizar").value = persona.direccion;

  document.getElementById("provincia-actualizar").value = "5";

  document.getElementById("email-actualizar").value = persona.email;

  document.getElementById("telefono-actualizar").value = persona.telefono;

  vistaActualizarPersona.classList.remove("d-none");
}

// ======================================
// MOSTRAR PERSONA NO ENCONTRADA
// ======================================

async function mostrarPersonaNoEncontrada(dni) {
  vistaActualizarPersona.classList.add("d-none");

  await completarSelectCiudades("ciudad-registrar");

  document.getElementById("dni-registrar").value = dni;

  document.getElementById("nombre-registrar").value = "";
  document.getElementById("apellido-registrar").value = "";
  document.getElementById("direccion-registrar").value = "";

  document.getElementById("provincia-registrar").value = "5";

  document.getElementById("email-registrar").value = "";
  document.getElementById("telefono-registrar").value = "";

  vistaRegistrarPersona.classList.remove("d-none");
}

// ======================================
// REGISTRAR PERSONA
// ======================================

formRegistrarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!window.verificarSesion()) {
    return;
  }

  try {
    const dni = document.getElementById("dni-registrar").value;

    const nombre = document.getElementById("nombre-registrar").value;

    const apellido = document.getElementById("apellido-registrar").value;

    const direccion = document.getElementById("direccion-registrar").value;

    const ciudad = document.getElementById("ciudad-registrar").value;

    const provincia = 5;

    const email = document.getElementById("email-registrar").value;

    const telefono = document.getElementById("telefono-registrar").value;

    const parametros = new URLSearchParams();

    parametros.append("dni", dni);
    parametros.append("nombre", nombre);
    parametros.append("apellido", apellido);
    parametros.append("direccion", direccion);
    parametros.append("ciudad", ciudad);
    parametros.append("provincia", provincia);
    parametros.append("email", email);
    parametros.append("telefono", telefono);

    const response = await fetch(
      window.API + "personas_guardar.php?" + parametros.toString(),
    );

    if (!response.ok) {
      throw new Error("Error HTTP al registrar persona: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta al registrar:", respuesta);

    if (respuesta.status !== undefined && respuesta.status !== 200) {
      throw new Error(respuesta.mensaje || "No se pudo registrar la persona.");
    }

    mostrarMensajePersona(
      "La persona " + nombre + " " + apellido + " fue dada de alta con éxito",
    );

    vistaRegistrarPersona.classList.add("d-none");
  } catch (error) {
    console.error("Error al registrar persona:", error);

    alert(error.message);
  }
});

// ======================================
// MOSTRAR MENSAJE DE ÉXITO
// ======================================

function mostrarMensajePersona(mensaje) {
  mensajePersona.textContent = mensaje;

  mensajePersona.classList.remove("d-none");
}
