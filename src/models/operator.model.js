const pool = require("../config/db");

function selectAll(userId){
    console.log(userId);
    return pool.query(
        'SELECT d.id_delivery AS id_delivery, d.send_date AS send_date, wS.name AS origin_warehouse_name, wS.locality AS origin_warehouse_locality, wD.name AS destination_warehouse_name, wD.locality AS destination_warehouse_locality, d.status AS status, t.plate AS plate, d.comments AS comments FROM delivery d INNER JOIN warehouse wS ON d.origin_warehouse_id = wS.id_warehouse INNER JOIN warehouse wD ON d.destination_warehouse_id = wD.id_warehouse INNER JOIN truck t ON t.id_truck = d.truck_id_truck WHERE truck_id_truck = ?;' ,
        [userId]
    );
}
function selectById(id_delivery){
    return pool.query ('SELECT d.id_delivery AS id_delivery, d.send_date AS send_date, wS.name AS origin_warehouse_name, wS.locality AS origin_warehouse_locality, wD.name AS destination_warehouse_name, wD.locality AS destination_warehouse_locality, d.status AS status, t.plate AS plate, d.comments AS comments FROM delivery d INNER JOIN warehouse wS ON d.origin_warehouse_id = wS.id_warehouse INNER JOIN warehouse wD ON d.destination_warehouse_id = wD.id_warehouse INNER JOIN truck t ON t.id_truck = d.truck_id_truck WHERE d.id_delivery = ?;'
, [id_delivery]);
}
function selectProductByDelivery(id_delivery){
    return pool.query('SELECT p.name AS product_name, dp.quantity AS product_quantity FROM delivery_products dp INNER JOIN product p ON dp.product_id_product = p.id_product WHERE dp.delivery_id_delivery = ?;', [id_delivery])
}
function postDelivery(data){
    return pool.query ('INSERT INTO delivery (send_date, received_date, truck_id_truck, origin_warehouse_id, destination_warehouse_id, status, comments) VALUES (?, ?, (SELECT id_truck FROM truck WHERE plate = ?), (SELECT id_warehouse FROM warehouse WHERE name = ?), (SELECT id_warehouse FROM warehouse WHERE name = ?), ?, ?)',
        [data.send_date, data.recive_date,data.plate, data.origin_warehouse_name, data.destination_warehouse_name, data.status, data.comments])
}
function postProducts(products, id_delivery){
    const delivery = id_delivery
    return pool.query('INSERT INTO delivery_products (product_id_product, quantity, delivery_id_delivery) VALUES ((SELECT id_product FROM product WHERE name = ?), ?, ?)', [products.product_name, products.product_quantity, delivery])
}
function updateById(delivery_info, id_delivery){
    return pool.query('UPDATE delivery SET send_date = ?, received_date = ?, truck_id_truck = (SELECT id_truck FROM truck WHERE plate = ?), origin_warehouse_id = (SELECT id_warehouse FROM warehouse WHERE name = ?), destination_warehouse_id = (SELECT id_warehouse FROM warehouse WHERE name = ?), status = ?, comments = ? WHERE id_delivery = ?;', 
        [delivery_info.send_date, delivery_info.recive_date, delivery_info.plate, delivery_info.origin_warehouse_name, delivery_info.destination_warehouse_name, delivery_info.status, delivery_info.comments, id_delivery])
}
function updateProductsById(products_info, id_delivery){
    return pool.query('INSERT INTO delivery_products (product_id_product, quantity, delivery_id_delivery) VALUES (?, ?, ?)',
            [products_info.product_id, products_info.quantity, id_delivery]);
}
function removeProductsById(id_delivery){
    return pool.query('DELETE FROM delivery_products WHERE delivery_id_delivery = ?', [id_delivery])
}
function removeDeliveryById(id_delivery){
    return pool.query('DELETE FROM delivery WHERE id_delivery = ?', [id_delivery])
}
function checkDelivery(id_delivery, id_user){
    return pool.query('SELECT * FROM delivery WHERE truck_id_truck = ? AND id_delivery = ?;', [id_user, id_delivery])
}
function selectTrucks() {
    return pool.query('SELECT id_truck, plate FROM truck')
}
function selectWarehouse() {
    return pool.query('SELECT id_warehouse, name FROM warehouse')
}
function selectProducts() {
    return pool.query('SELECT id_product, name FROM product')
}
module.exports = {
    selectAll, selectById, postDelivery, postProducts, updateById, updateProductsById, selectProductByDelivery, removeProductsById, removeDeliveryById, checkDelivery, selectProducts, selectTrucks, selectWarehouse
}