// 导入数据库
const mysql = require('mysql')

// 创建与数据库的连接
const db = mysql.createPool({
  host:'127.0.0.1',
  user:'back_end_system',
  password:'123456',
  database:'back_end_system',
})
// 服务器上信息
// const db = mysql.createPool({
//   host:'127.0.0.1',
//   user:'uer_ys',
//   password:'ys123123',
//   database:'db_vue',
// })
// 对外暴露数据库
module.exports = db 