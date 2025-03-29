const db = require('../db/index')
// 处理文件路径
const fs = require('fs')

// 设置轮播图
exports.setSwiper = (req, res) => {
  // req.query.set_name
  // 保存上传图片的生成的名称filename
  const fileName = req.files[0].filename
  // 服务器表中的文件名
  const originalName = Buffer.from(req.files[0].originalname, 'latin1').toString("utf8")
  const generateName = req.query.set_name + '.' + originalName.split('.')[1]
  // 更换文件在服务器中的名称
  fs.renameSync('./public/uploads/' + fileName, './public/uploads/' + generateName)
  const set_value = `http://127.0.0.1:3001/uploads/${generateName}`
  // 更新setting表中的swiper的url 
  const sql = 'update setting set set_value = ? where set_name = ?'
  db.query(sql, [set_value, req.query.set_name], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "修改成功"
    })
  })
}

// 设置公司信息
exports.setCompanyInfo = (req, res) => {
  res.send('success')
}