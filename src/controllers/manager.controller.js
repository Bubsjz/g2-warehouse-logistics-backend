const { selectUserById } = require("../models/boss.model")
const { selectOutgoingOrders, selectIncomingOrders, changeOrderStatus } = require("../models/manager.model")
const { selectById } = require("../models/operator.model")
const { getDeliveryById } = require("./operator.controller")

// Pedidos de salida
const getOutgoingOrders = async (req, res, next) => {
    console.log(req.user)
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
    console.log(req.user)
    try {
      const warehouseId = req.user.assigned_id_warehouse
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