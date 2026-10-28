<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 405,
        'mensaje' => 'Método no permitido. Utilizá POST.'
    ]);
    exit;
}

// Configuración de la base de datos.
$host = 'localhost';
$baseDatos = 'NOMBRE_DE_TU_BASE';
$usuario = 'root';
$contrasena = '';

try {
    require_once 'conexion.php';

    $pdo = new PDO(
        "mysql:host=$server_db;dbname=$base_db;charset=utf8mb4",
        $usuario_db,
        $password_db,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Recibir los datos enviados por el formulario.
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mensaje = trim($_POST['mensaje'] ?? '');

    // Validaciones.
    if ($nombre === '' || $email === '' || $mensaje === '') {
        http_response_code(400);
        echo json_encode([
            'status' => 400,
            'mensaje' => 'Todos los campos son obligatorios.'
        ]);
        exit;
    }

    if (mb_strlen($nombre) > 100) {
        http_response_code(400);
        echo json_encode([
            'status' => 400,
            'mensaje' => 'El nombre no puede superar los 100 caracteres.'
        ]);
        exit;
    }

    if (mb_strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'status' => 400,
            'mensaje' => 'El correo electrónico no es válido.'
        ]);
        exit;
    }

    if (mb_strlen($mensaje) > 5000) {
        http_response_code(400);
        echo json_encode([
            'status' => 400,
            'mensaje' => 'El mensaje no puede superar los 5000 caracteres.'
        ]);
        exit;
    }

    // Guardar el contacto con una consulta preparada.
    $sql = 'INSERT INTO contactos (nombre, email, mensaje)
            VALUES (:nombre, :email, :mensaje)';

    $consulta = $pdo->prepare($sql);

    $consulta->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':mensaje' => $mensaje
    ]);

    http_response_code(201);
    echo json_encode([
        'status' => 201,
        'mensaje' => 'Tu mensaje se guardó correctamente.',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        'status' => 500,
        'mensaje' => 'No se pudo guardar el mensaje. Intentá nuevamente.'
    ]);
}
?>