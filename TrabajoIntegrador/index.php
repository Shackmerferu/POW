<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Facultad de Ingeniería</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
    rel="stylesheet"
  >

  <style>
    :root {
      --azul: #0e5d98;
      --borde: #938989;
      --sombra: 0 4px 4px rgb(0 0 0 / 15%);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: #000;
      background: #fff;
      font-family: "Open Sans", sans-serif;
    }

    /* Navegación de muestra, fuera de las pantallas originales. */
    .navegacion {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .navegacion a {
      padding: 6px 10px;
      color: var(--azul);
      font-size: 13px;
      text-decoration: none;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .pantalla {
      position: relative;
      display: none;
      width: min(100%, 412px);
      min-height: 917px;
      margin-inline: auto;
      overflow: hidden;
      background: #fff;
    }

    #portada {
      display: block;
    }

    .pantalla:target {
      display: block;
    }

    body:has(.pantalla:target) #portada:not(:target) {
      display: none;
    }

    .logo {
      position: absolute;
      left: 50%;
      width: 220px;
      height: auto;
      object-fit: contain;
      transform: translateX(-50%);
    }

    .pie {
      position: absolute;
      top: 868px;
      left: 0;
      width: 100%;
      margin: 0;
      text-align: center;
      font-size: 14px;
      line-height: 19px;
    }

    .boton {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      padding: 0 12px;
      color: #fff;
      background: var(--azul);
      border: 0;
      border-radius: 16px;
      box-shadow: var(--sombra);
      font: 600 16px "Open Sans", sans-serif;
      text-decoration: none;
      cursor: pointer;
    }

    input {
      display: block;
      width: 100%;
      height: 50px;
      padding: 10px 12px;
      color: #000;
      background: #fff;
      border: 1px solid var(--borde);
      border-radius: 8px;
      box-shadow: var(--sombra);
      font: 15px "Open Sans", sans-serif;
    }

    a:focus-visible,
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid #77b8e6;
      outline-offset: 4px;
    }

    /* 1. Portada */
    #portada .logo {
      top: 256px;
    }

    /* 2. Opciones de ingreso */
    #inicio .logo {
      top: 94px;
      width: 250px;
    }

    .opciones-ingreso {
      position: absolute;
      top: 260px;
      left: 6.31%;
      right: 6.31%;
      display: grid;
      gap: 26px;
    }

    /* 3. Inicio de sesión */
    #sesion .logo {
      top: 89px;
      width: 220px;
    }

    .bienvenida {
      position: absolute;
      top: 180px;
      left: 10%;
      width: 80%;
      margin: 0;
      color: #575757;
      text-align: center;
      font-size: 14px;
      line-height: 19px;
      font-weight: 400;
    }

    .credenciales,
    .ayuda-sesion {
      position: absolute;
      left: 7.52%;
      right: 7.52%;
    }

    .credenciales {
      top: 245px;
    }

    .campo {
      display: block;
      margin: 0 0 13px;
    }

    .campo span {
      display: block;
      margin-bottom: 13px;
      font-size: 15px;
      line-height: 20px;
    }

    .ayuda-sesion {
      top: 470px;
      font-size: 15px;
      line-height: 20px;
    }

    .ayuda-sesion p {
      margin: 0 0 19px;
    }

    .enlace {
      color: var(--azul);
      text-decoration: none;
    }

    #sesion .conectar {
      position: absolute;
      top: 565px;
      left: 7.52%;
      width: 84.96%;
    }

    /* 4. Listado de consensos */
    .cabecera-consensos {
      position: absolute;
      top: 54px;
      left: 10.92%;
      right: 4.13%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .cabecera-consensos h1 {
      margin: 0;
      font-size: 24px;
      line-height: 33px;
      font-weight: 400;
    }

    .buscar {
      position: relative;
      display: block;
      width: 39px;
      height: 39px;
      color: #000;
    }

    .buscar::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 27px;
      height: 27px;
      border: 2px solid currentColor;
      border-radius: 50%;
    }

    .buscar::after {
      content: "";
      position: absolute;
      top: 28px;
      left: 28px;
      width: 13px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      transform-origin: left center;
    }

    .tarjetas {
      position: absolute;
      top: 123px;
      left: 10.92%;
      right: 8.98%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 26px 30px;
    }

    .tarjeta {
      height: 200px;
      background: #fff;
      border: 1px solid var(--borde);
      border-radius: 8px;
      box-shadow: var(--sombra);
    }

    /* 5. Búsqueda de consenso */
    #busqueda .logo {
      top: 20px;
      left: auto;
      right: 20px;
      width: 100px;
      height: auto;
      transform: none;
    }

    #busqueda h1 {
      position: absolute;
      top: 90px;
      left: 8%;
      margin: 0;
      font-size: 15px;
      line-height: 20px;
      font-weight: 400;
    }

    .filtros {
      position: absolute;
      top: 145px;
      left: 7.28%;
      right: 7.77%;
    }

    @media (min-width: 600px) {
      .pantalla {
        border-inline: 1px solid #f1f1f1;
      }
    }
  </style>
</head>

<body>
  <!-- Este menú permite revisar las cinco pantallas. -->
  <nav class="navegacion" aria-label="Pantallas del proyecto">
    <a href="#portada">Portada</a>
    <a href="#inicio">Ingreso</a>
    <a href="#sesion">Iniciar sesión</a>
    <a href="#consensos">Consensos</a>
    <a href="#busqueda">Búsqueda</a>
  </nav>

  <main>
    <!-- Pantalla 1 -->
    <section
      id="portada"
      class="pantalla"
      aria-label="Portada de la Facultad de Ingeniería"
    >
      <img
        class="logo"
        src="imagenes/logo.png"
        alt="Facultad de Ingeniería"
        width="160"
        height="210"
      >
      <footer class="pie"> 2026 © Copyright</footer>
    </section>

    <!-- Pantalla 2 -->
    <section id="inicio" class="pantalla" aria-label="Opciones de ingreso">
      <img
        class="logo"
        src="imagenes/logo.png"
        alt="Facultad de Ingeniería"
        width="160"
        height="210"
      >

      <div class="opciones-ingreso">
        <a class="boton" href="#sesion">Iniciar sesion</a>
        <a class="boton" href="#consensos">Ingresar como invitado</a>
      </div>

      <footer class="pie">Grupo 3 | 2026 © Copyright</footer>
    </section>

    <!-- Pantalla 3 -->
    <section id="sesion" class="pantalla" aria-label="Inicio de sesión">
      <img
        class="logo"
        src="imagenes/logo.png"
        alt="Facultad de Ingeniería"
        width="160"
        height="210"
      >

      <h1 class="bienvenida">
        Bienvenido , por favor ingresa tus<br>
        credenciales de usuario
      </h1>

      <form class="credenciales" id="form-sesion">
        <label class="campo">
          <span>Legajo</span>
          <input
            name="legajo"
            type="text"
            autocomplete="username"
            required
          >
        </label>

        <label class="campo">
          <span>Contraseña</span>
          <input
            name="contrasena"
            type="password"
            autocomplete="current-password"
            required
          >
        </label>
      </form>

      <div class="ayuda-sesion">
        <p>
          Problemas para iniciar sesion?
          <!-- Agregar aquí la dirección de soporte real. -->
          <span class="enlace">Click Aqui</span>
        </p>
        <!-- Agregar aquí la dirección de recuperación real. -->
        <span class="enlace">Olvidaste tu contraseña?</span>
      </div>

      <!-- Presentación visual: requiere conectar la autenticación. -->
      <button class="boton conectar" type="button">
        Conectarse
      </button>

      <footer class="pie">Grupo 3 | 2026 © Copyright</footer>
    </section>

    <!-- Pantalla 4 -->
    <section id="consensos" class="pantalla" aria-labelledby="titulo-consensos">
      <header class="cabecera-consensos">
        <h1 id="titulo-consensos">Concensos</h1>
        <a
          class="buscar"
          href="#busqueda"
          aria-label="Buscar consenso"
        ></a>
      </header>

      <!-- Las seis tarjetas visibles están vacías en el diseño. -->
      <div class="tarjetas" aria-label="Tarjetas sin contenido">
        <div class="tarjeta"></div>
        <div class="tarjeta"></div>
        <div class="tarjeta"></div>
        <div class="tarjeta"></div>
        <div class="tarjeta"></div>
        <div class="tarjeta"></div>
      </div>

      <footer class="pie">Grupo 3 | 2026 © Copyright</footer>
    </section>

    <!-- Pantalla 5 -->
    <section id="busqueda" class="pantalla" aria-labelledby="titulo-busqueda">
      <img
        class="logo"
        src="imagenes/logo.png"
        alt="Facultad de Ingeniería"
        width="50"
        height="66"
      >

      <h1 id="titulo-busqueda">Busqueda Consenso</h1>

      <div class="filtros" role="search" aria-label="Filtros de consenso">
        <label class="campo">
          <span>Nombre</span>
          <input name="nombre" type="search">
        </label>

        <label class="campo">
          <span>Numero</span>
          <input name="numero" type="text" inputmode="numeric">
        </label>

        <label class="campo">
          <span>Año</span>
          <input name="anio" type="text" inputmode="numeric" maxlength="4">
        </label>

        <label class="campo">
          <span>Tipo</span>
          <input name="tipo" type="text">
        </label>
      </div>

      <footer class="pie">Grupo 3 | 2026 © Copyright</footer>
    </section>
  </main>
</body>
</html>
