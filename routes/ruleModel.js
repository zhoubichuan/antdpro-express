let express = require("express");
let router = express.Router();
let { RuleModel } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require('moment')
// 添加规则
router.post('/rule', async (req, res) => {
  let {
    key = 1,
    disabled = true,
    href = 'https://ant.design',
    avatar = 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    name = 'TradeCode',
    owner = '张三',
    desc = 'asdfa',
    callNo = '100',
    status = '200',
    progress = '50',
    createdAt = "2022-08-10T02:18:45.682Z",
    updatedAt = "2022-08-10T02:18:45.682Z"
  } = req.body;
  let target = await RuleModel.find({ name })
  if (target.length) {
    res.send({ status: 'error', message: '规则重复' });
    return
  }
  let result = await RuleModel.create({ key, disabled, href, avatar, name, owner, desc, callNo, status, progress, createdAt, updatedAt });
  return res.json(result);
});

//查询
// router.get('/rule', checkLogin, async (req, res) => {
  router.get('/rule', async (req, res) => {
  let { current = 1, pageSize = 10, email, sorter, filter, ...query } = req.query;
  if (sorter) {
    sorter = sorter ? JSON.parse(sorter) : {};
    sorter[key] = sorter[key] === 'ascend' ? 1 : -1;
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
  let total = await RuleModel.countDocuments(query);
  let users = await RuleModel.find(query)
    .sort(sorter).skip((current - 1) * pageSize).limit(pageSize);
  const result = {
    data: users,
    total,
    pageSize,
    current,
  };
  return res.json(result);
});


module.exports = router;
