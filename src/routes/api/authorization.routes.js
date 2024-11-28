const router = require('express').Router();

const { login } = require('../../controllers/authorization.controller');


router.post("/", login)

module.exports = router;