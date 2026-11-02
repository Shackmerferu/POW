# Cheatsheet del parcial — POW (proyecto `termos`)

Contenido específico del **parcial de Programación Orientada a la Web** y del proyecto `termos`.

> La teoría general (HTML, CSS, Bootstrap, JavaScript, AJAX, PHP y SQL) está en [`CHEATSHEET.md`](CHEATSHEET.md). Este archivo solo tiene las secciones del parcial.

---

## Índice

1. [Plan de resolución en 3 h 15 min](#1-plan-de-resolución-en-3-h-15-min)
2. [Recetas del parcial](#2-recetas-del-parcial)
3. [Checklist final de entrega](#3-checklist-final-de-entrega)

---

## 1. Plan de resolución en 3 h 15 min

### 0:00 – 0:15 | Leer y preparar

- Leer todo el enunciado y subrayar:
  - endpoints,
  - parámetros exactos,
  - mensajes exactos,
  - puntos extra.
- Verificar que Apache y MySQL estén corriendo.
- Importar `termos.sql` si hace falta.
- Abrir la API en el navegador para ver la forma real del JSON.
- Crear la estructura:

```text
front/
├─ index.html
├─ panel.html
├─ css/styles.css
├─ js/config.js
├─ js/app.js
├─ js/login.js
├─ js/panel.js
└─ lib/
```

### 0:15 – 0:50 | Login y sesión

- Maquetar `index.html`.
- Formulario con `usuario` y `password`.
- `login.php` por POST.
- Guardar token en `sessionStorage`.
- Redirigir a `panel.html`.
- Proteger `panel.html` con `verifica_token.php`.
- Logout con confirmación.
- **Probar todo antes de seguir.**

### 0:50 – 1:35 | Listado de termos

- Llamar `listar_productos.php?token=...`.
- Ordenar por `titulo` en el front.
- Renderizar tarjetas.
- Imagen con `src`, `alt`, `title`, `aria-description`.
- Modal al hacer clic en la imagen.
- Estado vacío y manejo de token inválido.

### 1:35 – 2:15 | Carga de termos

- Modal con formulario `multipart/form-data`.
- Input de imagen primero.
- ExifReader para leer IPTC/XMP.
- Autocompletar los 5 campos.
- Vista previa.
- POST con `FormData` y token.
- Recargar listado y mostrar mensaje.

### 2:15 – 2:50 | Personas

- Búsqueda binaria:
  - `personas_cantidad.php`
  - `personas_listar.php?id=N`
- Alta con DNI precargado.
- Edición con DNI deshabilitado.
- Select de ciudades ordenado.
- Provincia fija y deshabilitada.
- Mensajes exactos de éxito.

### 2:50 – 3:05 | Diseño y responsive

- Revisar en mobile (DevTools).
- Navbar colapsable.
- Grid de tarjetas.
- Formularios legibles.
- Estados de foco y error.
- Contraste y espaciado.

### 3:05 – 3:15 | Pruebas finales

- Login incorrecto.
- Login correcto.
- Recarga del panel.
- Acceso directo sin token.
- Logout con confirmación.
- Alta de termo.
- Búsqueda de DNI existente e inexistente.
- Alta y edición de persona.
- Consola sin errores.
- Documento de consideraciones.

### Regla de oro

> **Primero funcional, después bonito.** Un flujo que funciona vale más que un diseño lindo que no guarda nada.

---

## 2. Recetas del parcial

### 2.1 Login completo

```js
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.classList.add("was-validated");
    return;
  }

  const usuario = formulario.elements.usuario.value.trim();
  const password = formulario.elements.password.value;

  try {
    const datos = await App.postUrlEncoded(API.login, {
      usuario,
      password
    });

    if (datos.status !== 200 || !datos.token) {
      throw new Error(datos.menssage || "Credenciales incorrectas");
    }

    App.saveSession(datos.token, {
      nombre: datos.nombre,
      apellido: datos.apellido,
      id: datos.id_usurio || datos.id_usuario
    });

    window.location.replace("panel.html");

  } catch (error) {
    App.showAlert(alertas, error.message, "danger");
  }
});
```

### 2.2 Verificar token

```js
async function verifyToken(token) {
  if (!token) return false;

  try {
    const datos = await App.getJSON(API.verificaToken, { token });

    const presente =
      datos.tpken_presente === true ||
      datos.token_presente === true;

    return datos.status === 200 && presente;
  } catch {
    return false;
  }
}
```

### 2.3 Proteger una página

```js
document.addEventListener("DOMContentLoaded", async () => {
  const token = await App.requireSession();

  if (!token) return;

  // Recién acá mostrar la app
  document.getElementById("auth-loading").classList.add("d-none");
  document.getElementById("app").classList.remove("d-none");

  await cargarDatos();
});
```

### 2.4 Listar y ordenar productos

```js
const datos = await App.getJSON(API.listarProductos, { token });

const productos = (datos.data || [])
  .slice()
  .sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
  );

grid.innerHTML = productos.map(renderizarProducto).join("");
```

### 2.5 Renderizar una tarjeta con atributos accesibles

```js
function renderizarProducto(producto) {
  const id = App.escapeHtml(producto.id);
  const titulo = App.escapeHtml(producto.titulo);
  const tituloImagen = App.escapeHtml(producto.titulo_imagen || producto.titulo);
  const alt = App.escapeHtml(producto.texto_alternativo || producto.titulo);
  const aria = App.escapeHtml(producto.descripcion_larga || "");
  const descripcion = App.escapeHtml(producto.descripcion || "");
  const src = App.escapeHtml(App.imageUrl(producto.imagen));

  return `
    <div class="col-12 col-sm-6 col-xl-4">
      <article class="card h-100">
        <button type="button" data-ver="${id}" aria-label="Ampliar ${titulo}">
          <img src="${src}"
               class="card-img-top"
               alt="${alt}"
               title="${tituloImagen}"
               aria-description="${aria}"
               loading="lazy">
        </button>
        <div class="card-body">
          <h3 class="card-title">${titulo}</h3>
          <p class="card-text">${descripcion}</p>
        </div>
      </article>
    </div>
  `;
}
```

### 2.6 Abrir un modal con datos

```js
function abrirModalProducto(id) {
  const producto = productosPorId.get(String(id));
  if (!producto) return;

  document.getElementById("ver-titulo").textContent = producto.titulo;
  document.getElementById("ver-imagen").src = App.imageUrl(producto.imagen);
  document.getElementById("ver-imagen").alt = producto.texto_alternativo || "";
  document.getElementById("ver-descripcion").textContent =
    producto.descripcion_larga || "";

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalVerTermo")
  ).show();
}
```

Delegación:

```js
grid.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-ver]");
  if (!boton) return;
  abrirModalProducto(boton.dataset.ver);
});
```

### 2.7 Leer metadatos con ExifReader

```js
async function leerMetadatos(archivo) {
  const buffer = await archivo.arrayBuffer();
  const tags = ExifReader.load(buffer);

  const texto = (tag) => {
    if (!tag) return "";
    const valor = tag.description ?? tag.value;
    return String(valor ?? "").trim();
  };

  return {
    titulo: texto(tags.Headline) || texto(tags.title),
    titulo_imagen: texto(tags.title) || texto(tags.Headline),
    descripcion: texto(tags["Caption/Abstract"]) || texto(tags.description),
    descripcion_larga: texto(tags.ExtDescrAccessibility) || texto(tags.description),
    texto_alternativo: texto(tags.AltTextAccessibility) || texto(tags.Headline)
  };
}
```

### 2.8 Subir un archivo con `FormData`

```js
const datos = new FormData();
datos.append("titulo", titulo);
datos.append("titulo_imagen", tituloImagen);
datos.append("descripcion", descripcion);
datos.append("descripcion_larga", descripcionLarga);
datos.append("texto_alternativo", textoAlternativo);
datos.append("imagen", archivo);

const respuesta = await App.postForm(
  API.registrarProducto,
  datos,
  { token }
);

if (respuesta.status !== 200) {
  throw new Error(respuesta.menssage || "No se pudo guardar");
}
```

### 2.9 Búsqueda binaria por DNI

```js
async function buscarPersonaPorDni(dniBuscado) {
  const cantidadRespuesta = await App.getJSON(API.personasCantidad);

  if (cantidadRespuesta.status !== 200) {
    throw new Error("No se pudo obtener la cantidad");
  }

  let inicio = 1;
  let fin = Number(cantidadRespuesta.cantidad);

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);

    const respuesta = await App.getJSON(API.personasListar, { id: medio });

    if (
      respuesta.status !== 200 ||
      !Array.isArray(respuesta.persona) ||
      respuesta.persona.length === 0
    ) {
      fin = medio - 1;
      continue;
    }

    const persona = respuesta.persona[0];
    const dniMedio = Number(persona.dni);

    if (dniMedio === dniBuscado) return persona;
    if (dniMedio < dniBuscado) inicio = medio + 1;
    else fin = medio - 1;
  }

  return null;
}
```

### 2.10 Alta o edición según el DNI

```js
const persona = await buscarPersonaPorDni(dni);

if (persona) {
  modo = "editar";
  personaActual = persona;
  precargarFormulario(persona);
} else {
  modo = "crear";
  personaActual = null;
  prepararFormularioVacio(dni);
}
```

### 2.11 Guardar persona y mostrar el mensaje exacto

```js
if (modo === "editar") {
  const respuesta = await App.postUrlEncoded(
    API.personasEditar,
    valores,
    { id: personaActual.id }
  );

  if (respuesta.status !== 200 && respuesta.status !== 505) {
    throw new Error(respuesta.menssage || "No se pudo actualizar");
  }

  mostrarExito(
    `Los datos de ${nombre} ${apellido} fueron actualizados.`
  );

} else {
  const respuesta = await App.postUrlEncoded(API.personasGuardar, {
    ...valores,
    dni
  });

  if (respuesta.status !== 200) {
    throw new Error(respuesta.menssage || "No se pudo guardar");
  }

  mostrarExito(
    `La persona ${nombre} ${apellido} fue dada de alta con éxito.`
  );
}
```

### 2.12 Cargar y ordenar ciudades

```js
const datos = await App.getJSON(API.ciudades);

const ciudades = (datos.localidades || [])
  .slice()
  .sort((a, b) =>
    a.nombre_ciudad.localeCompare(b.nombre_ciudad, "es", {
      sensitivity: "base"
    })
  );

select.innerHTML = '<option value="">Seleccioná una ciudad</option>';

ciudades.forEach((ciudad) => {
  const option = document.createElement("option");
  option.value = String(ciudad.id);
  option.textContent = ciudad.nombre_ciudad;
  select.appendChild(option);
});
```

### 2.13 Logout con confirmación

```js
document.getElementById("btn-salir").addEventListener("click", () => {
  const seguro = window.confirm("¿Está seguro de que desea cerrar sesión?");
  if (!seguro) return;

  App.clearSession();
  window.location.replace("index.html");
});
```

### 2.14 Escapar texto para `innerHTML`

```js
function escapeHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[caracter];
  });
}
```

### 2.15 Escape SQL de compatibilidad

```js
function escaparParaSql(texto) {
  return String(texto ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}
```

> Solo porque la API no usa consultas preparadas. En código propio, usar `mysqli_prepare`.

### 2.16 Parser de JSON tolerante

```js
function parseJson(texto) {
  if (!texto || !texto.trim()) return {};

  try {
    return JSON.parse(texto);
  } catch {
    const inicio = texto.indexOf("{");
    const fin = texto.lastIndexOf("}");

    if (inicio >= 0 && fin > inicio) {
      return JSON.parse(texto.slice(inicio, fin + 1));
    }

    throw new Error("La API no devolvió JSON válido");
  }
}
```

---

## 3. Checklist final de entrega

### Funcionalidad

- [ ] Login con `gaston` / `12345`.
- [ ] Login incorrecto muestra error sin navegar.
- [ ] Token guardado en `sessionStorage`.
- [ ] `index.html` redirige al panel si ya hay sesión.
- [ ] `panel.html` redirige al login sin token.
- [ ] Token verificado contra `verifica_token.php`.
- [ ] Logout con confirmación.
- [ ] Listado de termos.
- [ ] Ordenado por título.
- [ ] Imagen con `title`, `alt`, `aria-description`.
- [ ] Modal al hacer clic en la imagen.
- [ ] Botón de carga de termo.
- [ ] Imagen primero en el formulario.
- [ ] Metadatos autocompletados.
- [ ] POST multipart con token.
- [ ] Listado actualizado tras guardar.
- [ ] Búsqueda binaria por DNI.
- [ ] Alta con DNI precargado.
- [ ] Edición con DNI deshabilitado.
- [ ] Select de ciudades ordenado.
- [ ] Provincia fija y deshabilitada.
- [ ] Mensaje exacto de alta.
- [ ] Mensaje exacto de edición.
- [ ] Todos los campos requeridos.

### Calidad

- [ ] Sin errores en consola.
- [ ] Sin `console.log` de depuración.
- [ ] Sin `alert()` para errores.
- [ ] Sin `innerHTML` con datos sin escapar.
- [ ] Sin credenciales en la URL.
- [ ] Sin rutas absolutas innecesarias.
- [ ] Sin CDN obligatorio.
- [ ] Sin archivos de la API modificados.
- [ ] Documento de consideraciones incluido.
- [ ] Auditoría incluida.
- [ ] Cheatsheet incluido.

### Diseño

- [ ] Responsive en mobile, tablet y desktop.
- [ ] Navbar funcional.
- [ ] Tarjetas alineadas.
- [ ] Formularios legibles.
- [ ] Mensajes visibles.
- [ ] Estados de foco.
- [ ] Contraste adecuado.
- [ ] Sin scroll horizontal.

### Pruebas manuales

- [ ] Login vacío.
- [ ] Login incorrecto.
- [ ] Login correcto.
- [ ] Recargar panel.
- [ ] Abrir panel en otra pestaña sin token.
- [ ] Logout cancelado.
- [ ] Logout confirmado.
- [ ] Alta de termo con imagen real.
- [ ] Imagen sin metadatos.
- [ ] DNI existente.
- [ ] DNI inexistente.
- [ ] Alta de persona.
- [ ] Edición de persona.
- [ ] Edición sin cambios.
- [ ] Apóstrofos en nombres.
- [ ] Navegación por teclado.

---

**Fin del cheatsheet del parcial.**
