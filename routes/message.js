// 导入express
const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入message路由处理模块
const messageController = require('../router_controller/message')

// 导入express-joi 校验表单
const expressJoi = require('@escook/express-joi')
const { message_limit } = require('../limit/message')

// 导入信息的路由处理模块
// 发布消息，系统和公司共用
router.post('/publishMsg', messageController.publishMsg)

// 编辑公司消息
router.put('/updateCorpMsg', messageController.updateCorpMsg)

// 编辑系统消息
router.put('/updateSysMsg', messageController.updateSysMsg)

// 根据id删除消息到回收站
router.post('/deleteMsg', messageController.deleteMsg)

// 获取所有公司公告信息列表
router.get('/getCorpMsg', messageController.getCorpMsg)

// 筛选公司消息
router.post('/filterMsg', messageController.filterMsg)

// 获取所有系统信息列表
router.get('/getSysMsg', messageController.getSysMsg)

// 获取所有回收站信息列表
router.get('/getRecycleMsg', messageController.getRecycleMsg)

// 还原回收站信息
router.post('/restoreMsg', messageController.restoreMsg)

// 根据id删除回收站消息
router.delete('/deleteRecycleMsg', messageController.deleteRecycleMsg)

// 获取部门消息
router.post('/getDepartmentMsg', messageController.getDepartmentMsg)

// 更新点击数
router.post('/updateClick', messageController.updateClick)


// 向外暴露路由
module.exports = router;