const { getAllUsers, getUsersById, createUser, updateUser, deleteUser, getAllWarehouse, createWarehouse, getWarehouseById, updateWarehouse, deleteWarehouse } = require('../controllers/boss.controller');

const router = require('express').Router();
const upload = require('../config/multerConfig');
const { validateImage } = require('../utils/middlewares');

router.get('/users', getAllUsers)
router.get('/warehouse', getAllWarehouse)
router.get('/users/:id', getUsersById )
router.get('/warehouse/:id', getWarehouseById)

router.post('/users', createUser)
router.post('/warehouse', upload.single('image'), validateImage, createWarehouse)

router.put('/users/:id', updateUser)
router.put('/warehouse/:id', upload.single('image'), validateImage, updateWarehouse)

router.delete('/users/:id', deleteUser)
router.delete('/warehouse/:id', deleteWarehouse)

module.exports = router;