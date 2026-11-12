// ==========================================
// 1. EL "PATOVICA" (Seguridad en el Panel)
// ==========================================
function controlarSeguridad() {
    // Revisamos el bolsillo del navegador
    const token = localStorage.getItem('mi_token_termos');

    // Si no hay token, lo devolvemos al index de una patada
    if (!token) {
        window.location.href = 'index.html';
    }
}

// Llamamos a la seguridad obligatoriamente al abrir la página
controlarSeguridad();


// ==========================================
// 2. PUNTO EXTRA: CERRAR SESIÓN CON CONFIRMACIÓN
// ==========================================
// Vinculamos la acción al ID que le pusiste a tu botón rojo en el HTML
document.getElementById('btn-salir').addEventListener('click', function() {
    
    // El confirm frena la pantalla y devuelve true o false
    const confirmacion = confirm("¿Estás seguro que deseás cerrar la sesión del sistema?");
    
    if (confirmacion) {
        // Borramos el token de la memoria
        localStorage.removeItem('mi_token_termos');
        
        // Lo mandamos al inicio
        window.location.href = 'index.html';
    }
});
// ==========================================
// 3. CATÁLOGO DE TERMOS Y ORDENAMIENTO
// ==========================================
async function cargarTermos() {
    const contenedor = document.getElementById('resultados');
    // Prendemos los termos y apagamos las personas
    contenedor.classList.remove('d-none');
    document.getElementById('pantalla-personas').classList.add('d-none');
    contenedor.innerHTML = '<p class="text-center text-muted mt-3">Cargando catálogo...</p>';

    // 1. Sacamos el token que guardamos en el login
    const token = localStorage.getItem('mi_token_termos');

    try {
        // 2. Le pegamos a la API mandando el token por la URL (como exige el PDF)
        const respuesta = await fetch(`api/listar_productos.php?token=${token}`);
        const datos = await respuesta.json();

console.log("DATOS CRUDOS DE LA API:", datos);

        // Si el token es inválido o expiró, la API nos patea
        if (datos.error) {
            alert("Sesión expirada o inválida.");
            localStorage.removeItem('mi_token_termos');
            window.location.href = 'index.html';
            return;
        }

        // Atajamos la lista de termos (si viene pelada o adentro de "productos")
   let listaTermos = datos.data;

        // 3. LA TRAMPA DEL PDF: Ordenar alfabéticamente por título
        listaTermos.sort(function(a, b) {
            // localeCompare es la forma oficial de JavaScript para ordenar textos de la A a la Z
            return a.titulo.localeCompare(b.titulo);
        });

        // 4. Dibujamos las tarjetas en el HTML
        contenedor.innerHTML = ""; 
        
        listaTermos.forEach(termo => {
            // Armamos una tarjeta horizontal (imagen a la izquierda, texto a la derecha)
            contenedor.innerHTML += `
                <div class="card flex-row shadow-sm mb-3 border-0">
                    <!-- OJO: El PDF pide explícitamente usar title y alt de la base de datos -->
                    <img src="api/imagenes/${termo.imagen}" 
                         class="card-img-left rounded-start" 
                         alt="${termo.texto_alternativo}" 
                         title="${termo.titulo_imagen}" 
                         style="width: 200px; object-fit: cover; cursor: pointer;"
                         onclick="abrirModalImagen('${termo.imagen}', '${termo.titulo}')">
                    
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${termo.titulo}</h5>
                        <p class="card-text text-muted">${termo.descripcion}</p>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar los termos:", error);
        contenedor.innerHTML = '<p class="text-danger text-center">Error al conectar con la base de datos.</p>';
    }
}


// Vinculamos la función al botón verde "Ver Catálogo"
document.getElementById('btn-ver-termos').addEventListener('click', cargarTermos);
// ==========================================
// NAVEGACIÓN ENTRE SECCIONES (Los interruptores de luz)
// ==========================================
document.getElementById('btn-alta').addEventListener('click', function() {
    // Apagamos la luz de la caja de termos (le agregamos d-none)
    document.getElementById('resultados').classList.add('d-none');
    
    // Prendemos la luz de la caja de personas (le sacamos el d-none)
    document.getElementById('pantalla-personas').classList.remove('d-none');
});

function abrirModalImagen(imagen, titulo) {
    // Inyectamos el título y la ruta de la foto que tocaste
    document.getElementById('modal-termo-titulo').innerText = titulo;
    document.getElementById('modal-termo-img').src = `api/imagenes/${imagen}`;
    
    // Disparamos el modal usando la herramienta nativa de Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modalTermo'));
    modal.show();
}
// ==========================================
// 5. BÚSQUEDA BINARIA Y REGISTRO DE PERSONAS
// ==========================================

// PUNTO EXTRA: Cargar el select de ciudades apenas entramos
async function cargarCiudades() {
    try {
        const respuesta = await fetch('api/ciudades.php');
        const datos = await respuesta.json();
        
        // Supongamos que la lista viene en datos.data o suelta
        let ciudades = datos.data || datos.ciudades || datos; 
        const selectCiudad = document.getElementById('form-ciudad');

        ciudades.forEach(ciudad => {
            selectCiudad.innerHTML += `<option value="${ciudad.id_localidad}">${ciudad.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error al cargar ciudades:", error);
    }
}
// Llamamos a la función para que el select ya esté listo
cargarCiudades();


// EL ALGORITMO FILTRO: Búsqueda Binaria
async function buscarDni() {
    const dniBuscado = parseInt(document.getElementById('input-dni').value);
    if (!dniBuscado) return alert("Por favor ingresá un DNI");

    try {
        // 1. Preguntamos cuántas personas hay en total
        const resCantidad = await fetch('api/personas_cantidad.php');
        const datosCantidad = await resCantidad.json();
        const totalPersonas = datosCantidad.cantidad || datosCantidad.data;

        // 2. Preparamos las variables para la búsqueda binaria
        let min = 1;
        let max = totalPersonas;
        let encontrado = false;
        let personaEncontrada = null;

        // 3. Empieza la magia de partir a la mitad
        while (min <= max && !encontrado) {
            let medio = Math.floor((min + max) / 2); // Calcula la mitad exacta

            // Consultamos la persona que está justo en la mitad
            const resPersona = await fetch(`api/personas_listar.php?id=${medio}`);
            const datosPersona = await resPersona.json();
            
            // Atajamos los datos (ajustá ".data" si el profe usó otra palabra)
            let persona = datosPersona.data ? datosPersona.data[0] : datosPersona;

            let dniActual = parseInt(persona.dni);

            if (dniActual === dniBuscado) {
                // ¡Lo encontramos!
                encontrado = true;
                personaEncontrada = persona;
            } else if (dniActual < dniBuscado) {
                // Si el DNI de la mitad es MENOR, descartamos la mitad de abajo
                min = medio + 1;
            } else {
                // Si es MAYOR, descartamos la mitad de arriba
                max = medio - 1;
            }
        }

        // 4. Mostramos el formulario según el resultado
        document.getElementById('formulario-persona').classList.remove('d-none');
        document.getElementById('form-dni').value = dniBuscado;

        if (encontrado) {
            // ACTUALIZAR (El DNI ya existía)
            document.getElementById('titulo-form-persona').innerText = "Modificar Persona";
            document.getElementById('titulo-form-persona').classList.replace('text-success', 'text-warning');
            // Escondemos el ID en el input del DNI usando un atributo de datos (dataset)
document.getElementById('form-dni').dataset.id = personaEncontrada.id;
            
            // Llenamos los datos para que edite
            document.getElementById('form-nombre').value = personaEncontrada.nombre;
            document.getElementById('form-apellido').value = personaEncontrada.apellido;
            // Seleccionamos su ciudad en el select
            document.getElementById('form-ciudad').value = personaEncontrada.ciudad; 
        } else {
            // ALTA NUEVA (El DNI no existía)
            document.getElementById('titulo-form-persona').innerText = "Registrar Persona";
            document.getElementById('titulo-form-persona').classList.replace('text-warning', 'text-success');
            
            // Vaciamos los campos
            document.getElementById('form-nombre').value = "";
            document.getElementById('form-apellido').value = "";
            document.getElementById('form-ciudad').value = "";
        }

    } catch (error) {
        console.error("Error en la búsqueda binaria:", error);
    }
}

// Vinculamos el botón de consultar
document.getElementById('btn-buscar-dni').addEventListener('click', buscarDni);

// ==========================================
// 6. GUARDAR O EDITAR PERSONA
// ==========================================
async function guardarPersona() {
    // 1. Agarramos los datos que escribió el usuario en los inputs
    const dni = document.getElementById('form-dni').value;
    const nombre = document.getElementById('form-nombre').value;
    const apellido = document.getElementById('form-apellido').value;
    const ciudad = document.getElementById('form-ciudad').value;
    const provincia = 5; // La Pampa siempre es 5 según el PDF
    
    // (Nota: agregá los document.getElementById de dirección, email y teléfono según tu HTML)
    const direccion = "Calle Falsa 123"; // Reemplazá con tu input
    const email = "test@test.com"; // Reemplazá con tu input
    const telefono = "12345678"; // Reemplazá con tu input

    // Validación rápida para que no mande datos vacíos
    if (!nombre || !apellido || !ciudad) {
        return alert("Por favor, completá todos los campos.");
    }

    // 2. Nos fijamos qué dice el título del formulario para saber si estamos Creando o Editando
    const tituloFormulario = document.getElementById('titulo-form-persona').innerText;
    let urlApi = "";

    if (tituloFormulario === "Modificar Persona") {
        // --- MODO EDICIÓN ---
        // Para editar, el PDF exige mandar el ID, no el DNI. 
        // Asumimos que guardamos ese ID en algún lado (te muestro cómo abajo)
        const idPersona = document.getElementById('form-dni').dataset.id; 
        
        urlApi = `api/personas_guardar_editar.php?id=${idPersona}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&ciudad=${ciudad}&provincia=${provincia}&email=${email}&telefono=${telefono}`;
    } else {
        // --- MODO ALTA NUEVA ---
        // Para alta nueva mandamos el DNI
        urlApi = `api/personas_guardar.php?dni=${dni}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&ciudad=${ciudad}&provincia=${provincia}&email=${email}&telefono=${telefono}`;
    }

    try {
        // 3. Hacemos la petición a la API
        const respuesta = await fetch(urlApi);
        const resultado = await respuesta.json(); // Depende de qué devuelva tu API al guardar

        // 4. Mostramos el mensaje de éxito exacto que pide el PDF
        if (tituloFormulario === "Modificar Persona") {
            alert(`Los datos de ${nombre} ${apellido} fueron actualizados`);
        } else {
            alert(`La persona ${nombre} ${apellido} fue dada de alta con éxito`);
        }

        // Opcional: Ocultar el formulario o limpiarlo después de guardar
        document.getElementById('formulario-persona').classList.add('d-none');
        document.getElementById('input-dni').value = ""; // Limpiamos el buscador

    } catch (error) {
        console.error("Error al guardar la persona:", error);
        alert("Hubo un error al intentar guardar los datos.");
    }
}

// Enchufamos el botón de guardar
document.getElementById('btn-guardar-persona').addEventListener('click', guardarPersona);