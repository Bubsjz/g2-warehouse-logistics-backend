const router = require('express').Router();

const { getAllDeliveryByUser, getDeliveryById, createDelivery, updateDeliveryById, deleteDeliveryById, getDeliveryInfo } = require('../../controllers/operator.controller');
const { checkDeliveryByUser } = require('../../utils/middlewares')

router.get('/order-list', getAllDeliveryByUser);
router.get('/modify-order/:id_delivery', checkDeliveryByUser, getDeliveryById);
router.get('/create-order', getDeliveryInfo);
router.post('/create-order', createDelivery);
router.put('/modify-order/:id_delivery', checkDeliveryByUser, updateDeliveryById);
router.delete('/modify-order/:id_delivery', checkDeliveryByUser, deleteDeliveryById);

module.exports = router;
