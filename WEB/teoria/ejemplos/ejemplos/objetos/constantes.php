<!DOCTYPE html>
<html>
<body>

<?php
class Goodbye {
  const LEAVING_MESSAGE = "Gracias a ti!";
  public function byebye() {
    echo self::LEAVING_MESSAGE;
  }
}

$goodbye = new Goodbye();
$goodbye->byebye();
?>

</body>
</html>