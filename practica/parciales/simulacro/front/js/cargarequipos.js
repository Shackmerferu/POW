// Le ponemos 'async' para habilitar el botón de pausa ('await') adentro
async function cargarequipos(idCategoria, idTabla, modalidad = 'C1') {
    
    // Agarramos la tabla del HTML
    const tbody = document.getElementById(idTabla);
    
    // Le clavamos un mensajito temporal al usuario para que sepa que está cargando
    tbody.innerHTML = "<tr><td colspan='3' class='text-center'>Calculando puntos...</td></tr>";

    try {
        // ==========================================
        // PASO 1: TRAER LOS EQUIPOS
        // ==========================================
        
        // AWAIT: "Frená acá hasta que equipos.php nos devuelva los datos"
        let respuestaEquipos = await fetch('../api/equipos.php');
        let datosEquipos = await respuestaEquipos.json();
        
        // EL TRUCO DEL OR (||): 
        // A veces el profe manda la lista pelada, a veces la mete adentro de "productos" o "equipos".
        // Con esto le decimos: "Si existe datosEquipos.productos usá eso, SINO (||) usá .equipos, SINO usá los datos pelados".
        // Así no se rompe nunca.
        let listaEquipos = datosEquipos.productos || datosEquipos.equipos || datosEquipos;

        // Creamos un cajón vacío. Acá vamos a ir metiendo los equipos una vez que les hayamos calculado los puntos.
        let equiposTerminados = [];


        // ==========================================
        // PASO 2: RECORRER EQUIPO POR EQUIPO
        // ==========================================
        
        // Este for agarra al primer equipo (ej: La Tania) y no pasa al siguiente hasta terminar todo el bloque
        for (let equipo of listaEquipos) {
            
            // Creamos la variable puntos en 0 para este equipo en particular
            let puntos = 0; 
            
            // Configuramos cuánto vale ganar o empatar según si pasamos 'C1' o 'C2'
            let ptsGanado = (modalidad === 'C2') ? 5 : 3;
            let ptsEmpate = (modalidad === 'C2') ? 2 : 1;


            // --- A) BUSCAMOS LOS PARTIDOS DONDE JUGÓ DE LOCAL ---
            
            // AWAIT: "Frená acá y traeme solo los partidos donde localia es A, de este equipo y esta categoría"
            let respuestaLocal = await fetch(`../api/partidos.php?localia=A&id_equipo=${equipo.id_equipo}&id_categoria=${idCategoria}`);
            let datosLocal = await respuestaLocal.json();
            let partidosLocal = datosLocal.productos || datosLocal.partidos || datosLocal || [];

            // Recorremos esos partidos de local que nos trajo
            for (let partido of partidosLocal) {
                if (partido.puntos_A > partido.puntos_B) {
                    puntos += ptsGanado; // Como es local, sus puntos son los A. Si A es mayor a B, ganó.
                } else if (partido.puntos_A == partido.puntos_B) {
                    puntos += ptsEmpate; // Si son iguales, empató.
                }
            }


            // --- B) BUSCAMOS LOS PARTIDOS DONDE JUGÓ DE VISITANTE ---
            
            // AWAIT: Hacemos exactamente lo mismo, pero le pedimos a la API los de localia B
            let respuestaVisitante = await fetch(`../api/partidos.php?localia=B&id_equipo=${equipo.id_equipo}&id_categoria=${idCategoria}`);
            let datosVisitante = await respuestaVisitante.json();
            let partidosVisitante = datosVisitante.productos || datosVisitante.partidos || datosVisitante || [];

            // Recorremos los de visitante
            for (let partido of partidosVisitante) {
                if (partido.puntos_B > partido.puntos_A) {
                    puntos += ptsGanado; // Como es visitante, sus puntos son los B. Si B es mayor a A, ganó.
                } else if (partido.puntos_B == partido.puntos_A) {
                    puntos += ptsEmpate; // Empató.
                }
            }


            // --- C) GUARDAMOS EL RESULTADO ---
            
            // Le inventamos una propiedad nueva al objeto 'equipo' llamada 'puntosTotales' y le metemos el número final
            equipo.puntosTotales = puntos;
            
            // Agarramos a este equipo (que ahora ya tiene su puntaje) y lo empujamos (push) al cajón vacío que creamos al principio
            equiposTerminados.push(equipo);
            
        } // Acá termina el for. Si quedan más equipos en la lista, vuelve arriba y arranca con el siguiente.


        // ==========================================
        // PASO 3: ORDENAR LA TABLA (Posiciones)
        // ==========================================
        
        // Cuando el for terminó de procesar a TODOS los equipos, usamos .sort() para ordenarlos
        // Le pasamos 'b - a' para que los ordene de Mayor a Menor según la propiedad 'puntosTotales' que acabamos de inventar
        equiposTerminados.sort(function(a, b) {
            return b.puntosTotales - a.puntosTotales;
        });


        // ==========================================
        // PASO 4: DIBUJAR EN EL HTML
        // ==========================================
        
        // Borramos el mensajito de "Calculando puntos..."
        tbody.innerHTML = "";
        
        // Recorremos nuestro cajón de equiposTerminados (que ya están con sus puntos y ordenados) y dibujamos las filas
        for (let equipo of equiposTerminados) {
            tbody.innerHTML += `
                <tr>
                    <td>
                        <img src="../api/img/logos/${equipo.logo}" alt="Escudo" style="width: 40px; height: 40px; object-fit: contain;">
                    </td>
                    <td class="align-middle fw-bold">${equipo.nombre}</td>
                    <td class="align-middle fw-bold text-success fs-5">${equipo.puntosTotales}</td>
                </tr>
            `;
        }

    } catch (error) {
        // Si el fetch falla (ej: se cae el XAMPP), salta directo acá y no rompe toda la página
        console.error("Error cargando equipos:", error);
    }
}