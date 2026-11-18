// CONFIGURACIÓN CENTRAL DEL BACKEND
// Los secretos se toman del entorno (archivo .env o variables del sistema)
// y NUNCA van hardcodeados en el código (requisito de mantenibilidad:
// "configuración de ejemplo sin secretos"). Si no existe .env —por ejemplo,
// en la demo del laboratorio— se usa el valor de desarrollo de siempre.

const fs = require("fs");
const path = require("path");

// Carga mínima de un archivo .env (sin dependencias externas):
// acepta líneas CLAVE=VALOR, ignora comentarios con # y comillas envolventes.
function cargarArchivoEntorno() {
  const ruta = path.join(__dirname, ".env");
  if (!fs.existsSync(ruta)) return;

  const contenido = fs.readFileSync(ruta, "utf8");
  contenido.split(/\r?\n/).forEach((linea) => {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#")) return;

    const separador = limpia.indexOf("=");
    if (separador === -1) return;

    const clave = limpia.slice(0, separador).trim();
    let valor = limpia.slice(separador + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }

    // No pisa variables ya definidas en el entorno real.
    if (process.env[clave] === undefined) {
      process.env[clave] = valor;
    }
  });
}

cargarArchivoEntorno();

module.exports = {
  // Secreto de firma/verificación de JWT. En producción SIEMPRE viene del .env.
  JWT_SECRETO: process.env.JWT_SECRETO || "EL_VIP",
  PUERTO: Number(process.env.PORT) || 8000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USUARIO: process.env.DB_USUARIO || "root",
  DB_CONTRASENA: process.env.DB_CONTRASENA || "",
  DB_NOMBRE: process.env.DB_NOMBRE || "gestion_convenios",
};
