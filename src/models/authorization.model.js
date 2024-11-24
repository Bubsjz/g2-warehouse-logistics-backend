const pool = require("../config/db");

async function selectByEmail(email) {
    const [user] = await pool.query(`select * from user where email = ?`, [email])
    if (user.length === 0) return null
    return user[0]
}

async function selectAll() {
    return pool.query(`select * from user`)
}

function selectById(id) {
    return pool.query(`select * from user where id_user = ?`, [id])
}

function insertUser({name, surname, email, password, role, assigned_id_warehouse}) {
    const finalRole = role || "operator"
    return pool.query(`
        insert into user (name, surname, email, password, role, assigned_id_warehouse)
        values (?, ?, ?, ?, ?, ?)`, [name, surname, email, password, finalRole, assigned_id_warehouse])
}


module.exports = {
    selectByEmail, selectAll, selectById, insertUser
}