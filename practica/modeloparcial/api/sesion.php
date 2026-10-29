<?php
session_start();

header("Content-Type: text/plain; charset=utf-8");

if (!isset($_SESSION["usuario"])) {
    echo "INVITADO";
    exit;
}

echo $_SESSION["usuario"]["rol"] . "|";
echo $_SESSION["usuario"]["nombre"];
?>