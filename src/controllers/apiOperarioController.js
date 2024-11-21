const { selectAll } = require("../models/apiOperarioModel");

const getAllDeliveryByUser = async (req, res, next) => {
    const {userId} = req.params;
    console.log(req.params);
    try {
        const [result] = await selectAll(userId)
        res.json(result);
    } catch (error) {
        console.log("hola");
        next(error)
    }
};


module.exports = {
    getAllDeliveryByUser
}