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

@media (min-width: 600px) {
  .pantalla {
    border-inline: 1px solid #f1f1f1;
  }
}
