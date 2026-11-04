
<?php

// Inicia o recupera la sesión actual.
// Permite acceder a los datos guardados en $_SESSION.
session_start();

// VERIFICAR EL MÉTODO HTTP.

// Comprueba que la solicitud se haya enviado mediante POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    // Devuelve el código HTTP 405: método no permitido.
    http_response_code(405);

    // Muestra el mensaje y detiene la ejecución.
    exit("Método no permitido");
}

// VALIDAR EL TOKEN DE SEGURIDAD.

// Obtiene el token enviado por el cliente mediante POST.
// Si no se envió, utiliza una cadena vacía.
$token = $_POST["token"] ?? "";

// Comprueba que exista un token en la sesión
// y que coincida con el recibido.
// Esto ayuda a prevenir solicitudes maliciosas (CSRF).
if (
    empty($_SESSION["token"]) ||
    !hash_equals($_SESSION["token"], $token)
) {

    // Devuelve el código HTTP 403: acceso prohibido.
    http_response_code(403);

    // Finaliza el script si el token no es válido.
    exit("Token inválido.");
}

// CERRAR LA SESIÓN.

// Elimina todos los datos almacenados en la sesión actual.
// Por ejemplo: el usuario autenticado y el token.
$_SESSION = [];

// Destruye los datos de la sesión almacenados en el servidor.
// A partir de aquí, la sesión actual deja de estar activa.
session_destroy();

// Informa al cliente que el cierre de sesión fue exitoso.
echo "OK";

?>
