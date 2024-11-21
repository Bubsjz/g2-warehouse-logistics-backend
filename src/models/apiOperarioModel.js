const pool = require("../config/db");

function selectAll(userId){
    console.log(userId);
    return pool.query(
        'SELECT u.id_user, u.name, u.surname, d.send_date, d.origin_warehouse_id, d.destination_warehouse_id, t.plate, d.status FROM users u INNER JOIN truck t ON u.id_user = t.driver_id_user INNER JOIN delivery d ON t.driver_id_user = d.truck_id_truck WHERE u.id_user = ?;', 
        [userId]
    );
}
module.exports = {
    selectAll
}