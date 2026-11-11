// ======================================
// ELEMENTOS HTML
// ======================================

const listaTermos = document.getElementById("lista-termos");

// ======================================
// CONSULTAR Y MOSTRAR TERMOS
// ======================================

async function cargarTermos() {
  const token = sessionStorage.getItem("termos_token");

  listaTermos.textContent = "Cargando productos...";

  try {
    const response = await fetch(
      window.API + "listar_productos.php?token=" + encodeURIComponent(token),
    );

    if (!response.ok) {
      throw new Error("Error HTTP: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta PHP al listar termos:", respuesta);

    if (respuesta.status !== 200 && respuesta.status !== "200") {
      throw new Error(
        respuesta.mensaje ||
          respuesta.message ||
          "No se pudieron cargar los productos.",
      );
    }

    const productos = respuesta.data;

    if (!Array.isArray(productos)) {
      throw new Error("La API no devolvió una lista válida de productos.");
    }

    // Ordenar por título
    productos.sort(function (a, b) {
      return a.titulo.localeCompare(b.titulo);
    });

    // Limpiar listado anterior
    listaTermos.innerHTML = "";

    // Comprobar si hay productos
    if (productos.length === 0) {
      listaTermos.textContent = "No hay termos registrados.";
      return true;
    }

    productos.forEach(function (termo) {
      // Crear tarjeta
      const card = document.createElement("div");

      card.classList.add("card");
      card.style.cursor = "pointer";

      // Crear cuerpo
      const cardBody = document.createElement("div");

      cardBody.classList.add("card-body");

      // Contenedor horizontal
      const contenido = document.createElement("div");

      contenido.classList.add("d-flex", "align-items-center", "gap-3");

      // Crear imagen
      const imagen = document.createElement("img");

      imagen.src = "../api/imagenes/" + termo.imagen;
      imagen.alt = termo.texto_alternativo;
      imagen.title = termo.titulo_imagen;

      imagen.setAttribute("aria-description", termo.descripcion_larga);

      imagen.classList.add("img-fluid", "rounded");
      imagen.style.width = "150px";

      // Crear texto
      const texto = document.createElement("div");

      const titulo = document.createElement("h5");

      titulo.classList.add("card-title", "fw-bold");
      titulo.textContent = termo.titulo;

      const descripcion = document.createElement("p");

      descripcion.classList.add("card-text");
      descripcion.textContent = termo.descripcion;

      // Organizar texto
      texto.appendChild(titulo);
      texto.appendChild(descripcion);

      // Organizar contenido
      contenido.appendChild(imagen);
      contenido.appendChild(texto);

      cardBody.appendChild(contenido);
      card.appendChild(cardBody);

      // ======================================
      // ABRIR MODAL AL HACER CLICK EN LA TARJETA
      // ======================================

      card.addEventListener("click", function () {
        const modalImagen = document.getElementById("modalImagen");

        document.getElementById("modalTitulo").textContent = termo.titulo;

        modalImagen.src = imagen.src;
        modalImagen.title = termo.titulo_imagen;

        const modalElemento = document.getElementById("modalTermo");

        const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

        modal.show();
      });

      // Insertar tarjeta
      listaTermos.appendChild(card);
    });

    console.log("Termos cargados:", productos.length);

    return true;
  } catch (error) {
    console.error("Error al cargar termos:", error);

    listaTermos.textContent = error.message;

    return false;
  }
}
