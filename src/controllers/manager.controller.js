const { selectOutgoingOrders, selectIncomingOrders, changeOrderStatus, selectOrderById, selectProductsById } = require("../models/manager.model")
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
     console.log(req.user)
    try {
      const warehouseId = req.user.assigned_id_warehouse
      const [orders] = await selectIncomingOrders(warehouseId)
      
      const transformedOrders = orders.map(order => {
        if (order.status === "delivered") {
            return {...order, status: "pending reception"} 
        }
        return order
      })



      res.json(transformedOrders)

    } catch (error) {
        next(error)
    }
}

// Individual delivery
const getOrderById = async (req, res, next) => {
    const orderId = req.params.id
    try {
        const [order] = await selectOrderById(orderId)
        const [products] = await selectProductsById(orderId)
        console.log(products)
        order[0].products = products
        res.json(order)
    } catch (error) {
        next(error)
    }
}

// Status update
const updateOrderStatus = async (req, res, next) => {

    try {
        const orderId = req.params.id
        const { action, comments = null } = req.body

        let status
        if (action === "approve") {
            status = "ready departure"
        } else if (action === "reject") {
            if (!comments) {
                return res.json(400).json({ message: "Comments are required when rejecting an order" })
            }
            status = "corrections needed"
        } else {
            return res.status(400).json({ message: "Invalid action provided" })
        }

        await changeOrderStatus(orderId, status, comments)

        const [updatedOrder] = await selectById(orderId)
        res.json({ message: "Order status updated successfully", updatedOrder })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOutgoingOrders, getIncomingOrders, updateOrderStatus, getOrderById
}