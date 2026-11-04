
<?php

// Incluye el archivo que establece la conexión con la base de datos.
require_once "conexion.php";

// Define el nombre del administrador.
$nombre = "Administrador";

// Define su correo electrónico.
// Se utiliza como identificador para iniciar sesión.
$email = "admin@termostore.com";

// Genera un hash seguro de la contraseña.
// No guarda la contraseña original en la base de datos.
// PASSWORD_DEFAULT utiliza el algoritmo de hash recomendado por PHP.
$password = password_hash("Admin123!", PASSWORD_DEFAULT);

// Define el rol del usuario.
// La aplicación puede utilizarlo para controlar los permisos.
$rol = "admin";

// Prepara la consulta SQL para insertar un nuevo usuario.
// Los signos ? son parámetros que se completarán después.
// Esto ayuda a evitar inyecciones SQL.
$stmt = $conexion->prepare(
    "INSERT INTO usuarios (nombre, email, password, rol)
     VALUES (?, ?, ?, ?)"
);

// Asocia las variables con los cuatro parámetros.
// "ssss" indica que los cuatro valores son cadenas de texto.
$stmt->bind_param("ssss", $nombre, $email, $password, $rol);

// Ejecuta la consulta INSERT.
if ($stmt->execute()) {

    // Si la inserción fue exitosa, muestra un mensaje.
    // Luego de utilizarlo, hay que eliminar este archivo del servidor.
    echo "Administrador creado. Eliminá este archivo.";

} else {

    // Si la consulta falla, muestra un mensaje de error.
    // Puede ocurrir, por ejemplo, si el email ya existe.
    echo "No se pudo crear. Verificá si el usuario ya existe.";
}

// Cierra la consulta preparada.
$stmt->close();

// Cierra la conexión con la base de datos.
$conexion->close();

?>