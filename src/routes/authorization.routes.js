const { login } = require('../controllers/authorization.controller');

const router = require('express').Router();

router.post("/", login)

module.exports = router;