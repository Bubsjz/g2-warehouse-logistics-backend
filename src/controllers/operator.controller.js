const { selectAll, selectById, postDelivery, postProducts, selectProductByDelivery, updateById} = require("../models/operator.model");

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
    console.log (id_delivery)
    try {
        const [result] = await selectById (id_delivery);
        result.products = await selectProductByDelivery(id_delivery)
        res.json(result);
    } catch (error) {
        next(error);
    }
};
const createDelivery = async (req, res, next) => {
    try {
        const [newDelivery] = await postDelivery (req.body);
        const [result] = await selectById(newDelivery.insertId)
        for (const producto of req.body.products) {
            await postProducts(producto, newDelivery.insertId);
          }
        const [productos] = await selectProductByDelivery(newDelivery.insertId)
        result[0].productos = productos
        res.json(result);
    } catch (error) {
        next(error)
    }
};
const updateDeliveryById = async (req, res, next) => {
    const {id_delivery} = req.params;
    try {
        const [result] = await updateById(req.body, id_delivery);
        console.log(result)
        result[0].products = await updateProducts (req.body.products, id_delivery)
        res.json(result);
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getAllDeliveryByUser, getDeliveryById, createDelivery, updateDeliveryById
}