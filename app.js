const express = require('express');
const app = express();
// 1.导入path
const path = require('path')
const PORT = process.env.PORT || 3001;
// 引入body-parser
const bodyParser = require('body-parser')

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });
// 配置 cors 跨域:将 cors 注册为全局中间件
const cors = require('cors')
// Multer是node.js中间件，用于处理multipart/form-data类型的表单数据，主要用于上传文件
const multer = require('multer')
// 全局挂载
app.use(cors({
  // origin: /^https:\/\/(.+\.)?gmbksys\.xyz$/, // 前端域名（HTTPS协议，无需端口）
  // methods: ['GET', 'POST','PUT', 'DELETE', 'OPTIONS'],// 根据实际接口方法扩展
  // allowedHeaders: ['Authorization', 'Content-Type'], // 显式允许Authorization头
  // credentials: true // 允许携带凭证（如Cookie）
}))
// 显式处理OPTIONS请求（确保在所有路由之前）
app.options('*', (req, res) => {
  res.sendStatus(200); // 直接返回200，由CORS中间件添加头
});
// 在server服务端下新建一个public文件夹，在public下新建一个upload文件夹用于存放图片
const upload = multer({ dest: './public/uploads' })
app.use(upload.any())
// 2.静态托管dist
app.use(express.static(path.join(__dirname, 'dist')))
// 静态托管
app.use(express.static('./public'))

// extend为false时 值为数组或字符串，为true时，值为任意类型
app.use(bodyParser.urlencoded({ extended: false }));
// 使用内置中间件body-parser
app.use(bodyParser.json());
// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // 在所有路由前面对错误中间件进行一个挂载
  // status=0为成功 ，=1为失败，默认值为1方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 导入jwt配置文件
const jwtconfig = require('./jwt_config/index')

// express-jwt中间件，用于解析token
const { expressjwt: jwt } = require('express-jwt')

// 检查是否携带token，排除登录注册接口
app.use(jwt({
  secret: jwtconfig.jwtSecretKey, algorithms: ['HS256']
}).unless({
  // 排除登录和注册的接口,以及公开路径
  path: [/^\/api\/auth(\/.*)?$/],
}))
// 引入login路由文件
const loginRouter = require('./routes/login');

// 引入userinfo路由文件
const userInfoRouter = require('./routes/user_info');

// 引入setting路由文件
const settingRouter = require('./routes/setting');

// 引入product路由文件
const productRouter = require('./routes/product');

// 引入message路由文件
const messageRouter = require('./routes/message');

// 引入files路由文件
const filesRouter = require('./routes/files');

// 引入loginLog路由文件
const loginLogRouter = require('./routes/login_log');

// 引入operateLog路由文件
const operateLogRouter = require('./routes/operate_log');

// 引入department路由文件
const departmentRouter = require('./routes/department');

app.use('/api/auth', loginRouter);
app.use('/api/users', userInfoRouter);
app.use('/api/system', settingRouter);
app.use('/api/products', productRouter);
app.use('/api/notification', messageRouter);
app.use('/api/files', filesRouter);
app.use('/api/signin-records', loginLogRouter);
app.use('/api/operations', operateLogRouter);
app.use('/api/dpm', departmentRouter);

// 请求映射到dist
app.get('*', (req, res)=> {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
});
const Joi = require('joi')
// 对不符合joi规则的情况进行报错
app.use((err, req, res, next) => {
  // 数据校验失败
  if (err instanceof Joi.ValidationError) return res.send({
    status: 1,
    message: '输入账号密码不合法'
  })
  if (err.name === 'UnauthorizedError') { // JWT 库可能抛出的错误名称
    return res.status(401).json({ code: 401, message: '身份验证失败' });
  } else {
    return res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
