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
        <?php
        require("menu.php");
        ?>
    </div>
    
</body>
</html>