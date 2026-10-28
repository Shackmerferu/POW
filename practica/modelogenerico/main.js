document.addEventListener('DOMContentLoaded', () => {
    
    const API_URL = 'http://localhost/facultad/POW/practica/modelogenerico/api/almacen_api.php';

    const alertContainer = document.getElementById('alertContainer');
    const demoForm = document.getElementById('demoForm');
    
    const btnReset = document.getElementById('btnReset');
    const btnSuccess = document.getElementById('btnSuccess');
    const btnWarning = document.getElementById('btnWarning');
    const btnDanger = document.getElementById('btnDanger');
    const btnInfo = document.getElementById('btnInfo');

    const btnAlta = document.getElementById('btnAlta');
    const btnBaja = document.getElementById('btnBaja');
    const btnMostrar = document.getElementById('btnMostrar');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnBorrar = document.getElementById('btnBorrar');

    const contentArea = document.createElement('div');
    contentArea.id = "dynamicContentArea";
    contentArea.className = "mt-4 w-100";
    document.querySelector('.d-flex.flex-wrap.gap-2.mt-3').after(contentArea);

    function buildAlert(type, message, iconClass, boldText = null) {
        alertContainer.innerHTML = '';
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-shadow`;
        alertDiv.setAttribute('role', 'alert');

        const icon = document.createElement('i');
        icon.className = `fa-solid ${iconClass} me-2`;
        alertDiv.appendChild(icon);

        if (boldText) {
            const strong = document.createElement('strong');
            strong.textContent = boldText;
            alertDiv.appendChild(strong);
            alertDiv.appendChild(document.createTextNode(' '));
        }

        alertDiv.appendChild(document.createTextNode(message));

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close');
        
        closeBtn.addEventListener('click', () => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150); 
        });
        
        alertDiv.appendChild(closeBtn);
        alertContainer.appendChild(alertDiv);
    }

    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const categorySelect = document.getElementById('categorySelect');
        const selectedValue = categorySelect.options[categorySelect.selectedIndex].text;
        buildAlert('success', `Categoría seleccionada: ${selectedValue}.`, 'fa-circle-check', '¡Formulario procesado con éxito!');
    });

    btnReset.addEventListener('click', () => {
        demoForm.reset();
        buildAlert('secondary', 'Formulario restablecido.', 'fa-info-circle');
    });

    btnSuccess.addEventListener('click', () => buildAlert('success', 'Acción completada exitosamente.', 'fa-circle-check'));
    btnWarning.addEventListener('click', () => buildAlert('warning', 'Atención: Revise la información introducida.', 'fa-triangle-exclamation'));
    btnDanger.addEventListener('click', () => buildAlert('danger', 'Registro eliminado o acción cancelada.', 'fa-trash'));
    btnInfo.addEventListener('click', () => buildAlert('info', 'Información adicional sobre el proceso.', 'fa-circle-info'));

    const getFormValues = () => {
        return {
            codigo: document.getElementById('inputCodigo')?.value,
            cantidad: parseInt(document.getElementById('inputCantidad')?.value),
            precio: parseFloat(document.getElementById('inputPrecio')?.value)
        };
    };

    btnMostrar.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}?action=listar`);
            const data = await response.json();
            
            if(data.status === 200 && data.productos) {
                const sortedProducts = data.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                let tableHTML = `
                    <table class="table table-sm table-striped table-hover mt-3 border custom-shadow">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Cant</th>
                                <th>Precio $</th>
                                <th>Cant mínima</th>
                                <th>Valor $$</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                sortedProducts.forEach(prod => {
                    const valorTotal = parseInt(prod.cantidad) * parseFloat(prod.precio_costo);
                    tableHTML += `
                        <tr>
                            <td>${prod.codigo}</td>
                            <td>${prod.nombre}</td>
                            <td>${prod.cantidad}</td>
                            <td>${prod.precio_costo}</td>
                            <td>${prod.cantidad_minima}</td>
                            <td>${valorTotal}</td>
                        </tr>
                    `;
                });
                tableHTML += `</tbody></table>`;
                contentArea.innerHTML = tableHTML;
                buildAlert('info', 'Tabla de productos renderizada.', 'fa-list');
            } else {
                buildAlert('danger', 'Error al cargar los productos de la API.', 'fa-circle-xmark');
            }
        } catch (error) {
            buildAlert('danger', 'Error de conexión con el servidor local.', 'fa-plug-circle-xmark');
        }
    });

    btnBaja.addEventListener('click', async () => {
        const { codigo, cantidad } = getFormValues();

        if(!codigo || codigo <= 0 || !cantidad || cantidad <= 0) {
            buildAlert('warning', 'Ingrese un código y cantidad válidos (positivos) en el formulario[cite: 20].', 'fa-triangle-exclamation');
            return;
        }

        try {
            const getResp = await fetch(`${API_URL}?action=listar&codigo=${codigo}`);
            const getData = await getResp.json();

            if (getData.status === 200 && getData.productos && getData.productos.length > 0) {
                const producto = getData.productos[0];
                const cantidadActual = parseInt(producto.cantidad);

                if (cantidad > cantidadActual) {
                    buildAlert('danger', `La cantidad a retirar es superior al Stock (${cantidadActual})[cite: 21].`, 'fa-circle-xmark');
                    return;
                }

                const nuevaCantidad = cantidadActual - cantidad;
                const updateResp = await fetch(`${API_URL}?action=modificar&codigo=${codigo}&nombre=${producto.nombre}&cantidad=${nuevaCantidad}&precio_costo=${producto.precio_costo}&cantidad_minima=${producto.cantidad_minima}`);
                const updateData = await updateResp.json();

                if(updateData.status === 200) {
                    buildAlert('success', 'Stock actualizado (Baja registrada)[cite: 21].', 'fa-check-double');
                } else {
                    buildAlert('danger', updateData.menssage || "Error de actualización.", 'fa-circle-xmark');
                }
            } else {
                buildAlert('warning', 'Código Inexistente[cite: 20].', 'fa-magnifying-glass-minus');
            }
        } catch (error) {
             buildAlert('danger', 'Error de red al ejecutar Baja.', 'fa-plug-circle-xmark');
        }
    });

    btnAlta.addEventListener('click', async () => {
        const { codigo, cantidad, precio } = getFormValues();

        if(!codigo || codigo <= 0 || !cantidad || cantidad <= 0 || !precio || precio <= 0) {
             buildAlert('warning', 'Código, cantidad y precio deben ser valores numéricos positivos[cite: 21].', 'fa-triangle-exclamation');
             return;
        }

        try {
            const getResp = await fetch(`${API_URL}?action=listar&codigo=${codigo}`);
            const getData = await getResp.json();

            if (getData.status === 200 && getData.productos && getData.productos.length > 0) {
                 const prod = getData.productos[0];
                 const cantidadAnterior = parseInt(prod.cantidad);
                 const precioAnterior = parseFloat(prod.precio_costo);

                 const totalValorAnterior = cantidadAnterior * precioAnterior;
                 const totalValorNuevo = cantidad * precio;
                 const nuevaCantidad = cantidadAnterior + cantidad;
                 const nuevoPrecioPonderado = (totalValorAnterior + totalValorNuevo) / nuevaCantidad;

                 const updateResp = await fetch(`${API_URL}?action=modificar&codigo=${codigo}&nombre=${prod.nombre}&cantidad=${nuevaCantidad}&precio_costo=${nuevoPrecioPonderado}&cantidad_minima=${prod.cantidad_minima}`);
                 const updateData = await updateResp.json();

                 if(updateData.status === 200) {
                    buildAlert('success', 'Stock actualizado (Alta registrada mediante PPP)[cite: 22].', 'fa-check-double');
                 } else {
                    buildAlert('danger', updateData.menssage || "Fallo en la actualización.", 'fa-circle-xmark');
                 }
            } else {
                buildAlert('warning', 'Código Inexistente.', 'fa-magnifying-glass-minus');
            }
        } catch(e) {
             buildAlert('danger', 'Error de red al ejecutar Alta.', 'fa-plug-circle-xmark');
        }
    });

    btnBorrar.addEventListener('click', async () => {
         const { codigo } = getFormValues();
         if(!codigo || codigo <= 0) {
             buildAlert('warning', 'Requiere código válido en el formulario para procesar la baja.', 'fa-triangle-exclamation');
             return;
         }

         try {
             const resp = await fetch(`${API_URL}?action=borrar&codigo=${codigo}`);
             const data = await resp.json();
             
             if(data.status === 200) {
                 buildAlert('success', 'Registro eliminado de la base de datos[cite: 23].', 'fa-trash');
                 contentArea.innerHTML = '';
             } else {
                 buildAlert('danger', 'Error en la petición de borrado.', 'fa-circle-xmark');
             }
         } catch(e) {
             buildAlert('danger', 'Falla de conectividad con la API.', 'fa-plug-circle-xmark');
         }
    });
    
btnStockBajo.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}?action=listar`);
            const data = await response.json();
            
            if(data.status === 200 && data.productos) {
                // Filtrar productos donde cantidad <= cantidad_minima[cite: 27]
                const productosFiltrados = data.productos.filter(p => parseInt(p.cantidad) < parseInt(p.cantidad_minima));
                
                let tableHTML = `
                    <div class="alert alert-warning border border-warning fw-bold text-dark mt-3">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i> Productos por debajo de la cantidad mínima
                    </div>
                    <table class="table table-sm table-striped table-hover border custom-shadow">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Cant</th>
                                <th>Precio $</th>
                                <th>Cant mínima</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                productosFiltrados.forEach(prod => {
                    tableHTML += `
                        <tr>
                            <td>${prod.codigo}</td>
                            <td>${prod.nombre}</td>
                            <td class="text-danger fw-bold">${prod.cantidad}</td>
                            <td>${prod.precio_costo}</td>
                            <td>${prod.cantidad_minima}</td>
                        </tr>
                    `;
                });
                
                tableHTML += `
                        </tbody>
                    </table>
                    <div class="text-end fw-bold">Cantidad de productos: ${productosFiltrados.length}</div>
                `;
                
                contentArea.innerHTML = tableHTML;
                buildAlert('warning', `Se encontraron ${productosFiltrados.length} productos con stock crítico.`, 'fa-boxes-stacked');
            } else {
                buildAlert('danger', 'Error al cargar los datos del inventario.', 'fa-circle-xmark');
            }
        } catch (error) {
            buildAlert('danger', 'Error de red al consultar el stock.', 'fa-plug-circle-xmark');
        }
    });
    
    btnAgregar.addEventListener('click', () => {
        // Remover instancia previa si existe para evitar duplicación en el DOM
        const modalPrevio = document.getElementById('modalAgregarOverlay');
        if (modalPrevio) {
            modalPrevio.remove();
        }

        const modalHTML = `
            <div class="modal fade" id="modalAgregarOverlay" tabindex="-1" aria-labelledby="modalAgregarLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content custom-shadow border-primary">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title fw-bold" id="modalAgregarLabel">
                                <i class="fa-solid fa-cart-plus me-2"></i> Agregar Nuevo Producto
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formAgregarProdOverlay">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">Código:</label>
                                        <input type="number" id="overlayCodigo" class="form-control" required min="1">
                                    </div>
                                    <div class="col-md-8">
                                        <label class="form-label fw-bold small">Descripción:</label>
                                        <input type="text" id="overlayNombre" class="form-control" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">Cantidad:</label>
                                        <input type="number" id="overlayCant" class="form-control" required min="1">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">Precio Costo:</label>
                                        <input type="number" step="0.01" id="overlayPrecio" class="form-control" required min="0.01">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">Cant. Mínima:</label>
                                        <input type="number" id="overlayCantMin" class="form-control" required min="1">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small text-muted">Imagen (Opcional):</label>
                                        <input type="file" id="overlayImagen" class="form-control" accept="image/*">
                                    </div>
                                </div>
                                <div class="mt-4 text-end">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success fw-bold">
                                        <i class="fa-solid fa-save me-1"></i> GUARDAR
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Inyectar el modal al final del body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Inicializar y mostrar el modal de Bootstrap
        const modalElement = document.getElementById('modalAgregarOverlay');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();

        // Manejador del evento submit del formulario superpuesto
        document.getElementById('formAgregarProdOverlay').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cod = document.getElementById('overlayCodigo').value;
            const nom = document.getElementById('overlayNombre').value;
            const cant = document.getElementById('overlayCant').value;
            const prec = document.getElementById('overlayPrecio').value;
            const cantMin = document.getElementById('overlayCantMin').value;
            const imgInput = document.getElementById('overlayImagen').files[0];

            if(!cod || !nom || !cant || !prec || !cantMin || cod<=0 || cant<=0 || prec<=0 || cantMin<=0) {
                 buildAlert('warning', 'Todos los campos numéricos deben ser positivos y obligatorios[cite: 22].', 'fa-triangle-exclamation');
                 return;
            }

            try {
                 const getResp = await fetch(`${API_URL}?action=listar&codigo=${cod}`);
                 const getData = await getResp.json();
                 
                 if(getData.status === 200 && getData.productos) {
                     buildAlert('warning', 'Transacción denegada: El producto ya existe en la base de datos[cite: 22].', 'fa-ban');
                     return;
                 }

                 const formData = new FormData();
                 formData.append('action', 'insertar');
                 formData.append('codigo', cod);
                 formData.append('nombre', nom);
                 formData.append('cantidad', cant);
                 formData.append('precio_costo', prec);
                 formData.append('cantidad_minima', cantMin);
                 if (imgInput) formData.append('imagen', imgInput);

                 const insertResp = await fetch(API_URL, { method: 'POST', body: formData });
                 const insertData = await insertResp.json();

                 if(insertData.status === 200) {
                     buildAlert('success', 'El producto fue guardado satisfactoriamente[cite: 22].', 'fa-check');
                     modalInstance.hide();
                     btnMostrar.click(); 
                 } else {
                     buildAlert('danger', `Error en inserción: ${insertData.menssage}`, 'fa-circle-xmark');
                 }
            } catch(error) {
                 buildAlert('danger', 'Falla de conexión al intentar insertar el registro.', 'fa-plug-circle-xmark');
            }
        });
    });
});