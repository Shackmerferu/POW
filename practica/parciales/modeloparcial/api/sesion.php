<?php

// Inicia o recupera la sesión actual.
// Permite acceder a los datos guardados en $_SESSION.
session_start();

// Indica que la respuesta será texto plano codificado en UTF-8.
header("Content-Type: text/plain; charset=utf-8");

// VERIFICAR SI HAY UN USUARIO AUTENTICADO.

// Comprueba si existe la información del usuario en la sesión.
if (!isset($_SESSION["usuario"])) {

    // Si no hay un usuario autenticado, devuelve "INVITADO".
    echo "INVITADO";

    // Finaliza el script para evitar ejecutar las instrucciones siguientes.
    exit;
}

// DEVOLVER LOS DATOS DEL USUARIO.

// Devuelve el rol del usuario y agrega el separador "|".
// Ejemplo: admin|
echo $_SESSION["usuario"]["rol"] . "|";

// Devuelve el nombre del usuario.
// Ejemplo: Administrador
echo $_SESSION["usuario"]["nombre"];

?>