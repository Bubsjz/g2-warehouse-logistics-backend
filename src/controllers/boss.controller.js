const bcrypt = require("bcrypt")

const { selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserById, selectAllWarehouse, selectWarehouseById, insertWarehouse, updateWarehouseById, deleteWarehouseById } = require("../models/boss.model")

const fs = require('fs')
const path = require('path')

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
            const extension = path.extname(req.file.originalname)
            const newImageName = `user-${userId}${extension}`
            const oldImagePath = path.join(__dirname, '../../uploads', req.file.filename)
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)

            fs.renameSync(oldImagePath, newImagePath)

            const updateData = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                image: newImageName,
                assigned_id_warehouse: req.body.assigned_id_warehouse,
                assigned_id_truck: req.body.assigned_id_truck
            }

            await updateUserById(userId, updateData)
        }
        const [user] = await selectUserById(userId)
        res.status(201).json(user[0])
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting the temporary image:', err)
            })
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
            const extension = path.extname(req.file.originalname)
            const newImageName = `warehouse-${warehouseId}${extension}`
            const oldImagePath = path.join(__dirname, '../../uploads', req.file.filename)
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)

            fs.renameSync(oldImagePath, newImagePath)

            const updateData = {
                name: req.body.name,
                locality: req.body.locality,
                address: req.body.address,
                image: newImageName
            }

            await updateWarehouseById(warehouseId, updateData)
        }
        const [warehouse] = await selectWarehouseById(warehouseId)
        res.status(201).json(warehouse[0])
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting the temporary image:', err);
            });
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
            const extension = path.extname(req.file.originalname)
            newImageName = `user-${id}${extension}`
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)
            fs.renameSync(req.file.path, newImagePath)
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
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting the temporary image:', err);
        });
        next(error)
    }
}

const updateWarehouse = async (req, res, next) => {
    const { id } = req.params
    try {
        let newImageName = null
        if (req.file) {
            const extension = path.extname(req.file.originalname)
            newImageName = `warehouse-${id}${extension}`
            const newImagePath = path.join(__dirname, '../../uploads', newImageName)
            fs.renameSync(req.file.path, newImagePath)
        }
        const warehouseData = {
            ...req.body,
            image: newImageName
        };
        await updateWarehouseById(id, warehouseData);
        const [updatedWarehouse] = await selectWarehouseById(id)
        res.json(updatedWarehouse[0])
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting the temporary image:', err)
            })
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

        const imagePath = path.join(__dirname, '../../uploads', user[0].image);

        if (user[0].image && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

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
        const imagePath = path.join(__dirname, '../../uploads', warehouse[0].image)
        if (warehouse[0].image && fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
        }
        await deleteWarehouseById(id)
        res.json(warehouse[0])
    } catch (error) {
        next (error)
    }
}

module.exports = {
    getAllUsers, getUsersById, getAllWarehouse, getWarehouseById, createUser, createWarehouse, updateUser, updateWarehouse, deleteUser, deleteWarehouse
}