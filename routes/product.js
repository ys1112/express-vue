// 导入express
const express = require('express')

// 使用express框架的路由
const router = express.Router()

// 导入product路由处理模块
const productController = require('../router_controller/product')

// 导入express-joi 校验表单
const expressJoi = require('@escook/express-joi')
const { product_limit } = require('../limit/product')

// 导入产品的路由处理模块
router.post('/createProduct', productController.createProduct)

// 申请产品出库
router.post('/applyDelivery', productController.applyDelivery)

// 编辑产品信息
router.put('/updateProduct', productController.updateProduct)

// 获取所有产品列表
router.get('/getProducts', productController.getProducts)

// 根据id删除产品
router.delete('/deleteProduct', productController.deleteProduct)

// 获取申请中的产品列表
router.get('/getApplyProducts', productController.getApplyProducts)

// 同意出库申请
router.post('/approveApply', productController.approveApply)

// 驳回出库申请
router.post('/rejectApply', productController.rejectApply)

// 撤销申请
router.post('/cancelApply', productController.cancelApply)

// 再次提交申请
router.post('/resubmit', productController.resubmit)

// 获取已出库的产品列表
router.get('/getOutProducts', productController.getOutProducts)

// 根据id删除已出库产品
router.delete('/deleteDelivery', productController.deleteDelivery)

router.get('/getProductsTest', productController.getProductsTest)


// 向外暴露路由
module.exports = router;