<?php

if(isset($_COOKIE['webtaller'])) {
	$_COOKIE['webtaller']++;	setcookie("webtaller",$_COOKIE['webtaller'],time()+30*24*60*60);
} else {
	setcookie("webtaller",1,time()+30*24*60*60);
}
print($_COOKIE['webtaller']);

unset($_COOKIE['webtaller']);
setcookie("webtaller","",time()+30*24*60*60);

?>