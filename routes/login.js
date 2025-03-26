// 登录注册模块路由
// 导入express
const express = require('express')
const Joi = require('joi')
// 使用express框架的路由
const router = express.Router();
// 导入login路由处理模块
const loginController = require('../router_controller/login')
// 导入express-joi 校验表单
const expressJoi = require('@escook/express-joi')
const { login_limit } = require('../limit/login')

// 导入register的路由处理模块
router.post('/register',expressJoi(login_limit),  loginController.register)
// 导入login的路由处理模块
router.post('/login',expressJoi(login_limit),  loginController.login)

// 向外暴露路由
module.exports = router;