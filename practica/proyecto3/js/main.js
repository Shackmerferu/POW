document.addEventListener('DOMContentLoaded', () => {
    const contenedorLogueo = document.getElementById('logueo');
    const contenedorNav = document.getElementById('navDesplegable');
    const btnIniciar = document.getElementById('btnIniciar');
    const btnRegistrar = document.getElementById('btnRegistrar');

    const ejecutarSustitucion = () => {
        contenedorLogueo.classList.remove('d-flex');
        contenedorLogueo.classList.add('d-none');
        
        contenedorNav.classList.remove('d-none');
        contenedorNav.classList.add('d-flex');
    };

    btnIniciar.addEventListener('click', ejecutarSustitucion);
    btnRegistrar.addEventListener('click', ejecutarSustitucion);
});