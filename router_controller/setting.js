const { object } = require('joi')
const db = require('../db/index')
// 处理文件路径
const fs = require('fs')
const pool = require('../db/sql2')

// 设置轮播图
exports.setSwiper = (req, res) => {
  // res.send(req.body.set_name)
  // 保存上传图片的生成的名称filename
  const fileName = req.files[0].filename
  // 服务器表中的文件名
  const originalName = Buffer.from(req.files[0].originalname, 'latin1').toString("utf8")
  const generateName = req.body.set_name + '.' + originalName.split('.')[1]
  // 更换文件在服务器中的名称
  fs.renameSync('./public/uploads/' + fileName, './public/uploads/' + generateName)
  const set_value = `http://127.0.0.1:3001/uploads/${generateName}`
  // 服务器上地址
  // const set_value = `https://api.gmbksys.xyz/uploads/${generateName}`
  // 更新setting表中的swiper的url 
  const sql = 'update setting set set_value = ? where set_name = ?'
  db.query(sql, [set_value, req.body.set_name], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      set_name: req.body.set_name,
      url: `http://127.0.0.1:3001/uploads/${generateName}`
      // 服务器上地址
      // url: `https://api.gmbksys.xyz/uploads/${generateName}`
      // url:`http://127.0.0.1:3001/uploads/${generateName}?t=${Date.now()}`
    })
  })
}
// 获取所有轮播图 
exports.getAllSwiper = (req, res) => {
  const sql = 'select * from setting where set_name like ?'
  db.query(sql, ['swiper%'], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      results,
      status: 0
    })
  })
}
// 设置公司信息
exports.setCompanyInfo = (req, res) => {
  const set_name = req.body.set_name
  const set_value = req.body.set_value
  const sql = `update setting set set_value = ? where set_name = ?`
  db.query(sql, [set_value, set_name], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改成功"
      })
    }
  })
}

// 获取所有公司信息
exports.getCompanyInfo = (req, res) => {
  const sql = 'select * from setting where set_name like ?'
  db.query(sql, ['company%'], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      results,
      status: 0
    })
  })
}


// 获取用户管理员数据
exports.getUserData = async (req, res) => {
  try {
    const [results] = await pool.query(
      'select `identity` as name, count(*) as value from users group by `identity` order by value'
    );
    res.send({
      status: 0,
      message: '成功',
      results
    });
  } catch (error) {
    console.error('数据库查询失败:', error);
    // 返回错误时的code
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 获取信息等级信息
exports.getMsgLvData = async (req, res) => {
  try {
    const [results] = await pool.query(
      'select `message_level` as name, count(*) as value from message group by `message_level` order by value'
    );
    res.send({
      status: 0,
      message: '成功',
      results
    });
  } catch (error) {
    console.error('数据库查询失败:', error);
    // 返回错误时的code
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
exports.getPriceData = async (req, res) => {
  try {
    const [results] = await pool.query(`
      select 
      product_category as category, 
      sum(product_all_price) as total 
      from products 
      group by product_category
    `)
    res.send({
      status: 0,
      message: '成功',
      results
    });
  } catch (error) {
    console.error('数据库查询失败:', error);
    // 返回错误时的code
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

exports.getLoginCount = async (req, res) => {
  try {
    // 构建查询 SQL
    const [rows] = await pool.execute(`
      SELECT 
        date(login_time) as date,
        count(distinct account) as count
        from login_log
        where login_time >= curdate() - interval 6 day
        group by date
      `);

    const results = rows.map(({ date, count }) => {
      return {
        date: date.toISOString().split('T')[0],
        count
      }
    })

    res.send({
      results,
      status: 0
    });
  } catch (error) {
    console.error('数据库查询失败:', error);
    // 返回错误时的code
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}