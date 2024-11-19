const { selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserByid, selectAllWarehouse } = require("../models/boss.model")

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

const getAllWarehouse = async (req, res, next) => {
    try {
        const [result] = await selectAllWarehouse()
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const createUser = async (req, res, next) => {
    try {
        const [result] = await insertUser(req.body)
        const [user] = await selectUserById(result.insertId)
        res.status(201).json(user[0])
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    const { id } = req.params
    try {
        await updateUserById(id, req.body)
        const [user] = await selectUserById(id)
        res.json(user[0])
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const [user] = await selectUserById(id)
        await deleteUserByid(id)
        res.json(user[0])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers, getUsersById, getAllWarehouse, createUser, updateUser, deleteUser
}