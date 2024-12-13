const pool = require("../config/db");

async function selectByEmail(email) {
    const [user] = await pool.query(`select u.*, t.plate from user u left join truck t on t.id_truck = u.assigned_id_truck where u.email = ?`, [email])
    if (user.length === 0) return null
    return user[0]
}

function selectById(id) {
    return pool.query(`select * from user where id_user = ?`, [id])
}

module.exports = {
    selectByEmail, selectById
}