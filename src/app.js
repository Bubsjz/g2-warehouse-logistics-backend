// Creacion y configuracion de la app Express
const express = require('express');
const cors = require("cors");
const path = require('path')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/', require('./routes/api.routes'));

//Servir las imagenes de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
}) 

module.exports = app