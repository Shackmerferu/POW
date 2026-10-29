<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Método no permitido");
}

$token = $_POST["token"] ?? "";

if (
    empty($_SESSION["token"]) ||
    !hash_equals($_SESSION["token"], $token)
) {
    http_response_code(403);
    exit("Token inválido.");
}

$_SESSION = [];
session_destroy();

echo "OK";
?>