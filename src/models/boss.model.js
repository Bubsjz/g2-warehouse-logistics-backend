const  pool   = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

function selectUserById(id) {
    return pool.query('select * from user where id_user = ?', [id])
}

function insertUser({ name, surname, email, password, rol, asigned_id_warehouse }) {
    return pool.query(
        'insert into user (name, surname, email, password, rol, asigned_id_warehouse) values (?, ?, ?, ?, ?, ?)', [name, surname, email, password, rol, asigned_id_warehouse]
    )
}

function updateUserById(id, {name, surname, email, password, rol, asigned_id_warehouse}){
    return pool.query(
        'update user set name = ?, surname = ?, email = ?, password = ?, rol = ?, asigned_id_warehouse = ? where id_user = ?', [name, surname, email, password, rol, asigned_id_warehouse, id] 
    )
}

function deleteUserByid(id) {
    return pool.query('delete from user where id_user = ?', [id])
}

module.exports = {
    selectAllUsers, selectUserById, insertUser, updateUserById, deleteUserByid
}