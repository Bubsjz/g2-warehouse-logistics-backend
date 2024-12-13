const jwt =  require("jsonwebtoken")
const fs = require('fs')
const path = require('path')

const { selectById } = require("../models/authorization.model")
const { selectAllUsers, selectAllWarehouse } = require("../models/boss.model")
const {checkDelivery} = require("../models/operator.model")
const { checkDeliveryOwnership, selectOrderById } = require("../models/manager.model")


const checkToken = async (req, res, next) => {

    // Token exists?
    const authHeaders = req.headers["authorization"]
    if(!authHeaders) {
        return res.status(403).json({ message: "Token is missing"})
    }

    try {
        // Verify if token is correct
        let data = jwt.verify(authHeaders, process.env.PRIVATEKEY)

        // Check if user exists
        const [user] = await selectById(data.user_id)
        if(!user) return res.status(403).json({ message: "User does not exist" })
        req.user = user[0]

    } catch (error) {
        return res.status(403).json({ message: "Incorrect authorization"})
    }

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
    const warehouseId = req.user.assigned_id_warehouse;

    if (isNaN(warehouseId)) {
        return res.status(400).json({ message: "Invalid warehouseId. It must be a number." });
    }
    next();
};

const validateDeliveryOwnership = async (req, res, next) => {
    const orderId = req.params.id
    const warehouseId = req.user.assigned_id_warehouse

    try {
        const [order] = await checkDeliveryOwnership(orderId, warehouseId, warehouseId)
        if(order.length === 0) return res.status(403).json({ message: "Access denied: Order doesn't belong to your warehouse" })
        next()

    } catch (error) {
        next(error)
    }

}

const validateNewStatus = async (req, res, next) => {
    const status = req.body.status
    const orderId = req.params.id
    const warehouseId = req.user.assigned_id_warehouse

    const [currentOrder] = await selectOrderById(orderId, warehouseId, warehouseId)
    if(currentOrder[0].status === status) return res.status(400).json({ message: "Order is already in the requested status." })

    next()
}




function validateImage(req, res, next) {
    if (!req.file){
        return res.status(400).json({ error: 'No image was provided'})
    }
    next()
}

// Limpiar imágenes no utilizadas en la carpeta uploads
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

const checkDeliveryByUser = async (req, res, next) => {
    const id_user = req.user.id_user;
    const {id_delivery} = req.params
    try {
        [delivery] = await checkDelivery(id_delivery, id_user)
        if (delivery.length === 0) {
            return res.status(404).json({ error: "Inserted order doesn't belong to this user"})
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({error: "Internal error"});
    }
}
module.exports = {
    checkToken, authenticateManager, validateWarehouseId,  validateDeliveryOwnership,authenticateOperator, authenticateBoss, validateImage, cleanImages, checkDeliveryByUser, validateNewStatus
}