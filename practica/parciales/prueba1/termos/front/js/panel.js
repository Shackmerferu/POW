// ======================================
// RUTAS DE LAS API
// ======================================

const API =
  "http://localhost/facultad/POW/practica/parciales/prueba1/termos/api/";

// ======================================
// CERRAR SESIÓN
// ======================================

const btnSalir = document.getElementById("btn-salir");

btnSalir.addEventListener("click", cerrarSesion);

function cerrarSesion() {
  const seguro = window.confirm("¿Está seguro de que desea cerrar sesión?");

  if (!seguro) {
    return;
  }

  sessionStorage.removeItem("termos_token");
  sessionStorage.removeItem("termos_nombre");
  sessionStorage.removeItem("termos_apellido");

  window.location.replace("index.html");
}

// ======================================
// VERIFICAR SESIÓN
// ======================================

function verificarSesion() {

    const token = sessionStorage.getItem("termos_token");

    if (!token) {
        window.location.replace("index.html");
        return false;
    }

    return true;
}

// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

// Secciones
const inicio = document.getElementById("inicio");
const termos = document.getElementById("termos");
const personas = document.getElementById("personas");

// Botones
const btnInicio = document.getElementById("btn-inicio");
const btnTermos = document.getElementById("btn-termos");
const btnPersonas = document.getElementById("btn-personas");

// Contenedor de productos
const listaTermos = document.getElementById("lista-termos");

// ======================================
// ESTADO INICIAL DE LA NAVEGACIÓN
// ======================================

btnInicio.classList.replace("btn-primary", "btn-light");

// ======================================
// CAMBIAR DE VISTA
// ======================================

// Mostrar inicio
btnInicio.addEventListener("click", function () {
  inicio.classList.remove("d-none");
  termos.classList.add("d-none");
  personas.classList.add("d-none");

  btnInicio.classList.replace("btn-primary", "btn-light");
  btnTermos.classList.replace("btn-light", "btn-primary");
  btnPersonas.classList.replace("btn-light", "btn-primary");
});

// Mostrar termos
btnTermos.addEventListener("click", function () {
  if (!verificarSesion()) {
    return;
  }

  inicio.classList.add("d-none");
  termos.classList.remove("d-none");
  personas.classList.add("d-none");

  btnInicio.classList.replace("btn-light", "btn-primary");
  btnTermos.classList.replace("btn-primary", "btn-light");
  btnPersonas.classList.replace("btn-light", "btn-primary");

  cargarTermos();
});

// Mostrar personas
btnPersonas.addEventListener("click", function () {
  if (!verificarSesion()) {
    return;
  }

  inicio.classList.add("d-none");
  termos.classList.add("d-none");
  personas.classList.remove("d-none");

  btnInicio.classList.replace("btn-light", "btn-primary");
  btnTermos.classList.replace("btn-light", "btn-primary");
  btnPersonas.classList.replace("btn-primary", "btn-light");
});

// ======================================
// CONSULTAR PRODUCTOS A PHP
// ======================================

function cargarTermos() {
  const token = sessionStorage.getItem("termos_token");

  listaTermos.textContent = "Cargando productos...";

  fetch(API + "listar_productos.php?token=" + encodeURIComponent(token))
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error HTTP: " + response.status);
      }

      return response.json();
    })

    .then(function (respuesta) {
      console.log("Respuesta PHP:", respuesta);

      if (respuesta.status !== 200) {
        throw new Error("No autorizado o no hay productos");
      }

      const productos = respuesta.data;

      listaTermos.innerHTML = "";

      productos.forEach(function (termo) {
        // Crear tarjeta
        const card = document.createElement("div");
        card.classList.add("card");

        // Comportamiento modal de Bootstrap
        card.setAttribute("data-bs-toggle", "modal");
        card.setAttribute("data-bs-target", "#modalTermo");

        card.style.cursor = "pointer";

        // Cargar datos del termo seleccionado
        card.addEventListener("click", function () {
          document.getElementById("modalTitulo").textContent = termo.titulo;

          const modalImagen = document.getElementById("modalImagen");

          modalImagen.src = "../api/imagenes/" + termo.imagen;
          modalImagen.alt = termo.texto_alternativo;

          document.getElementById("modalDescripcion").textContent =
            termo.descripcion;

          document.getElementById("modalDescripcionLarga").textContent =
            termo.descripcion_larga;
        });

        // Crear cuerpo
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Contenedor horizontal
        const contenido = document.createElement("div");
        contenido.classList.add("d-flex", "align-items-center", "gap-3");

        // Imagen
        const imagen = document.createElement("img");

        imagen.src = "../api/imagenes/" + termo.imagen;
        imagen.alt = termo.texto_alternativo;

        imagen.classList.add("img-fluid", "rounded");
        imagen.style.width = "150px";

        // Texto
        const texto = document.createElement("div");

        const titulo = document.createElement("h5");
        titulo.classList.add("card-title");
        titulo.textContent = termo.titulo;

        const descripcion = document.createElement("p");
        descripcion.classList.add("card-text");
        descripcion.textContent = termo.descripcion;

        // Organizar elementos
        texto.appendChild(titulo);
        texto.appendChild(descripcion);

        contenido.appendChild(imagen);
        contenido.appendChild(texto);

        cardBody.appendChild(contenido);
        card.appendChild(cardBody);

        // Insertar tarjeta
        listaTermos.appendChild(card);
      });
    })

    .catch(function (error) {
      console.error("Error al cargar termos:", error);
      listaTermos.textContent = error.message;
    });
}

// ======================================
// AGREGAR TERMO
// ======================================

const formAgregarTermo = document.getElementById("formAgregarTermo");

formAgregarTermo.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtener valores
  const titulo = document.getElementById("tituloTermo").value;
  const descripcion = document.getElementById("descripcionTermo").value;

  const descripcionLarga = document.getElementById(
    "descripcionLargaTermo",
  ).value;

  const textoAlternativo = document.getElementById(
    "textoAlternativoTermo",
  ).value;

  const imagen = document.getElementById("imagenTermo").files[0];

  // Mostrar datos en consola
  console.log("Título:", titulo);
  console.log("Descripción:", descripcion);
  console.log("Descripción larga:", descripcionLarga);
  console.log("Texto alternativo:", textoAlternativo);
  console.log("Imagen:", imagen);

  // Cerrar modal
  const modalElemento = document.getElementById("modalAgregarTermo");
  const modal = bootstrap.Modal.getInstance(modalElemento);

  if (modal) {
    modal.hide();
  }
});

// ======================================
// ELEMENTOS DEL FORMULARIO DE PERSONAS
// ======================================

// Formulario de búsqueda
const formBuscarPersona = document.getElementById("form-buscar-persona");

// Formularios de actualización y registro
const formActualizarPersona = document.getElementById(
  "form-actualizar-persona",
);
const formRegistrarPersona = document.getElementById("form-registrar-persona");

// Vistas
const vistaActualizarPersona = document.getElementById(
  "vista-actualizar-persona",
);
const vistaRegistrarPersona = document.getElementById(
  "vista-registrar-persona",
);

// Mensaje de resultado
const mensajePersona = document.getElementById("mensaje-persona");

// Persona encontrada actualmente
let personaActual = null;

// ======================================
// BUSCAR PERSONA
// ======================================

formBuscarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!verificarSesion()) {
    return;
  }

  // Obtener DNI
  const dni = Number(document.getElementById("dni-buscar").value);

  // Validar DNI
  if (!Number.isInteger(dni) || dni < 3000000 || dni > 50000000) {
    alert("Ingresá un DNI válido.");
    return;
  }

  // Ocultar formularios anteriores
  vistaActualizarPersona.classList.add("d-none");
  vistaRegistrarPersona.classList.add("d-none");
  mensajePersona.classList.add("d-none");

  personaActual = null;

  // Buscar persona
  await buscarPersona(dni);
});

// ======================================
// OBTENER CANTIDAD DE PERSONAS
// ======================================

async function obtenerCantidadPersonas() {
  const response = await fetch(API + "personas_cantidad.php");

  if (!response.ok) {
    throw new Error("Error al consultar la cantidad de personas.");
  }

  const respuesta = await response.json();

  console.log("Cantidad de personas:", respuesta);

  if (respuesta.status !== undefined && respuesta.status !== 200) {
    throw new Error("No se pudo obtener la cantidad de personas.");
  }

  // Obtener cantidad según la respuesta de PHP
  const cantidad = Number(
    respuesta.cantidad !== undefined
      ? respuesta.cantidad
      : respuesta.total !== undefined
        ? respuesta.total
        : respuesta.data,
  );

  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error("La API no devolvió una cantidad válida de personas.");
  }

  return cantidad;
}

// ======================================
// CONSULTAR PERSONA POR ID
// ======================================

async function consultarPersonaPorId(id) {
  const response = await fetch(API + "personas_listar.php?id=" + id);

  if (!response.ok) {
    throw new Error("Error HTTP al consultar la persona: " + response.status);
  }

  const respuesta = await response.json();

  console.log("Persona consultada:", respuesta);

  if (respuesta.status !== undefined && respuesta.status !== 200) {
    throw new Error("Error al consultar la persona con ID " + id);
  }

  // La API puede devolver un array o un objeto
  let persona = respuesta.persona;

  if (persona === undefined) {
    persona = respuesta.data;
  }

  if (Array.isArray(persona)) {
    persona = persona[0];
  }

  if (!persona || persona.dni === undefined) {
    throw new Error("La API no devolvió una persona válida para el ID " + id);
  }

  return persona;
}

// ======================================
// BÚSQUEDA BINARIA DE PERSONAS
// ======================================

async function buscarPersona(dniBuscado) {
  try {
    // Obtener cantidad total de personas
    const cantidad = await obtenerCantidadPersonas();

    // Límites de búsqueda
    let inicio = 1;
    let fin = cantidad;

    let personaEncontrada = null;

    // Búsqueda binaria
    while (inicio <= fin) {
      // Calcular posición del medio
      const medio = Math.floor((inicio + fin) / 2);

      // Consultar persona correspondiente al ID medio
      const persona = await consultarPersonaPorId(medio);

      const dniActual = Number(persona.dni);

      // Comparar DNI
      if (dniActual === dniBuscado) {
        personaEncontrada = persona;
        break;
      } else if (dniActual < dniBuscado) {
        // Buscar en la mitad superior
        inicio = medio + 1;
      } else {
        // Buscar en la mitad inferior
        fin = medio - 1;
      }
    }

    // Mostrar resultado
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
// CARGAR CIUDADES DESDE LA API
// ======================================

let ciudadesCargadas = null;

async function cargarCiudades() {
  if (ciudadesCargadas !== null) {
    return ciudadesCargadas;
  }

  const response = await fetch(API + "ciudades.php");

  if (!response.ok) {
    throw new Error("Error HTTP: " + response.status);
  }

  const respuesta = await response.json();

  console.log("Respuesta de ciudades:", respuesta);

  if (respuesta.status !== 200) {
    throw new Error("No se pudieron cargar las ciudades.");
  }

  // Obtener localidades
  const ciudades = respuesta.localidades;

  if (!Array.isArray(ciudades)) {
    throw new Error("La API no devolvió una lista de localidades.");
  }

  // Ordenar alfabéticamente
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

  // Limpiar opciones
  select.innerHTML = "";

  // Opción inicial
  const opcionInicial = document.createElement("option");

  opcionInicial.value = "";
  opcionInicial.textContent = "Seleccione una ciudad";
  opcionInicial.disabled = true;
  opcionInicial.selected = true;

  select.appendChild(opcionInicial);

  // Agregar localidades
  ciudades.forEach(function (ciudad) {
    const opcion = document.createElement("option");

    opcion.value = ciudad.id;
    opcion.textContent = ciudad.nombre_ciudad;

    select.appendChild(opcion);
  });

  // Seleccionar localidad de la persona
  if (ciudadSeleccionada !== "") {
    select.value = String(ciudadSeleccionada);
  }
}

// ======================================
// MOSTRAR PERSONA ENCONTRADA
// ======================================

async function mostrarPersonaEncontrada(persona) {
  // Guardar persona actual para utilizar su ID al actualizar
  personaActual = persona;

  // Ocultar registro
  vistaRegistrarPersona.classList.add("d-none");

  // Cargar ciudades y seleccionar la correspondiente
  await completarSelectCiudades("ciudad-actualizar", persona.ciudad);

  // Completar campos
  document.getElementById("dni-actualizar").value = persona.dni;
  document.getElementById("nombre-actualizar").value = persona.nombre;
  document.getElementById("apellido-actualizar").value = persona.apellido;
  document.getElementById("direccion-actualizar").value = persona.direccion;
  document.getElementById("provincia-actualizar").value = persona.provincia;
  document.getElementById("email-actualizar").value = persona.email;
  document.getElementById("telefono-actualizar").value = persona.telefono;

  // Mostrar formulario
  vistaActualizarPersona.classList.remove("d-none");
}

// ======================================
// MOSTRAR PERSONA NO ENCONTRADA
// ======================================

async function mostrarPersonaNoEncontrada(dni) {
  // Ocultar actualización
  vistaActualizarPersona.classList.add("d-none");

  // Cargar ciudades
  await completarSelectCiudades("ciudad-registrar");

  // Completar DNI
  document.getElementById("dni-registrar").value = dni;

  // Limpiar campos
  document.getElementById("nombre-registrar").value = "";
  document.getElementById("apellido-registrar").value = "";
  document.getElementById("direccion-registrar").value = "";
  document.getElementById("provincia-registrar").value = "5";
  document.getElementById("email-registrar").value = "";
  document.getElementById("telefono-registrar").value = "";

  // Mostrar formulario
  vistaRegistrarPersona.classList.remove("d-none");
}

// ======================================
// REGISTRAR PERSONA
// ======================================

formRegistrarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!verificarSesion()) {
    return;
  }

  try {
    // Obtener datos del formulario
    const dni = document.getElementById("dni-registrar").value;
    const nombre = document.getElementById("nombre-registrar").value;
    const apellido = document.getElementById("apellido-registrar").value;
    const direccion = document.getElementById("direccion-registrar").value;
    const ciudad = document.getElementById("ciudad-registrar").value;
    const provincia = 5;
    const email = document.getElementById("email-registrar").value;
    const telefono = document.getElementById("telefono-registrar").value;

    // Construir parámetros
    const parametros = new URLSearchParams();

    parametros.append("dni", dni);
    parametros.append("nombre", nombre);
    parametros.append("apellido", apellido);
    parametros.append("direccion", direccion);
    parametros.append("ciudad", ciudad);
    parametros.append("provincia", provincia);
    parametros.append("email", email);
    parametros.append("telefono", telefono);

    // Consultar API
    const response = await fetch(
      API + "personas_guardar.php?" + parametros.toString(),
    );

    if (!response.ok) {
      throw new Error("Error HTTP al registrar persona: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta al registrar:", respuesta);

    if (respuesta.status !== undefined && respuesta.status !== 200) {
      throw new Error(respuesta.mensaje || "No se pudo registrar la persona.");
    }

    // Mostrar mensaje
    mostrarMensajePersona(
      "La persona " + nombre + " " + apellido + " fue dada de alta con éxito",
    );

    // Ocultar formulario
    vistaRegistrarPersona.classList.add("d-none");
  } catch (error) {
    console.error("Error al registrar persona:", error);
    alert(error.message);
  }
});

// ======================================
// ACTUALIZAR PERSONA
// ======================================

formActualizarPersona.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!verificarSesion()) {
    return;
  }

  try {
    if (!personaActual || !personaActual.id) {
      throw new Error(
        "No se encontró el ID de la persona que se desea actualizar.",
      );
    }

    // Obtener datos del formulario
    const id = personaActual.id;
    const nombre = document.getElementById("nombre-actualizar").value;
    const apellido = document.getElementById("apellido-actualizar").value;
    const direccion = document.getElementById("direccion-actualizar").value;
    const ciudad = document.getElementById("ciudad-actualizar").value;
    const provincia = 5;
    const email = document.getElementById("email-actualizar").value;
    const telefono = document.getElementById("telefono-actualizar").value;

    // Construir parámetros
    const parametros = new URLSearchParams();

    parametros.append("id", id);
    parametros.append("nombre", nombre);
    parametros.append("apellido", apellido);
    parametros.append("direccion", direccion);
    parametros.append("ciudad", ciudad);
    parametros.append("provincia", provincia);
    parametros.append("email", email);
    parametros.append("telefono", telefono);

    // Consultar API
    const response = await fetch(
      API + "personas_guardar_editar.php?" + parametros.toString(),
    );

    if (!response.ok) {
      throw new Error("Error HTTP al actualizar persona: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta al actualizar:", respuesta);

    if (respuesta.status !== undefined && respuesta.status !== 200) {
      throw new Error(
        respuesta.mensaje || "No se pudieron actualizar los datos.",
      );
    }

    // Mostrar mensaje
    mostrarMensajePersona(
      "Los datos de " + nombre + " " + apellido + " fueron actualizados",
    );

    // Ocultar formulario
    vistaActualizarPersona.classList.add("d-none");
  } catch (error) {
    console.error("Error al actualizar persona:", error);
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
