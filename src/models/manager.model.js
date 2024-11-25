const pool = require('../config/db');


// Pedidos de salida
function selectOutgoingOrders(warehouseId) {
    return pool.query(
        `select d.*, t.plate, w.name as destination_warehouse
         from delivery d
         join truck t on d.truck_id_truck = t.id_truck
         join warehouse w on d.destination_warehouse_id = w.id_warehouse
         where d.origin_warehouse_id = ?
         and d.status in ("review", "ready for departure", "corrections needed", "in transit", "delivered")`
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
         where d.destination_warehouse_id = ?
         and d.status in ("pending reception", "review")`
        , [warehouseId]
    )
}

// Actualización status
function changeOrderStatus(orderId, status, comments) {
    return pool.query(
        `update delivery
         set status = ?, comments = ?
         where id_delivery = ?`
        , [status, comments, orderId]
    )
}


module.exports = {
    selectOutgoingOrders, selectIncomingOrders, changeOrderStatus
};