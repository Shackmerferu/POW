// Definimos la función que recibe el número de categoría (1 o 3) y el ID del <div> donde van las cartas
function cargarJugadores(idCategoria, idContenedor) {
    
    // 1. Apuntamos al contenedor vacío en tu HTML
    const contenedor = document.getElementById(idContenedor);
    
    // 2. EL FETCH: Acá conectamos con tu PHP. 
    // Usamos las comillas invertidas (backticks ` `) para poder inyectar la variable ${idCategoria} en la URL
    fetch(`../api/jugadores.php?id_categoria=${idCategoria}`)
    
        // 3. El PHP nos devuelve un texto raro. Esta línea lo traduce a un formato que JavaScript entiende (JSON)
        .then(respuesta => respuesta.json())
        
        // 4. Acá ya tenemos la lista de jugadores lista para usar en la variable "datos"
        .then(datos => {
            
            // Vaciamos el contenedor por si había jugadores viejos cargados
            contenedor.innerHTML = "";
            
            // 5. Recorremos la lista y por cada jugador armamos la carta
            datos.productos.forEach(jugador => {
                contenedor.innerHTML += `
                    <div class="col-6 col-md-3 mb-4">
                        <div class="card h-100 shadow-sm text-center">
                            <!-- Inyectamos la foto y el nombre que vinieron del PHP -->
                            <img src="../api/img/fotos_jugadores/${jugador.imagen}" class="card-img-top" alt="${jugador.nombre}"
                                style="height: 250px; width: 100%; object-fit: cover; object-position: top;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${jugador.nombre}</h5>
                                <p class="card-text text-muted mb-3">Apodo: ${jugador.apodo}</p>
                                
                                <button class="btn btn-outline-success btn-sm mt-auto" onclick="verDetalle(${jugador.id_jugador})" data-bs-toggle="modal" data-bs-target="#modalJugador">
                                    Ver mas
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        
        // 6. Por si el servidor se cae o escribiste mal la ruta
        .catch(error => console.error("Error al cargar jugadores:", error));
}
async function verDetalle(idJugador) {
    try {
        // 1. Buscamos la info específica del jugador
        let resJugador = await fetch(`../api/jugadores.php?id_jugador=${idJugador}`);
        let datosJugador = await resJugador.json();
        
        // Atajamos el objeto jugador (ajustá ".productos[0]" según cómo devuelva el JSON tu API)
        let jugador = datosJugador.productos ? datosJugador.productos[0] : datosJugador[0];

        // Rellenamos el HTML del modal
        document.getElementById('modal-nombre').innerText = jugador.nombre;
        document.getElementById('modal-apodo').innerText = `Apodo: ${jugador.apodo}`;
        document.getElementById('modal-biografia').innerText = jugador.biografia || "Sin biografía disponible.";
        document.getElementById('modal-foto').src = `../api/img/fotos_jugadores/${jugador.imagen}`;

        // 2. Buscamos su trayectoria usando su DNI
        let dniJugador = jugador.dni;
        let resPalmares = await fetch(`../api/palmares_listar.php?dni=${dniJugador}`);
        let datosPalmares = await resPalmares.json();
        
        let listaPalmares = datosPalmares.productos || datosPalmares.palmares || datosPalmares || [];
        
        // Rellenamos la tabla de trayectoria
        const tbodyTrayectoria = document.getElementById('modal-trayectoria');
        tbodyTrayectoria.innerHTML = ""; // Limpiamos por si había datos de otro jugador

        if (listaPalmares.length > 0) {
            for (let item of listaPalmares) {
                tbodyTrayectoria.innerHTML += `
                    <tr>
                        <td class="fw-bold">${item.anio || 'S/F'}</td>
                        <td>${item.detalle}</td>
                    </tr>
                `;
            }
        } else {
            tbodyTrayectoria.innerHTML = "<tr><td colspan='2' class='text-center'>Sin trayectoria registrada</td></tr>";
        }

    } catch (error) {
        console.error("Error al cargar detalles del jugador:", error);
    }
}