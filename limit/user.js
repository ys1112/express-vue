// 验证用户信息
const joi = require('joi')

// 定义姓名，性别，邮箱校验规则
const id = joi.string().pattern(/^\d+$/).required()

const identity = joi.string().required()

const department = joi.string().required()

const account = joi.string().alphanum().min(6).max(12).required()

// 必须包含一个字母和数字，可以使用-_!?@的6-16位的密码
const password = joi.string().pattern(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/).required()

const name = joi.string().pattern(/^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/).required()

const gender = joi.string().pattern(/^男$|^女$/).required()

const email = joi.string().pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required()



// 导出姓名，性别，邮箱校验规则
exports.name_limit = {
  query:{
    id
  },
  body: {
    name
  }
}
exports.gender_limit = {
  query:{
    id
  },
  body: {
    gender
  }
}
exports.email_limit = {
  query:{
    id
  },
  body: {
    email
  }
}
exports.password_limit = {
  query:{
    id
  },
  body: {
    password,
    newPassword:password
  }
}
exports.reset_limit = {
  body: {
    id,
    newPassword:password
  }
}
exports.create_admin_limit = {
  body: {
    account,
    password,
    name,
    gender,
    email,
    identity,
    department
  }
}