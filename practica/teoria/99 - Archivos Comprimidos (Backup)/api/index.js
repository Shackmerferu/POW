const express = require("express");
const cors = require("cors");
const Tortas = require('./controllers/torta.controller.js');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "hola soy el api node." });
  });

app.get("/tortas",Tortas.list);
app.get("/tortas/:id",Tortas.getId);
app.post("/tortas",Tortas.create);
app.post("/api/tortas/:id", Tortas.update);
app.delete("/api/tortas/:id", Tortas.delete);

  // set port, listen for requests
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});