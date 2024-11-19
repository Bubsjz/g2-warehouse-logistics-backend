const { getAllUsers, getUsersById } = require('../controllers/boss.controller');

const router = require('express').Router();

router.get('/users', getAllUsers)
router.get('/users/:id', getUsersById )

module.exports = router;