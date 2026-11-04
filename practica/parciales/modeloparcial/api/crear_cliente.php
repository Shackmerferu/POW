```php
<?php

// Incluye el archivo de conexión a la base de datos.
// __DIR__ representa la carpeta donde se encuentra este archivo.
require_once __DIR__ . "/conexion.php";

// Define los datos del cliente que se va a crear.
$nombre = "Cliente Demo";
$email = "cliente@termstore.com";

// Contraseña en texto plano.
// Se convertirá en un hash antes de guardarla en la base de datos.
$password = "Cliente123!";

// Define el rol del usuario dentro del sistema.
$rol = "cliente";

// VERIFICAR SI EL CORREO YA EXISTE.

// Prepara una consulta para buscar un usuario con ese email.
// El signo ? será reemplazado por el valor asociado posteriormente.
$stmt = $conexion->prepare(
    "SELECT id FROM usuarios WHERE email = ?"
);

// Asocia el email al parámetro ?.
// La letra "s" indica que el valor es una cadena de texto.
$stmt->bind_param("s", $email);

// Ejecuta la consulta SELECT.
$stmt->execute();

// Recupera el resultado de la consulta.
$resultado = $stmt->get_result();

// Comprueba si se encontró al menos un usuario con ese email.
if ($resultado->num_rows > 0) {

    // Si el correo ya existe, finaliza el script
    // y muestra un mensaje para evitar duplicar el usuario.
    exit("El usuario cliente ya existe.");
}

// Cierra la consulta de verificación.
$stmt->close();

// GENERAR EL HASH DE LA CONTRASEÑA.

// Convierte la contraseña original en un hash seguro.
// PASSWORD_DEFAULT utiliza el algoritmo recomendado por PHP.
// Este hash puede verificarse posteriormente con password_verify().
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// PREPARAR LA INSERCIÓN DEL USUARIO.

// Prepara una consulta SQL para insertar al cliente
// en la tabla usuarios.
$stmt = $conexion->prepare(
    "INSERT INTO usuarios (nombre, email, password, rol)
     VALUES (?, ?, ?, ?)"
);

// Asocia los cuatro datos a los parámetros de la consulta.
// "ssss" indica que todos los valores son cadenas de texto.
// Se guarda $passwordHash, no la contraseña original.
$stmt->bind_param(
    "ssss",
    $nombre,
    $email,
    $passwordHash,
    $rol
);

// EJECUTAR LA INSERCIÓN.

// Intenta insertar el nuevo usuario en la base de datos.
if ($stmt->execute()) {

    // Si la inserción fue exitosa, informa al usuario.
    echo "Usuario cliente creado correctamente.";

} else {

    // Si ocurre un error, responde con el código HTTP 500
    // (error interno del servidor).
    http_response_code(500);

    // Muestra un mensaje genérico sin revelar detalles internos.
    echo "Error al crear el usuario.";
}

// Cierra la consulta preparada.
$stmt->close();

// Cierra la conexión con la base de datos.
$conexion->close();

?>
```