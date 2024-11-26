const  pool   = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

function selectAllWarehouse() {
    return pool.query('select * from warehouse')
}

function selectUserById(id) {
    return pool.query(`
        select user.*, warehouse.name AS warehouse_name, warehouse.locality, warehouse.address, warehouse.image from user left join warehouse on user.assigned_id_warehouse = warehouse.id_warehouse where user.id_user = ?`, [id])
}

function selectWarehouseById(id) {
    return pool.query(`
        select warehouse.*, user.id_user, user.name AS user_name, user.surname, user.email, user.role from warehouse left join user on warehouse.id_warehouse = user.assigned_id_warehouse where warehouse.id_warehouse = ?`, [id])
}

function insertUser({ name, surname, email, password, role, assigned_id_warehouse }){
    const finalRole = role || "operator"
    return pool.query(
        'insert into user (name, surname, email, password, role, assigned_id_warehouse) values (?, ?, ?, ?, ?, ?)', [name, surname, email, password, finalRole, assigned_id_warehouse]
    )
}

function insertWarehouse({ name, locality, address, image }) {
    return pool.query(
        'insert into warehouse (name, locality, address, image) values (?, ?, ?, ?)', [name, locality, address, image]
    )
}

function updateUserById(id, {name, surname, email, password, role, assigned_id_warehouse}){
    return pool.query(
        'update user set name = ?, surname = ?, email = ?, password = ?, role = ?, assigned_id_warehouse = ? where id_user = ?', [name, surname, email, password, role, assigned_id_warehouse, id] 
    )
}

function updateWarehouseById(id, { name, locality, address, image}) {
    return pool.query(
        'update warehouse set name = ?, locality = ?, address = ?, image = ? where id_warehouse = ?', [name, locality, address, image, id]
    )
}

function deleteUserById(id) {
    return pool.query('delete from user where id_user = ?', [id])
}

function deleteWarehouseById(id) {
    return pool.query('delete from warehouse where id_warehouse = ?', [id])

}

module.exports = {
    selectAllUsers, selectAllWarehouse, selectUserById, selectWarehouseById, insertUser, insertWarehouse, updateUserById, updateWarehouseById, deleteUserById, deleteWarehouseById
}