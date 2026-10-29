<?php
session_start();

header("Content-Type: text/plain; charset=utf-8");

if (empty($_SESSION["usuario"]) || empty($_SESSION["token"])) {
    http_response_code(401);
    exit("No autenticado.");
}

echo $_SESSION["token"];
?>