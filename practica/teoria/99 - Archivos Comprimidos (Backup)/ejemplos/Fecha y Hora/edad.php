<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php
    //con objetos
    function obtener_edad_segun_fecha($fecha_nacimiento)
    {
        $nacimiento = new DateTime($fecha_nacimiento);
        $ahora = new DateTime(date("Y-m-d"));
        $diferencia = $ahora->diff($nacimiento);
        return $diferencia->format("%y");
    }
    $fecha_nacimiento="1971-09-04";
    $anios=obtener_edad_segun_fecha($fecha_nacimiento);
    print("<p>Edad de Batman con Objetos: ".$anios."</p> ");
    
    //procedimientos

    function obtener_edad_segun_fecha2($fecha_nacimiento)
    {
        $nacimiento = date_create($fecha_nacimiento);
        $ahora = date_create(date("Y-m-d"));
        $diferencia = date_diff($ahora, $nacimiento);
        return $diferencia->format("%y");
    }
    $fecha_nacimiento="1971-09-04";
    $anios=obtener_edad_segun_fecha2($fecha_nacimiento);
    print("<p>Edad de Batman con Objetos: ".$anios."</p> ");
    ?>
</body>

</html>