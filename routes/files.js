const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入files路由处理模块
const filesController = require('../router_controller/files')

// 导入express-joi 校验表单
const expressJoi = require('@escook/express-joi')
const { file_limit } = require('../limit/files')

// 导入信息的路由处理模块
// 上传文件
router.post('/uploadFile', filesController.uploadFile)

// 删除文件
router.delete('/deleteFile', filesController.deleteFile)

// 获取文件列表
router.get('/getFiles', filesController.getFiles)

// 更新下载量
router.post('/updateDownload', filesController.updateDownload)


// 向外暴露路由
module.exports = router;