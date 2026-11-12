
// ======================================
// ELEMENTOS HTML
// ======================================

const listaJugadoresMasc = document.getElementById(
    "lista-jugadores-masc"
);

// ======================================
// CARGAR JUGADORES MASCULINOS
// ======================================

async function cargarJugadoresMasc() {

    listaJugadoresMasc.textContent = "Cargando jugadores...";

    try {

        const jugadores = await consultarJugadores(1);

        mostrarJugadores(jugadores, listaJugadoresMasc);

    } catch (error) {

        console.error("Error al cargar jugadores masculinos:", error);

        listaJugadoresMasc.textContent = error.message;

    }
}

// ======================================
// INICIAR
// ======================================

cargarJugadoresMasc();

cargarPosiciones(
    1,
    document.getElementById("tabla-posiciones-masc")
);
