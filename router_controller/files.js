const db = require('../db/index')


// file_name 文件名
// file_url 文件地址
// file_size 文件大小
// upload_person 上传者
// upload_time 上传时间
// download_number 下载次数
const fs = require('fs')


// 上传文件
exports.uploadFile = (req, res) => {
  const { upload_person } = req.body
  // 保存上传图片的生成的名称filename
  const fileName = req.files[0].filename
  let fileSize = req.files[0].size * 1
  if (fileSize / 1024 / 1024 > 1) {
    fileSize = (fileSize / 1024 / 1024).toFixed(2) + 'MB'
  } else {
    fileSize = (fileSize / 1024).toFixed(2) + 'KB'
  }
  // 服务器表中的文件名
  const originalName = Buffer.from(req.files[0].originalname, 'latin1').toString("utf8")
  // 更换文件在服务器中的名称
  fs.renameSync('./public/uploads/' + fileName, './public/uploads/' + originalName)
  // 查询名称是否存在
  const sql = 'select * from files where file_name = ?'
  db.query(sql, originalName, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '上传失败,文件已存在'
      })
    } else {
      // sql语句，上传文件信息到数据库
      const upload_time = new Date()
      const sql1 = 'insert into files set ?'
      const fileInfo = {
        file_name: originalName,
        file_url: `http://127.0.0.1:3001/uploads/${originalName}`,
        file_size: fileSize,
        upload_time,
        upload_person,
        download_number: 0
      }
      db.query(sql1, fileInfo, (err, results) => {
        if (err) return res.cc(err)
        res.send({
          status: 0,
          message: '上传文件成功'
        })
      })
    }
  })

}

// 删除文件
exports.deleteFile = (req, res) => {
  const id = req.body.id
  const sql = 'delete from files where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除文件成功"
      })
    }
  })
}

// 获取文件列表
exports.getFiles = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [keyword]
  const limit = ` limit ? offset ?`
  let sql = `select * 
    from files
    where
    file_name like ?
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
        message: '获取文件列表成功',
        total,
        results
      })
    })
  })
}

// 更新下载量
exports.updateDownload = (req, res) => {
  const {
    id
  } = req.body
  const sql = 'select * from files where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    const download_number = results[0].download_number * 1 + 1
    const sql1 = 'update files set download_number = ? where id = ?'
    db.query(sql1, [download_number, id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows == 1) {
        res.send({
          status: 0,
          download_number,
          message: "下载量增加"
        })
      }
    })
  })
}
