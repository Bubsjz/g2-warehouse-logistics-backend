const bcrypt = require("bcrypt")

const { selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserById, selectAllWarehouse, selectWarehouseById, insertWarehouse, updateWarehouseById, deleteWarehouseById } = require("../models/boss.model")

const fs = require('fs')
const path = require('path')
const { handleImageFile } = require("../utils/helpers")

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
        res.json (result[0])
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
        res.json({
            ...result[0],
            users: result
            .filter(row => row.id_user)
            .map(({ id_user, user_name, surname, email, role}) => ({
                id_user,
                name: user_name,
                surname,
                email,
                role
            }))
    })
    } catch (error) {
        next (error)
    }
}

const createUser = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        req.body.password = hashedPassword

        const userData = {
            ...req.body,
            image: req.file ? req.file.filename : null
        }
        const [result] = await insertUser(userData)
        const userId = result.insertId

        if (req.file){
            const newImageName = handleImageFile.getNewImageName("user", userId, req.file)
            const oldImagePath = req.file.path
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)

            handleImageFile.renameImage(oldImagePath, newImagePath)

            await updateUserById(userId, { ...userData, image: newImageName})
        }
        const [user] = await selectUserById(userId)
        res.status(201).json(user[0])
    } catch (error) {
        if(req.file){
            handleImageFile.deleteImage(req.file.filename)
        }
        next(error)
    }
}



const createWarehouse = async (req, res, next) => {
    try {
        const warehouseData = {
            ...req.body,
            image: req.file ? req.file.filename : null
        }
        const [result] = await insertWarehouse(warehouseData)
        const warehouseId = result.insertId
        if (req.file){
            const newImageName = handleImageFile.getNewImageName("warehouse", warehouseId, req.file)
            const oldImagePath = req.file.path
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)

            handleImageFile.renameImage(oldImagePath, newImagePath)

            await updateWarehouseById(warehouseId, { ...warehouseData, image: newImageName})
        }
        const [warehouse] = await selectWarehouseById(warehouseId)
        res.status(201).json(warehouse[0])
    } catch (error) {
        if (req.file) {
            handleImageFile.deleteImage(req.file.filename)
        }
        next (error)
    }
}

const updateUser = async (req, res, next) => {
    const { id } = req.params
    try {
        let updatedPassword = null
        if (req.body.password){
        updatedPassword = await bcrypt.hash(req.body.password, 8)
        }

        let newImageName = null;
        if(req.file) {
            newImageName = handleImageFile.getNewImageName("user", id, req.file)
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)
            handleImageFile.renameImage(req.file.path, newImagePath)
        }
        const userData = {
            ...req.body,
            password: updatedPassword || req.body.password,
            image: newImageName || req.body.image
        }
        await updateUserById(id, userData)
        const [updateUser] = await selectUserById(id)
        res.json(updateUser[0])
    } catch (error) {
        if (req.file) {
            handleImageFile.deleteImage(req.file.filename)
        }
        next(error)
    }
}

const updateWarehouse = async (req, res, next) => {
    const { id } = req.params
    try {
        let newImageName = null
        if (req.file) {
            newImageName = handleImageFile.getNewImageName("warehouse", id, req.file)
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)
            handleImageFile.renameImage(req.file.path, newImagePath)
        }
        const warehouseData = {
            ...req.body,
            image: newImageName || req.body.image
        };
        await updateWarehouseById(id, warehouseData);
        const [updatedWarehouse] = await selectWarehouseById(id)
        res.json(updatedWarehouse[0])
    } catch (error) {
        if (req.file) {
            handleImageFile.deleteImage(req.file.filename)
        }
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [user] = await selectUserById(id);
        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        handleImageFile.deleteImage(user[0].image)

        await deleteUserById(id);
        res.json(user[0]);
    } catch (error) {
        next(error);
    }
};

const deleteWarehouse = async (req, res, next) => {
    const { id } = req.params
    try {
        const [warehouse] = await selectWarehouseById(id)
        if (!warehouse.length){
            return res.status(404).json({error: 'Warehouse not found'})
        }
        handleImageFile.deleteImage(warehouse[0].image)
        await deleteWarehouseById(id)
        res.json(warehouse[0])
    } catch (error) {
        next (error)
    }
}

module.exports = {
    getAllUsers, getUsersById, getAllWarehouse, getWarehouseById, createUser, createWarehouse, updateUser, updateWarehouse, deleteUser, deleteWarehouse
}