const router = require('express').Router();

const { getAllDeliveryByUser, getDeliveryById, createDelivery, updateDeliveryById } = require('../../controllers/operator.controller');



router.get('/order-list', getAllDeliveryByUser);
router.get('/modify-order/:id_delivery', getDeliveryById);
router.put('/modify-order/:id_delivery', updateDeliveryById);
router.post('/create-order', createDelivery);



module.exports = router;
