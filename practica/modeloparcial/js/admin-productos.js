
document.addEventListener("click", async function (evento) {
    const boton = evento.target.closest(".btn-eliminar-producto");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;

    if (!id) {
        alert("No se encontró el identificador del producto.");
        return;
    }

    const confirmar = confirm(
        "¿Seguro que querés eliminar este producto del catálogo?"
    );

    if (!confirmar) {
        return;
    }

    boton.disabled = true;
    boton.textContent = "Eliminando...";

    try {
        const datos = new FormData();
        datos.append("id", id);

        const respuesta = await fetch(
            "./api/eliminar_producto.php",
            {
                method: "POST",
                body: datos,
                credentials: "same-origin"
            }
        );

        const mensaje = await respuesta.text();

        if (!respuesta.ok) {
            alert(mensaje || "No se pudo eliminar el producto.");
            boton.disabled = false;
            boton.textContent = "Eliminar producto";
            return;
        }

        alert(mensaje);

        // Volver a cargar el catálogo para quitar el producto eliminado.
        window.location.reload();

    } catch (error) {
        console.error("Error al eliminar el producto:", error);

        alert("No se pudo conectar con el servidor.");

        boton.disabled = false;
        boton.textContent = "Eliminar producto";
    }
});
