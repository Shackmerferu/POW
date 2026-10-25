// Ejercicio 4: Lectura y escritura de JSON
// Leer actividades.json, agregar dos actividades y guardar el resultado.


const fs = require("node:fs/promises");
const path = require("node:path");


const rutaArchivo = path.join(__dirname, "actividades.json");


async function ejecutar() {
  try {
    // TODO: leer y parsear el archivo.
    // Si no existe (código ENOENT), empezar con un arreglo vacío.
    const actividades = [];


    // TODO: agregar dos actividades con id y titulo.
    // TODO: guardar usando JSON.stringify(actividades, null, 2).
    // TODO: mostrar las actividades y la cantidad.
  } catch (error) {
    console.error("Ocurrió un error:", error.message);
  }
}


ejecutar();