const router = require('express').Router();

const { getOutgoingOrders, getIncomingOrders, getOrderById, updateOutgoingOrder, verifyIncomingOrder } = require('../../controllers/manager.controller');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)
router.get("/review-order/:id", getOrderById)

router.put("/review-order/:id", updateOutgoingOrder)
router.put("/verify-order/:id", verifyIncomingOrder)


module.exports = router;