// Creacion y configuracion de la app Express
const express = require('express');
const cors = require("cors");
const path = require('path')
const { emailHelper } = require('./config/emailService')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/', require('./routes/api.routes'));

//Servir las imagenes de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    if (!to || !subject || !text) {
      return res.status(400).send("Missing required fields: to, subject, text");
    }
  
    try {
      let info = await emailHelper(to, subject, text);
      res.status(200).send(`Email sent: ${info.response}`);
    } catch (error) {
      console.error("Error in /send-email route:", error.message); // Log del error
      res.status(500).send(`Error sending email: ${error.message}`); // Enviar error a Postman
    }
  });

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
}) 

module.exports = app