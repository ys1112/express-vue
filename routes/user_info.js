// 导入express
const express = require('express')

// 使用express框架的路由
const router = express.Router();
// 导入express-joi 校验表单
const expressJoi = require('@escook/express-joi')

// 导入姓名，性别，邮箱校验规则
const { 
  name_limit,
  gender_limit,
  email_limit,
  password_limit,
  reset_limit 
} = require('../limit/user')

// 导入userInfo的路由处理模块
const userInfoController = require('../router_controller/user_info')
// 导入upload头像上传的路由处理模块
router.post('/uploadAvatar', userInfoController.uploadAvatar)
router.post('/bindAccount', userInfoController.bindAccount)
router.put('/updatePassword', expressJoi(password_limit), userInfoController.updatePassword)
router.get('/getUserInfo', userInfoController.getUserInfo)
router.put('/updateName', expressJoi(name_limit), userInfoController.updateName)
router.put('/updateGender', expressJoi(gender_limit), userInfoController.updateGender)
router.put('/updateEmail', expressJoi(email_limit), userInfoController.updateEmail)
router.post('/verifyAccount', userInfoController.verifyAccount)
router.post('/resetPassword', expressJoi(reset_limit), userInfoController.resetPassword)
// 向外暴露路由
module.exports = router;