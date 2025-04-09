const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入登录路由处理模块
const operateLogController = require('../router_controller/operate_log')

// 导入路由处理模块
// 获取文件列表
router.get('/getOperateLog', operateLogController.getOperateLog)

// 向外暴露路由
module.exports = router;