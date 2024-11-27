const express = require('express')
const { checkToken, authenticateManager, authenticateOperator, authenticateBoss } = require('../utils/middlewares')
const router = express.Router()

router.use("/login", require ("./api/authorization.routes"))

router.use("/manager", checkToken, authenticateManager, require ("./api/manager.routes"))
router.use("/operator", checkToken, authenticateOperator, require ("./api/operator.routes"))
router.use("/boss", checkToken, authenticateBoss, require ("./api/boss.routes"))



module.exports = router