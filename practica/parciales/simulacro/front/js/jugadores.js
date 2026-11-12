// ======================================
// CONSULTAR JUGADORES
// ======================================

async function consultarJugadores(idCategoria) {
  return await obtenerProductos(
    window.API + "jugadores.php?id_categoria=" + idCategoria,
  );
}

// ======================================
// MOSTRAR JUGADORES
// ======================================

function mostrarJugadores(jugadores, contenedor) {
  contenedor.innerHTML = "";

  if (jugadores.length === 0) {
    contenedor.textContent = "No hay jugadores registrados.";
    return;
  }

  jugadores.sort(function (a, b) {
    return a.apellido.localeCompare(b.apellido);
  });

  jugadores.forEach(function (jugador) {
    const columna = document.createElement("div");

    columna.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

    // TARJETA

    const card = document.createElement("div");

    card.classList.add("card", "h-100");

    // IMAGEN

    const imagen = document.createElement("img");

    imagen.src = window.API + "img/fotos_jugadores/" + jugador.imagen;

    imagen.alt = "Foto de " + jugador.nombre;

    imagen.classList.add("card-img-top", "imagen-jugador");

    // CUERPO

    const cuerpo = document.createElement("div");

    cuerpo.classList.add("card-body", "text-center");

    // NOMBRE

    const titulo = document.createElement("h5");

    titulo.classList.add("card-title", "fw-bold");

    titulo.textContent = jugador.apellido + ", " + jugador.nombre;

    // APODO

    const apodo = document.createElement("p");

    apodo.classList.add("card-text");

    apodo.textContent = jugador.apodo || "";

    // BOTÓN

    const boton = document.createElement("button");

    boton.type = "button";

    boton.classList.add("btn", "btn-primary");

    boton.textContent = "Ver más";

    // EVENTOS

    boton.addEventListener("click", function () {
      abrirModalJugador(jugador.id_jugador);
    });

    imagen.addEventListener("click", function () {
      abrirModalJugador(jugador.id_jugador);
    });

    // ARMAR TARJETA

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(apodo);
    cuerpo.appendChild(boton);

    card.appendChild(imagen);
    card.appendChild(cuerpo);

    columna.appendChild(card);

    contenedor.appendChild(columna);
  });
}

// ======================================
// CARGAR JUGADORES POR CATEGORÍA
// ======================================

async function cargarJugadores(idCategoria, idContenedor) {
  const contenedor = document.getElementById(idContenedor);

  contenedor.textContent = "Cargando jugadores...";

  try {
    const jugadores = await consultarJugadores(idCategoria);

    mostrarJugadores(jugadores, contenedor);
  } catch (error) {
    console.error("Error al cargar jugadores:", error);

    contenedor.textContent = error.message;
  }
}

// ======================================
// CONSULTAR DATOS COMPLETOS DEL JUGADOR
// ======================================

async function consultarJugador(idJugador) {
  const jugadores = await obtenerProductos(
    window.API + "jugadores.php?id_jugador=" + encodeURIComponent(idJugador),
  );

  if (jugadores.length === 0) {
    throw new Error("No se encontró el jugador.");
  }

  return jugadores[0];
}

// ======================================
// ABRIR MODAL DEL JUGADOR
// ======================================

async function abrirModalJugador(idJugador) {
  const modalElemento = document.getElementById("modaljugadores");

  const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

  const titulo = document.getElementById("modalTitulo");
  const imagen = document.getElementById("modalImagen");
  const apodo = document.getElementById("modalApodo");
  const biografia = document.getElementById("modalBiografia");

  const tabla = document.getElementById("tabla-palmares");

  const formulario = document.getElementById("form-palmares");

  const mensaje = document.getElementById("mensaje-palmares");

  // ESTADO INICIAL

  titulo.textContent = "Cargando jugador...";

  imagen.src = "";

  apodo.textContent = "";

  biografia.textContent = "";

  tabla.innerHTML = "<tr><td colspan='2'>Cargando trayectoria...</td></tr>";

  document.getElementById("nuevo-palmares").value = "";

  mensaje.textContent = "";

  formulario.dataset.dni = "";

  modal.show();

  try {
    const jugador = await consultarJugador(idJugador);

    // MOSTRAR DATOS

    titulo.textContent = jugador.apellido + ", " + jugador.nombre;

    imagen.src = window.API + "img/fotos_jugadores/" + jugador.imagen;

    imagen.alt = "Foto de " + jugador.nombre;

    apodo.textContent = jugador.apodo || "Sin apodo";

    biografia.textContent = jugador.biografia || "Sin biografía disponible.";

    // GUARDAR DNI

    formulario.dataset.dni = jugador.dni;

    // CARGAR PALMARÉS

    await cargarPalmares(jugador.dni);
  } catch (error) {
    console.error(error);

    titulo.textContent = "Error al cargar el jugador";

    tabla.innerHTML =
      "<tr><td colspan='2'>No se pudo cargar la información.</td></tr>";
  }
}

// ======================================
// CONSULTAR PALMARÉS
// ======================================

async function cargarPalmares(dni) {
  const tabla = document.getElementById("tabla-palmares");

  tabla.innerHTML = "";

  try {
    const url =
      window.API + "palmares_listar.php?dni=" + encodeURIComponent(dni);

    const response = await fetch(url);

    const respuesta = await response.json();

    // EL PHP DEVUELVE 500 CUANDO NO HAY REGISTROS

    if (
      response.status === 500 ||
      respuesta.status === 500 ||
      respuesta.status === "500"
    ) {
      tabla.innerHTML =
        "<tr><td colspan='2'>El jugador todavía no tiene palmarés registrado.</td></tr>";

      return;
    }

    if (!response.ok) {
      throw new Error("Error HTTP: " + response.status);
    }

    if (respuesta.status !== 200 && respuesta.status !== "200") {
      throw new Error("Error al consultar el palmarés.");
    }

    const registros = respuesta.productos;

    if (!Array.isArray(registros) || registros.length === 0) {
      tabla.innerHTML =
        "<tr><td colspan='2'>El jugador todavía no tiene palmarés registrado.</td></tr>";

      return;
    }

    // MOSTRAR REGISTROS

    registros.forEach(function (registro) {
      const fila = document.createElement("tr");

      const celdaAnio = document.createElement("td");

      celdaAnio.textContent = registro.anio;

      const celdaDetalle = document.createElement("td");

      celdaDetalle.textContent = registro.detalle;

      fila.appendChild(celdaAnio);

      fila.appendChild(celdaDetalle);

      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error(error);

    tabla.innerHTML =
      "<tr><td colspan='2'>Error al consultar la trayectoria.</td></tr>";
  }
}

// ======================================
// GUARDAR NUEVO PALMARÉS
// ======================================

const formularioPalmares = document.getElementById("form-palmares");

if (formularioPalmares) {
  formularioPalmares.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dni = this.dataset.dni;

    const detalle = document.getElementById("nuevo-palmares").value.trim();

    const mensaje = document.getElementById("mensaje-palmares");

    if (!dni) {
      mensaje.textContent = "No se pudo identificar al jugador.";

      return;
    }

    if (detalle === "") {
      mensaje.textContent = "Ingresá el detalle del palmarés.";

      return;
    }

    try {
      const datos = new FormData();

      datos.append("detalle", detalle);

      const respuesta = await consultarAPI(
        window.API + "palmares_guardar.php?dni=" + encodeURIComponent(dni),
        {
          method: "POST",
          body: datos,
        },
      );

      mensaje.textContent =
        respuesta.mensaje || "Palmarés guardado correctamente.";

      document.getElementById("nuevo-palmares").value = "";

      await cargarPalmares(dni);
    } catch (error) {
      console.error(error);

      mensaje.textContent = error.message;
    }
  });
}
