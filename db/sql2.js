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
);
module.exports = pool