const express = require('express');
const router = express.Router();

const { getAllClientes } = require('../../controllers/manager.controller');

router.get('/', getAllClientes);


module.exports = router;