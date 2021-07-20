let express = require('express');
let router = express.Router();
let {UserModel} = require('../model');
let jwt = require('jsonwebtoken');
let config = require('../config');
let checkLogin = require('../checkLogin');
let checkPermission = require('../checkPermission');
//添加用户
// router.post('/user', checkLogin,checkPermission('admin'),async (req, res) => {
  router.post('/user',async (req, res) => {
        let user = req.body;
        let hash = require('crypto').createHash('md5').update(user.email).digest('hex');
        user.avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
        user = await UserModel.create(user);
        res.send({ status: 'ok',access: user.toJSON().access});
});
    //删除用户
// router.delete('/user', checkLogin,checkPermission('admin'),async (req, res) => {
  router.delete('/user',async (req, res) => {
        await UserModel.remove({_id:req.body.key});
        return res.json({success:true});
});
    //修改用户
// router.put('/user', checkLogin,checkPermission('admin'), async (req, res) => {
  router.put('/user',async (req, res) => {
        let user = req.body;
        let hash = require('crypto').createHash('md5').update(user.email).digest('hex');
        user.avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
        user = await UserModel.findByIdAndUpdate(user.id,user,{useFindAndModify:false});
        res.send({ status: 'ok',access: user.toJSON().access});
});
//查询
/**
 * http://localhost:8000/api/user
 * ?current=1&pageSize=5&email=admin@qq.com&sorter={"createdAt":"descend"}&filter={"access":["admin"]}
 */
// router.get('/user', checkLogin,checkPermission('admin','user'),async (req, res) => {
  router.get('/user', async (req, res) => {
   let { current = 1, pageSize = 10,sorter=1,filter={},...query} = req.query;
   if(sorter){
       sorter = sorter?JSON.parse(sorter):{};
       for(let key in sorter){
           sorter[key]= sorter[key]==='ascend'?1:-1;
       }
   }
   if(filter){
       filter = filter?JSON.parse(filter):{};
       for(let key in filter){
           if(filter[key])
            query[key]=filter[key];
       }
   }
   console.log(query,current,pageSize);

   current = parseInt(current);
   pageSize =  parseInt(pageSize);
   if(query&&query.username){
    query.username = new RegExp(query.username)
   }
   let total = await UserModel.countDocuments(query);
   let users = await UserModel.find(query)
   .sort(sorter).skip((current-1)*pageSize).limit(pageSize);
   let dataSource = users.map(item=>item.toJSON());
   const result = {
       data: dataSource,
      //  total,
       success: true,
      //  pageSize,
       current,
   };
   return res.json(result);
});
//注册接口
router.post('/register', async (req, res) => {
    let user = req.body;
    console.log(req.body)
    let hash = require('crypto').createHash('md5').update(user.email).digest('hex');
    user.avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
    user = await UserModel.create(user);
    res.send({ status: 'ok',access: user.toJSON().access});
});
//登录接口
router.post('/login/account', async (req, res) => {
    let query = {username:req.body.username,password:req.body.password};
    let dbUser = await UserModel.findOne(query);
    console.log(query,dbUser)
    if (dbUser) {
        let user = dbUser.toJSON();
        let token = jwt.sign(user, config.secret,{expiresIn:'1h'});
        return res.send({ status: 'ok', token, type: 'account', access: user.access });
    } else {
        return res.send({
            status: 'error',
            type: 'account',
            access: 'guest'
        });
    }
});
router.get('/currentUser', async (req, res) => {
    let authorization = req.headers['authorization'];
    if (authorization) {
        try {
            let user = jwt.verify(authorization.split(' ')[1], config.secret);
            res.json(user);
        } catch (err) {
            res.status(401).send({});
        }
    } else {
        res.status(401).send({});
    }
});
router.get('/login/outLogin', async (req, res) => {
    res.send({ data: {}, success: true });
});

module.exports = router;