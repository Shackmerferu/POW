
// ======================================
// ELEMENTOS HTML
// ======================================

const listaJugadoresFem = document.getElementById(
    "lista-jugadores-fem"
);

// ======================================
// CARGAR JUGADORAS FEMENINAS
// ======================================

async function cargarJugadorasFem() {

    listaJugadoresFem.textContent = "Cargando jugadoras...";

    try {

        const jugadoras = await consultarJugadores(3);

        mostrarJugadores(jugadoras, listaJugadoresFem);

    } catch (error) {

        console.error("Error al cargar jugadoras:", error);

        listaJugadoresFem.textContent = error.message;

    }
}

// ======================================
// INICIAR
// ======================================

cargarJugadorasFem();

cargarPosiciones(
    3,
    document.getElementById("tabla-posiciones-fem")
);
