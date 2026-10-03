/* Funcion comun de guardado de las actividades del TP4.
   Logica usada en los trabajos practicos anteriores:
   localStorage guarda unicamente strings, por eso se convierte el objeto
   a texto con JSON.stringify y se recupera con JSON.parse. */
var Almacen = {
    leer: function (clave, valorPorDefecto) {
        var texto = localStorage.getItem(clave);
        if (texto === null) {
            return valorPorDefecto;
        }
        try {
            return JSON.parse(texto);
        } catch (error) {
            return valorPorDefecto;
        }
    },

    guardar: function (clave, valor) {
        localStorage.setItem(clave, JSON.stringify(valor));
    },

    borrar: function (clave) {
        localStorage.removeItem(clave);
    }
};