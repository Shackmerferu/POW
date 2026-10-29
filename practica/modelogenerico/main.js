
/*
 * MAIN.JS
 * Gestiona las alertas, el inventario y el formulario de contacto.
 */

// Espera a que el HTML esté cargado antes de buscar sus elementos.
document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. CONFIGURACIÓN Y ELEMENTOS DEL HTML
    // =====================================================

    // Dirección de la API que gestiona el inventario.
    const API_URL =
        'http://localhost/facultad/POW/practica/modelogenerico/api/almacen_api.php';

    // Dirección de la API que guarda los mensajes de contacto.
    const CONTACTO_URL = 'api/contacto_api.php';

    // Obtiene los elementos del HTML por su ID.
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
    const btnStockBajo = document.getElementById('btnStockBajo');

    // Crea un contenedor donde se mostrarán las tablas del inventario.
    const contentArea = document.createElement('div');
    contentArea.id = 'dynamicContentArea';
    contentArea.className = 'mt-4 w-100';

    // Inserta el contenedor debajo del grupo de botones.
    const zonaBotones = document.querySelector(
        '.d-flex.flex-wrap.gap-2.mt-3'
    );

    if (zonaBotones) {
        zonaBotones.after(contentArea);
    }

    // =====================================================
    // 2. FUNCIÓN PARA MOSTRAR ALERTAS
    // =====================================================

    /*
     * Una función reutilizable evita repetir código.
     * Recibe el tipo, el mensaje, un icono y un título opcional.
     */
    function buildAlert(type, message, iconClass, boldText = null) {

        // Si el contenedor no existe, muestra el mensaje en consola.
        if (!alertContainer) {
            console.log(message);
            return;
        }

        // Elimina la alerta anterior para mostrar solamente la nueva.
        alertContainer.innerHTML = '';

        // Crea la alerta de Bootstrap.
        const alertDiv = document.createElement('div');
        alertDiv.className =
            `alert alert-${type} alert-dismissible fade show custom-shadow`;
        alertDiv.setAttribute('role', 'alert');

        // Agrega el icono de Font Awesome.
        const icon = document.createElement('i');
        icon.className = `fa-solid ${iconClass} me-2`;
        alertDiv.appendChild(icon);

        // Agrega un título en negrita si se proporcionó.
        if (boldText) {
            const strong = document.createElement('strong');
            strong.textContent = boldText;
            alertDiv.appendChild(strong);
            alertDiv.appendChild(document.createTextNode(' '));
        }

        // Agrega el texto del mensaje.
        alertDiv.appendChild(document.createTextNode(message));

        // Crea el botón para cerrar la alerta.
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Cerrar');

        // Elimina la alerta cuando se presiona el botón de cierre.
        closeBtn.addEventListener('click', () => {
            alertDiv.remove();
        });

        alertDiv.appendChild(closeBtn);

        // Inserta la alerta terminada en el HTML.
        alertContainer.appendChild(alertDiv);
    }

    // =====================================================
    // 3. FORMULARIO DE EJEMPLO Y BOTONES DE ALERTAS
    // =====================================================

    // Evita que el formulario de demostración recargue la página.
    if (demoForm) {
        demoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const categorySelect =
                document.getElementById('categorySelect');

            // Comprueba que exista el selector de categorías.
            if (categorySelect) {
                const selectedValue =
                    categorySelect.options[
                        categorySelect.selectedIndex
                    ].text;

                // Muestra una alerta con la categoría seleccionada.
                buildAlert(
                    'success',
                    `Categoría seleccionada: ${selectedValue}.`,
                    'fa-circle-check',
                    '¡Formulario procesado con éxito!'
                );
            }
        });
    }

    // Restablece el formulario de demostración.
    if (btnReset && demoForm) {
        btnReset.addEventListener('click', () => {
            demoForm.reset();
            buildAlert(
                'secondary',
                'Formulario restablecido.',
                'fa-circle-info'
            );
        });
    }

    // Cada botón muestra un tipo diferente de alerta.
    if (btnSuccess) {
        btnSuccess.addEventListener('click', () => {
            buildAlert('success', 'Acción completada exitosamente.', 'fa-circle-check');
        });
    }

    if (btnWarning) {
        btnWarning.addEventListener('click', () => {
            buildAlert('warning', 'Atención: revise la información introducida.', 'fa-triangle-exclamation');
        });
    }

    if (btnDanger) {
        btnDanger.addEventListener('click', () => {
            buildAlert('danger', 'Registro eliminado o acción cancelada.', 'fa-trash');
        });
    }

    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            buildAlert('info', 'Información adicional sobre el proceso.', 'fa-circle-info');
        });
    }

    // =====================================================
    // 4. FORMULARIO DE CONTACTO
    // =====================================================

    // Obtiene el formulario y el espacio donde se mostrarán sus alertas.
    const formularioContacto = document.getElementById('formContacto');
    const alertaContacto = document.getElementById('alertaContacto');

    if (formularioContacto) {

        // Ejecuta esta función cuando el usuario envía el mensaje.
        formularioContacto.addEventListener('submit', async (event) => {

            // Evita que el navegador recargue la página.
            event.preventDefault();

            // Oculta cualquier alerta anterior.
            if (alertaContacto) {
                alertaContacto.className = 'alert d-none';
                alertaContacto.textContent = '';
            }

            // Deshabilita el botón mientras se procesa el envío.
            const botonEnviar = formularioContacto.querySelector(
                'button[type="submit"]'
            );

            if (botonEnviar) {
                botonEnviar.disabled = true;
                botonEnviar.textContent = 'Enviando...';
            }

            try {

                // Envía los campos del formulario a la API mediante POST.
                const respuesta = await fetch(CONTACTO_URL, {
                    method: 'POST',
                    body: new FormData(formularioContacto)
                });

                // Convierte la respuesta JSON de PHP en un objeto JavaScript.
                const resultado = await respuesta.json();

                // Si la API informa un error HTTP o de aplicación, lo muestra.
                if (!respuesta.ok || resultado.error) {
                    throw new Error(
                        resultado.mensaje ||
                        resultado.error ||
                        'No se pudo enviar el mensaje.'
                    );
                }

                // Informa que el mensaje se guardó correctamente.
                if (alertaContacto) {
                    alertaContacto.className = 'alert alert-success';
                    alertaContacto.textContent =
                        resultado.mensaje ||
                        '¡Mensaje enviado correctamente!';
                } else {
                    alert(
                        resultado.mensaje ||
                        '¡Mensaje enviado correctamente!'
                    );
                }

                // Limpia los campos después de un envío exitoso.
                formularioContacto.reset();

            } catch (error) {

                // Informa errores de la API, de conexión o de respuesta.
                if (alertaContacto) {
                    alertaContacto.className = 'alert alert-danger';
                    alertaContacto.textContent =
                        error.message ||
                        'Ocurrió un error al enviar el mensaje.';
                } else {
                    alert(
                        error.message ||
                        'Ocurrió un error al enviar el mensaje.'
                    );
                }

            } finally {

                // Reactiva el botón tanto si el envío tuvo éxito como si falló.
                if (botonEnviar) {
                    botonEnviar.disabled = false;
                    botonEnviar.innerHTML =
                        '<i class="fa-solid fa-paper-plane me-1"></i>Enviar mensaje';
                }
            }
        });
    }

    // =====================================================
    // 5. OBTENER LOS VALORES DEL FORMULARIO DE INVENTARIO
    // =====================================================

    // Agrupa los datos del formulario para reutilizarlos en varias funciones.
    function getFormValues() {
        return {
            codigo: document.getElementById('inputCodigo')?.value,
            cantidad: parseInt(
                document.getElementById('inputCantidad')?.value
            ),
            precio: parseFloat(
                document.getElementById('inputPrecio')?.value
            )
        };
    }

    // =====================================================
    // 6. MOSTRAR TODOS LOS PRODUCTOS
    // =====================================================

    if (btnMostrar) {
        btnMostrar.addEventListener('click', async () => {

            try {

                // Solicita a la API la lista completa de productos.
                const response = await fetch(`${API_URL}?action=listar`);
                const data = await response.json();

                if (data.status === 200 && Array.isArray(data.productos)) {

                    // Ordena los productos alfabéticamente sin alterar la lista original.
                    const productos = [...data.productos].sort(
                        (a, b) => a.nombre.localeCompare(b.nombre)
                    );

                    // Construye el HTML de la tabla.
                    let tableHTML = `
                        <div class="table-responsive">
                            <table class="table table-sm table-striped table-hover mt-3 border custom-shadow">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Cant.</th>
                                        <th>Precio $</th>
                                        <th>Cant. mínima</th>
                                        <th>Valor total $</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    // Agrega una fila por cada producto recibido.
                    productos.forEach((producto) => {
                        const valorTotal =
                            Number(producto.cantidad) *
                            Number(producto.precio_costo);

                        tableHTML += `
                            <tr>
                                <td>${producto.codigo}</td>
                                <td>${producto.nombre}</td>
                                <td>${producto.cantidad}</td>
                                <td>${producto.precio_costo}</td>
                                <td>${producto.cantidad_minima}</td>
                                <td>${valorTotal.toFixed(2)}</td>
                            </tr>
                        `;
                    });

                    tableHTML += `
                                </tbody>
                            </table>
                        </div>
                    `;

                    // Muestra la tabla dentro del contenedor dinámico.
                    contentArea.innerHTML = tableHTML;

                    buildAlert('info', 'Tabla de productos renderizada.', 'fa-list');

                } else {
                    buildAlert('danger', 'Error al cargar los productos de la API.', 'fa-circle-xmark');
                }

            } catch (error) {
                // Captura problemas de conexión o respuestas inválidas.
                buildAlert('danger', 'Error de conexión con el servidor local.', 'fa-plug-circle-xmark');
            }
        });
    }

    // =====================================================
    // 7. BAJA DE STOCK
    // =====================================================

    if (btnBaja) {
        btnBaja.addEventListener('click', async () => {

            // Obtiene y valida el código y la cantidad que se desea retirar.
            const { codigo, cantidad } = getFormValues();

            if (!codigo || Number(codigo) <= 0 || !cantidad || cantidad <= 0) {
                buildAlert('warning', 'Ingrese un código y una cantidad válidos.', 'fa-triangle-exclamation');
                return;
            }

            try {

                // Busca el producto para conocer su cantidad actual.
                const parametros = new URLSearchParams({
                    action: 'listar',
                    codigo: codigo
                });

                const getResp = await fetch(`${API_URL}?${parametros}`);
                const getData = await getResp.json();

                // Comprueba que el producto exista.
                if (
                    getData.status !== 200 ||
                    !getData.productos ||
                    getData.productos.length === 0
                ) {
                    buildAlert('warning', 'Código inexistente.', 'fa-magnifying-glass-minus');
                    return;
                }

                const producto = getData.productos[0];
                const cantidadActual = Number(producto.cantidad);

                // Impide retirar más unidades de las disponibles.
                if (cantidad > cantidadActual) {
                    buildAlert(
                        'danger',
                        `La cantidad a retirar supera el stock (${cantidadActual}).`,
                        'fa-circle-xmark'
                    );
                    return;
                }

                // Calcula la nueva cantidad después de la baja.
                const nuevaCantidad = cantidadActual - cantidad;

                // Envía a la API los datos actualizados del producto.
                const parametrosUpdate = new URLSearchParams({
                    action: 'modificar',
                    codigo: codigo,
                    nombre: producto.nombre,
                    cantidad: nuevaCantidad,
                    precio_costo: producto.precio_costo,
                    cantidad_minima: producto.cantidad_minima
                });

                const updateResp = await fetch(`${API_URL}?${parametrosUpdate}`);
                const updateData = await updateResp.json();

                // Informa el resultado de la operación.
                if (updateData.status === 200) {
                    buildAlert('success', 'Stock actualizado. Baja registrada.', 'fa-check-double');
                    btnMostrar?.click();
                } else {
                    buildAlert('danger', updateData.menssage || 'Error al actualizar el stock.', 'fa-circle-xmark');
                }

            } catch (error) {
                buildAlert('danger', 'Error de red al ejecutar la baja.', 'fa-plug-circle-xmark');
            }
        });
    }

    // =====================================================
    // 8. ALTA DE STOCK CON PRECIO PROMEDIO PONDERADO (PPP)
    // =====================================================

    if (btnAlta) {
        btnAlta.addEventListener('click', async () => {

            // Obtiene los datos ingresados para el alta.
            const { codigo, cantidad, precio } = getFormValues();

            // Valida que los números sean positivos.
            if (
                !codigo || Number(codigo) <= 0 ||
                !cantidad || cantidad <= 0 ||
                !precio || precio <= 0
            ) {
                buildAlert('warning', 'Código, cantidad y precio deben ser positivos.', 'fa-triangle-exclamation');
                return;
            }

            try {

                // Busca el producto para consultar su stock y costo actuales.
                const parametros = new URLSearchParams({
                    action: 'listar',
                    codigo: codigo
                });

                const getResp = await fetch(`${API_URL}?${parametros}`);
                const getData = await getResp.json();

                if (
                    getData.status !== 200 ||
                    !getData.productos ||
                    getData.productos.length === 0
                ) {
                    buildAlert('warning', 'Código inexistente.', 'fa-magnifying-glass-minus');
                    return;
                }

                const producto = getData.productos[0];

                const cantidadAnterior = Number(producto.cantidad);
                const precioAnterior = Number(producto.precio_costo);

                // Suma las unidades nuevas al stock existente.
                const nuevaCantidad = cantidadAnterior + cantidad;

                /*
                 * Calcula el PPP:
                 * (valor del stock anterior + valor del ingreso) / stock total.
                 */
                const nuevoPrecioPonderado =
                    (
                        cantidadAnterior * precioAnterior +
                        cantidad * precio
                    ) / nuevaCantidad;

                // Envía la cantidad y el nuevo costo promedio a la API.
                const parametrosUpdate = new URLSearchParams({
                    action: 'modificar',
                    codigo: codigo,
                    nombre: producto.nombre,
                    cantidad: nuevaCantidad,
                    precio_costo: nuevoPrecioPonderado,
                    cantidad_minima: producto.cantidad_minima
                });

                const updateResp = await fetch(`${API_URL}?${parametrosUpdate}`);
                const updateData = await updateResp.json();

                // Muestra si se actualizó el producto.
                if (updateData.status === 200) {
                    buildAlert('success', 'Stock actualizado mediante precio promedio ponderado.', 'fa-check-double');
                    btnMostrar?.click();
                } else {
                    buildAlert('danger', updateData.menssage || 'Falló la actualización del stock.', 'fa-circle-xmark');
                }

            } catch (error) {
                buildAlert('danger', 'Error de red al ejecutar el alta.', 'fa-plug-circle-xmark');
            }
        });
    }

    // =====================================================
    // 9. ELIMINAR UN PRODUCTO
    // =====================================================

    if (btnBorrar) {
        btnBorrar.addEventListener('click', async () => {

            // Obtiene el código del producto que se quiere eliminar.
            const { codigo } = getFormValues();

            if (!codigo || Number(codigo) <= 0) {
                buildAlert('warning', 'Ingrese un código válido para eliminar un producto.', 'fa-triangle-exclamation');
                return;
            }

            try {

                // Solicita a la API que elimine el producto indicado.
                const parametros = new URLSearchParams({
                    action: 'borrar',
                    codigo: codigo
                });

                const response = await fetch(`${API_URL}?${parametros}`);
                const data = await response.json();

                // Informa el resultado del borrado.
                if (data.status === 200) {
                    buildAlert('success', 'Registro eliminado de la base de datos.', 'fa-trash');
                    contentArea.innerHTML = '';
                } else {
                    buildAlert('danger', 'Error en la petición de borrado.', 'fa-circle-xmark');
                }

            } catch (error) {
                buildAlert('danger', 'Error de conectividad con la API.', 'fa-plug-circle-xmark');
            }
        });
    }

    // =====================================================
    // 10. CONSULTAR PRODUCTOS CON STOCK BAJO
    // =====================================================

    if (btnStockBajo) {
        btnStockBajo.addEventListener('click', async () => {

            try {

                // Obtiene todos los productos para revisar sus cantidades.
                const response = await fetch(`${API_URL}?action=listar`);
                const data = await response.json();

                if (
                    data.status !== 200 ||
                    !Array.isArray(data.productos)
                ) {
                    buildAlert('danger', 'Error al cargar los datos del inventario.', 'fa-circle-xmark');
                    return;
                }

                // Selecciona los productos cuya cantidad está debajo del mínimo.
                const productosFiltrados = data.productos.filter(
                    (producto) =>
                        Number(producto.cantidad) <
                        Number(producto.cantidad_minima)
                );

                // Construye la tabla de productos con stock crítico.
                let tableHTML = `
                    <div class="alert alert-warning fw-bold text-dark mt-3">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>
                        Productos por debajo de la cantidad mínima
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-striped table-hover border custom-shadow">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio $</th>
                                    <th>Cantidad mínima</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Agrega una fila por cada producto filtrado.
                productosFiltrados.forEach((producto) => {
                    tableHTML += `
                        <tr>
                            <td>${producto.codigo}</td>
                            <td>${producto.nombre}</td>
                            <td class="text-danger fw-bold">${producto.cantidad}</td>
                            <td>${producto.precio_costo}</td>
                            <td>${producto.cantidad_minima}</td>
                        </tr>
                    `;
                });

                tableHTML += `
                            </tbody>
                        </table>
                    </div>
                    <div class="text-end fw-bold">
                        Cantidad de productos: ${productosFiltrados.length}
                    </div>
                `;

                // Muestra la tabla y comunica cuántos productos tienen stock bajo.
                contentArea.innerHTML = tableHTML;

                buildAlert(
                    'warning',
                    `Se encontraron ${productosFiltrados.length} productos con stock crítico.`,
                    'fa-boxes-stacked'
                );

            } catch (error) {
                buildAlert('danger', 'Error de red al consultar el stock.', 'fa-plug-circle-xmark');
            }
        });
    }

    // =====================================================
    // 11. MODAL PARA AGREGAR UN PRODUCTO
    // =====================================================

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {

            // Elimina un modal anterior para evitar duplicarlo.
            const modalPrevio = document.getElementById('modalAgregarOverlay');

            if (modalPrevio) {
                bootstrap.Modal.getInstance(modalPrevio)?.dispose();
                modalPrevio.remove();
            }

            // Define el HTML del formulario que aparecerá en el modal.
            const modalHTML = `
                <div class="modal fade" id="modalAgregarOverlay"
                     tabindex="-1" aria-labelledby="modalAgregarLabel"
                     aria-hidden="true">

                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content custom-shadow border-primary">

                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title fw-bold" id="modalAgregarLabel">
                                    <i class="fa-solid fa-cart-plus me-2"></i>
                                    Agregar nuevo producto
                                </h5>
                                <button type="button" class="btn-close btn-close-white"
                                        data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>

                            <div class="modal-body">
                                <form id="formAgregarProdOverlay">

                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label fw-bold">Código:</label>
                                            <input type="number" id="overlayCodigo"
                                                   class="form-control" required min="1">
                                        </div>

                                        <div class="col-md-8">
                                            <label class="form-label fw-bold">Descripción:</label>
                                            <input type="text" id="overlayNombre"
                                                   class="form-control" required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Cantidad:</label>
                                            <input type="number" id="overlayCant"
                                                   class="form-control" required min="1">
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Precio costo:</label>
                                            <input type="number" step="0.01"
                                                   id="overlayPrecio" class="form-control"
                                                   required min="0.01">
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Cantidad mínima:</label>
                                            <input type="number" id="overlayCantMin"
                                                   class="form-control" required min="1">
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Imagen (opcional):</label>
                                            <input type="file" id="overlayImagen"
                                                   class="form-control" accept="image/*">
                                        </div>
                                    </div>

                                    <div class="mt-4 text-end">
                                        <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancelar</button>

                                        <button type="submit" class="btn btn-success fw-bold">
                                            <i class="fa-solid fa-save me-1"></i>Guardar
                                        </button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            `;

            // Inserta el modal en el documento.
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Inicializa Bootstrap y muestra el modal.
            const modalElement = document.getElementById('modalAgregarOverlay');
            const modalInstance = new bootstrap.Modal(modalElement);

            modalInstance.show();

            // Elimina el modal del HTML cuando se cierra.
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalInstance.dispose();
                modalElement.remove();
            }, { once: true });

            // Obtiene el formulario que se acaba de crear.
            const formulario = document.getElementById('formAgregarProdOverlay');

            // Procesa el envío del formulario de alta.
            formulario.addEventListener('submit', async (event) => {

                event.preventDefault();

                // Obtiene los valores ingresados.
                const cod = document.getElementById('overlayCodigo').value;
                const nom = document.getElementById('overlayNombre').value;
                const cant = document.getElementById('overlayCant').value;
                const prec = document.getElementById('overlayPrecio').value;
                const cantMin = document.getElementById('overlayCantMin').value;
                const imgInput = document.getElementById('overlayImagen').files[0];

                // Comprueba que los campos obligatorios sean válidos.
                if (
                    !cod || !nom.trim() || !cant || !prec || !cantMin ||
                    Number(cod) <= 0 || Number(cant) <= 0 ||
                    Number(prec) <= 0 || Number(cantMin) <= 0
                ) {
                    buildAlert('warning', 'Complete los campos correctamente con valores positivos.', 'fa-triangle-exclamation');
                    return;
                }

                const botonGuardar = formulario.querySelector('button[type="submit"]');
                botonGuardar.disabled = true;

                try {

                    // Comprueba que no exista otro producto con el mismo código.
                    const parametros = new URLSearchParams({
                        action: 'listar',
                        codigo: cod
                    });

                    const getResp = await fetch(`${API_URL}?${parametros}`);
                    const getData = await getResp.json();

                    if (
                        getData.status === 200 &&
                        getData.productos &&
                        getData.productos.length > 0
                    ) {
                        buildAlert('warning', 'El producto ya existe en la base de datos.', 'fa-ban');
                        return;
                    }

                    // Prepara los datos para enviarlos a PHP.
                    const formData = new FormData();

                    formData.append('action', 'insertar');
                    formData.append('codigo', cod);
                    formData.append('nombre', nom);
                    formData.append('cantidad', cant);
                    formData.append('precio_costo', prec);
                    formData.append('cantidad_minima', cantMin);

                    // Adjunta la imagen solo si el usuario eligió una.
                    if (imgInput) {
                        formData.append('imagen', imgInput);
                    }

                    // Envía los datos mediante POST para insertar el producto.
                    const insertResp = await fetch(API_URL, {
                        method: 'POST',
                        body: formData
                    });

                    const insertData = await insertResp.json();

                    // Muestra el resultado de la inserción.
                    if (insertResp.ok && insertData.status === 200) {

                        buildAlert('success', 'El producto fue guardado correctamente.', 'fa-check');

                        // Cierra el modal y actualiza la tabla.
                        modalInstance.hide();
                        btnMostrar?.click();

                    } else {

                        buildAlert(
                            'danger',
                            `Error al insertar: ${
                                insertData.menssage ||
                                insertData.message ||
                                'No se pudo guardar el producto.'
                            }`,
                            'fa-circle-xmark'
                        );
                    }

                } catch (error) {

                    // Informa si no se pudo contactar con la API.
                    buildAlert('danger', 'Error de conexión al intentar insertar el producto.', 'fa-plug-circle-xmark');

                } finally {

                    // Reactiva el botón cuando termina el proceso.
                    if (botonGuardar.isConnected) {
                        botonGuardar.disabled = false;
                    }
                }
            });
        });
    }

});
