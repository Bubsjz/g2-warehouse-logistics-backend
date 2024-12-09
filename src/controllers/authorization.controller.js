const bcrypt = require("bcrypt") 

const { selectByEmail, selectAll, selectById, insertUser } = require("../models/authorization.model")
const { createToken } = require("../utils/helpers")


const login = async (req, res, next) => {
    const { email, password } = req.body

    //User exists?
    const user = await selectByEmail(email)
    if(!user) return res.status(401).json({ error: "Incorrect email or password" })
    
    //Passwords match?
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(401).json({ error: "Incorrect email or passwords" })
    
    res.json({message:`Hello ${user.role}!`, role: user.role, token: createToken(user)})
}

const register = async (req, res, next) => {
    req.body.password = await bcrypt.hash(req.body.password, 8)
    try {
        const [result] = await insertUser(req.body)
        const [newUser] = await selectById(result.insertId)
        res.json(newUser)
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
     console.log(req.user)
     const [user] = await selectAll()
     res.json(user)
}


module.exports = {
    login, getAll, register
}