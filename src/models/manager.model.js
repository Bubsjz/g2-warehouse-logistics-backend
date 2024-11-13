const pool = require('../config/db');



function selectAll() {
    return pool.query("SELECT * FROM user")
}



module.exports = {
    selectAll
};