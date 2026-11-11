// ======================================
// ELEMENTOS HTML
// ======================================

const listaJugadores = document.getElementById("lista-jugadores-masc");

// ======================================
// CONSULTAR Y MOSTRAR JUGADORES
// ======================================

async function cargarJugadores() {
  listaJugadores.textContent = "Cargando jugadores...";

  try {
    const response = await fetch(window.API + "jugadores.php?id_categoria=1");

    if (!response.ok) {
      throw new Error("Error HTTP: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta PHP al listar jugadores:", respuesta);

    if (respuesta.status !== 200 && respuesta.status !== "200") {
      throw new Error(
        respuesta.mensaje ||
          respuesta.message ||
          "No se pudieron cargar los jugadores.",
      );
    }

    const jugadores = respuesta.productos;

    if (!Array.isArray(jugadores)) {
      throw new Error("La API no devolvió una lista válida de jugadores.");
    }

    // Ordenar jugadores
    jugadores.sort(function (a, b) {
      return a.apellido.localeCompare(b.apellido);
    });

    // Limpiar listado anterior
    listaJugadores.innerHTML = "";

    if (jugadores.length === 0) {
      listaJugadores.textContent = "No hay jugadores.";
      return true;
    }

    // Recorrer jugadores
    jugadores.forEach(function (jugador) {
      // Crear tarjeta
      const card = document.createElement("div");

      card.classList.add("card", "h-100");

      // Crear imagen
      const imagen = document.createElement("img");

      imagen.src = "../api/img/fotos_jugadores/" + jugador.imagen;

      imagen.classList.add("card-img-top", "w-100");

      // Crear cuerpo
      const cardBody = document.createElement("div");

      cardBody.classList.add("card-body", "text-center");

      // Crear nombre
      const titulo = document.createElement("h6");
      titulo.classList.add("card-title", "fw-bold" , "text-truncate");
      titulo.textContent = jugador.apellido + ", " + jugador.nombre;

      // Crear apodo
      const apodo = document.createElement("p");
      apodo.classList.add("card-text" , "text-truncate");
      apodo.textContent = jugador.apodo || "";

      // Crear botón
      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-primary");
      boton.textContent = "Ver más";

      // Organizar tarjeta
      cardBody.appendChild(titulo);
      cardBody.appendChild(apodo);
      cardBody.appendChild(boton);

      card.appendChild(imagen);
      card.appendChild(cardBody);

      // Abrir modal
      boton.addEventListener("click", function () {
        const modalImagen = document.getElementById("modalImagen");

        document.getElementById("modalTitulo").textContent =
          jugador.apellido + ", " + jugador.nombre;

        modalImagen.src = imagen.src;

        const modalElemento = document.getElementById("modaljugadores");

        const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

        modal.show();
      });

      // Insertar tarjeta
      listaJugadores.appendChild(card);
    });

    console.log("Jugadores cargados:", jugadores.length);

    return true;
  } catch (error) {
    console.error("Error al cargar jugadores:", error);

    listaJugadores.textContent = error.message;

    return false;
  }
}

// ======================================
// INICIAR
// ======================================

cargarJugadores();
