const API_URL = 'http://localhost/facultad/POW/practica/proyectoToni/api_almacen/almacen_api.php';

function limpiarPantalla() {
  document.getElementById('mensaje').innerText = '';
  document.getElementById('contenido').innerHTML = '';
}

async function mostrarTodos() {
  limpiarPantalla();
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.status !== 200 || !data.productos) {
      document.getElementById('mensaje').innerText = 'No hay productos para mostrar.';
      return;
    }
    let productos = data.productos;
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    let html = `
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cant</th>
            <th>Precio $</th>
            <th>cant mínima</th>
            <th>Valor $$</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>`;
    productos.forEach(prod => {
      const valorTotal = (parseFloat(prod.cantidad) * parseFloat(prod.precio_costo)).toFixed(2);
      html += `
        <tr>
          <td>${prod.codigo}</td>
          <td>${prod.nombre}</td>
          <td>${prod.cantidad}</td>
          <td>$${parseFloat(prod.precio_costo).toFixed(2)}</td>
          <td>${prod.cantidad_minima}</td>
          <td><strong>$${valorTotal}</strong></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="borrarProducto(${prod.codigo})">Borrar</button>
          </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('contenido').innerHTML = html;
  } catch (error) {
    document.getElementById('mensaje').innerText = 'Error al conectar con la API.';
  }
}

async function mostrarStockBajo() {
  limpiarPantalla();
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.status !== 200 || !data.productos) {
      document.getElementById('mensaje').innerText = 'No hay productos registrados.';
      return;
    }
    const bajoStock = data.productos.filter(p => parseInt(p.cantidad) <= parseInt(p.cantidad_minima));
    let html = `
      <h3>Productos por debajo de la cantidad mínima</h3>
      <table class="table table-striped table-bordered align-middle mt-3">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cant</th>
            <th>Precio $</th>
            <th>cant mínima</th>
          </tr>
        </thead>
        <tbody>`;
    bajoStock.forEach(p => {
      html += `
        <tr>
          <td>${p.codigo}</td>
          <td>${p.nombre}</td>
          <td>${p.cantidad}</td>
          <td>$${parseFloat(p.precio_costo).toFixed(2)}</td>
          <td>${p.cantidad_minima}</td>
        </tr>`;
    });
    html += `</tbody></table>
      <p class="fw-bold fs-5 mt-2">Cantidad de productos: ${bajoStock.length}</p>`;
    document.getElementById('contenido').innerHTML = html;
  } catch (error) {
    document.getElementById('mensaje').innerText = 'Error al consultar stock bajo.';
  }
}

async function ejecutarBaja() {
  limpiarPantalla();
  const idInput = document.getElementById('form-codigo').value;
  const cantInput = document.getElementById('form-cantidad').value;
  const codigo = parseInt(idInput);
  const cantARetirar = parseInt(cantInput);
  if (!codigo || codigo <= 0 || !cantARetirar || cantARetirar <= 0) {
    document.getElementById('mensaje').innerText = 'Ingrese Código y Cantidad válidos (mayores a 0).';
    return;
  }
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const producto = data.productos ? data.productos.find(p => p.codigo == codigo) : null;
    if (!producto) {
      document.getElementById('mensaje').innerText = 'Código inexistente';
      return;
    }
    const stockActual = parseInt(producto.cantidad);
    if (cantARetirar > stockActual) {
      document.getElementById('mensaje').innerText = `La cantidad a retirar es superior al Stock(${stockActual})`;
      return;
    }
    const nuevoStock = stockActual - cantARetirar;
    const urlMod = `${API_URL}?action=modificar&codigo=${producto.codigo}&nombre=${encodeURIComponent(producto.nombre)}&cantidad=${nuevoStock}&precio_costo=${producto.precio_costo}&cantidad_minima=${producto.cantidad_minima}`;
    const resMod = await fetch(urlMod);
    const dataMod = await resMod.json();
    if (dataMod.status === 200) {
      document.getElementById('mensaje').innerText = 'Actualizado';
    } else {
      document.getElementById('mensaje').innerText = 'No modificado';
    }
  } catch (error) {
    document.getElementById('mensaje').innerText = 'Error al procesar la baja.';
  }
}

async function ejecutarAlta() {
  limpiarPantalla();
  const codigo = parseInt(document.getElementById('form-codigo').value);
  const cantIngresada = parseInt(document.getElementById('form-cantidad').value);
  const precioIngresado = parseFloat(document.getElementById('form-precio').value);
  if (!codigo || codigo <= 0 || !cantIngresada || cantIngresada <= 0 || !precioIngresado || precioIngresado <= 0) {
    document.getElementById('mensaje').innerText = 'Ingrese Código, Cantidad y Precio válidos (mayores a 0).';
    return;
  }
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const producto = data.productos ? data.productos.find(p => p.codigo == codigo) : null;
    if (!producto) {
      document.getElementById('mensaje').innerText = 'Código inexistente';
      return;
    }
    const cantAnterior = parseInt(producto.cantidad);
    const precioAnterior = parseFloat(producto.precio_costo);
    const nuevaCantTotal = cantAnterior + cantIngresada;
    const nuevoPrecioPPP = ((cantAnterior * precioAnterior) + (cantIngresada * precioIngresado)) / nuevaCantTotal;
    const urlMod = `${API_URL}?action=modificar&codigo=${producto.codigo}&nombre=${encodeURIComponent(producto.nombre)}&cantidad=${nuevaCantTotal}&precio_costo=${nuevoPrecioPPP.toFixed(2)}&cantidad_minima=${producto.cantidad_minima}`;
    const resMod = await fetch(urlMod);
    const dataMod = await resMod.json();
    if (dataMod.status === 200) {
      document.getElementById('mensaje').innerText = 'Actualizado';
    } else {
      document.getElementById('mensaje').innerText = 'No modificado';
    }
  } catch (error) {
    document.getElementById('mensaje').innerText = 'Error al procesar el alta.';
  }
}

async function guardarNuevoProducto() {
  const codigo = document.getElementById('add-codigo').value;
  const nombre = document.getElementById('add-nombre').value;
  const cantidad = document.getElementById('add-cantidad').value;
  const precio = document.getElementById('add-precio').value;
  const minima = document.getElementById('add-minima').value;
  if (!codigo || !nombre || !cantidad || !precio || !minima || codigo <= 0 || cantidad <= 0 || precio <= 0 || minima <= 0) {
    alert('Todos los campos son requeridos y deben ser números mayores a 0.');
    return;
  }
  try {
    const resList = await fetch(API_URL);
    const dataList = await resList.json();
    const existe = dataList.productos ? dataList.productos.some(p => p.codigo == codigo) : false;
    if (existe) {
      alert('El producto ya existe en la base de datos.');
      return;
    }
    const urlIns = `${API_URL}?action=insertar&codigo=${codigo}&nombre=${encodeURIComponent(nombre)}&cantidad=${cantidad}&precio_costo=${precio}&cantidad_minima=${minima}`;
    const resIns = await fetch(urlIns);
    const dataIns = await resIns.json();
    if (dataIns.status === 200) {
      alert('Producto guardado correctamente.');
      cerrarModalAgregar();
      mostrarTodos();
    } else {
      alert('Error al guardar el producto.');
    }
  } catch (error) {
    alert('Error al conectar con el servidor.');
  }
}

async function borrarProducto(codigo) {
  if (confirm('¿Desea eliminar este producto?')) {
    try {
      const urlDel = `${API_URL}?action=borrar&codigo=${codigo}`;
      const res = await fetch(urlDel);
      const data = await res.json();
      if (data.status === 200) {
        document.getElementById('mensaje').innerText = 'Eliminado';
        mostrarTodos();
      } else {
        document.getElementById('mensaje').innerText = 'No se pudo eliminar.';
      }
    } catch (error) {
      document.getElementById('mensaje').innerText = 'Error al intentar eliminar.';
    }
  }
}