const db = require('../db/index')


// message_title 消息主题
// message_category 消息类别
// message_publish_department 消息发布部门
// message_publish_name 消息发布者
// message_receipt_object 消息接收者
// message_click_number 消息查看数量
// message_content 消息内容
// message_create_time 消息发布时间
// message_update_time 消息更新时间
// message_level 消息等级
// message_status 默认为0,1在回收站
// message_delete_time 消息删除时间


// 发布消息
exports.publishMsg = (req, res) => {
  const {
    message_title,
    message_category,
    message_publish_department,
    message_publish_name,
    message_receipt_object,
    message_level,
    message_content,
  } = req.body
  let messageInfo = {}
  const message_create_time = new Date()
  if (req.body.message_category == '系统消息') {
    messageInfo = {
      message_title,
      message_category,
      message_publish_name,
      message_receipt_object: '全体成员',
      message_level: '一般',
      message_content,
      message_create_time,
      message_click_number: 0,
      message_status: 0
    }
  } else {
    messageInfo = {
      message_title,
      message_category,
      message_publish_department,
      message_publish_name,
      message_receipt_object,
      message_level,
      message_content,
      message_create_time,
      message_click_number: 0,
      message_status: 0
    }
  }
  const sql = 'insert into message set ?'
  db.query(sql, messageInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      return res.send({
        status: 0,
        message: '发布消息成功'
      })
    } else {
      res.send({
        status: 1,
        message: '发布消息失败'
      })
    }
  })
}

// 编辑公司消息
exports.updateCorpMsg = (req, res) => {
  const {
    message_title,
    message_publish_department,
    message_receipt_object,
    message_level,
    message_content,
  } = req.body
  const id = req.query.id
  const message_update_time = new Date()
  const messageInfo = {
    message_title,
    message_publish_department,
    message_receipt_object,
    message_level,
    message_content,
    message_update_time,
  }
  const sql = 'update message set ? where id = ?'
  db.query(sql, [messageInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "编辑公司信息成功"
      })
    }
  })
}

// 编辑系统消息
exports.updateSysMsg = (req, res) => {
  const {
    message_title,
    message_content,
  } = req.body
  const id = req.query.id
  const message_update_time = new Date()
  const messageInfo = {
    message_title,
    message_content,
    message_update_time,
  }
  const sql = 'update message set ? where id = ?'
  db.query(sql, [messageInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "编辑系统信息成功"
      })
    }
  })
}

// 删除公司公告消息到回收站
exports.deleteMsg = (req, res) => {
  const id = req.body.id
  const message_status = 1
  const message_delete_time = new Date()
  const deleteInfo = {
    message_delete_time,
    message_status
  }
  const sql = 'update message set ? where id = ?'
  db.query(sql, [deleteInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除信息成功"
      })
    }
  })
}

// 获取所有公司公告信息列表
exports.getCorpMsg = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const department = `%${req.query.department || ''}%`
  const messageLevel = `%${req.query.messageLevel || ''}%`
  const queryInfo = [0, '公司公告', department, messageLevel]
  let sql = `select * 
  from message 
  where 
  message_status = ? 
  and message_category = ?
  and message_publish_department like ?
  and message_level like ?
  `
  const limit = ` limit ? offset ?`

  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    queryInfo.push(pageSize, offset)
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取公司公告列表成功',
        results,
        total
      })
    })
  })
}

// 获取所有系统信息列表
exports.getSysMsg = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const limit = ` limit ? offset ?`
  let queryInfo = [0, '系统消息']
  let sql = `select * 
    from message
    where message_status = ?
    and message_category = ?
    `
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    queryInfo.push(pageSize, offset)
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取系统消息列表成功',
        total,
        results
      })
    })
  })
}

// 获取所有回收站信息列表
exports.getRecycleMsg = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [1, keyword]
  const limit = ` limit ? offset ?`
  let sql = `select * 
    from message
    where message_status = ?
    and message_title like ?
    `
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    queryInfo.push(pageSize, offset)
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取回收站信息列表成功',
        total,
        results
      })
    })
  })
}

// 还原消息
exports.restoreMsg = (req, res) => {
  const id = req.body.id
  const message_status = 0
  const restoreInfo = {
    message_status,
    message_delete_time: null
  }
  const sql = 'update message set ? where id = ?'
  db.query(sql, [restoreInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "还原信息成功"
      })
    }
  })
}

// 删除回收站信息
exports.deleteRecycleMsg = (req, res) => {
  const id = req.body.id
  const sql = 'delete from message where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除信息成功"
      })
    }
  })
}

// 更新点击数
exports.updateClick = (req, res) => {
  const {
    id
  } = req.body
  const sql = 'select * from message where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    const message_click_number = results[0].message_click_number * 1 + 1
    const sql1 = 'update message set message_click_number = ? where id = ?'
    db.query(sql1, [message_click_number, id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows == 1) {
        res.send({
          status: 0,
          message_click_number,
          message: "点击数增加"
        })
      }
    })
  })
}

// 获取部门消息
exports.getDepartmentMsg = (req, res) => {
  const message_publish_department = req.body.department
  const sql = `select * 
    from message
    where message_status = ?
    and message_publish_department = ?
    `
  const message_status = 0
  db.query(sql, [message_status, message_publish_department], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取部门信息成功',
      results
    })
  })
}