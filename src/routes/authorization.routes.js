const { login, getAll, register } = require('../controllers/authorization.controller');
const { checkToken, authenticateManager } = require('../utils/middlewares');

const router = require('express').Router();

router.get("/manager", checkToken, authenticateManager, getAll)

router.post("/login", login)
router.post("/register", register)

module.exports = router;