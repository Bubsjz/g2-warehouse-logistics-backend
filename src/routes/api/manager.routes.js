const express = require('express');
const router = express.Router();

const { getOutgoingOrders, getIncomingOrders, updateOrderStatus } = require('../../controllers/manager.controller');
const { checkToken, authenticateManager } = require('../../utils/middlewares');
const { getAll } = require('../../controllers/authorization.controller');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)
router.get("/manager", getAll)

router.put("/order/:id", updateOrderStatus)

module.exports = router;