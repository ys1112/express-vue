const mysql = require('mysql2/promise');

// 配置连接池
const pool = mysql.createPool({
  host:'127.0.0.1',
  user:'back_end_system',
  password:'123456',
  database:'back_end_system',
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z'
}
// 服务器上的信息
// const pool = mysql.createPool({
//   host:'127.0.0.1',
//   user:'uer_ys',
//   password:'ys123123',
//   database:'db_vue',
//   waitForConnections: true,
//   connectionLimit: 10,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
//   timezone: 'Z'
// }
);
module.exports = pool