const  pool   = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

function selectUserById(id) {
    return pool.query('Select * from user where id_user = ?', [id])
}

module.exports = {
    selectAllUsers, selectUserById
}