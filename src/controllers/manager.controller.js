const { selectAll } = require("../models/manager.model")

// Example controller
const getAllClientes = async (req, res, next) => {
    console.log("Hola")
    try {
        const [result] = await selectAll()    //almacenamos la query en una variable
        res.json(result)
    } catch (error) {
        next(error)
    }
    
}

module.exports = {
    getAllClientes
}