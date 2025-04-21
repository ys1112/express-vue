// 导入数据库
const db = require('../db/index')
const pool = require('../db/sql2')
const io = require('../db/socket')
const menuList = require('../config/menu')

// 导入密码加密中间件
const bcryptjs = require('bcryptjs')
// 导入node.js内置的crypto库，生成匹配图片的uuid
const crypto = require('crypto')
// 处理文件路径
const fs = require('fs')

// 上传头像 
// 1.修改上传图片在public/uploads中的名称 
// 2.images表中插入image_url和only_id
// 3.返回数据到前端
exports.uploadAvatar = (req, res) => {
  // 生成唯一标识
  const only_id = crypto.randomUUID()
  // 保存上传图片的生成的名称filename
  const fileName = req.files[0].filename
  // 服务器表中的文件名
  // Buffer.from‌是Node.js中用于将字符串、数组或其他Buffer对象转换为Buffer对象的方法。
  // latin1是 ISO 8859-1 单字节编码的别名，支持西欧语言（如英语、法语、德语、西班牙语等）。
  // .toString('utf-8')防止乱码
  const originalName = Buffer.from(req.files[0].originalname, 'latin1').toString("utf8")
  // 更换文件在服务器中的名称
  fs.renameSync('./public/uploads/' + fileName, './public/uploads/' + req.body.id + originalName)
  // sql语句，上传头像到数据库
  const sql = 'insert into images set ?'
  db.query(sql, {
    image_url: `http://127.0.0.1:3001/uploads/${req.body.id + originalName}`,
    // 服务器上地址
    // image_url: `https://api.gmbksys.xyz/uploads/${req.body.id + originalName}`,
    only_id
  }, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      only_id,
      status: 0,
      // 服务器上地址
      // url: `https://api.gmbksys.xyz/uploads/${req.body.id + originalName}`
      url: `http://127.0.0.1:3001/uploads/${req.body.id + originalName}`
    })
  })
}

// 绑定账号 
// 1.在images表中插入account 
// 2.在user表中插入image_url
exports.bindAccount = (req, res) => {
  const {
    account,
    only_id,
    url
  } = req.body
  // 更新images表中的account 
  const sql = 'update images set account = ? where only_id = ?'
  db.query(sql, [account, only_id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      // 更新user表中的image_url 
      const sql1 = 'update users set image_url = ? where account = ?'
      db.query(sql1, [url, account], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows == 1) {
          res.send({
            status: 0,
            message: "修改成功"
          })
        }
      })
    }
  })
}

// 获取用户信息
exports.getUserInfo = (req, res) => {
  const sql = 'select * from users where id = ?'
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length == 0) {
      return res.send({
        status: 1,
        message: '用户不存在'
      })
    }
    results[0].password = ''
    res.send(results[0])
  })
}

// 登录后修改密码 
// 1.根据id查询数据库密码对比（bcryptjs.compareSync）前端传过来的原密码 
// 2.对比一致保存新密码（bcryptjs.hashSync）
exports.updatePassword = (req, res) => {
  const id = req.query.id
  const sql = 'select * from users where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    const compareResult = bcryptjs.compareSync(req.body.password, results[0].password)
    if (!compareResult) return res.send({
      status: 1,
      message: "原密码错误"
    })
    const newPassword = bcryptjs.hashSync(req.body.newPassword, 10)
    const sql1 = 'update users set password = ? where id = ?'
    db.query(sql1, [newPassword, id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows == 1) {
        res.send({
          status: 0,
          message: "修改成功"
        })
      }
    })
  })
}

// 修改姓名
exports.updateName = (req, res) => {
  const id = req.query.id
  const name = req.body.name
  const sql = 'update users set name = ? where id = ?'
  db.query(sql, [name, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改成功"
      })
    }
  })
}

// 修改性别
exports.updateGender = (req, res) => {
  const id = req.query.id
  const gender = req.body.gender
  const sql = 'update users set gender = ? where id = ?'
  db.query(sql, [gender, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改成功"
      })
    }
  })
}

// 修改邮箱
exports.updateEmail = (req, res) => {
  const id = req.query.id
  const email = req.body.email
  const sql = 'update users set email = ? where id = ?'
  db.query(sql, [email, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改成功"
      })
    }
  })
}

// 登录前修改密码
// 1.验证账号和邮箱是否和数据库中一致
exports.verifyAccount = (req, res) => {
  const { account, email } = req.body
  const sql = 'select * from users where account = ?'
  db.query(sql, account, (err, results) => {
    if (err) return res.cc(err)
    if (results.length < 1) {
      return res.send({
        status: 1,
        message: "查询失败，账号错误"
      })
    }
    if (!results[0].email) {
      return res.send({
        status: 1,
        message: "查询失败，邮箱不存在"
      })
    }

    if (results[0].email == email) {
      res.send({
        status: 0,
        message: "查询成功",
        id: results[0].id
      })
    } else {
      res.send({
        status: 1,
        message: "查询失败，邮箱错误"
      })
    }
  })
}

// 2.重置密码
exports.resetPassword = (req, res) => {
  const newPassword = bcryptjs.hashSync(req.body.newPassword, 10)
  const sql = 'update users set password = ? where id = ?'
  db.query(sql, [newPassword, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      return res.send({
        status: 0,
        message: "修改成功"
      })
    }
    res.send({
      status: 1,
      message: "账号不存在"
    })
  })
}

// 新增或删除部门
exports.setDepartment = (req, res) => {
  const set_value = req.body.department
  const sql = `update setting set set_value = ? where set_name = ?`
  db.query(sql, [set_value, 'department_category'], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改部门成功"
      })
    }
  })
}

// 获取部门
exports.getDepartment = (req, res) => {
  const sql = `select set_value from setting where set_name = 'department_category'`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      results: results[0],
    })
  })
}

// 新增或删除产品
exports.setProduct = (req, res) => {
  const set_value = req.body.product
  const sql = `update setting set set_value = ? where set_name = ?`
  db.query(sql, [set_value, 'product_category'], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改产品成功"
      })
    }
  })
}

// 获取产品
exports.getProduct = (req, res) => {
  const sql = `select set_value from setting where set_name = 'product_category'`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      results: results[0],
    })
  })
}


// ---------------------------用户管理
// post 新增管理员 参数：账号 account ，密码 password ，姓名 name ，性别 gender ，邮箱 email ，部门 department
exports.createAdmin = (req, res) => {
  const {
    account,
    password,
    name,
    gender,
    email,
    identity,
    department,
  } = req.body
  // 第一步  判断前端传的数据有没有为空
  if (!account || !password) {
    return res.send({
      status: 1,
      message: '账号或者密码不能为空'
    })
  }
  const sql = 'select * from users where account = ?'
  // 第一个参数sql是执行语句 第二个是前端传过来的参数 第三个是一个函数用于处理结果
  db.query(sql, account, (err, results) => {
    if (err) return res.cc(err)
    // 第二步  判断账号是否存在数据表中
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '账号已存在'
      })
    }
    // 第三步，对密码进行加密
    const hashPassword = bcryptjs.hashSync(password, 10)
    if (identity == '用户管理员') {
      menus = JSON.stringify(menuList.userAdminMenu)
    } else if ('产品管理员'){
      menus = JSON.stringify(menuList.prodAdminMenu)
    } else {
      menus = JSON.stringify(menuList.msgAdminMenu)
    }
    // 注册时间
    const create_time = new Date()
    const createInfo = {
      account,
      password: hashPassword,
      identity,
      name,
      gender,
      email,
      department,
      create_time,
      status: 0,
      menus
    }
    // 第四步  把账号和密码插入到users表里面
    const sql1 = 'insert into users set ?'
    db.query(sql1, createInfo, (err, results) => {
      if (err) return res.cc(err)
      // 判断插入状态 affectedRows为影响的行数
      if (results.affectedRows == 1) {
        return res.send({
          status: 0,
          message: '创建管理员成功'
        })
      }
      return res.send({
        status: 1,
        message: '添加管理员失败'
      })
    })
  })
}

// post 删除管理员（降级为普通用户）
exports.downgradeAdmin = (req, res) => {
  const id = req.body.id
  const updateInfo = {
    identity :'用户',
    menus:JSON.stringify(menuList.usersMenu)
  }
  const sql = 'update users set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "降级管理员成功"
      })
    }
  })
}

// put 编辑用户账号信息 参数：姓名 name ，性别 gender ，邮箱 email ，部门 department
exports.updateUser = async (req, res) => {
  const {
    name,
    gender,
    email,
    department,
  } = req.body
  const id = req.query.id
  const update_time = new Date()
  // const updateParams = [name, gender, email, department, update_time, id]
  // const sql = 'update users set name = ?,gender = ?,email = ?,department = ?, update_time = ? where id = ?'
  const updateInfo = {
    name,
    gender,
    email,
    department,
    update_time
  }
  // 查询用户当前部门,如果修改部门则更新read_list和read_status
  const querySql = 'select department from users where id = ?'
  const [oldDepartment] = await pool.query(querySql, id)
  const sql = 'update users set ? where id = ?'
  if (oldDepartment[0].department != department) {
    const queryMsg = `select * 
    from message
    where message_status = ?
    and message_receipt_object = ?
    `
    const message_status = 0
    const queryInfo = [message_status, department]
    const [departMsg] = await pool.query(queryMsg,queryInfo)
    updateInfo.read_status = 1
    updateInfo.read_list = JSON.stringify(departMsg.map(item => item.id))
  }
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改用户账号信息成功"
      })
    }
  })
}

// get 获取用户列表 1. identity 2. identity 和 department 3. identity 和 status
exports.getUserList = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const identity = req.query.identity || ''
  const department = req.query.department || ''
  const status = req.query.status || ''
  let queryInfo = [identity]
  // 基础语法
  let sql = 'select * from users where identity = ?'
  const limit = ` limit ? offset ?`

  // 先根据条件查询数据数量total,再根据限制返回前端数据
  if (department) {
    // 根据身份和部门搜索
    sql += ' and department = ?'
    queryInfo.push(department)
  } else if (status) {
    // 根据身份和冻结状态搜索
    sql += ' and status = ?'
    queryInfo.push(status)
  } else if (keyword) {
    // 根据身份和账号搜索
    sql += ' and account like ?'
    queryInfo.push(keyword)
  }
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    queryInfo.push(pageSize, offset)
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      if (results.length > 0) {
        results.forEach((item, index) => {
          results[index].password = ''
        })
      }
      res.send({
        status: 0,
        message: '查询用户列表成功',
        total,
        results
      })
    })
  })
}

// get 搜索用户列表
// exports.searchUserList = (req, res) => {
//   const identity = req.query.identity
//   const keyword = req.query.keyword
//   const sql = 'select * from users where identity = ? and account like ?'
//   // 模糊查询
//   db.query(sql, [identity, `%${keyword}%`], (err, results) => {
//     if (err) return res.cc(err)
//     if (results.length == 0) {
//       return res.send({
//         status: 1,
//         message: '查询用户列表为空'
//       })
//     }
//     results.forEach((item, index) => {
//       results[index].password = ''
//     })
//     res.send({
//       status: 0,
//       message: '查询用户列表成功',
//       results: results
//     })
//   })
// }

// 根据id冻结用户
exports.freezeUser = (req, res) => {
  const id = req.body.id
  const status = 1
  const sql = 'update users set status = ? where id = ?'
  db.query(sql, [status, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "冻结用户成功"
      })
    }
  })
}

// 根据id解冻用户
exports.unfreezeUser = (req, res) => {
  const id = req.body.id
  const status = 0
  const sql = 'update users set status = ? where id = ?'
  db.query(sql, [status, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "解冻用户成功"
      })
    }
  })
}

// 根据id和identity赋权为用户管理员或产品管理员
exports.empowerUser = (req, res) => {
  const id = req.body.id
  const identity = req.body.identity
  if (identity == '用户管理员') {
    menus = JSON.stringify(menuList.userAdminMenu)
  } else if ('产品管理员'){
    menus = JSON.stringify(menuList.prodAdminMenu)
  } else {
    menus = JSON.stringify(menuList.msgAdminMenu)
  }
  const updateInfo = {
    identity :req.body.identity,
    menus
  }
  const sql = 'update users set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        identity,
        message: `赋权${identity}操作成功`
      })
    }
  })
}

// 根据id删除用户 删除images表里的图片信息
exports.deleteUser = (req, res) => {
  const id = req.body.id
  const account = req.body.account
  const sql = 'delete from users where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      const sql1 = 'delete from images where account = ?'
      db.query(sql1, account, (err1, results1) => {
        if (err1) return res.cc(err1)
      })
      res.send({
        status: 0,
        message: "删除用户成功"
      })
    }
  })
}

// put 编辑用户账号信息 参数：姓名 name ，性别 gender ，邮箱 email
exports.setAccount = async (req, res) => {
  const {
    name,
    gender,
    email,
  } = req.body
  const id = req.query.id
  const update_time = new Date()
  const updateInfo = {
    name,
    gender,
    email,
    update_time
  }
  const sql = 'update users set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改用户账号信息成功"
      })
    }
  })
  
}