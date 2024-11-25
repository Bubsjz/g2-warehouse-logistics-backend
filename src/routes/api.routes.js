const express = require('express')
const { checkToken, authenticateManager } = require('../utils/middlewares')
const router = express.Router()

router.use("/manager", checkToken, authenticateManager, require ("./api/manager.routes"))



module.exports = router