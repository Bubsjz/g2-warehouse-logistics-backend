//aqui esta la base de datos mysql requerida
const mysql = require ('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    port:1234,
    database:'nombreBaseDatos'
})




module.exports = pool.promise();