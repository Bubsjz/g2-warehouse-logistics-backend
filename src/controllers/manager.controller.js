const { selectAll, selectById, selectOutgoingOrders, selectIncomingOrders } = require("../models/manager.model")

// Pedidos de salida
const getOutgoingOrders = async (req, res, next) => {
    console.log("getOutgoingOrders")

    try {
        const warehouseId = req.query.warehouseId
        const [orders] = await selectOutgoingOrders(warehouseId)
        res.json(orders)
    } catch (error) {
        next(error)
    }
}


// Pedidos de entrada
const getIncomingOrders = async (req, res, next) => {
    console.log("getIncomingOrders")

    
    try {
      const warehouseId = req.query.warehouseId
      const [orders] = await selectIncomingOrders(warehouseId)
      res.json(orders)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOutgoingOrders, getIncomingOrders
}