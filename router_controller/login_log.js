const db = require('../db/index')

// 插入记录
exports.recordLogin = (req, res) => {
  const {
    name,
    account,
    identity,
    email
  } = req.body
  const login_time = new Date()
  const sql = `insert into login_log set ?`
  const recordInfo = {
    name,
    account,
    identity,
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
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [keyword]
  const limit = ` limit ? offset ?`
  let sql = `select * 
    from login_log
    where account like ?
    order by login_time desc
    `
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    sql += limit
    queryInfo.push(pageSize, offset)
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取登录日志列表成功',
        results,
        total
      })
    })
  })
}

// 删除登录记录
exports.deleteLoginLog = (req, res) => {
  const id = req.body.id
  const sql = 'delete from login_log where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除登录记录成功"
      })
    }
  })
}

// 清空记录
exports.clearLoginLog = (req, res) => {
  // 清空数据 
  db.query(`delete from login_log`);
  // 重置自增 ID 
  db.query(`alter table login_log auto_increment = 1`);
  res.send({
    status: 0,
    message: "清空登录记录日志成功"
  })
}
