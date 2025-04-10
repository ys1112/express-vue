const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入登录路由处理模块
const operateLogController = require('../router_controller/operate_log')

// 导入路由处理模块
// 获取操作列表
router.get('/getOperLog', operateLogController.getOperLog)

// 删除操作记录
router.delete('/deleteOperLog', operateLogController.deleteOperLog)

// 插入操作记录
router.post('/recordOper', operateLogController.recordOper)

// 清空记录
router.post('/clearOperLog', operateLogController.clearOperLog)

// 向外暴露路由
module.exports = router;