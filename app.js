const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
// 引入body-parser
const bodyParser = require('body-parser')
// 引入路由文件
const loginRouter = require('./routes/login');
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

const cors = require('cors')
// 全局挂载
app.use(cors())

// extend为false时 值为数组或字符串，为true时，值为任意类型
app.use(bodyParser.urlencoded({ extended: false }));
// 使用内置中间件body-parser
app.use(bodyParser.json());

app.use((req,res,next)=>{
  
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

app.use(jwt({
  secret: jwtconfig.jwtSecretKey, algorithms: ['HS256']
}).unless({
  // 排除登录和注册的接口,以及公开路径
  path: [/^\/api\//],
}))



app.use('/api', loginRouter);

app.use((req,res,next)=>{
  if (err instanceof Joi.ValidationError) return res.cc(err)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
