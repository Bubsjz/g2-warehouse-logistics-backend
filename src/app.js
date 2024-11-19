// Creacion y configuracion de la app Express
const express = require('express');


const app = express();
app.use(express.json());


// Rutas del jefe usuarios
app.use('/api/boss', require('./routes/boss.routes'))



// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
}) 

module.exports = app;