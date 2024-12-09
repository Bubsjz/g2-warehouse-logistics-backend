const NodeGecoder = require('node-geocoder')

const options = {
    provider: 'google',
    apiKey: process.env.GEOCODER_KEY,
    formatter: null
}

const geocoder = NodeGecoder(options)

module.exports = geocoder