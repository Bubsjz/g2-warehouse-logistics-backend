const { selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserByid, selectAllWarehouse, deleteUserById, selectWarehouseById, insertWarehouse, updateWarehouseByid, deleteWarehouseById } = require("../models/boss.model")

const getAllUsers = async (req, res, next) => {
    try {
        const [result] = await selectAllUsers()
        res.json(result)
    } catch (error) {
        next(error)
    };
}

const getAllWarehouse = async (req, res, next) => {
    try {
        const [result] = await selectAllWarehouse()
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getUsersById = async (req, res, next) => {
    try {
        const { id } = req.params
        const [result] = await selectUserById(id)
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(result[0])
    } catch (error) {
        next(error)
    }
}

const getWarehouseById = async (req, res, next) => {
    try {
        const { id } = req.params
        const [result] = await selectWarehouseById(id)
        if (result.length === 0) {
            return res.status(404).json({ error: 'Warehouse not found' })
        }
        res.json(result[0])
    } catch (error) {
        next (error)
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

const createWarehouse = async (req, res, next) => {
    try {
        const [result] = await insertWarehouse(req.body)
        const [warehouse] = await selectWarehouseById(result.insertId)
        res.status(201).json(warehouse[0])
    } catch (error) {
        next (error)
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

const updateWarehouse = async (req, res, next) => {
    const { id } = req.params
    try {
        await updateWarehouseByid(id, req.body)
        const [warehouse] = await selectWarehouseById(id)
        res.json(warehouse[0])
    } catch (error) {
        next (error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const [user] = await selectUserById(id)
        await deleteUserById(id)
        res.json(user[0])
    } catch (error) {
        next(error)
    }
}

const deleteWarehouse = async (req, res, next) => {
    const { id } = req.params
    try {
        const [warehouse] = await selectWarehouseById(id)
        await deleteWarehouseById(id)
        res.json(warehouse[0])
    } catch (error) {
        next (error)
    }
}

module.exports = {
    getAllUsers, getUsersById, getAllWarehouse, getWarehouseById, createUser, createWarehouse, updateUser, updateWarehouse, deleteUser, deleteWarehouse
}