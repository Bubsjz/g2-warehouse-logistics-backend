const express = require('express')
const { checkToken, authenticateManager, authenticateOperator } = require('../utils/middlewares')
const router = express.Router()

router.use("/manager", checkToken, authenticateManager, require ("./api/manager.routes"))
router.use("/operator", checkToken, authenticateOperator, require ("./api/apiOperarioRoutes"))



module.exports = router