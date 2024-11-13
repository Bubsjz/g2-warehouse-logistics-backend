const express = require('express');
const router = express.Router();

const { getAllClientes, getClientById } = require('../../controllers/manager.controller');

router.get('/', getAllClientes);
router.get("/:clientId", getClientById)


module.exports = router;