const { selectAll, selectById, postDelivery} = require("../models/apiOperarioModel");

const getAllDeliveryByUser = async (req, res, next) => {
    const {id_user} = req.user;
    try {
        const [result] = await selectAll(id_user);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
const getDeliveryById = async (req, res, next) => {
    const {id_delivery} = req.params;
    try {
        const [result] = await selectById (id_delivery);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
const createDelivery = async (req, res, next) => {
    try {
        const [newDelivery] = await postDelivery (req.body);
        const [result] = await selectById(newDelivery.insertId)
        res.json(result);
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllDeliveryByUser, getDeliveryById, createDelivery
}