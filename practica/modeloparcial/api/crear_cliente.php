
<?php
require_once __DIR__ . "/conexion.php";

$nombre = "Cliente Demo";
$email = "cliente@termstore.com";
$password = "Cliente123!";
$rol = "cliente";

// Verificar si el correo ya existe.
$stmt = $conexion->prepare(
    "SELECT id FROM usuarios WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    exit("El usuario cliente ya existe.");
}

$stmt->close();

// Generar un hash compatible con password_verify().
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

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

if ($stmt->execute()) {
    echo "Usuario cliente creado correctamente.";
} else {
    http_response_code(500);
    echo "Error al crear el usuario.";
}

$stmt->close();
$conexion->close();
?>
