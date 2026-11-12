// Atrapamos el botón por el ID que le pusiste en tu HTML
document.getElementById('btn-ingresar').addEventListener('click', async function(event) {
    // Frenamos la recarga de la página
    event.preventDefault();

    // 1. Agarramos lo que el usuario tipeó en tus inputs
    const usuarioIngresado = document.getElementById('usuario').value;
    const claveIngresada = document.getElementById('clave').value;

    try {
        // 2. Le pegamos a la API de login (ajustá la ruta a tu XAMPP)
        // El PDF aclara que espera recibir usuario y password por la URL
       const respuesta = await fetch(`api/login.php?usuario=${usuarioIngresado}&password=${claveIngresada}`);
        const datos = await respuesta.json();

        // 3. Verificamos qué nos contestó el PHP
        if (datos.token) {
            // ÉXITO: Guardamos el token en la memoria del navegador
            localStorage.setItem('mi_token_termos', datos.token);
            
            // REDIRECCIÓN: Lo mandamos al panel como pide el PDF
            window.location.href = 'panel.html';
        } else {
            // ERROR: La API nos devolvió un error (usuario o clave mal)
            alert("Acceso denegado: Usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Falló la conexión con la API de login:", error);
    }
});

// "Auto-login": Si el usuario entra al index pero ya tiene el token guardado, lo pateamos directo al panel
if (localStorage.getItem('mi_token_termos')) {
    window.location.href = 'panel.html';
}