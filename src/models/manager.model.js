const pool = require('../config/db');


// Pedidos de salida
function selectOutgoingOrders(warehouseId) {
    return pool.query(
        `select d.*, t.plate, w.name as destination_warehouse
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse w on d.destination_warehouse_id = w.id_warehouse
        where d.origin_warehouse_id = ?`
        , [warehouseId]
    )
}


// Pedidos de entrada
function selectIncomingOrders(warehouseId) {
    return pool.query(
        `select d.*, t.plate, w.name as origin_warehouse
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse w on d.origin_warehouse_id = w.id_warehouse
        where d.destination_warehouse_id = ?`
        , [warehouseId]
    )
}




module.exports = {
    selectOutgoingOrders, selectIncomingOrders
};