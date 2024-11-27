const router = require('express').Router();

const { getAllDeliveryByUser, getDeliveryById, createDelivery } = require('../../controllers/operator.controller');


router.get('/order-list', getAllDeliveryByUser);
router.get('/order-form/:id_delivery', getDeliveryById);

router.post('/order-form', createDelivery);


module.exports = router;
