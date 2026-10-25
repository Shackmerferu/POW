<HTML>
<HEAD>
</HEAD>
<BODY>
<?php
// get contents of a file into a string
$filename = 'test.txt';
$handle = fopen ($filename, "r");
$contents = fread ($handle, filesize ($filename));
$contents = fgets ($handle);
print "El contenido del archivo es
<p> 

$contents";
fclose ($handle);
?>


</BODY>
</HTML>