<?php

header('Content-Type: application/json; charset=utf-8');

// Reutilizar la conexión existente a la base de datos.
require_once __DIR__ . "/conexion.php";

// Asegurarse de que la API reciba datos mediante POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => 405,
        "message" => "Método no permitido."
    ]);
    exit;
}

// Obtener los datos enviados desde el formulario.
$nombre = trim($_POST["nombre"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

// Validar que los campos obligatorios estén completos.
if ($nombre === "" || $email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "status" => 400,
        "message" => "Todos los campos son obligatorios."
    ]);
    exit;
}

// Validar el formato del correo electrónico.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => 400,
        "message" => "El correo electrónico no es válido."
    ]);
    exit;
}

// Definir el rol desde el servidor para evitar que el usuario lo elija.
$rol = "cliente";

// Comprobar si ya existe una cuenta con ese correo.
$stmt = $conexion->prepare(
    "SELECT id FROM usuarios WHERE email = ?"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $stmt->close();

    http_response_code(409);
    echo json_encode([
        "status" => 409,
        "message" => "El correo electrónico ya está registrado."
    ]);
    exit;
}

$stmt->close();

// Generar el hash antes de guardar la contraseña.
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Preparar la inserción del nuevo usuario.
$stmt = $conexion->prepare(
    "INSERT INTO usuarios (nombre, email, password, rol)
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssss",
    $nombre,
    $email,
    $passwordHash,
    $rol
);

// Ejecutar el registro y responder a la API.
if ($stmt->execute()) {
    http_response_code(201);

    echo json_encode([
        "status" => 201,
        "message" => "Usuario registrado correctamente."
    ]);
} else {
    http_response_code(500);

    echo json_encode([
        "status" => 500,
        "message" => "Error al registrar el usuario."
    ]);
}

// Liberar los recursos utilizados.
$stmt->close();
$conexion->close();

?>