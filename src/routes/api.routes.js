const express = require('express')
const router = express.Router()

router.use("/manager", require ("./api/manager.routes"))



module.exports = router