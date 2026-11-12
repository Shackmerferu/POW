window.api = {
  // Construye la URL completa del endpoint.
  url(endpoint) {
    const base = APP.API_BASE.replace(/\/+$/, "");
    const path = String(endpoint).replace(/^\/+/, "");

    return `${base}/${path}`;
  },

  // Ejecuta las peticiones HTTP.
  async request(endpoint, options = {}) {
    const url = endpoint;

    console.log("Petición:", options.method || "GET", url);

    let response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      throw new Error(
        "No se pudo conectar con el servidor. Verificá Apache, la URL y la configuración CORS.",
      );
    }

    const raw = await response.text();

    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("La API no devolvió JSON válido: " + raw.slice(0, 180));
    }

    if (!response.ok) {
      throw new Error(
        data.mensaje || data.error || `Error HTTP ${response.status}`,
      );
    }

    if (
      data[APP.RESPONSE.successKey] !== undefined &&
      data[APP.RESPONSE.successKey] !== APP.RESPONSE.successValue
    ) {
      throw new Error(
        data.mensaje ||
          data.error ||
          "La operación no fue aceptada por la API.",
      );
    }

    return data;
  },

  // Peticiones GET.
  get(endpoint, params = {}, withToken = false) {
    const url = new URL(this.url(endpoint));

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const headers = {};

    if (withToken && APP.AUTH.tokenMode === "query") {
      url.searchParams.set(
        APP.AUTH.tokenParameter,
        sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "",
      );
    }

    if (withToken && APP.AUTH.tokenMode === "header") {
      headers[APP.AUTH.tokenHeader] =
        APP.AUTH.tokenPrefix +
        (sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "");
    }

    return this.request(url.href, {
      method: "GET",
      headers,
    });
  },

  // Peticiones POST.
  post(endpoint, values = {}, withToken = true) {
    const body = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      body.set(key, value ?? "");
    });

    if (withToken && APP.AUTH.tokenMode === "body") {
      body.set(
        APP.AUTH.tokenParameter,
        sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "",
      );
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (withToken && APP.AUTH.tokenMode === "header") {
      headers[APP.AUTH.tokenHeader] =
        APP.AUTH.tokenPrefix +
        (sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "");
    }

    // En modo "query" el token viaja en la URL, tambien para POST.
    let url = this.url(endpoint);
    if (withToken && APP.AUTH.tokenMode === "query") {
      const urlConToken = new URL(url);
      urlConToken.searchParams.set(
        APP.AUTH.tokenParameter,
        sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "",
      );
      url = urlConToken.href;
    }

    return this.request(url, {
      method: "POST",
      headers,
      body,
    });
  },

  // Subida de archivos.
  upload(endpoint, formData) {
    if (APP.AUTH.tokenMode === "body") {
      formData.set(
        APP.AUTH.tokenParameter,
        sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "",
      );
    }

    const headers = {};

    if (APP.AUTH.tokenMode === "header") {
      headers[APP.AUTH.tokenHeader] =
        APP.AUTH.tokenPrefix +
        (sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "");
    }

    // En modo "query" el token viaja en la URL, tambien para el upload.
    let url = this.url(endpoint);
    if (APP.AUTH.tokenMode === "query") {
      const urlConToken = new URL(url);
      urlConToken.searchParams.set(
        APP.AUTH.tokenParameter,
        sessionStorage.getItem(APP.AUTH.tokenStorageKey) || "",
      );
      url = urlConToken.href;
    }

    return this.request(url, {
      method: "POST",
      headers,
      body: formData,
    });
  },
};
