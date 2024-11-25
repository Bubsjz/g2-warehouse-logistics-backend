const { selectAll, selectById, selectOutgoingOrders, selectIncomingOrders, changeOrderStatus } = require("../models/manager.model")

// Pedidos de salida
const getOutgoingOrders = async (req, res, next) => {

    try {
        const warehouseId = req.user.assigned_id_warehouse //this comes from middleware
        const [orders] = await selectOutgoingOrders(warehouseId)
        res.json(orders)
        
    } catch (error) {
        next(error)
    }
}

// Pedidos de entrada
const getIncomingOrders = async (req, res, next) => {

    try {
      const warehouseId = req.query.warehouseId
      const [orders] = await selectIncomingOrders(warehouseId)
      res.json(orders)

    } catch (error) {
        next(error)
    }
}

// Actualización status
const updateOrderStatus = async (req, res, next) => {

    try {
        const orderId = req.params.id
        const { status, comments } = req.body
        const result = await changeOrderStatus(orderId, status, comments)
        res.json({ message: "Order status updated successfully", result })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOutgoingOrders, getIncomingOrders, updateOrderStatus
}