const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入登录路由处理模块
const loginLogController = require('../router_controller/login_log')

// 导入路由处理模块
// 获取文件列表
router.get('/getLoginLog', loginLogController.getLoginLog)

// 删除操作记录
router.delete('/deleteLoginLog', loginLogController.deleteLoginLog)

// 插入操作记录
router.post('/recordLogin', loginLogController.recordLogin)

// 清空记录
router.post('/clearLoginLog', loginLogController.clearLoginLog)

// 向外暴露路由
module.exports = router;