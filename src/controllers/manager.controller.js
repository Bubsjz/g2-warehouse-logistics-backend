const { sendEmail } = require("../config/emailService")
const { selectOutgoingOrders, selectIncomingOrders, changeOrderStatus, selectOrderById, selectProductsById, selectOutgoingOrderById, selectIncomingOrderById, selectOriginManagerEmail, selectDestinationManagerEmail } = require("../models/manager.model")
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

// Delivery details
const getOrderById = async (req, res, next) => {
    const orderId = req.params.id
    try {
        const [order] = await selectOrderById(orderId)
        const [products] = await selectProductsById(orderId)
        // console.log(products)
        order[0].products = products
        res.json(order)

    } catch (error) {
        next(error)
    }
}

// Status update outgoing deliveries
const updateOutgoingOrder = async (req, res, next) => {
    const orderId = req.params.id
    const { status, comments = null } = req.body

    try {
        if (!["ready for departure", "corrections needed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        if (status === "corrections needed" && !comments) {
            return res.status(400).json({ message: "Comments are required to request changes" })
        }

        await changeOrderStatus(orderId, status, comments)

        const [updatedOrder] = await selectOutgoingOrderById(orderId)
        console.log(updatedOrder)
        res.json({ message: "Order status updated successfully", updatedOrder })

    } catch (error) {
        next(error)
    }
}

// Incoming order verification
const verifyIncomingOrder = async (req, res, next) => {
    const orderId = req.params.id
    const userId = req.user.id_user
    const { status, comments } = req.body
    try {
        if (!["approved", "not approved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }
        await changeOrderStatus(orderId, status, comments)

        const [recipientInfo] = await selectDestinationManagerEmail(userId)
        const [managerEmail] = await selectOriginManagerEmail(orderId)
        if(!managerEmail) return res.status(404).json({ message: "Manager email not found" })
        
        const subject = status === "not approved" ? 
        `Rejected order: ${orderId}` : 
        `Approved order: ${orderId}`

        const emailMessage = status === "not approved" ? 
        `Order ${orderId} has been rejected.
        Reason: ${comments}
        Contact details: ${recipientInfo[0].name}, ${recipientInfo[0].surname}, ${recipientInfo[0].email}`
        : 
        `Order ${orderId} has been approved.
        Reason: ${comments}
        Contact details: ${recipientInfo[0].name}, ${recipientInfo[0].surname}, ${recipientInfo[0].email}`

        if(status === "not approved") {
            sendEmail(managerEmail[0].email, subject, emailMessage)
        }

        if(status === "approved") {
            sendEmail(managerEmail[0].email, subject, emailMessage)
        }

        const [verifiedOrder] = await selectIncomingOrderById(orderId)
        res.json({ message: "Order status updated successfully", verifiedOrder })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    getOutgoingOrders, getIncomingOrders, updateOutgoingOrder, getOrderById, verifyIncomingOrder
}