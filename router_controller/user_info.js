// 导入数据库
const db = require('../db/index')
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
  let fileName = req.files[0].filename
  // 服务器表中的文件名
  // Buffer.from‌是Node.js中用于将字符串、数组或其他Buffer对象转换为Buffer对象的方法。
  // latin1是 ISO 8859-1 单字节编码的别名，支持西欧语言（如英语、法语、德语、西班牙语等）。
  // .toString('utf-8')防止乱码
  let originalName = Buffer.from(req.files[0].originalname, 'latin1').toString("utf8")
  // 更换文件在服务器中的名称
  fs.renameSync('./public/uploads/' + fileName, './public/uploads/' + originalName)
  // sql语句，上传头像到数据库
  const sql = 'insert into images set ?'
  db.query(sql, {
    image_url: `http://127.0.0.1:3001/uploads/${originalName}`,
    only_id
  }, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      only_id,
      status: 0,
      url: `http://127.0.0.1:3001/uploads/${originalName}`
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
  if(!req.query.id) return res.send({
    status: 1,
    message: '获取失败'
  })
  const sql = 'select * from users where id = ?'
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}

// 修改密码 
// 1.根据id查询数据库密码对比（bcryptjs.compareSync）前端传过来的原密码 
// 2.对比一致保存新密码（bcryptjs.hashSync）
exports.updatePassword = (req, res) => {
  const id = req.query.id
  const sql = 'select * from users where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    const compareResult = bcryptjs.compareSync(req.body.password,results[0].password)
    if(!compareResult) return res.send({
      status:1,
      message:"原密码错误"
    })
    const newPassword = bcryptjs.hashSync(req.body.newPassword)
    const sql1 = 'update users set password = ? where id = ?'
    db.query(sql1, [newPassword,id], (err, results) => {
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
  db.query(sql, [name,id], (err, results) => {
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
  db.query(sql, [gender,id], (err, results) => {
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
  db.query(sql, [email,id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改成功"
      })
    }
  })
}