const { selectOutgoingOrders, selectIncomingOrders, changeOrderStatus } = require("../models/manager.model")
const { selectById } = require("../models/operator.model")

// Outgoing deliveries
const getOutgoingOrders = async (req, res, next) => {
    // console.log(req.user)
    try {
        const warehouseId = req.user.assigned_id_warehouse
        const [orders] = await selectOutgoingOrders(warehouseId)
        res.json(orders)
        
    } catch (error) {
        next(error)
    }
}

// Incoming deliveries
const getIncomingOrders = async (req, res, next) => {
    // console.log(req.user)
    try {
      const warehouseId = req.user.assigned_id_warehouse
      const [orders] = await selectIncomingOrders(warehouseId)
      res.json(orders)

    } catch (error) {
        next(error)
    }
}

// Status update
const updateOrderStatus = async (req, res, next) => {

    try {
        const orderId = req.params.id
        const { status, comments } = req.body
        const [result] = await changeOrderStatus(orderId, status, comments)
        const [updatedOrder] = await selectById(orderId)
        res.json({ message: "Order status updated successfully", updatedOrder })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOutgoingOrders, getIncomingOrders, updateOrderStatus
}