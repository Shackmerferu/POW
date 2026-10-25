const sql = require("../db/db.js");

// constructor
const Torta = function (torta) {
    this.nombre = torta.nombre;
    this.descripcion = torta.descripcion;
    this.precio = torta.precio;
};

Torta.create = (newTorta, result) => {
    sql.query("INSERT INTO tortas SET ?", newTorta, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("torta creada: ", { id: res.insertId, ...newTorta });
        result(null, { id: res.insertId, ...newTorta });
    });
};


Torta.findById = (id, result) => {
    sql.query(`SELECT * FROM tortas WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("torta encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
    });
};

Torta.getAll = (result) => {
    let query = "SELECT * FROM tortas";

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tortas: ", res);
        result(null, res);
    });
};

Torta.updateById = (id, torta, result) => {
    sql.query(
        "UPDATE tortas SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?",
        [torta.nombre, torta.descripcion, torta.precio, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("torta actualizada: ", { id: id, ...torta });
            result(null, { id: id, ...torta });
        }
    );
};

Torta.remove = (id, result) => {
    sql.query("DELETE FROM tortas WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Tutorial with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("torta borrada id: ", id);
        result(null, res);
    });
};

Torta.removeAll = result => {
    sql.query("DELETE FROM tortas", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} tortas`);
        result(null, res);
    });
};

module.exports = Torta;