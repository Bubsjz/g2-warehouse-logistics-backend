const { getAllUsers } = require('../controllers/boss.controller');

const router = require('express').Router();

router.get('/users', getAllUsers)

module.exports = router;