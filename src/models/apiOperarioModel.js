const pool = require("../config/db");

function selectAll(userId){
    console.log(userId);
    return pool.query(
        'SELECT u.id_user, u.name, u.surname, d.send_date, d.origin_warehouse_id, d.destination_warehouse_id, t.plate, d.status FROM user u INNER JOIN truck t ON u.id_user = t.driver_id_user INNER JOIN delivery d ON t.driver_id_user = d.truck_id_truck WHERE u.id_user = ?;', 
        [userId]
    );
}

function selectById(id_delivery){
    return pool.query ('SELECT d.id_delivery AS Pedido, d.send_date AS Envio, wS.name AS Origen, wD.name AS Destino, t.plate AS Matricula, d.comments AS Comentarios FROM delivery d INNER JOIN warehouse wS ON d.origin_warehouse_id = wS.id_warehouse INNER JOIN warehouse wD ON d.destination_warehouse_id = wD.id_warehouse INNER JOIN truck t ON t.id_truck = d.truck_id_truck WHERE d.id_delivery = ?;',
        [id_delivery]
    );
}
function postDelivery(data){
    return pool.query ('INSERT INTO delivery (send_date, received_date, truck_id_truck, origin_warehouse_id, destination_warehouse_id, status, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.send_date, data.recive_date,data.truck_id_truck, data.origin_warehouse_id, data.destination_warehouse_id, data.status, data.comments])
}
module.exports = {
    selectAll, selectById, postDelivery
}