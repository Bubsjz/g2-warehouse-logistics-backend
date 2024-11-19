const { getAllUsers, getUsersById, createUser, updateUser, deleteUser, getAllWarehouse, createWarehouse, getWarehouseById, updateWarehouse, deleteWarehouse } = require('../controllers/boss.controller');

const router = require('express').Router();

router.get('/users', getAllUsers)
router.get('/warehouse', getAllWarehouse)
router.get('/users/:id', getUsersById )
router.get('/warehouse/:id', getWarehouseById)

router.post('/users', createUser)
router.post('/warehouse', createWarehouse)

router.put('/users/:id', updateUser)
router.put('/warehouse/:id', updateWarehouse)

router.delete('/users/:id', deleteUser)
router.delete('/warehouse/:id', deleteWarehouse)

module.exports = router;