const express = require("express");
const router = express.Router();
const verificarToken = require("../verificarToken");

const ROLES_PANEL = ["administracion", "gestion", "revision"];

function exigirAccesoAlPanel(req, res, next) {
  if (!ROLES_PANEL.includes(req.usuario?.rol)) {
    return res.status(403).json({
      status: 403,
      mensaje: "Tu rol no tiene acceso al panel administrativo.",
    });
  }

  next();
}

module.exports = (db) => {
  // Métricas limitadas a la unidad asignada.
  router.get("/", verificarToken, exigirAccesoAlPanel, (req, res) => {
    let query = `
      SELECT c.estado, COUNT(*) AS cantidad
      FROM convenios c
    `;
    const valores = [];

    if (req.usuario.id_unidad != null) {
      query += " WHERE c.id_unidad_responsable = ?";
      valores.push(req.usuario.id_unidad);
    }

    query += " GROUP BY c.estado";

    db.query(query, valores, (error, resultados) => {
      if (error) {
        console.error("Error consultando métricas:", error);
        return res.status(500).json({
          status: 500,
          mensaje: "Error consultando las métricas.",
        });
      }

      res.json({ status: 200, data: resultados });
    });
  });

  // Incluye convenios vencidos y los que ya entraron en su período de preaviso.
  router.get(
    "/alerts",
    verificarToken,
    exigirAccesoAlPanel,
    (req, res) => {
      let query = `
        SELECT
          c.id,
          c.codigo_unico,
          c.titulo,
          c.tipo,
          c.estado,
          c.fecha_vencimiento,
          COALESCE(c.dias_preaviso, 30) AS dias_preaviso,
          DATEDIFF(c.fecha_vencimiento, CURDATE()) AS dias_restantes
        FROM convenios c
        WHERE c.fecha_vencimiento IS NOT NULL
          AND DATEDIFF(c.fecha_vencimiento, CURDATE())
              <= COALESCE(c.dias_preaviso, 30)
          AND c.estado NOT IN ('archivado', 'rescindido')
      `;
      const valores = [];

      if (req.usuario.id_unidad != null) {
        query += " AND c.id_unidad_responsable = ?";
        valores.push(req.usuario.id_unidad);
      }

      query += " ORDER BY c.fecha_vencimiento ASC";

      db.query(query, valores, (error, resultados) => {
        if (error) {
          console.error("Error consultando alertas:", error);
          return res.status(500).json({
            status: 500,
            mensaje: "Error consultando las alertas.",
          });
        }

        res.json({
          status: 200,
          total: resultados.length,
          data: resultados,
        });
      });
    },
  );

  return router;
};