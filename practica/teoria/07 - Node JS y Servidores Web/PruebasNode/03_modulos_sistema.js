// Ejercicio 3: Módulos nativos de Node.js
// Mostrar datos del sistema y analizar una ruta usando node:os y node:path.


const os = require("node:os");
const path = require("node:path");


const rutaArchivo = path.join("materiales", "clase", "node.js");


console.log("=== Información del entorno ===");
console.log("Sistema operativo: " + os.platform());
console.log("Arquitectura: " + os.arch());
console.log("Versión de Node.js: " + process.version);


// TODO: mostrar el nombre del archivo con path.basename().
// TODO: mostrar la extensión con path.extname().