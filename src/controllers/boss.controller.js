const bcrypt = require("bcrypt")

const { selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserById, selectAllWarehouse, selectWarehouseById, insertWarehouse, updateWarehouseById, deleteWarehouseById, selectAvailabeTrucks, selectTruckById, selectAvailableWarehouse } = require("../models/boss.model")

const fs = require('fs')
const path = require('path')
const { handleImageFile, getImageUrl, getCoordinatesFromAddress } = require("../utils/helpers")

const getAllUsers = async (req, res, next) => {
    try {
        const [users] = await selectAllUsers()
        const usersImageUrls = users.map(user => ({
            ...user,
            image: getImageUrl(user.image)
        }))
        res.json(usersImageUrls)
    } catch (error) {
        next(error)
    };
}

const getAllWarehouse = async (req, res, next) => {
    try {
        const [warehouse] = await selectAllWarehouse()
        const warehousesImageUrls = warehouse.map((warehouse) => ({
            ...warehouse,
            image: getImageUrl(warehouse.image)
        }))
        res.json(warehousesImageUrls)
    } catch (error) {
        next(error)
    }
}

const getTruckById = async (req, res, next) => {
    try {
        const { id } = req.params
        const [plate] = await selectTruckById(id)
        res.json(plate[0])
    } catch (error) {
        next(error)
    }
}

const getAvailableTrucks = async (req, res, next) => {
    try {
        const [trucks] = await selectAvailabeTrucks()
        res.json(trucks)
    } catch (error) {
        next(error)
    }
}

const getAvailableWarehouse = async (req, res, next) => {
    try {
        const [warehouse] = await selectAvailableWarehouse()
        res.json(warehouse)
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
        const user = result[0]
        user.image = user.image ? getImageUrl(user.image) : null
        res.json(user)
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
        const { id_user, user_name, surname, email, role, user_image, ...warehouseData} = result[0]

        const warehouse = {
            ...warehouseData,
            image: warehouseData.image ? getImageUrl(warehouseData.image) : null,
            users: result
            .filter(row => row.id_user)
            .map(({ id_user, user_name, surname, email, role}) => ({
                id_user,
                name: user_name,
                surname,
                email,
                role
            }))
    }
    res.json(warehouse)
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
        user[0].image = user[0].image ? getImageUrl(user[0].image) : null
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

        const { latitude, longitude } = await getCoordinatesFromAddress(req.body.address)

        const warehouseData = {
            ...req.body,
            image: req.file ? req.file.filename : null,
            latitude,
            longitude
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
        warehouse[0].image = warehouse[0].image ? getImageUrl(warehouse[0].image) : null
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
        const [existingUser] = await selectUserById(id)
        if(!existingUser.length){
            return res.status(404).json({error: 'User not found'})
        }

        const userData = { ...existingUser[0], ...req.body}

        if (req.body.password){
            userData.password = await bcrypt.hash(req.body.password, 8)
        } 

        if(req.file) {
            const newImageName = handleImageFile.getNewImageName("user", id, req.file)
            handleImageFile.renameImage(req.file.path, path.join(__dirname, '../../uploads', newImageName))
            userData.image = newImageName
        } else {
            userData.image = existingUser[0].image
        }
        
        await updateUserById(id, userData)

        const [updateUser] = await selectUserById(id)
        updateUser[0].image = updateUser[0].image ? getImageUrl(updateUser[0].image) : null
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
        const [existingWarehouse] = await selectWarehouseById(id)
        if(!existingWarehouse.length){
            return res.status(404).json({error: 'Warehouse not found'})
        }

        const warehouseData = { ...existingWarehouse[0], ...req.body }

        if(req.body.address) {
            const { latitude, longitude } = await getCoordinatesFromAddress(req.body.address)
            Object.assign(warehouseData, { latitude, longitude })
        }

        if (req.file) {
            const newImageName = handleImageFile.getNewImageName("warehouse", id, req.file) 
            handleImageFile.renameImage(req.file.path, path.join(__dirname, '../../uploads', newImageName))
            warehouseData.image = newImageName
        }

        await updateWarehouseById(id, warehouseData);

        const [updateWarehouse] = await selectWarehouseById(id)
        updateWarehouse[0].image = getImageUrl(updateWarehouse[0].image)
        res.json(updateWarehouse[0])
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
    getAllUsers, getUsersById, getAllWarehouse, getWarehouseById, getTruckById, getAvailableTrucks, getAvailableWarehouse, createUser, createWarehouse, updateUser, updateWarehouse, deleteUser, deleteWarehouse
}