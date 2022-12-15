let express = require("express");
let router = express.Router();
let { Tags } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require('moment')
// 添加规则
router.post('/tags', async (req, res) => {
  let {
    code = 1,
    name = 'xxxx',
    type = '全部',
    value = 0,
  } = req.body;
  let target = await Tags.find({ code })
  if (target.length) {
    res.send({ status: 'error', message: '规则重复' });
    return
  }
  let result = await Tags.create({ code, name, type, value });
  return res.json(result);
});

//查询
// router.get('/tags', checkLogin, async (req, res) => {
router.get('/tags', async (req, res) => {
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
  let total = await Tags.countDocuments(query);
  let users = await Tags.find(query)
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
