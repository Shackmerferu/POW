
<?php

// Inicia o recupera la sesión del usuario.
// Permite leer y guardar información en $_SESSION.
session_start();

// Incluye el archivo que establece la conexión con la base de datos.
require_once "conexion.php";

// VERIFICAR EL MÉTODO HTTP.

// Comprueba que la solicitud se haya enviado mediante POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    // Devuelve el código HTTP 405: método no permitido.
    http_response_code(405);

    // Muestra el mensaje y finaliza el script.
    exit("Método no permitido");
}

// OBTENER LOS DATOS DEL FORMULARIO.

// Obtiene el correo electrónico y elimina los espacios
// al principio y al final.
$email = trim($_POST["email"] ?? "");

// Obtiene la contraseña.
// No se usa trim() porque los espacios pueden formar parte
// de una contraseña válida.
$password = $_POST["password"] ?? "";

// BUSCAR AL USUARIO EN LA BASE DE DATOS.

// Prepara una consulta que busca al usuario por su email.
// Solo recupera los campos necesarios para iniciar sesión.
$stmt = $conexion->prepare(
    "SELECT id, nombre, email, password, rol
     FROM usuarios
     WHERE email = ?"
);

// Vincula el email con el parámetro ?.
// La letra "s" indica que el parámetro es una cadena.
$stmt->bind_param("s", $email);

// Ejecuta la consulta SQL.
$stmt->execute();

// Obtiene el resultado de la consulta.
$resultado = $stmt->get_result();

// Recupera la primera fila como un array asociativo.
// Si no se encuentra ningún usuario, devuelve null.
$usuario = $resultado->fetch_assoc();

// VERIFICAR LAS CREDENCIALES.

// Comprueba dos condiciones:
// 1. Que el usuario exista.
// 2. Que la contraseña ingresada coincida con su hash almacenado.
//
// password_verify() compara la contraseña original
// con el hash generado previamente mediante password_hash().
if (!$usuario || !password_verify($password, $usuario["password"])) {

    // Devuelve el código HTTP 401: credenciales no válidas.
    http_response_code(401);

    // Utiliza el mismo mensaje para ambos errores,
    // evitando revelar si un correo está registrado.
    exit("Correo o contraseña incorrectos.");
}

// RENOVAR EL IDENTIFICADOR DE SESIÓN.

// Genera un nuevo identificador de sesión y elimina
// el identificador anterior del servidor.
// Ayuda a prevenir ataques de fijación de sesión.
session_regenerate_id(true);

// GUARDAR LOS DATOS DEL USUARIO EN LA SESIÓN.

// Almacena los datos necesarios para reconocer al usuario
// durante las siguientes solicitudes.
$_SESSION["usuario"] = [
    "id" => $usuario["id"],         // Identificador del usuario.
    "nombre" => $usuario["nombre"], // Nombre para mostrar en pantalla.
    "email" => $usuario["email"],   // Correo electrónico.
    "rol" => $usuario["rol"]        // Rol: por ejemplo, admin o cliente.
];

// GENERAR EL TOKEN DE SEGURIDAD.

// Genera 32 bytes aleatorios y los convierte en hexadecimal.
// El resultado es un token que puede utilizarse para validar
// solicitudes posteriores y ayudar a prevenir ataques CSRF.
$_SESSION["token"] = bin2hex(random_bytes(32));

// RESPONDER AL CLIENTE.

// Informa que el inicio de sesión fue exitoso.
echo "OK";

?>
