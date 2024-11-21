const express = require('express');
const router = express.Router();

const { getClientById, getOutgoingOrders, getIncomingOrders } = require('../../controllers/manager.controller');


router.get("/outgoing-orders", getOutgoingOrders);
router.get("/incoming-orders", getIncomingOrders)


module.exports = router;