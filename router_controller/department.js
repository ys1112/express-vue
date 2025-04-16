const db = require('../db/index')
const io = require('../db/socket')


// 首次获取部门消息
exports.getDepartMsg = (req, res) => {
  const {
    department,
    id
  } = req.body
  const sql = `select * 
    from message
    where message_status = ?
    and message_receipt_object = ?
    `
  const message_status = 0
  const queryInfo = [message_status, department]
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const department_msg_list = results
    const read_list = department_msg_list.map(item => item.id)
    const updateSql = 'update users set ? where id = ?'
    const undateInfo = {
      read_list: JSON.stringify(read_list),
      read_status: 1
    }
    db.query(updateSql, [undateInfo, id], (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: "获取部门消息成功",
        department_msg_list,
        read_list
      })
    })
  })
}
// 根据部门获取所有部门消息
exports.getAllDepartMsg = (req, res) => {
  const {
    department
  } = req.body
  const sql = `select * 
    from message
    where message_status = ?
    and message_receipt_object = ?
    `
  const message_status = 0
  const queryInfo = [message_status, department]
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "获取部门消息成功",
      results,
    })
  })
}
// 获取用户未读信息read_list
exports.getReadMsg = (req, res) => {
  const id = req.body.id
  const sql = 'select * from users where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取用户部门消息状态成功',
      results: {
        read_list: results[0].read_list,
        read_status: results[0].read_status,
      }
    })
  })
}

// 用户点击部门信息,更新未读信息read_list
exports.deleteReadMsg = (req, res) => {
  const { read_id, user_id } = req.body
  const sql = 'select read_list from users where id = ?'
  db.query(sql, user_id, (err, results) => {
    if (err) return res.cc(err)
    const read_list = JSON.stringify(JSON.parse(results[0].read_list).filter(item => item != read_id))

    const sql1 = `update users set read_list = ? where id = ?`
    db.query(sql1, [read_list, user_id], (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '更新用户已读信息成功',
      })
    })
  })


}

// 新增信息时修改所属部门成员的未读消息
exports.addUnreadMsg = (req, res) => {
  // 发布新文章时,如果有接受部门,则向对应部门用户的read_list插入新建文章id
  const {
    id, // 修改的消息 id
    department //修改的部门
  } = req.body
  const sql = 'select read_list,read_status,id from users where department = ?'
  db.query(sql, department, (err, results) => {
    if (err) return res.cc(err)
    results.forEach(item => {
      if (item.read_status) {
        // 用户readlist中插入对应未读id
        let read_list = JSON.parse(item.read_list)
        if (!read_list.includes(+id)) {
          read_list.push(+id)
          read_list = JSON.stringify(read_list.sort((a, b) => a - b))
          const sql1 = 'update users set read_list = ? where id = ?'
          db.query(sql1, [read_list, item.id], (err, results) => {
            if (err) return res.cc(err)
            const safeRoomName = `dept_${department.replace(/[^\w\u4e00-\u9fa5]/g, '')}`;
            io.to(safeRoomName).emit('newMessage', {
              content: 'newMsg'
            });
          })
        }
      }
    });
    return res.send({
      status: 0,
      message: '修改用户未读消息成功'
    })
  })
}

// 删除信息时修改所属部门成员的未读消息
exports.deleteUnreadMsg = (req, res) => {
  const {
    id,
    department
  } = req.body
  const sql = 'select read_list,read_status,id from users where department = ?'
  db.query(sql, department, (err, results) => {
    if (err) return res.cc(err)
    results.forEach(item => {
      if (item.read_status) {
        // 用户readlist中插入对应未读id
        const read_list = JSON.stringify(JSON.parse(item.read_list).filter(item => item != id))
        const sql1 = 'update users set read_list = ? where id = ?'
        db.query(sql1, [read_list, item.id], (err, results) => {
          if (err) return res.cc(err)
          const safeRoomName = `dept_${department.replace(/[^\w\u4e00-\u9fa5]/g, '')}`;
          io.to(safeRoomName).emit('newMessage', {
            content: 'newMsg'
          });

        })
      }
    });
    res.send({
      status: 0,
      message: '更新新信息成功',
    })
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