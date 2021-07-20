let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let user = require('./routes/user');
let dataModel = require('./routes/dataModel');
app.use(bodyParser.json());//可以接收JSON格式的请求体
app.use(bodyParser.urlencoded({extended:true}));//可以接收表单格式的请求体
app.use('/api',user);
app.use('/api',dataModel);
app.listen(3000,()=>{
    console.log('服务器在3000端口上启动了!');
});