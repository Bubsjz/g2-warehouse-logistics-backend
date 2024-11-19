const { selectAllUsers, selectUserById } = require("../models/boss.model")

const getAllUsers = async (req, res, next) => {
    try {
        const [result] = await selectAllUsers()
        res.json(result)
    } catch (error) {
        next(error)
    };
}

const getUsersById = async (req, res, next) => {
    try {
        const { id } = req.params
        const [result] = await selectUserById(id)
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(result[0])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers, getUsersById
}