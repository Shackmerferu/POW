
// ======================================
// OBTENER LISTA DE REGISTROS
// ======================================

function obtenerRegistros(respuesta) {

    if (Array.isArray(respuesta.productos)) {
        return respuesta.productos;
    }

    if (Array.isArray(respuesta.equipos)) {
        return respuesta.equipos;
    }

    if (Array.isArray(respuesta.partidos)) {
        return respuesta.partidos;
    }

    if (Array.isArray(respuesta.data)) {
        return respuesta.data;
    }

    return [];
}

// ======================================
// OBTENER UN CAMPO CON DISTINTOS NOMBRES
// ======================================

function obtenerCampo(objeto, nombres) {

    for (let i = 0; i < nombres.length; i++) {

        if (objeto[nombres[i]] !== undefined &&
            objeto[nombres[i]] !== null) {

            return objeto[nombres[i]];
        }
    }

    return null;
}

// ======================================
// CONSULTAR EQUIPOS
// ======================================

async function consultarEquipos() {

    const response = await fetch(window.API + "equipos.php");

    if (!response.ok) {
        throw new Error("Error al consultar los equipos.");
    }

    const respuesta = await response.json();

    const equipos = obtenerRegistros(respuesta);

    if (equipos.length === 0) {
        throw new Error("No se encontraron equipos.");
    }

    return equipos;
}

// ======================================
// CONSULTAR PARTIDOS DE UN EQUIPO
// ======================================

async function consultarPartidos(idEquipo, idCategoria, localia) {

    const url = window.API +
        "partidos.php?localia=" + localia +
        "&id_equipo=" + encodeURIComponent(idEquipo) +
        "&id_categoria=" + idCategoria;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error al consultar los partidos.");
    }

    const respuesta = await response.json();

    return obtenerRegistros(respuesta);
}

// ======================================
// CALCULAR PUNTOS DE UN PARTIDO
// ======================================

function calcularPuntos(partido, esLocal) {

    const puntosA = Number(
        obtenerCampo(partido, ["puntos_A", "puntos_a", "puntosA"])
    );

    const puntosB = Number(
        obtenerCampo(partido, ["puntos_B", "puntos_b", "puntosB"])
    );

    const modalidad = obtenerCampo(
        partido,
        ["modalidad", "tipo_puntuacion", "tipo", "categoria_puntos"]
    );

    if (!Number.isFinite(puntosA) || !Number.isFinite(puntosB)) {
        throw new Error("Un partido no contiene los puntos A y B.");
    }

    let puntosVictoria;
    let puntosEmpate;

    if (modalidad === "C1") {
        puntosVictoria = 3;
        puntosEmpate = 1;

    } else if (modalidad === "C2") {
        puntosVictoria = 5;
        puntosEmpate = 2;

    } else {
        throw new Error(
            "No se reconoce la modalidad del partido: " + modalidad
        );
    }

    // Si el equipo es local, se compara A contra B.
    // Si es visitante, se compara B contra A.

    const puntosEquipo = esLocal ? puntosA : puntosB;
    const puntosRival = esLocal ? puntosB : puntosA;

    if (puntosEquipo > puntosRival) {
        return puntosVictoria;
    }

    if (puntosEquipo === puntosRival) {
        return puntosEmpate;
    }

    return 0;
}

// ======================================
// CALCULAR POSICIONES
// ======================================

async function calcularPosiciones(idCategoria) {

    const equipos = await consultarEquipos();

    const posiciones = [];

    for (let i = 0; i < equipos.length; i++) {

        const equipo = equipos[i];

        const idEquipo = obtenerCampo(
            equipo,
            ["id_equipo", "id"]
        );

        const nombre = obtenerCampo(
            equipo,
            ["nombre", "nombre_equipo", "equipo"]
        );

        const logo = obtenerCampo(
            equipo,
            ["logo", "imagen", "escudo"]
        );

        if (idEquipo === null) {
            continue;
        }

        // Consultar partidos como local y visitante
        const partidosLocales = await consultarPartidos(
            idEquipo,
            idCategoria,
            "A"
        );

        const partidosVisitantes = await consultarPartidos(
            idEquipo,
            idCategoria,
            "B"
        );

        let puntos = 0;

        // Recorrer partidos locales
        for (let j = 0; j < partidosLocales.length; j++) {

            puntos += calcularPuntos(partidosLocales[j], true);

        }

        // Recorrer partidos visitantes
        for (let j = 0; j < partidosVisitantes.length; j++) {

            puntos += calcularPuntos(partidosVisitantes[j], false);

        }

        posiciones.push({
            id: idEquipo,
            nombre: nombre || "Equipo sin nombre",
            logo: logo || "",
            puntos: puntos
        });

    }

    // Ordenar de mayor a menor puntaje
    posiciones.sort(function (a, b) {
        return b.puntos - a.puntos;
    });

    return posiciones;
}

// ======================================
// MOSTRAR TABLA DE POSICIONES
// ======================================

async function cargarPosiciones(idCategoria, tabla) {

    tabla.innerHTML = "<tr><td colspan='3'>Calculando posiciones...</td></tr>";

    try {

        const posiciones = await calcularPosiciones(idCategoria);

        tabla.innerHTML = "";

        if (posiciones.length === 0) {
            tabla.innerHTML =
                "<tr><td colspan='3'>No hay equipos registrados.</td></tr>";

            return;
        }

        posiciones.forEach(function (equipo, indice) {

            const fila = document.createElement("tr");

            const celdaPosicion = document.createElement("td");
            celdaPosicion.textContent = indice + 1;

            const celdaEquipo = document.createElement("td");

            if (equipo.logo) {

                const imagen = document.createElement("img");

                imagen.src = "../api/img/logos/" + equipo.logo;
                imagen.alt = "Logo de " + equipo.nombre;
                imagen.width = 40;
                imagen.classList.add("me-2");

                celdaEquipo.appendChild(imagen);

            }

            const nombre = document.createElement("span");
            nombre.textContent = equipo.nombre;

            celdaEquipo.appendChild(nombre);

            const celdaPuntos = document.createElement("td");
            celdaPuntos.textContent = equipo.puntos;

            fila.appendChild(celdaPosicion);
            fila.appendChild(celdaEquipo);
            fila.appendChild(celdaPuntos);

            tabla.appendChild(fila);

        });

    } catch (error) {

        console.error("Error al calcular posiciones:", error);

        tabla.innerHTML = "";

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 3;
        celda.textContent = error.message;

        fila.appendChild(celda);
        tabla.appendChild(fila);

    }
}
