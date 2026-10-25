<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    
    <?php

    setlocale(LC_TIME, "spanish");
    print "<p>" . strftime("Ejemplo 1: %A, %d de %B de %Y") . "</p>\n";


    setlocale(LC_TIME, "english");
    print "<p>" . strftime("Ejemplo 1: %A, %d de %B de %Y") . "</p>\n";

    setlocale(LC_TIME, "C");
    echo strftime("%A");
    //setlocale(LC_TIME, "french");
    setlocale(LC_TIME, "fr_FR");
    echo strftime(" en Frances es %A,");
    //setlocale(LC_TIME, "it_IT");
    setlocale(LC_TIME, "Italian");
    echo strftime(" en Ilaliano %A y");
    setlocale(LC_TIME, "de_DE");
    echo strftime(" en alemán %A.\n");
    ?>


</body>

</html>