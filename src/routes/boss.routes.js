const { getAllUsers, getUsersById, createUser, updateUser, deleteUser, getAllWarehouse } = require('../controllers/boss.controller');

const router = require('express').Router();

router.get('/users', getAllUsers)
router.get('/users/:id', getUsersById )
router.get('/warehouse', getAllWarehouse)

router.post('/users', createUser)

router.put('/users/:id', updateUser)

router.delete('/users/:id', deleteUser)

module.exports = router;