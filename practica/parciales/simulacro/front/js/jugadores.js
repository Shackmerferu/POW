// ======================================
// CONSULTAR JUGADORES
// ======================================

async function consultarJugadores(idCategoria) {
  const response = await fetch(
    window.API + "jugadores.php?id_categoria=" + idCategoria,
  );

  if (!response.ok) {
    throw new Error("Error HTTP: " + response.status);
  }

  const respuesta = await response.json();

  if (respuesta.status !== 200 && respuesta.status !== "200") {
    throw new Error(
      respuesta.menssage ||
        respuesta.mensaje ||
        "No se pudieron consultar los jugadores.",
    );
  }

  return respuesta.productos;
}

// ======================================
// MOSTRAR TARJETAS
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

    const card = document.createElement("div");
    card.classList.add("card", "h-100");

    // FOTO
    const imagen = document.createElement("img");

    imagen.src = window.API + "img/fotos_jugadores/" + jugador.imagen;
    imagen.alt = "Foto de " + jugador.nombre;
    imagen.classList.add("card-img-top", "imagen-jugador");

    imagen.style.cursor = "pointer";

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

    // BOTÓN VER MÁS
    const boton = document.createElement("button");

    boton.type = "button";
    boton.classList.add("btn", "btn-primary");
    boton.textContent = "Ver más";

    boton.addEventListener("click", function () {
      abrirModalJugador(jugador.id_jugador);
    });

    imagen.addEventListener("click", function () {
      abrirModalJugador(jugador.id_jugador);
    });

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
// CONSULTAR DATOS COMPLETOS DEL JUGADOR
// ======================================

async function consultarJugador(idJugador) {
  const response = await fetch(
    window.API + "jugadores.php?id_jugador=" + encodeURIComponent(idJugador),
  );

  if (!response.ok) {
    throw new Error("Error al consultar el jugador.");
  }

  const respuesta = await response.json();

  if (respuesta.status !== 200 && respuesta.status !== "200") {
    throw new Error("No se pudieron obtener los datos del jugador.");
  }

  if (!respuesta.productos || respuesta.productos.length === 0) {
    throw new Error("No se encontró el jugador.");
  }

  return respuesta.productos[0];
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

  // Mostrar estado de carga
  titulo.textContent = "Cargando jugador...";
  imagen.src = "";
  apodo.textContent = "";
  biografia.textContent = "";

  tabla.innerHTML = "<tr><td>Cargando trayectoria...</td></tr>";

  document.getElementById("nuevo-palmares").value = "";

  mensaje.textContent = "";

  formulario.dataset.dni = "";

  modal.show();

  try {
    // Consultar los datos completos
    const jugador = await consultarJugador(idJugador);

    // Mostrar información del jugador
    titulo.textContent = jugador.apellido + ", " + jugador.nombre;

    imagen.src = window.API + "img/fotos_jugadores/" + jugador.imagen;

    imagen.alt = "Foto de " + jugador.nombre;

    apodo.textContent = jugador.apodo || "Sin apodo";

    biografia.textContent = jugador.biografia || "Sin biografía disponible.";

    // Guardar DNI para utilizarlo al consultar y guardar palmarés
    formulario.dataset.dni = jugador.dni;

    // Consultar trayectoria
    await cargarPalmares(jugador.dni);
  } catch (error) {
    console.error(error);

    titulo.textContent = "Error al cargar el jugador";

    tabla.innerHTML = "<tr><td>No se pudo cargar la información.</td></tr>";
  }
}

// ======================================
// CONSULTAR PALMARÉS DEL JUGADOR
// ======================================

async function cargarPalmares(dni) {
  const tabla = document.getElementById("tabla-palmares");

  tabla.innerHTML = "";

  try {
    const response = await fetch(
      window.API + "palmares_listar.php?dni=" + encodeURIComponent(dni),
    );

    if (!response.ok) {
      throw new Error("Error HTTP: " + response.status);
    }

    const respuesta = await response.json();

    // El PHP devuelve status 500 cuando no hay registros.
    if (respuesta.status !== 200 && respuesta.status !== "200") {
      tabla.innerHTML =
        "<tr><td>El jugador todavía no tiene palmarés registrado.</td></tr>";

      return;
    }

    const registros = respuesta.productos;

    tabla.innerHTML = "";

    if (!Array.isArray(registros) || registros.length === 0) {
      tabla.innerHTML =
        "<tr><td>El jugador todavía no tiene palmarés registrado.</td></tr>";

      return;
    }

    // Recorrer los registros de la trayectoria
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

    tabla.innerHTML = "<tr><td>Error al consultar la trayectoria.</td></tr>";
  }
}

// ======================================
// GUARDAR NUEVO PALMARÉS
// ======================================

document
  .getElementById("form-palmares")
  .addEventListener("submit", async function (event) {
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

      // El PHP espera el campo POST llamado detalle
      datos.append("detalle", detalle);

      const response = await fetch(
        window.API + "palmares_guardar.php?dni=" + encodeURIComponent(dni),
        {
          method: "POST",
          body: datos,
        },
      );

      if (!response.ok) {
        throw new Error("Error HTTP: " + response.status);
      }

      const respuesta = await response.json();

      if (respuesta.status !== 200 && respuesta.status !== "200") {
        throw new Error(respuesta.message || "No se pudo guardar el palmarés.");
      }

      mensaje.textContent = "Palmarés guardado correctamente.";

      document.getElementById("nuevo-palmares").value = "";

      // Actualizar la tabla después de guardar
      await cargarPalmares(dni);
    } catch (error) {
      console.error(error);

      mensaje.textContent = error.message;
    }
  });
