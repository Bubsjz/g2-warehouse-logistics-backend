//aqui ponemos la creación del token 

const jwt = require('jsonwebtoken')

function getImageUrl(imageFilename) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    return `${baseUrl}/uplods/${imageFilename}`
}

module.exports = { getImageUrl }
