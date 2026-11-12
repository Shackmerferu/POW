// ======================================
// CALCULAR PUNTOS DE UN PARTIDO
// ======================================

function calcularPuntos(partido, equipoEsA) {
  const puntosA = Number(partido.puntos_A);
  const puntosB = Number(partido.puntos_B);

  const puntosEquipo = equipoEsA ? puntosA : puntosB;
  const puntosRival = equipoEsA ? puntosB : puntosA;

  const puntosGanado = partido.modalidad === "C2" ? 5 : 3;
  const puntosEmpate = partido.modalidad === "C2" ? 2 : 1;

  if (puntosEquipo > puntosRival) {
    return puntosGanado;
  }

  if (puntosEquipo === puntosRival) {
    return puntosEmpate;
  }

  return 0;
}

// ======================================
// CONSULTAR PARTIDOS
// ======================================


async function consultarPartidos(idEquipo, idCategoria, localia) {

    const url = window.API + "partidos.php?localia=" + localia + "&id_equipo=" + encodeURIComponent(idEquipo) + "&id_categoria=" + encodeURIComponent(idCategoria);

    const response = await fetch(url);

    const respuesta = await response.json();

    console.log("Consulta de partidos:", {
        equipo: idEquipo,
        categoria: idCategoria,
        localia: localia,
        respuesta: respuesta
    });

    // El PHP devuelve status 500 cuando no encuentra partidos.
    if (
        respuesta.status === 500 ||
        respuesta.status === "500"
    ) {
        return [];
    }

    if (!response.ok) {
        throw new Error("Error HTTP: " + response.status);
    }

    if (
        respuesta.status !== 200 &&
        respuesta.status !== "200"
    ) {
        throw new Error(
            respuesta.menssage ||
            respuesta.mensaje ||
            "Error al consultar los partidos."
        );
    }

    return Array.isArray(respuesta.productos)
        ? respuesta.productos
        : [];
}


// ======================================
// CALCULAR POSICIONES
// ======================================

async function calcularPosiciones(idCategoria) {
  // Obtener todos los equipos
  const equipos = await obtenerProductos(window.API + "equipos.php");

  for (let equipo of equipos) {
    let puntos = 0;

    // PARTIDOS COMO EQUIPO A
    const partidosA = await consultarPartidos( equipo.id_equipo, idCategoria, "A", );

    for (let partido of partidosA) { puntos += calcularPuntos(partido, true); }

    // PARTIDOS COMO EQUIPO B
    const partidosB = await consultarPartidos( equipo.id_equipo, idCategoria, "B", );

    for (let partido of partidosB) {
      puntos += calcularPuntos(partido, false);
    }

    equipo.puntosTotales = puntos;
  }

  // ORDENAR DE MAYOR A MENOR
  equipos.sort(function (a, b) {
    return b.puntosTotales - a.puntosTotales;
  });

  return equipos;
}

// ======================================
// MOSTRAR POSICIONES
// ======================================

async function cargarPosiciones(idCategoria, idTabla) {
  const tbody = document.getElementById(idTabla);

  if (!tbody) {
    console.error("No se encontró la tabla:", idTabla);
    return;
  }

  tbody.innerHTML = "<tr><td colspan='3'>Calculando posiciones...</td></tr>";

  try {
    const equipos = await calcularPosiciones(idCategoria);

    tbody.innerHTML = "";

    if (equipos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='3'>No hay equipos registrados.</td></tr>";

      return;
    }

    equipos.forEach(function (equipo) {
      const fila = document.createElement("tr");

      // LOGO
      const celdaLogo = document.createElement("td");

      const imagen = document.createElement("img");

      imagen.src = window.API + "img/logos/" + equipo.logo;

      imagen.alt = "Logo de " + equipo.nombre;

      imagen.classList.add("logo-equipo" , "text-truncate");

      celdaLogo.appendChild(imagen);

      // NOMBRE
      const celdaNombre = document.createElement("td");

      celdaNombre.classList.add("align-middle");

      celdaNombre.textContent = equipo.nombre;

      // PUNTOS
      const celdaPuntos = document.createElement("td");

      celdaPuntos.classList.add("align-middle");

      celdaPuntos.textContent = equipo.puntosTotales;

      // AGREGAR COLUMNAS
      fila.appendChild(celdaLogo);
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPuntos);
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al calcular posiciones:", error);

    tbody.innerHTML = "<tr><td colspan='3'>Error al calcular las posiciones.</td></tr>";
  }
}
