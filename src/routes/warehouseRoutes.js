const router = require('express').Router();

router.use('/operario', require('./api/apiOperarioRoutes'));

module.exports = router; 