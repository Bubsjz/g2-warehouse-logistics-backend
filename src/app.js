// Creacion y configuracion de la app Express
const express = require('express');
const path = require('path')

const app = express();
app.use(express.json());


app.use('/dashboard', require('./routes/api.routes'));
app.use("/dashboard", require ("./routes/authorization.routes"))

// Rutas del jefe usuarios
app.use('/api/boss', require('./routes/boss.routes'))

app.use("/dashboard", require("./routes/api.routes"));

//Servir las imagenes de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
}) 

module.exports = app