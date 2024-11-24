const { selectByEmail, selectAll, selectById, insertUser } = require("../models/authorization.model")
const { createToken } = require("../utils/helpers")


const login = async (req, res, next) => {
    const { email, password } = req.body

    //User exist?
    const user = await selectByEmail(email)
    if(!user) return res.status(401).json({ error: "Incorrect email or password" })
        console.log(user)
    
    //Passwords coincide?
    if(password !== user.password) return res.status(401).json({ error: "Incorrect email or password" })
    
    res.json({message: "Login is correct", token: createToken(user)})
}

const register = (req, res, next) => {
    insertUser
}

const getAll = async (req, res, next) => {
     const [user] = await selectAll()
     res.json(user)
}


module.exports = {
    login, getAll, register
}