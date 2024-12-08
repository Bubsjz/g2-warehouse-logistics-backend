const { selectOutgoingOrders, selectIncomingOrders, changeOrderStatus, selectOrderById, selectProductsById, selectOutgoingOrderById, selectIncomingOrderById } = require("../models/manager.model")

// Outgoing deliveries
const getOutgoingOrders = async (req, res, next) => {
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

// Delivery details
const getOrderById = async (req, res, next) => {
    const orderId = req.params.id
    const warehouseId = req.user.assigned_id_warehouse

    try {
        const [order] = await selectOrderById(orderId, warehouseId, warehouseId)
        const [products] = await selectProductsById(orderId)
        order[0].products = products
        res.json(order)

    } catch (error) {
        next(error)
    }
}

// Status update outgoing deliveries
const updateOutgoingOrder = async (req, res, next) => {
    const orderId = req.params.id
    const warehouseId = req.user.assigned_id_warehouse
    const { status, comments = null } = req.body

    try {
        if (!["ready for departure", "corrections needed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        if (status === "corrections needed" && !comments) {
            return res.status(400).json({ message: "Comments are required to request changes" })
        }

        await changeOrderStatus(orderId, status, comments)

        const [updatedOrder] = await selectOrderById(orderId, warehouseId, warehouseId)
        res.json({ message: "Order status updated successfully", updatedOrder })

    } catch (error) {
        next(error)
    }
}

// Incoming order verification
const verifyIncomingOrder = async (req, res, next) => {
    const orderId = req.params.id
    const warehouseId = req.user.assigned_id_warehouse
    const { status, comments } = req.body

    try {
        if (!["approved", "not approved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }
        await changeOrderStatus(orderId, status, comments)

        const [verifiedOrder] = await selectOrderById(orderId, warehouseId, warehouseId)
        res.json({ message: "Order status updated successfully", verifiedOrder })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOutgoingOrders, getIncomingOrders, updateOutgoingOrder, getOrderById, verifyIncomingOrder
}