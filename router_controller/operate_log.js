const db = require('../db/index')

// 插入操作记录
exports.recordOper = (req, res) => {
  const {
    operate_account,
    operate_content,
    operate_level
  } = req.body
  const operate_time = new Date()
  const sql = `insert into operate_log set ?`
  const recordInfo = {
    operate_account,
    operate_content,
    operate_level,
    operate_time,
  }
  db.query(sql, recordInfo, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '标记操作记录成功',
    })
  })
}

// 获取操作列表
exports.getOperLog = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [keyword]
  const limit = ` limit ? offset ?`
  let sql = `select * 
    from operate_log
    where operate_account like ?
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
        message: '获取操作日志列表成功',
        results,
        total
      })
    })
  })
}
// 删除操作记录
exports.deleteOperLog = (req, res) => {
  const id = req.body.id
  const sql = 'delete from operate_log where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除操作记录成功"
      })
    }
  })
}

// 清空记录
exports.clearOperLog = (req, res) => {
  // 清空数据 
  db.query(`delete from operate_log`);
  // 重置自增 ID 
  db.query(`alter table operate_log auto_increment = 1`);
  res.send({
    status: 0,
    message: "清空操作记录日志成功"
  })
}