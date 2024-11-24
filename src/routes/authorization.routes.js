const { login, getAll, register } = require('../controllers/authorization.controller');
const { checkToken } = require('../utils/middlewares');

const router = require('express').Router();

router.get("/hola", checkToken, getAll)

router.post("/login", login)
router.post("/register", register)

module.exports = router;