const pool = require('../config/db');


function selectOutgoingOrders(warehouseId) {
    return pool.query(
        `select d.*, t.plate, wo.name as origin_warehouse_name, wo.locality as origin_warehouse_locality, wd.name as destination_warehouse_name, wd.locality as destination_warehouse_locality
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse wo on d.origin_warehouse_id = wo.id_warehouse
        join warehouse wd on d.destination_warehouse_id = wd.id_warehouse
        where d.origin_warehouse_id = ?
        and d.status in ("review", "ready for departure", "corrections needed", "in transit", "delivered")`
        , [warehouseId]
    )
}

function selectIncomingOrders(warehouseId) {
    return pool.query(
        `select d.*, t.plate, wo.name as origin_warehouse_name, wo.locality as origin_warehouse_locality, wd.name as destination_warehouse_name, wd.locality as destination_warehouse_locality
         from delivery d
         join truck t on d.truck_id_truck = t.id_truck
         join warehouse wo on d.origin_warehouse_id = wo.id_warehouse
         join warehouse wd on d.destination_warehouse_id = wd.id_warehouse
         where d.destination_warehouse_id = ?
         and d.status in ("delivered", "pending reception", "approved", "not approved")`
        , [warehouseId]
    )
}

function selectOutgoingOrderById(orderId){
    return pool.query(
        `select d.*, t.plate, wo.name as origin_warehouse, wd.name as destination_warehouse
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse wo on d.origin_warehouse_id = wo.id_warehouse
        join warehouse wd on d.destination_warehouse_id = wd.id_warehouse
        where d.id_delivery = ?
        and d.status in ("review", "ready for departure", "corrections needed", "in transit", "delivered")`
        , [orderId])
}

function selectIncomingOrderById(orderId){
    return pool.query(
        `select d.*, t.plate, wo.name as origin_warehouse, wd.name as destination_warehouse
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse wo on d.origin_warehouse_id = wo.id_warehouse
        join warehouse wd on d.destination_warehouse_id = wd.id_warehouse
        where d.id_delivery = ?
        and d.status in ("delivered", "pending reception", "approved", "not approved")`
        , [orderId])
}

function selectOrderById(orderId){
    return pool.query(
        `select d.*, t.plate, wo.name as origin_warehouse, wd.name as destination_warehouse
        from delivery d
        join truck t on d.truck_id_truck = t.id_truck
        join warehouse wo on d.origin_warehouse_id = wo.id_warehouse
        join warehouse wd on d.destination_warehouse_id = wd.id_warehouse
        where d.id_delivery = ?
        and d.status in ("delivered", "pending reception", "approved", "not approved")`
        , [orderId])
}

function selectProductsById(id) {
    return pool.query(
        `select product_id_product as product_id, quantity as product_quantity
        from delivery_products
        where delivery_id_delivery = ?`
        , [id]
    )
}

function changeOrderStatus(orderId, status, comments) {
    return pool.query(
        `update delivery
         set status = ?, comments = ?
         where id_delivery = ?`
        , [status, comments, orderId]
    )
}


module.exports = {
    selectOutgoingOrders, selectIncomingOrders, selectOutgoingOrderById, selectIncomingOrderById, changeOrderStatus, selectProductsById, selectOrderById
};