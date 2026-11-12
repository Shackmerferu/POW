// ======================================
// CONSULTAR API
// ======================================

async function consultarAPI(url, opciones = {}) {

    const response = await fetch(url, opciones);

    let respuesta;

    try {
        respuesta = await response.json();
    } catch (error) {
        throw new Error("La API no devolvió una respuesta JSON válida.");
    }

    if (!response.ok) {
        throw new Error(
            respuesta.mensaje ||
            respuesta.message ||
            "Error HTTP: " + response.status
        );
    }

    if (
        respuesta.status !== undefined &&
        respuesta.status !== 200 &&
        respuesta.status !== "200"
    ) {
        throw new Error(
            respuesta.mensaje ||
            respuesta.message ||
            "Error al consultar la API."
        );
    }

    return respuesta;
}

// ======================================
// OBTENER PRODUCTOS
// ======================================

async function obtenerProductos(url) {

    const respuesta = await consultarAPI(url);

    return Array.isArray(respuesta.productos)
        ? respuesta.productos
        : [];

}