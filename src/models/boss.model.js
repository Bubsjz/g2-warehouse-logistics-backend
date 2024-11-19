const  pool   = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

function selectAllWarehouse() {
    return pool.query('select * from warehouse')
}

function selectUserById(id) {
    return pool.query('select * from user where id_user = ?', [id])
}

function selectWarehouseById(id) {
    return pool.query('select * from warehouse where id_warehouse = ?', [id])
}

function insertUser({ name, surname, email, password, rol, asigned_id_warehouse }) {
    return pool.query(
        'insert into user (name, surname, email, password, rol, asigned_id_warehouse) values (?, ?, ?, ?, ?, ?)', [name, surname, email, password, rol, asigned_id_warehouse]
    )
}

function insertWarehouse({ name, locality, adress, image }) {
    return pool.query(
        'insert into warehouse (name, locality, adress, image) values (?, ?, ?, ?)', [name, locality, adress, image]
    )
}

function updateUserById(id, {name, surname, email, password, rol, asigned_id_warehouse}){
    return pool.query(
        'update user set name = ?, surname = ?, email = ?, password = ?, rol = ?, asigned_id_warehouse = ? where id_user = ?', [name, surname, email, password, rol, asigned_id_warehouse, id] 
    )
}

function updateWarehouseByid(id, {}) {

}

function deleteUserById(id) {
    return pool.query('delete from user where id_user = ?', [id])
}

function deleteWarehouseById(id) {

}

module.exports = {
    selectAllUsers, selectAllWarehouse, selectUserById, selectWarehouseById, insertUser, insertWarehouse, updateUserById, updateWarehouseByid, deleteUserById, deleteWarehouseById
}