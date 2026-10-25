<?PHP
   //unset($_COOKIE['webtaller']);
    if(isset($_COOKIE['webtaller'])) {

        $_COOKIE['webtaller']++;
        //setcookie("webtaller",$_COOKIE['webtaller'],time()+30*24*60*60);
		setcookie("webtaller",$_COOKIE['webtaller'],time()+3600);
		print($_COOKIE['webtaller']);

    } else {

        setcookie("webtaller",1,time()+3600);
		//setcookie("webtaller",1,time()+30*24*60*60);

    }
	
	
?>


