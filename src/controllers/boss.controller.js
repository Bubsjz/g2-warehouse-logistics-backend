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
        const [result] = await insertUser(req.body)
        const [user] = await selectUserById(result.insertId)
        res.status(201).json(user[0])
    } catch (error) {
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
        // Procesar la nueva imagen (si se sube)
        let newImageName = null;
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            newImageName = `warehouse-${id}${extension}`;
            // Renombrar la nueva imagen para sobrescribir la existente
            const newImagePath = path.join(__dirname, '../../uploads', newImageName);
            fs.renameSync(req.file.path, newImagePath);
        }
        // Actualizar el almacén en la base de datos
        const warehouseData = {
            ...req.body,
            image: newImageName // La imagen se actualizará solo si hay una nueva
        };
        await updateWarehouseById(id, warehouseData);
        // Obtener el almacén actualizado
        const [updatedWarehouse] = await selectWarehouseById(id);
        res.json(updatedWarehouse[0]);
    } catch (error) {
        // Si ocurre un error, eliminar la imagen subida (si existe)
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error al eliminar la imagen temporal:', err);
            });
        }
        next(error);
    }
};


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