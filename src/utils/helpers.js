const jwt = require('jsonwebtoken')

const createToken = (user) => {
    const data = {
        user_id: user.id_user,
        user_name: user.name,
        user_surname: user.surname,
        user_role: user.role,
    }

    const token =  jwt.sign(data, process.env.PRIVATEKEY, { expiresIn: "1h" })
    return token
}

function getImageUrl(imageFilename) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    return `${baseUrl}/uploads/${imageFilename}`
}

module.exports = {
    createToken, getImageUrl
}
