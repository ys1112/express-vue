// 验证登录表单
const joi = require('joi')
// alphanum代表 a-z A-Z 0-9
const account = joi.string().alphanum().min(6).max(12).required()
// 必须包含一个字母和数字，可以使用-_!?@的6-16位的密码
const password = joi.string().pattern(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/).required()

exports.login_limit = {
  body: {
    account,
    password
  }
}