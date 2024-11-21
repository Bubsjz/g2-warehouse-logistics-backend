const express = require('express');
const router = express.Router();

const { getOutgoingOrders, getIncomingOrders, updateOrderStatus } = require('../../controllers/manager.controller');
const validateWarehouseId = require('../../utils/middlewares');


router.get("/outgoing-orders", validateWarehouseId, getOutgoingOrders);
router.get("/incoming-orders", validateWarehouseId, getIncomingOrders)

router.put("/order/:id", updateOrderStatus)

module.exports = router;