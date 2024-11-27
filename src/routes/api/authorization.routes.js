const { login, getAll, register } = require('../../controllers/authorization.controller');
const { checkToken, authenticateManager } = require('../../utils/middlewares');

const router = require('express').Router();

router.post("/", login)

module.exports = router;