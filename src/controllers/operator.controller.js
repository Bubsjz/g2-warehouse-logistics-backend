const { selectAll, selectById, postDelivery, postProducts, selectProductByDelivery, updateById, updateProductsById, removeProductsById} = require("../models/operator.model");

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
        const [products] = await selectProductByDelivery(id_delivery)
        result[0].products = products
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
        result[0].products = productos
        res.json(result);
    } catch (error) {
        next(error)
    }
};
const updateDeliveryById = async (req, res, next) => {
    const {id_delivery} = req.params;
    try {
        await updateById(req.body, id_delivery)
        const [result] = await selectById(id_delivery)
        await removeProductsById(id_delivery)
        for (const producto of req.body.products) {
            await postProducts(producto, id_delivery);
          }
        const [products] = await selectProductByDelivery(id_delivery)
        result[0].products = products
        res.json(result);
    } catch (error) {
        next(error)
    }
};
module.exports = {
    getAllDeliveryByUser, getDeliveryById, createDelivery, updateDeliveryById
}