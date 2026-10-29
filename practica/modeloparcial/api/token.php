<?php

// Inicia o recupera la sesión actual.
// Permite acceder a los datos almacenados en $_SESSION.
session_start();

// Indica que la respuesta será texto plano codificado en UTF-8.
header("Content-Type: text/plain; charset=utf-8");

// Comprueba si falta el usuario o el token de seguridad.
// empty() devuelve true si el valor no existe o está vacío.
if (empty($_SESSION["usuario"]) || empty($_SESSION["token"])) {

    // Indica que la solicitud no está autenticada.
    http_response_code(401);

    // Devuelve un mensaje de error y detiene la ejecución.
    exit("No autenticado.");
}

// Si hay usuario y token, devuelve el token CSRF.
// JavaScript puede recibirlo y enviarlo en futuras solicitudes.
echo $_SESSION["token"];

?>