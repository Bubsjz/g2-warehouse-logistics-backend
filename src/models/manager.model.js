const pool = require('../config/db');



function selectAll() {
    return pool.query("SELECT * FROM user")
}

function selectById(clientId) {
    return pool.query("SELECT * FROM user WHERE id_user = ?", [clientId])
}



module.exports = {
    selectAll, selectById
};