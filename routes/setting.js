// 导入express
const express = require('express')

// 使用express框架的路由
const router = express.Router();

// 导入setting的路由处理模块
const settingController = require('../router_controller/setting')
// 导入路由处理模块
router.post('/setSwiper', settingController.setSwiper)
router.get('/getAllSwiper', settingController.getAllSwiper)
router.post('/setCompanyInfo', settingController.setCompanyInfo)
router.get('/getCompanyInfo', settingController.getCompanyInfo)

// 获取用户管理员数据
router.get('/getUserData', settingController.getUserData)
// 获取信息等级信息
router.get('/getMsgLvData', settingController.getMsgLvData)

router.get('/getPriceData', settingController.getPriceData)

router.get('/getLoginCount', settingController.getLoginCount)

// 向外暴露路由
module.exports = router;