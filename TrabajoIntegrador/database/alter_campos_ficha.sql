-- ALTER: columnas nuevas de la ficha técnica (punto del enunciado).
-- Agrega a `convenios` los campos que la ficha muestra pero que aún no
-- existían en la tabla. Todos quedan NULL: no se insertan datos, solo se
-- habilita la estructura. La API (GET /agreements usa SELECT c.*) los
-- devuelve automáticamente y la ficha los muestra solos.
--
-- Ejecutar en phpMyAdmin, con la base `gestion_convenios` seleccionada
-- (o importar este archivo desde la pestaña "Importar").
--
-- Nota: NO se crea una columna `alcance` en convenios porque el término
-- "alcance" ya nombra otra cosa del sistema (el alcance por unidad:
-- facultad, rectorado, etc. del panel de administración). El campo de
-- ficha equivalente es `obligaciones`, `objeto` y las condiciones.

ALTER TABLE `convenios`
  ADD COLUMN `obligaciones` TEXT NULL DEFAULT NULL,
  ADD COLUMN `condiciones_rescision` TEXT NULL DEFAULT NULL,
  ADD COLUMN `condiciones_renovacion` TEXT NULL DEFAULT NULL,
  ADD COLUMN `notas` TEXT NULL DEFAULT NULL,
  ADD COLUMN `resolucion` VARCHAR(255) NULL DEFAULT NULL,
  ADD COLUMN `expediente` VARCHAR(255) NULL DEFAULT NULL;

-- Concurrencia optimista: estampa de la última modificación del convenio.
-- El backend la escribe con NOW() en cada cambio de estado y el cliente la
-- envía de vuelta para detectar ediciones simultáneas (respuesta 409).
ALTER TABLE `convenios`
  ADD COLUMN `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL;
