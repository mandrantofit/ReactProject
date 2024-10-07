const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '172.25.52.205', //172.25.52.205
  user: 'cpadmin', //cpadmin
  password: 'adminplus', //adminplus
  database: 'stock', //stock
});

module.exports = pool;
