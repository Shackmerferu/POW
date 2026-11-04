<?php
// api/productos.php

// Iniciamos la sesión para verificar usuario, rol y token CSRF.
session_start();

// Indicamos que todas las respuestas serán JSON.
header("Content-Type: application/json; charset=UTF-8");

// Cargamos la conexión existente con MySQL.
require_once __DIR__ . "/conexion.php";

// Esta función devuelve una respuesta JSON y termina la ejecución.
function responder($status, $message, $data = null) {
    http_response_code($status);

    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Comprobamos que el usuario tenga una sesión de administrador.
function verificarAdministrador() {
    if (
        !isset($_SESSION["usuario"]["rol"]) ||
        $_SESSION["usuario"]["rol"] !== "admin"
    ) {
        responder(403, "No tenés permisos para realizar esta operación.");
    }
}

// Verificamos el token CSRF recibido desde JavaScript.
function verificarToken() {
    $tokenRecibido = $_POST["token"] ?? "";
    $tokenSesion = $_SESSION["token"] ?? "";

    if (
        $tokenSesion === "" ||
        $tokenRecibido === "" ||
        !hash_equals($tokenSesion, $tokenRecibido)
    ) {
        responder(403, "Token inválido o vencido. Recargá la página.");
    }
}

// Convertimos los campos recibidos a los tipos esperados.
function obtenerDatosProducto() {
    return [
        "nombre" => trim($_POST["nombre"] ?? ""),
        "categoria" => $_POST["categoria"] ?? "",
        "descripcion" => trim($_POST["descripcion"] ?? ""),
        "imagen" => trim($_POST["imagen"] ?? ""),
        "precio" => $_POST["precio"] ?? "",
        "stock" => $_POST["stock"] ?? ""
    ];
}

// Validamos los campos antes de insertar o modificar.
function validarProducto($p) {
    if (
        $p["nombre"] === "" ||
        $p["descripcion"] === "" ||
        $p["imagen"] === "" ||
        !in_array($p["categoria"], ["termo", "mate"], true) ||
        !is_numeric($p["precio"]) ||
        !is_numeric($p["stock"]) ||
        (float)$p["precio"] <= 0 ||
        (float)$p["stock"] < 0 ||
        (float)$p["stock"] != (int)$p["stock"]
    ) {
        responder(400, "Los datos del producto no son válidos.");
    }

    // Normalizamos los números antes de utilizarlos en SQL.
    $p["precio"] = (float)$p["precio"];
    $p["stock"] = (int)$p["stock"];

    return $p;
}

// La acción puede recibirse por GET o POST.
$accion = $_GET["action"] ?? $_POST["action"] ?? "listar";

// Elegimos la operación solicitada.
switch ($accion) {

    // CONSULTAR PRODUCTOS.
    case "listar":

        // Los clientes solo necesitan productos activos.
        // Los administradores también pueden consultar los inactivos.
        $esAdmin = isset($_SESSION["usuario"]["rol"])
            && $_SESSION["usuario"]["rol"] === "admin";

        $categoria = $_GET["categoria"] ?? "todos";

        if (!in_array($categoria, ["todos", "termo", "mate"], true)) {
            responder(400, "Categoría no válida.");
        }

        // Armamos la consulta según el rol y la categoría.
        $sql = "SELECT id, nombre, categoria, descripcion,
                       imagen, precio, stock, activo
                FROM productos
                WHERE " . ($esAdmin ? "1 = 1" : "activo = 1");

        if ($categoria !== "todos") {
            $sql .= " AND categoria = ?";
        }

        $sql .= " ORDER BY id DESC";

        $stmt = $conexion->prepare($sql);

        if (!$stmt) {
            responder(500, "No se pudo preparar la consulta.");
        }

        if ($categoria !== "todos") {
            $stmt->bind_param("s", $categoria);
        }

        if (!$stmt->execute()) {
            responder(500, "No se pudieron consultar los productos.");
        }

        $resultado = $stmt->get_result();
        $productos = [];

        while ($fila = $resultado->fetch_assoc()) {
            $fila["id"] = (int)$fila["id"];
            $fila["precio"] = (float)$fila["precio"];
            $fila["stock"] = (int)$fila["stock"];
            $fila["activo"] = (int)$fila["activo"];

            $productos[] = $fila;
        }

        $stmt->close();

        responder(200, "Productos obtenidos correctamente.", $productos);
        break;

    // INSERTAR UN PRODUCTO NUEVO.
    case "insertar":

        verificarAdministrador();
        verificarToken();

        $p = validarProducto(obtenerDatosProducto());

        $stmt = $conexion->prepare(
            "INSERT INTO productos
                (nombre, categoria, descripcion, imagen, precio, stock, activo)
             VALUES (?, ?, ?, ?, ?, ?, 1)"
        );

        if (!$stmt) {
            responder(500, "No se pudo preparar el alta del producto.");
        }

        $stmt->bind_param(
            "ssssdi",
            $p["nombre"],
            $p["categoria"],
            $p["descripcion"],
            $p["imagen"],
            $p["precio"],
            $p["stock"]
        );

        if (!$stmt->execute()) {
            responder(500, "No se pudo guardar el producto.");
        }

        $nuevoId = $conexion->insert_id;
        $stmt->close();

        responder(201, "Producto creado correctamente.", [
            "id" => $nuevoId
        ]);
        break;

    // MODIFICAR UN PRODUCTO EXISTENTE.
        case "modificar":

        verificarAdministrador();
        verificarToken();

        $id = filter_var(
            $_POST["id"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            responder(400, "El ID del producto no es válido.");
        }

        $p = validarProducto(obtenerDatosProducto());

        $stmt = $conexion->prepare(
            "UPDATE productos
             SET nombre = ?, categoria = ?, descripcion = ?,
                 imagen = ?, precio = ?, stock = ?
             WHERE id = ?"
        );

        if (!$stmt) {
            responder(500, "No se pudo preparar la modificación.");
        }

        $stmt->bind_param(
            "ssssdii",
            $p["nombre"],
            $p["categoria"],
            $p["descripcion"],
            $p["imagen"],
            $p["precio"],
            $p["stock"],
            $id
        );

        if (!$stmt->execute()) {
            responder(500, "No se pudo modificar el producto.");
        }

        if ($stmt->affected_rows === 0) {
            // Una modificación sin cambios también puede devolver 0.
            // Por eso verificamos si el producto existe.
            $stmt->close();

            $verificar = $conexion->prepare(
                "SELECT id FROM productos WHERE id = ?"
            );
            $verificar->bind_param("i", $id);
            $verificar->execute();
            $existe = $verificar->get_result()->num_rows > 0;
            $verificar->close();

            if (!$existe) {
                responder(404, "El producto no existe.");
            }
        } else {
            $stmt->close();
        }

        responder(200, "Producto modificado correctamente.");
        break;

        // Se corrige el formato de tipos para mysqli:
        // cuatro cadenas, un decimal y dos enteros.
        // mysqli no admite espacios dentro de la cadena de tipos.
        // Por eso ejecutamos la consulta con la cadena correcta.
        // La sentencia anterior se vuelve a preparar correctamente abajo.
        $stmt->close();

        $stmt = $conexion->prepare(
            "UPDATE productos
             SET nombre = ?, categoria = ?, descripcion = ?,
                 imagen = ?, precio = ?, stock = ?
             WHERE id = ?"
        );

        $stmt->bind_param(
            "ssssdii",
            $p["nombre"],
            $p["categoria"],
            $p["descripcion"],
            $p["imagen"],
            $p["precio"],
            $p["stock"],
            $id
        );

        if (!$stmt->execute()) {
            responder(500, "No se pudo modificar el producto.");
        }

        $stmt->close();

        responder(200, "Producto modificado correctamente.");
        break;

    // ELIMINAR UN PRODUCTO.
    case "borrar":

        verificarAdministrador();
        verificarToken();

        $id = filter_var(
            $_POST["id"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            responder(400, "El ID del producto no es válido.");
        }

        // Eliminación lógica: el producto deja de aparecer
        // en el catálogo, pero permanece en la base de datos.
        $stmt = $conexion->prepare(
            "UPDATE productos SET activo = 0 WHERE id = ?"
        );

        if (!$stmt) {
            responder(500, "No se pudo preparar la eliminación.");
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            responder(500, "No se pudo eliminar el producto.");
        }

        if ($stmt->affected_rows === 0) {
            $stmt->close();
            responder(404, "El producto no existe o ya está inactivo.");
        }

        $stmt->close();

        responder(200, "Producto eliminado correctamente.");
        break;

    // ACCIÓN DESCONOCIDA.
    default:
        responder(400, "La acción solicitada no existe.");
}

$conexion->close();