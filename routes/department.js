const express = require('express')
const router = express.Router()
const departmentController = require('../router_controller/department')

// 获取部门消息
router.post('/getDepartMsg', departmentController.getDepartMsg)

// 获取用户已读信息
router.post('/getReadMsg', departmentController.getReadMsg)

// 用户点击部门信息,更新未读信息read_list
router.post('/deleteReadMsg', departmentController.deleteReadMsg)

// 新增信息时修改所属部门成员的未读消息
router.post('/addUnreadMsg', departmentController.addUnreadMsg)

// 删除信息时修改所属部门成员的未读消息
router.post('/deleteUnreadMsg', departmentController.deleteUnreadMsg)

router.post('/getAllDepartMsg', departmentController.getAllDepartMsg)

router.post('/updateClick', departmentController.updateClick)

module.exports = router;
