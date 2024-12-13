const http = require('http');
const app = require('./src/app');

// Si utlizamos dotenv 
require('dotenv').config();

//Creaccion del servidor 
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on('listening', () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on('error', (error) => {
    console.log(error);
});