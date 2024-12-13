const  pool = require("../config/db");

function selectAllUsers() {
    return pool.query('select * from user')
}

function selectAllWarehouse() {
    return pool.query('select * from warehouse')
}

function selectUserById(id) {
    return pool.query(`
        select user.*, warehouse.name AS warehouse_name, warehouse.locality, warehouse.address, warehouse.latitude, warehouse.longitude, warehouse.image AS warehouse_image from user left join warehouse on user.assigned_id_warehouse = warehouse.id_warehouse where user.id_user = ?`, [id])
}

function selectWarehouseById(id) {
    return pool.query(`
        select warehouse.*, user.id_user, user.name AS user_name, user.surname, user.email, user.role, user.image AS user_image from warehouse left join user on warehouse.id_warehouse = user.assigned_id_warehouse where warehouse.id_warehouse = ?`, [id])
}

function selectTruckById(id) {
    return pool.query(`select id_truck, plate from truck where id_truck = ?`, [id])
}

function selectAvailabeTrucks() {
    return pool.query(`select id_truck, plate from truck where id_truck not in (select assigned_id_truck from logistics.user where assigned_id_truck is not null)`)
}

function selectAvailableWarehouse() {
    return pool.query(`select w.id_warehouse, w.name, w.locality, w.address from warehouse w left join user u on w.id_warehouse = u.assigned_id_warehouse and u.role = 'manager' where u.id_user is null`)
}

function insertUser({ name, surname, email, password, role, assigned_id_warehouse, image, assigned_id_truck }){
    const finalRole = role
    return pool.query(
        'insert into user (name, surname, email, password, role, assigned_id_warehouse, image, assigned_id_truck) values (?, ?, ?, ?, ?, ?, ?, ?)', [name, surname, email, password, finalRole, assigned_id_warehouse, image, assigned_id_truck]
    )
}

function insertWarehouse({ name, locality, address, latitude, longitude, image }) {
    return pool.query(
        'insert into warehouse (name, locality, address, latitude, longitude, image) values (?, ?, ?, ?, ?, ?)', [name, locality, address, latitude, longitude, image]
    )
}

function updateUserById(id, {name, surname, email, password, role, assigned_id_warehouse, image, assigned_id_truck}){
    return pool.query(
        'update user set name = ?, surname = ?, email = ?, password = ?, role = ?, assigned_id_warehouse = ?, image = ?, assigned_id_truck = ? where id_user = ?', [name, surname, email, password, role, assigned_id_warehouse, image, assigned_id_truck, id] 
    )
}

function updateWarehouseById(id, { name, locality, address, latitude, longitude, image}) {
    return pool.query(
        'update warehouse set name = ?, locality = ?, address = ?, latitude = ?, longitude = ?, image = ? where id_warehouse = ?', [name, locality, address, latitude, longitude, image, id]
    )
}

function deleteUserById(id) {
    return pool.query('delete from user where id_user = ?', [id])
}

function deleteWarehouseById(id) {
    return pool.query('delete from warehouse where id_warehouse = ?', [id])

}

module.exports = {
    selectAllUsers, selectAllWarehouse, selectUserById, selectWarehouseById, selectTruckById, selectAvailabeTrucks, selectAvailableWarehouse, insertUser, insertWarehouse, updateUserById, updateWarehouseById, deleteUserById, deleteWarehouseById
}