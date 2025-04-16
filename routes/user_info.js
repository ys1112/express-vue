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
  reset_limit,
  create_admin_limit 
} = require('../limit/user')

// 导入userInfo的路由处理模块
const userInfoController = require('../router_controller/user_info')
// 导入upload头像上传的路由处理模块
router.post('/uploadAvatar', userInfoController.uploadAvatar)

// 绑定头像和账号
router.post('/bindAccount', userInfoController.bindAccount)

// 登录后修改密码
router.put('/updatePassword', expressJoi(password_limit), userInfoController.updatePassword)

// 获取用户信息
router.get('/getUserInfo', userInfoController.getUserInfo)

// 修改姓名
router.put('/updateName', expressJoi(name_limit), userInfoController.updateName)

// 修改性别
router.put('/updateGender', expressJoi(gender_limit), userInfoController.updateGender)

// 修改邮箱
router.put('/updateEmail', expressJoi(email_limit), userInfoController.updateEmail)

// 登录前修改密码
// 1.验证账号和邮箱是否和数据库中一致
router.post('/verifyAccount', userInfoController.verifyAccount)

// 登录前修改密码
// 2.重置密码
router.post('/resetPassword', expressJoi(reset_limit), userInfoController.resetPassword)

// 新增或删除部门
router.post('/setDepartment', userInfoController.setDepartment)

router.get('/getDepartment', userInfoController.getDepartment)

// 新增或删除产品
router.post('/setProduct', userInfoController.setProduct)

router.get('/getProduct', userInfoController.getProduct)

// --------------------用户管理
// 新建管理员
router.post('/createAdmin',expressJoi(create_admin_limit) ,userInfoController.createAdmin)

// 删除管理员（降级为普通用户）
router.post('/downgradeAdmin', userInfoController.downgradeAdmin)

// 编辑用户账号信息
router.put('/updateUser', userInfoController.updateUser)

// 获取用户列表
router.get('/getUserList', userInfoController.getUserList)

// 搜索用户列表
// router.get('/searchUserList', userInfoController.searchUserList)

// 根据id冻结用户
router.post('/freezeUser', userInfoController.freezeUser)

// 根据id解冻用户
router.post('/unfreezeUser', userInfoController.unfreezeUser)

// 根据id和identity赋权为用户管理员或产品管理员
router.post('/empowerUser', userInfoController.empowerUser)

// 删除用户
router.delete('/deleteUser', userInfoController.deleteUser)

// 修改用户基础账号信息
router.put('/setAccount', userInfoController.setAccount)
// 向外暴露路由
module.exports = router;