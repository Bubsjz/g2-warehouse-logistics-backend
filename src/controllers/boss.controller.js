const { selectAllUsers } = require("../models/boss.model")

const getAllUsers = async (req, res, next) => {
    try {
        const [result] = await selectAllUsers()
        res.json(result)
    } catch (error) {
        next(error)
    };
}

module.exports = {
    getAllUsers
}