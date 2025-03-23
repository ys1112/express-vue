const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
// 引入body-parser
const bodyParser = require('body-parser')

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const cors = require('cors')
// 全局挂载
app.use(cors())

// extend为false时 值为数组或字符串，为true时，值为任意类型
app.use(bodyParser.urlencoded({ extended: false }));
// 使用内置中间件body-parser
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
