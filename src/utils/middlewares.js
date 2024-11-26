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

const authenticateOperator = (req, res, next) => {
    if(req.user.role !== "operator") return res.status(403).json({ message: "Acces denied: Not a operator"})
    next()

}

const authenticateBoss = (req, res, next) => {
    if(req.user.role !== "boss") return res.status(403).json({ message: "Acces denied: Not a boss"})
    next()

}

const validateWarehouseId = (req, res, next) => {
    console.log("pasa por middleware")

    const warehouseId = req.query.warehouseId;

    if (isNaN(warehouseId)) {
        return res.status(400).json({ message: "Invalid warehouseId. It must be a number." });
    }

    next();
};

function validateImage(req, res, next) {
    if (!req.file){
        return res.status(400).json({ error: 'No image was provided'})
    }
    const allowedTypes = ['image/jpeg', 'image/png']
    
    if (!allowedTypes.includes(req.file.mimetype)){
        return res.status(400).json({ error: 'File type not allowed'})
    }
    next()
}

module.exports = {
    checkToken, authenticateManager, validateWarehouseId, authenticateOperator, authenticateBoss, validateImage
}