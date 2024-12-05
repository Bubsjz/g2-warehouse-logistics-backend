const router = require('express').Router();

const { getOutgoingOrders, getIncomingOrders, getOrderById, updateOutgoingOrder, verifyIncomingOrder } = require('../../controllers/manager.controller');
const { validateDeliveryOwnership } = require('../../utils/middlewares');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)
router.get("/review-order/:id", validateDeliveryOwnership, getOrderById)

router.put("/review-order/:id", validateDeliveryOwnership, updateOutgoingOrder)
router.put("/verify-order/:id", validateDeliveryOwnership, verifyIncomingOrder)


module.exports = router;