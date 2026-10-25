const Torta = require("../models/torta.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "datos vacios!"
    });
  }

  const torta = new Torta({
    //id: req.body.id,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio || 0
  });

  Torta.create(torta, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "error al crear la torta."
      });
    else res.send(data);
  });
};

exports.list = (req, res) => {
  Torta.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "error al buscar las tortas."
      });
    else res.send({"status": 200, "data":data});
  });
};

exports.getId = (req, res) => {
  Torta.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `torta no encontrada id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "error al buscar id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "sin contenido!"
    });
  }

  console.log(req.body);

  Torta.updateById(
    req.params.id,
    new Torta(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `torta no encontrada id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "error al actualizar la torta id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Torta.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `torta no encontrada id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "no se puede borrar la torta id " + req.params.id
        });
      }
    } else res.send({ message: `torta borrada!` });
  });
};
