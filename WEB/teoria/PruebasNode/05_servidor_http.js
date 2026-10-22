// Ejercicio 5: Servidor HTTP con rutas básicas
// Implementar GET /, GET /api/cursos y una respuesta 404.


const http = require("node:http");


const cursos = [
  { id: 1, nombre: "Programación Orientada a la Web" },
  { id: 2, nombre: "Diseño de Interfaces de Usuario" }
];


const servidor = http.createServer((req, res) => {
   res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end(JSON.stringify({ mensaje: "Servidor Node.js en funcionamiento" }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/cursos") {
    res.statusCode = 200;
    res.end(JSON.stringify(cursos));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});


servidor.listen(3000, "127.0.0.1", () => {
  console.log("Servidor disponible en http://127.0.0.1:3000");
});