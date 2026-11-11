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
                            <img src="../api/img/fotos_jugadores/${jugador.imagen}" class="card-img-top" alt="${jugador.nombre}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${jugador.nombre}</h5>
                                <p class="card-text text-muted mb-3">Apodo: ${jugador.apodo}</p>
                                
                                <button class="btn btn-outline-success btn-sm mt-auto" onclick="verDetalle(${jugador.id_jugador})" data-bs-toggle="modal" data-bs-target="#modalJugador">
                                    Ver más
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