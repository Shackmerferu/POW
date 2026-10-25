<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php
    date_default_timezone_set("Europe/Madrid");
    print "<p>" . date("d-m-Y h:i:s A") . "</p>\n";
    date_default_timezone_set("America/Argentina/cordoba");
    print "<p>" . date("d-m-Y h:i:s A") . "</p>\n";
    ?>
</body>

</html>