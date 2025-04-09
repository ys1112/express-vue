// 导入数据库
const db = require('../db/index')

// *产品管理字段

// 两张表
// 产品表 字段:
// id
// product_id 入库编号 int
// product_name 产品名称 varchar
// product_category 产品类别 varchar
// product_unit 产品单位 varchar
// product_inwarehouse_number 产品入库数量 库存 int
// product_single_price 产品入库单价int
// product_all_price 产品入库总价 int
// product_status 库存状态100-300为正常 100以下为库存告急 300以上为过剩varchar
// product_create_person 入库操作人 varchar
// product_create_time 产品新建时间 varchar
// product_update_time 产品最新编辑时间 varchar
// in_memo 入库备注

// product_out_id 出库id int
// product_out_number 出库数量 int
// product_out_price 出库总价 int
// product_out_apply_person 出库申请人 varchar
// product_apply_date 申请出库时间varchar
// apply_memo 申请备注 varchar
// product_out_status 出库状态 申请出库 or同意or 否决 varchar

// product_audit_time 审核时间 varchar
// product_out_audit_person 审核人 varchar
// audit_memo 出库备注 备注 varchar

// 出库(审核成功)表
// product_out_id 出库id int
// product_out_number 出库数量 int
// product_out_price 出库总价int
// product_out_apply_person 出库申请人 varchar
// product_audit_time 审核时间 varchar
// product_out_audit_person 审核人 varchar
// audit_memo 出库/审核备注 varchar
const getProductStatus = (number) => {
  if (number < 100) {
    return '库存告急'
  } else if (number >= 100 && number <= 400) {
    return '库存正常'
  } else if (number > 400) {
    return '库存过剩'
  }
}

// 查询值可能未设置product_out_status，入库0 申请1 否决 2 同意3（已出库） 
// 创建产品
exports.createProduct = (req, res) => {
  const {
    product_id,
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    product_create_person,
    in_memo,
  } = req.body
  // 防止入库编号重复
  const isRepeatSql = 'select * from products where product_id = ?'
  db.query(isRepeatSql, product_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '入库编号已存在'
      })
    } else {
      // 创建时间
      const product_create_time = new Date()
      // 状态
      const product_out_status = 0
      // 总价
      const product_all_price = product_single_price * product_inwarehouse_number
      // 商品是否紧急
      const product_status = getProductStatus(product_inwarehouse_number)
      const createInfo = {
        product_id,
        product_name,
        product_category,
        product_unit,
        product_inwarehouse_number,
        product_single_price,
        product_all_price,
        product_create_person,
        product_create_time,
        in_memo,
        product_out_status,
        product_status
      }
      const sql = 'insert into products set ?'
      db.query(sql, createInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows == 1) {
          return res.send({
            status: 0,
            message: '添加产品成功'
          })
        } else {
          res.send({
            status: 1,
            message: '添加产品失败'
          })
        }
      })
    }
  })

}

// 申请产品出库
exports.applyDelivery = (req, res) => {
  const {
    id,
    product_out_id,
    product_out_number,
    product_out_apply_person,
    apply_memo,
  } = req.body
  const isRepeatSql = 'select * from products where product_out_id = ?'
  db.query(isRepeatSql, product_out_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '出库编号已存在'
      })
    } else {
      const sql = 'select * from products where id = ?'
      db.query(sql, id, (err, results) => {
        if (err) return res.cc(err)
        if (product_out_number > results[0].product_inwarehouse_number) {
          return res.send({
            status: 1,
            message: '出库数量错误'
          })
        }
        const product_out_price = results[0].product_single_price * product_out_number
        const product_apply_date = new Date()
        const product_out_status = 1
        const applyInfo = {
          product_out_id,
          product_out_number,
          product_out_apply_person,
          apply_memo,
          product_out_price,
          product_apply_date,
          product_out_status
        }
        const sql1 = 'update products set ? where id = ?'
        db.query(sql1, [applyInfo, id], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows == 1) {
            res.send({
              status: 0,
              message: "申请出库成功"
            })
          }
        })
      })
    }
  })
}

// 编辑产品信息
exports.updateProduct = (req, res) => {
  const {
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    in_memo,
  } = req.body
  const id = req.query.id
  const product_update_time = new Date()
  const product_all_price = product_single_price * product_inwarehouse_number
  const product_status = getProductStatus(product_inwarehouse_number)
  const updateInfo = {
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    product_all_price,
    product_update_time,
    in_memo,
    product_status,
  }
  const sql = 'update products set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "修改产品信息成功"
      })
    }
  })
}

// 获取所有产品列表
exports.getProducts = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [keyword]
  let sql = 'select * from products where product_id like ?'
  const limit = ` limit ? offset ?`
  // 查询一页10条数据
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    // 记录总数
    const total = results.length || 0
    // 追加限制
    queryInfo.push(pageSize, offset)
    // 修改sql语句
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '查询产品列表成功',
        total,
        results
      })
    })
  })

}


// 根据id删除产品
exports.deleteProduct = (req, res) => {
  const id = req.body.id
  const sql = 'delete from products where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除产品成功"
      })
    }
  })
}

// 获取申请中的产品列表
exports.getApplyProducts = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const keyword = `%${req.query.keyword || ''}%`
  const offset = (pageNum - 1) * pageSize
  const limit = ` limit ? offset ?`
  // 查询所有product_out_status为申请中的产品
  let sql = `select * 
    from products
    where
    (product_out_status = ?
    or product_out_status = ?)
    and product_out_id like ?
    `
  let queryInfo = [1, 2, keyword]
  // 查询一页10条数据
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    // 符合要求的总数量
    const total = results.length || 0
    // 偏移量
    // 追加每页数量和偏移量
    queryInfo.push(pageSize, offset)
    // sql追加限制
    sql += limit
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '查询产品列表成功',
        total,
        results
      })
    })
  })



  // const sql = `select * 
  //   from products
  //   where
  //   product_out_status = ?
  //   or product_out_status = ?
  //   `
  // const queryInfo = [1, 2]
  // db.query(sql, queryInfo, (err, results) => {
  //   if (err) return res.cc(err)
  //   res.send({
  //     status: 0,
  //     message: '查询申请出库列表成功',
  //     results
  //   })
  // })
}


// 同意出库申请
exports.approveApply = (req, res) => {
  const {
    id,
    product_out_audit_person,
    audit_memo,
  } = req.body
  const sql = 'select * from products where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    let {
      product_out_id,
      product_inwarehouse_number,
      product_name,
      product_single_price,
      product_all_price,
      product_out_number,
      product_out_price,
      product_out_apply_person,
    } = results[0]
    const product_audit_time = new Date()
    const agreeInfo = {
      product_out_id,
      product_out_name: product_name,
      product_out_number,
      product_single_price,
      product_out_price,
      product_out_apply_person,
      product_audit_time, // 新加
      product_out_audit_person, //新加
      audit_memo, // 新加
    }
    const sql1 = 'insert into out_products set ?'
    db.query(sql1, [agreeInfo], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows == 1) {
        // 1.重置products申请部分 
        // 2.库存总数减去出库数量，总价更新
        // 3.product_out_status 更新为0 
        product_inwarehouse_number = product_inwarehouse_number - product_out_number
        product_all_price = product_inwarehouse_number * product_single_price
        const product_status = getProductStatus(product_inwarehouse_number)
        const updateInfo = {
          product_inwarehouse_number,
          product_all_price,
          product_status,
          product_out_id: null,
          product_out_number: null,
          product_out_apply_person: null,
          product_out_price: null,
          product_apply_date: null,
          product_out_status: 0,
          apply_memo: null,
          product_out_audit_person: null,
          audit_memo: null,
        }

        const sql2 = 'update products set ? where id = ?'
        db.query(sql2, [updateInfo, id], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows == 1) {
            res.send({
              status: 0,
              message: "同意出库申请成功"
            })
          }
        })
      }
    })
  })
}

// 驳回出库申请
exports.rejectApply = (req, res) => {
  const {
    id,
    product_out_audit_person,
    audit_memo,
  } = req.body
  const product_out_status = 2
  const rejectInfo = {
    product_out_status,
    product_out_audit_person,
    audit_memo,
  }
  const sql2 = 'update products set ? where id = ?'
  db.query(sql2, [rejectInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "出库更新产品信息成功"
      })
    }
  })
}

// 撤销出库申请
exports.cancelApply = (req, res) => {
  const {
    id
  } = req.body
  const updateInfo = {
    product_out_id: null,
    product_out_number: null,
    product_out_apply_person: null,
    product_out_price: null,
    product_apply_date: null,
    product_out_status: 0,
    apply_memo: null,
    product_out_audit_person: null,
    audit_memo: null,
  }
  const sql = 'update products set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "撤销申请成功"
      })
    }
  })
}

// 再次提交出库申请
exports.resubmit = (req, res) => {
  const {
    id
  } = req.body
  const updateInfo = {
    product_out_status: 1,
  }
  const sql = 'update products set ? where id = ?'
  db.query(sql, [updateInfo, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "提交申请成功"
      })
    }
  })
}

// 获取已出库的产品列表
exports.getOutProducts = (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // 当前页码
  const pageSize = Number(req.query.pageSize) || 10; // 每页条数
  const offset = (pageNum - 1) * pageSize
  const keyword = `%${req.query.keyword || ''}%`
  const queryInfo = [keyword]
  const limit = ` limit ? offset ?`
  // 基础sql语句
  let sql = 'select * from out_products where product_out_id like ?'
  db.query(sql, queryInfo, (err, results) => {
    if (err) return res.cc(err)
    const total = results.length || 0
    sql += limit
    queryInfo.push(pageSize, offset)
    db.query(sql, queryInfo, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '查询已出库列表成功',
        results,
        total
      })
    })
  })
}

// 根据id删除已出库产品
exports.deleteDelivery = (req, res) => {
  const id = req.body.id
  const sql = 'delete from out_products where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除已出库记录成功"
      })
    }
  })
}