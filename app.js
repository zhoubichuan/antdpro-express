require('dotenv').config()
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
var routes = require('./routes/index')

const cors = require('cors')
app.use(cors())
app.use(bodyParser.json()); //可以接收JSON格式的请求体
app.use(bodyParser.urlencoded({
  extended: true
})); //可以接收表单格式的请求体
Object.keys(routes).forEach(key => {
  app.use('/api', routes[key])
})

// 错误处理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'internal server error'
  res.status(err, statusCode).json({
    message: err.message
  })
})
app.use(express.static('public'))
app.listen(7001, () => {
  console.log('服务器在7001端口上启动了!');
});