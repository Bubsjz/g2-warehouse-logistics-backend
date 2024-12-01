const jwt =  require("jsonwebtoken")
const { selectById } = require("../models/authorization.model")
const fs = require('fs')
const path = require('path')
const { selectAllUsers, selectAllWarehouse } = require("../models/boss.model")
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
    next()
}

const cleanImages = async (req, res, next) => {
    try {
        const [users] = await selectAllUsers()
        const [warehouses] = await selectAllWarehouse()

        const dbImages = [
            ...users.map((users) => user.image),
            ...warehouses.map((warehouse) => warehouse.image),
        ].filter((image) => image !== null)

        const uploadDir = path.join(__dirname, '../../uploads')
        const uploadFiles = fs.readdirSync(uploadDir)

        uploadFiles.forEach((file) => {
            if(!dbImages.includes(file)) {
                const filePath = path.join(uploadDir, file)
                fs.unlink(filePath), (err) => {
                    if (err) {
                        console.error(`Error deleting image ${file}:`, err)
                    } else {
                        console.log(`Image deleted: ${file}`)
                    }
                }
            }
        })
        next()
    } catch (error) {
        console.log('Error during the cleaning images', error)
        next(error)
    }
}

module.exports = {
    checkToken, authenticateManager, validateWarehouseId, authenticateOperator, authenticateBoss, validateImage, cleanImages
}