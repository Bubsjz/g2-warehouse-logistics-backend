const { selectAll, selectById, postDelivery, postProducts, selectProductByDelivery, updateById, updateProductsById, removeProductsById, removeDeliveryById, selectProducts, selectWarehouse, selectTrucks} = require("../models/operator.model");

const getAllDeliveryByUser = async (req, res, next) => {
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
        const [productos] = await selectProductByDelivery(id_delivery)
        for (const item of productos) {
            item.product_quantity = parseInt(item.product_quantity, 10);
          }
        result[0].products = productos
        res.json(result);
    } catch (error) {
        next(error);
    }
};
const getDeliveryInfo = async (req, res, next) => {
    try {
        const result = [{}];
        const [warehouse] = await selectWarehouse();
        const [truck] = await selectTrucks();
        const [productNames] = await selectProducts();
        result[0].warehouse = warehouse
        result[0].truck = truck
        result[0].productNames = productNames 
        
        res.json(result);
    } catch (error) {
        next(error)
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
        for (const item of productos) {
            item.product_quantity = parseInt(item.product_quantity, 10);
          }
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
        const [productos] = await selectProductByDelivery(id_delivery)
        for (const item of productos) {
            item.product_quantity = parseInt(item.product_quantity, 10);
          }
        result[0].products = productos
        res.json(result);
    } catch (error) {
        next(error)
    }
};
const deleteDeliveryById = async (req, res, next) => {
    const {id_delivery} = req.params;
    try {
        const [result] = await selectById (id_delivery);
        const [productos] = await selectProductByDelivery(id_delivery)
        for (const item of productos) {
            item.product_quantity = parseInt(item.product_quantity, 10);
          }
        result[0].products = productos
        await removeProductsById(id_delivery)
        await removeDeliveryById(id_delivery)
        res.json(result)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getAllDeliveryByUser, getDeliveryById, createDelivery, updateDeliveryById, deleteDeliveryById, getDeliveryInfo
}