const router = require('express').Router();

const { getOutgoingOrders, getIncomingOrders, updateOrderStatus } = require('../../controllers/manager.controller');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)

router.put("/order/:id", updateOrderStatus)


module.exports = router;