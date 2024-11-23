// Creacion y configuracion de la app Express
const express = require('express');


const app = express();
app.use(express.json());


// Aqui podriamos poner la configuracion de ruta: ej app.use('/api',require('./routes/apiRoutes'));
app.use("/login", require ("./routes/authorization.routes"))


// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
}) 

module.exports = app;