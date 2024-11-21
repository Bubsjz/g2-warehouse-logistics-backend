const router = require('express').Router();
const { getAllDeliveryByUser } = require('../../controllers/apiOperarioController');
//GET'S//
router.get('/:userId', getAllDeliveryByUser);


module.exports = router;
