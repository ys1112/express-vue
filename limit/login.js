// 验证登录表单
const joi = require('joi')
// alphanum代表 a-z A-Z 0-9
const account = joi.string().alphanum().min(6).max(12).required()

const password = joi.string().pattern(/^[a-zA-Z0-9_!?@]{6,16}$/).required()

exports.login_limit = {
  body: {
    account,
    password
  }
}