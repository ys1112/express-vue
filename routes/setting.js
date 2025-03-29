// 导入express
const express = require('express')

// 使用express框架的路由
const router = express.Router();

// 导入setting的路由处理模块
const settingController = require('../router_controller/setting')
// 导入路由处理模块
router.post('/setSwiper', settingController.setSwiper)
router.post('/setCompanyInfo', settingController.setCompanyInfo)

// 向外暴露路由
module.exports = router;