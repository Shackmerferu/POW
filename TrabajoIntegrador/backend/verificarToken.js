const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Buscamos el token en la cabecera de la petición
    const autorizacion = req.headers.authorization || '';
    const token = autorizacion.startsWith('Bearer ') ? autorizacion.slice(7) : null;

    // 2. Si no hay token, rebotamos la petición antes de que llegue a la ruta
    if (!token) {
        return res.status(401).json({ status: 401, mensaje: "Acceso denegado. Faltan credenciales." });
    }

    // 3. Verificamos que el token sea válido y no esté vencido
    try {
        const datos = jwt.verify(token, 'EL_VIP');
        
        // Guardamos los datos del usuario en la request por si la ruta los necesita (ej. saber su rol)
        req.usuario = datos; 
        
        // Le damos luz verde para que pase a la ruta que quería acceder
        next(); 
    } catch (error) {
        return res.status(401).json({ status: 401, mensaje: "Token inválido o sesión expirada." });
    }
};