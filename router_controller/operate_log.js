const db = require('../db/index')

// 插入操作记录
exports.recordOperate = (req, res) => {
  const {
    account:operate_account,
    operate
  } = req.body
  const operate_time = new Date()
  // 操作内容 
  // 1.添加管理员2.删除管理员(降职) 
  // 3.冻结,解冻操作 4.赋权操作 5.删除用户
  // 6.添加产品 7.申请出库 8.删除产品 9.同意出库  10.删除出库记录
  // 11.发布公告 12.系统公告 13.删除回收站消息 
  // 14.上传合同 15.删除合同 
  // 16.编辑公司信息 17.轮播图更换 18.部门选项修改 19 产品修改
  const operate_content = ``
  // 操作等级
  const operate_level = ``
  const sql = `insert into login_log set ?`
  const recordInfo = {
    operate_account,
    operate_time
  }
  db.query(sql, recordInfo, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '标记登录记录成功',
    })
  })
}

// 获取操作列表
exports.getOperateLog = (req, res) => {
  const sql = `select * 
    from operate_log
    `
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取操作日志列表成功',
      results
    })
  })
}

// 搜索记录
exports.searchOperateLog = (req, res) => {
  const operate_account = req.body.account
  const sql = `select * from operate_log where operate_account like ?`
  db.query(sql, [`%${operate_account}%`], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '搜索操作日志成功',
      results
    })
  })
}

// 清空记录
exports.clearOperateLog = (req,res)=>{
  // 清空数据 
  db.query(`delete from operate_log`);
  // 重置自增 ID 
  db.query(`alter table operate_log auto_increment = 1`);
}