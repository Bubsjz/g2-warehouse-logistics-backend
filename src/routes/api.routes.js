const express = require('express')
const router = express.Router()

router.use("/clientes", require ("./api/manager.routes"))    //con el middleware checkToken ponemos privada la url



module.exports = router