const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();
const httpServer = createServer(app);
// 导入jwt配置文件
const jwtconfig = require('../jwt_config/index')
const { verify } = require('jsonwebtoken');
const io = new Server(httpServer, {
  cors: {
    // origin: ["https://example.com", "http://127.0.0.1:3002"],
    // credentials: true,
    origin: '*',
    methods: ['GET', 'POST'],
  },
  path: '/my-socket-path'
});

// Node.js 服务端代码改造
io.on('connection', (socket) => {
  // 客户端连接时，根据部门 ID 加入对应房间
  socket.on('joinDeptRoom', (encodedDeptName) => {
    // 解码中文部门名称
    const deptName = decodeURIComponent(encodedDeptName);
    console.log(deptName);

    // 安全处理房间名（移除特殊字符）
    const safeRoomName = `dept_${deptName.replace(/[^\w\u4e00-\u9fa5]/g, '')}`;
    // 将客户端加入部门专属房间
    socket.join(safeRoomName);
  });
  // 客户端断开时自动离开所有房间（Socket.IO 内置）
  socket.on('disconnect', () => {
    console.log('客户端断开');
  });
});
// 后端校验 Token
io.use((socket, next) => {
  const token = socket.handshake.auth.token?.split(' ')[1];

  if (!token) return next(new Error('未提供 Token'));
  verify(token, jwtconfig.jwtSecretKey, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('JWT 验证失败:', err.message);
      return next(new Error('Unauthorized'));
    }
    socket.user = decoded;
    next();
  });
});
// io.on('connection_error', (err) => {
//   console.error('连接错误:', err.message);
//   // 可记录日志或通知客户端
// });


httpServer.listen(3002, () => {
  console.log(`Server is running on http://127.0.0.1:3002`);
});
module.exports = io