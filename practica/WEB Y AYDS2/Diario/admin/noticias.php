<?php
 session_start();
    if(!isset($_SESSION['usuario'])){
        header("Location: index.php");
    }
    
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="..\lib\Boostrap\css\bootstrap.css" rel="stylesheet">
    <script></script>
</head>
<body>
    <div class="container">
        <h1>Noticias</h1>
        <?php
        require("menu.php");
        ?>
    </div>
    <div>
        <table class="table table-striped">
            <tr>
                <th>titulo</th>
                <th>copete</th>
                <th>editar</th>
                <th>borrar</th>
            </tr>

        <?php
        require("conexion.php");
        $conexion = mysqli_connect($server_db,$user_db,$pass_db,$base_db) or die("Error en la conexion a la base de datos");
        $instruccion = "SELECT * FROM noticias";
        $consulta = mysqli_query($conexion, $instruccion) or die("Error en la consulta de noticias");
        $nfilas = mysqli_num_rows($consulta);
        for($i =  0 ; $i < $nfilas; $i++){
            $resultado = mysqli_fetch_array($consulta);
            print("<tr>
                <td>".$resultado['titulo']."</td>
                <td>".$resultado['copete']."</td>
                <td><a href='editar_noticia.php?id=".$resultado['id']."' class='btn btn-primary btn-sm'>Editar</a></td>
                <td><a href='borrar_noticia.php?id=".$resultado['id']."' class='btn btn-danger btn-sm'>Borrar</a></td>
            </tr>");
        }
        mysqli_close($conexion);
        ?>
        </table>
    </div>
    
</body>
</html>