const jwt =  require("jsonwebtoken")
const { selectById } = require("../models/authorization.model")

const checkToken = async (req, res, next) => {

    // Token exists?
    const authHeaders = req.headers["authorization"]
    if(!authHeaders) {
        return res.status(403).json({ message: "Token is missing"})
    }

    try {
        // Verify if token is correct
        let data = jwt.verify(authHeaders, process.env.PRIVATEKEY)
        // console.log("middleware")
        // console.log(data)

        // Check if user exists
        const [user] = await selectById(data.user_id)
        if(!user) return res.status(403).json({ message: "User does not exist" })
        req.user = user[0]

    } catch (error) {
        return res.status(403).json({ message: "Incorrect authorization"})
    }


    // console.log(req.user)
    next()
}

const authenticateManager = (req, res, next) => {
    if(req.user.role !== "manager") return res.status(403).json({ message: "Acces denied: Not a manager"})
    next()

}

module.exports = {
    checkToken, authenticateManager
}