<?php
session_start();
session_destroy();
header("Location: index.php?mensaje=Gracias por su visita");
?>