<?php
// Le avisamos al navegador que le vamos a responder en formato JSON
header('Content-Type: application/json');

// Conexión a la base de datos de XAMPP (usuario 'root', sin contraseña)
$conexion = new mysqli("localhost", "root", "", "tienda_examen");

// Verificamos si el fetch nos mandó el 'user' y el 'pass' por la URL
if (isset($_GET['user']) && isset($_GET['pass'])) {
    
    $usuarioLlegado = $_GET['user'];
    $claveLlegada = $_GET['pass'];

    // Buscamos en la base de datos si existe alguien con esos datos exactos
    $query = "SELECT * FROM usuarios WHERE usuario = '$usuarioLlegado' AND clave = '$claveLlegada'";
    $resultado = $conexion->query($query);

    // Si encontró 1 fila, el login es correcto
    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        
        // Armamos el paquete JSON de ÉXITO (status 200) y le mandamos el token
        echo json_encode([
            "status" => 200, 
            "mensaje" => "Login correcto", 
            "token" => $fila['token']
        ]);
    } else {
        // Armamos el paquete JSON de ERROR (status 401)
        echo json_encode([
            "status" => 401, 
            "mensaje" => "Usuario o contraseña incorrectos"
        ]);
    }

} else {
    // Si entraron al PHP sin mandar datos
    echo json_encode(["status" => 400, "mensaje" => "Faltan enviar credenciales"]);
}
?>