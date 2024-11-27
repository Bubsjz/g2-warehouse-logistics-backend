const { selectAll, selectById, postDelivery} = require("../models/operator.model");

const getAllDeliveryByUser = async (req, res, next) => {
    console.log(req.user)
    const id = req.user.id_user;
    try {
        const [result] = await selectAll(id);
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