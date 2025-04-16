// 登录注册实现模块
// 导入数据库
const db = require('../db/index')
// 导入密码加密中间件
const bcryptjs = require('bcryptjs');
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密和解密
const jwtconfig = require('../jwt_config/index');
const menuList = require('../config/menu')
exports.register = (req, res) => {
  // req是前端传过来的数据request，res是返回给前端的数据，也就是result
  const reginfo = req.body
  // 第一步  判断前端传的数据有没有为空
  if (!reginfo.account || !reginfo.password) {
    return res.send({
      status: 1,
      message: '账号或者密码不能为空'
    })
  }
  // 第二步  判断账号是否存在数据表中
  // 需要使用mysql的select语句
  const sql = 'select * from users where account = ?'
  // 第一个参数sql是执行语句 第二个是前端传过来的参数 第三个是一个函数用于处理结果
  db.query(sql, reginfo.account, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '账号已存在'
      })
    }
    // 第三步，对密码进行加密
    // 需要使用加密中间件 bcryptjs  npm i bcryptjs
    // bcryptjs.hashSync里的参数第一个是传入的密码，第二个是加密后的长度
    reginfo.password = bcryptjs.hashSync(reginfo.password, 10)
    // 第四步  把账号和密码插入到users表里面
    const sql1 = 'insert into users set ?'
    // 注册身份
    const identity = '用户'
    // 注册时间
    const create_time = new Date()
    db.query(sql1, {
      account: reginfo.account,
      password: reginfo.password,
      identity,
      create_time,
      status: 0,
      menus:JSON.stringify(menuList.usersMenu)
    }, (err, results) => {
      if (err) return res.cc(err)
      // 判断插入状态 affectedRows为影响的行数
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '创建账号失败'
        })
      }
      return res.send({
        status: 0,
        message: '创建账号成功'
      })
    })
  })

}
// 55555555555
exports.login = (req, res) => {
  const loginfo = req.body
  // 第一步，查看数据表中有没有前端传过来的账号
  const sql = 'select * from users where account = ?'
  db.query(sql, loginfo.account, (err, results) => {
    // 执行sql语句失败的情况：数据库断开
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登陆失败')
    //第二步， 对前端传过来的密码进行解密
    const compareResult = bcryptjs.compareSync(loginfo.password, results[0].password)
    if (!compareResult) return res.cc('登陆失败')
    // 第三步 对帐号是否冻结做判定
    if (results[0].status == 1) return res.cc('账号被冻结')
    // 第四步 生成token返回给前端
    // 剔除加密后的密码，头像，创建时间，更行时间
    const user = {
      ...results[0],
      password: '',
      imageUrl: '',
      create_time: '',
      update_time: ''
    }
    // 设置token有效时长
    const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
      expiresIn: '8h'
    })
    // 将消息返回给前端
    res.send({
      results: results[0],
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    })
  })
}