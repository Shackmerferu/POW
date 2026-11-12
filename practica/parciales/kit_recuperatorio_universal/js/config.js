/*
  ADAPTAR ESTE ARCHIVO PRIMERO.
  Los valores de ejemplo son genéricos. Reemplazalos por los nombres exactos del parcial.
*/
window.APP = {
  API_BASE:
    "http://localhost/facultad/POW/practica/parciales/kit_recuperatorio_universal/",

  ENDPOINTS: {
    login: "api/login.php",
    verify: "api/verificar-token.php",
    list: "api/entidad_listar.php",
    create: "api/entidad_guardar.php",
    update: "api/entidad_actualizar.php",
    delete: "api/entidad_borrar.php",
    upload: "api/entidad_guardar_imagen.php",
  },

  AUTH: {
    userField: "usuario",
    passwordField: "clave",
    tokenResponseKey: "token",
    tokenStorageKey: "token",
    // "query" agrega token a la URL; "body" lo envía en POST; "header" usa Authorization.
    tokenMode: "query",
    tokenParameter: "token",
    tokenHeader: "Authorization",
    tokenPrefix: "Bearer ",
  },

  RESPONSE: {
    listKey: "registros", // ej. "personas", "productos", "data"
    itemKey: "registro", // ej. "persona", "producto", "data"
    successKey: "status",
    successValue: 200,
  },

  ENTITY: {
    singular: "Registro",
    plural: "Registros",
    idField: "id",
    fields: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripción" },
      { key: "valor", label: "Valor" },
    ],
    // Los nombres a la izquierda son los que espera el PHP.
    payload: {
      nombre: "nombre",
      descripcion: "descripcion",
      valor: "valor",
      extra: "categoria",
    },
  },

  IMAGE: {
    fileField: "imagen",
    nameField: "nombre",
    descriptionField: "descripcion",
    altField: "texto_alternativo",
    imageTitleField: "titulo_imagen",
    longDescriptionField: "descripcion_larga",
    headlineField: "titulo",
  },
};
