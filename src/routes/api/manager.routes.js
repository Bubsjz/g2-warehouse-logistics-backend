const router = require('express').Router();

const { getOutgoingOrders, getIncomingOrders, updateOrderStatus, getOrderById } = require('../../controllers/manager.controller');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)
router.get("/review-order/:id", getOrderById)

router.put("/review-order/:id", updateOrderStatus)


module.exports = router;