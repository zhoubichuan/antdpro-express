let express = require("express");
let router = express.Router();
let { RuleModel5 } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require('moment')
// 添加规则
router.post('/rule5', async (req, res) => {
  let {
    code = 1,
    name = 'xxxx',
    type = '全部',
    count = 0,
    number = 0,
    status = 0,
    remark='备注信息描述文字',
  } = req.body;
  let target = await RuleModel5.find({ code })
  if (target.length) {
    res.send({ status: 'error', message: '规则重复' });
    return
  }
  let result = await RuleModel5.create({ code, name, type, count, number, status, remark });
  return res.json(result);
});

//查询
// router.get('/rule5', checkLogin, async (req, res) => {
  router.get('/rule5', async (req, res) => {
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
  let total = await RuleModel5.countDocuments(query);
  let users = await RuleModel5.find(query)
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
