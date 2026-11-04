<ul class="nav">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="home.php">Inicio</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="noticias.php">Noticias</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="usuarios.php">Usuarios</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="logout.php">Salir</a>
            </li>
            <li class="nav-item">
                <?php 
                       print("<a class='nav-link disabled'>".$_SESSION['nombre']." ".$_SESSION['apellido']."</a>");
                ?>
            </li>
        </ul>