<?php
    session_start();
    if(isset($_SESSION['usuario'])){
        header("Location: control.php");
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
        <div class="row">
            <div class="col-md-4 offset-md-4" style="margin-top:20px;">
                <h1>LoginIn</h1>
                <form action="login.php" method="POST">
                    <div class="form-group">
                        <label for="usuario">Usuario</label>
                        <input type="text" class="form-control" name="usuario" placeholder="Ingrese su usuario">
                    </div>
                    <div class="form-group">
                        <label for="usuario">Password</label>
                        <input type="text" class="form-control" name="password" placeholder="Ingrese su password">
                    </div>
                    <button type="submit" class="btn btn-primary">Entrar al sistema</button>
                </form>
            </div>
            <?php
                if(isset($_REQUEST['mensaje'])){
                    $mensaje = $_REQUEST['mensaje'];
                    echo "<div class='col-md-4 offset-md-4' style='margin-top:20px;'>";
                    echo "<div class='alert alert-info'>$mensaje</div>";
                    echo "</div>";
                }
            ?>
    </div>
</body>
</html>