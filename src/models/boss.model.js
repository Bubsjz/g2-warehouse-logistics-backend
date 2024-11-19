const { pool } = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

module.exports = {
    selectAllUsers
}