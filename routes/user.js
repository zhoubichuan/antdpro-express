let express = require("express");
let router = express.Router();
let { UserModel, Notices } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
//添加用户
// router.post('/user', checkLogin,checkPermission('admin'),async (req, res) => {
router.post('/user', async (req, res) => {
  let { username, password, email } = req.body;
  let hash = require('crypto').createHash('md5').update(email).digest('hex');
  let avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
  let user = await UserModel.create({ username, password, email, avatar });
  res.send({ status: 'ok', result: user.toJSON() });
});
//删除用户
// router.delete('/user', checkLogin,checkPermission('admin'),async (req, res) => {
router.delete('/user', async (req, res) => {
  let { data } = req.body;
  let result = [], del
  for (let i = 0;i < data.length;i++) {
    let { id, username } = data[i]
    del = await UserModel.findByIdAndDelete(id, { username })
    result.push(del)
  }
  return res.json({ status: 'ok', result });
});
//修改用户
// router.put('/user', checkLogin,checkPermission('admin'), async (req, res) => {
router.put('/user', async (req, res) => {
  let { data } = req.body;
  let result = [], up
  for (let i = 0;i < data.length;i++) {
    let { id, ...update } = data[i]
    up = await UserModel.findByIdAndUpdate(id, update)
    result.push(up)
  }
  res.send({ status: 'ok', result });
});
//查询
/**
 * http://localhost:8000/api/user
 * ?current=1&pageSize=5&email=admin@qq.com&sorter={"createdAt":"descend"}&filter={"access":["admin"]}
 */
// router.get('/user', checkLogin,checkPermission('admin','user'),async (req, res) => {
router.get('/user', async (req, res) => {
  let { current = 1, pageSize = 10, sorter, filter, ...query } = req.query;
  if (sorter) {
    sorter = sorter ? JSON.parse(sorter) : {};
    for (let key in sorter) {
      sorter[key] = sorter[key] === 'ascend' ? 1 : -1;
    }
  }
  if (filter) {
    filter = filter ? JSON.parse(filter) : {};
    for (let key in filter) {
      if (filter[key])
        query[key] = filter[key];
    }
  }
  current = parseInt(current);
  pageSize = parseInt(pageSize);
  if (query && query.username) {
    query.username = new RegExp(query.username)
  }
  let total = await UserModel.countDocuments(query);
  let users = await UserModel.find(query)
    .sort(sorter).skip((current - 1) * pageSize).limit(pageSize);
  const result = {
    data: users,
    total,
    pageSize,
    current,
  };
  return res.json(result);
});
//注册接口
router.post('/register', async (req, res) => {
  let { username, password, email } = req.body;
  let hash = require('crypto').createHash('md5').update(email).digest('hex');
  let avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
  let user = await UserModel.create({ username, password, email, avatar });
  res.send({ status: 'ok', result: user.toJSON() });
});
//登录接口
router.post('/login/account', async (req, res) => {
  let { username, password } = req.body;
  let dbUser = await UserModel.findOne({ username, password });
  if (dbUser) {
    let user = dbUser.toJSON();
    let token = jwt.sign(user, config.secret, { expiresIn: '1h' });
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
//setnotices
router.post('/notices', async (req, res) => {
  let notices = req.body;
  notices = await Notices.create(notices);
  res.send({ status: 'ok', data: notices.toJSON() });
});
router.get('/notices', async (req, res) => {
  let data = await Notices.find({});
  res.send({ status: '200', data });
});
router.post('/login/outLogin', async (req, res) => {
  let authorization = req.headers['authorization'];
  if (authorization) {
    try {
      let { username } = jwt.verify(authorization.split(' ')[1], config.secret);
      let dbUser = await UserModel.findOne({ username });
      if (dbUser) {
        return res.send({ status: 'ok' });
      } else {
        return res.send({
          status: 'error',
          type: 'account',
          access: 'guest'
        });
      }
    } catch (err) {
      res.send({ status: 'ok' })
    }
  } else {
    res.send({ status: 'ok' })
  }
});

module.exports = router;
