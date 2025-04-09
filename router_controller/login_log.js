const db = require('../db/index')

// 插入记录
exports.recordLogin = (req, res) => {
  const {
    name,
    account,
    email
  } = req.body
  const login_time = new Date()
  const sql = `insert into login_log set ?`
  const recordInfo = {
    name,
    account,
    email,
    login_time
  }
  db.query(sql, recordInfo, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '标记登录记录成功',
    })
  })
}

// 获取登录列表
exports.getLoginLog = (req, res) => {
  const sql = `select * 
    from login_log
    `
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取登录日志列表成功',
      results
    })
  })
}

// 搜索记录
exports.searchLoginLog = (req, res) => {
  const account = req.body.account
  const sql = `select * from login_log where account like ?`
  db.query(sql, [`%${account}%`], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '搜索登录日志成功',
      results
    })
  })
}

// 清空记录
exports.clearLoginLog = (req,res)=>{
  // 清空数据 
  db.query(`delete from login_log`);
  // 重置自增 ID 
  db.query(`alter table login_log auto_increment = 1`);
}
