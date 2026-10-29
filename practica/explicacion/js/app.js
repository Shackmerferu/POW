// ==========================================
// 0. CONFIGURACIÓN INICIAL
// ==========================================

console.log("¡El archivo app.js está enchufado!");
// console: Es la consola oculta del navegador (se abre con F12).
// .log(): Es la orden para "imprimir un registro" ahí adentro. 
// "texto": Lo que va entre comillas es el mensaje literal que va a aparecer.

const pantallaLogin = document.getElementById('pantalla-login');
const pantallaSistema = document.getElementById('pantalla-sistema');
// const: Crea una caja en la memoria de la compu que NUNCA va a cambiar de contenido (una Constante).
// pantallaLogin: Es el nombre inventado que le damos a esa caja.
// = : Significa "guardá lo que está a la derecha, adentro de la caja de la izquierda".
// document: Representa a TODO tu archivo HTML entero. Es el puente entre JS y HTML.
// .getElementById('...'): Es la orden que le dice al document: "Buscá la etiqueta que tenga exactamente este ID".


// ==========================================
// 1. LÓGICA DE INICIO DE SESIÓN
// ==========================================

document.getElementById('btn-ingresar').addEventListener('click', () => {
// document.getElementById('btn-ingresar'): Busca el botón de login en el HTML.
// .addEventListener: Le "enchufa" un sensor que se queda esperando que pase algo.
// ('click', : Le dice al sensor que específicamente espere el clic del mouse.
// () => { : Se llama "Función Flecha". Significa: "Cuando escuches el clic, arrancá a ejecutar todo el código que está adentro de las llaves { }".

    let user = document.getElementById('usuario').value;
    let pass = document.getElementById('clave').value;
    // let: Crea una caja en la memoria que SÍ puede cambiar (una Variable). 
    // .value: Va a la cajita de texto del HTML y "se roba" lo que el usuario tipeó en ese preciso segundo.

    if (!user || !pass) {
    // if: Significa "SI pasa esto...". Evalúa una condición.
    // !user: El signo de exclamación (!) significa "NO". Acá dice "Si NO hay usuario" (si está vacío).
    // ||: Son dos barritas verticales que significan "O".
    // !pass: "Si NO hay contraseña".
    // Todo junto: "Si la caja de usuario está vacía O la caja de contraseña está vacía..."

        alert("Completá los campos por favor");
        // alert(): Hace saltar el cartelito molesto del navegador con un mensaje.

        return; 
        // return: Significa "Cortá todo acá". Frena la ejecución y evita que el código siga leyendo hacia abajo.
    }

    fetch(`api/login.php?user=${user}&pass=${pass}`)
    // fetch(): Es nuestro "cadete" que va a internet o al servidor local (XAMPP).
    // `...` : Las comillas invertidas permiten mezclar texto fijo con variables matemáticas o de texto.
    // ${user}: Le dice a JS "agarrá el valor de la variable user que guardamos arriba y metelo acá".

    .then(res => res.json())
    // .then(): Significa "Y ENTONCES...". Espera a que el cadete vuelva del servidor.
    // res: Es el paquete cerrado que trajo el cadete (viene de "Response" o respuesta).
    // => res.json(): Pasa ese paquete por el traductor JSON para convertirlo de texto crudo a un Objeto de JavaScript ordenado.

    .then(datos => {
    // .then(datos => { : Significa "Y ENTONCES, ahora que el paquete está abierto y traducido, llamalo 'datos' y abrí las llaves { } para trabajar con él".

        if (datos.status === 200) {
        // datos.status: Entra al objeto 'datos' y busca una propiedad llamada 'status' (que programó el profe en el PHP).
        // === : Es una comparación estricta. Pregunta "Es EXACTAMENTE IGUAL a...?"
        // 200: En la web, el código 200 significa "Todo OK / Éxito".

            sessionStorage.setItem('miTokenVIP', datos.token);
            // sessionStorage: Es un cajón de memoria del navegador que dura hasta que el usuario cierra la pestaña.
            // .setItem(): Ordena "guardar un ítem".
            // 'miTokenVIP': Es el nombre de la etiqueta que le pegamos al ítem para encontrarlo después.
            // datos.token: Es el código secreto (la pulsera VIP) que vino de la base de datos.

            pantallaLogin.classList.add('d-none');
            // pantallaLogin: Es la constante que creamos al principio de todo el archivo.
            // .classList: Entra a la lista de clases de Bootstrap que tiene ese HTML.
            // .add('d-none'): Le agrega la clase "display: none". Básicamente, apaga la luz y oculta el login.

            pantallaSistema.classList.remove('d-none');
            // .remove('d-none'): Le arranca la clase de ocultamiento. Prende la luz y muestra la tienda.

        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});


// ==========================================
// 2. LÓGICA USANDO EL TOKEN
// ==========================================

document.getElementById('btn-ver-termos').addEventListener('click', () => {
// Vuelve a buscar un botón y le pone un sensor de clic.

    let tokenGuardado = sessionStorage.getItem('miTokenVIP');
    // .getItem('miTokenVIP'): Va al cajón de memoria del navegador, busca la etiqueta que guardamos antes, y saca el código secreto.
    // let tokenGuardado = : Guarda ese código en esta variable nueva para usarlo ahora.

    fetch('api/termos.php?action=listar', {
    // El fetch arranca igual, mandando al cadete a la ruta. PERO...
    // , { : La coma abre un espacio de "Configuraciones extra" para el envío.

        headers: {
        // headers: Son las cabeceras. Es como el remito o el sobre de la carta.
            'Authorization': tokenGuardado
            // 'Authorization': Es la palabra estándar mundial para identificarse.
            // : tokenGuardado: Le pegamos el código VIP en el remito para que el profe (API) lo lea.
        }
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.status === 200) {
            
            document.getElementById('resultados').innerHTML = "¡Exito!";
            // .innerHTML: Va adentro de la caja <div> vacía y le inyecta directamente el texto o código HTML que pongas a la derecha del igual.

        } else {
            alert("No tenés permiso.");
        }
    });
});


// ==========================================
// 3. LÓGICA DE CERRAR SESIÓN
// ==========================================

document.getElementById('btn-salir').addEventListener('click', () => {

    sessionStorage.removeItem('miTokenVIP');
    // .removeItem('...'): Va al cajón de la memoria del navegador y DESTRUYE el token. Ya no existe más.

    document.getElementById('usuario').value = "";
    document.getElementById('clave').value = "";
    // .value = "": Al poner dos comillas vacías sin nada adentro, estamos limpiando las cajas de texto (borrando lo que tipeó el usuario) por seguridad.

    document.getElementById('resultados').innerHTML = ""; 
    // .innerHTML = "": Borramos la tabla de termos que habíamos dibujado, dejando la caja blanca.

    pantallaSistema.classList.add('d-none');
    pantallaLogin.classList.remove('d-none');
    // Volvemos a ocultar el sistema y a mostrar la pantallita de login.
});