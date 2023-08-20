let express = require("express");
let router = express.Router();
let { RuleModel } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require("moment");
// 添加规则
router.post("/rule", async (req, res) => {
  let { name = "TradeCode", type = "张三", value = "asdfa" } = req.body;
  let currentId = "1";
  let preRow = await RuleModel.find({}).sort({ updatedAt: -1 }).limit(1);
  if (!preRow || !preRow.id) {
    currentId = "0000001";
  } else {
    currentId = String(Number(preRow.id) + 1);
    currentId = "0".repeat(currentId.length - 7) + currentId;
  }
  let target = await RuleModel.find({ name });
  if (target.length) {
    res.send({ status: "error", message: "规则重复" });
    return;
  }
  let result = await RuleModel.create({
    id: currentId,
    name,
    type,
    value,
  });
  return res.json(result);
});
// 更新规则
router.put("/rule", async (req, res) => {
  let { id = 1, name = "TradeCode", type = "张三", value = "asdfa" } = req.body;
  let target = await RuleModel.find({ id });
  if (!target.length) {
    res.send({ status: "error", message: "没有找到" });
    return;
  }
  let result = await RuleModel.updateMany({ name ,type , value });
  return res.json(result);
});
// 删除规则
router.delete("/rule", async (req, res) => {
  let { id } = req.body;
  let target = await RuleModel.find({ id });
  if (!target.length) {
    res.send({ status: "error", message: "没有找到" });
    return;
  }
  let result = await RuleModel.deleteMany({ id });
  return res.json(result);
});
//查询
// router.get('/rule', checkLogin, async (req, res) => {
router.get("/rule", async (req, res) => {
  let {
    current = 1,
    pageSize = 10,
    sorter,
    filter,
    ...query
  } = req.query;
  if (sorter) {
    sorter = sorter ? JSON.parse(sorter) : {};
    sorter[key] = sorter[key] === "ascend" ? 1 : -1;
  }
  if (filter) {
    filter = filter ? JSON.parse(filter) : {};
    for (let key in filter) {
      if (filter[key]) query[key] = filter[key];
    }
  }
  current = parseInt(current);
  pageSize = parseInt(pageSize);
  if (query && query.username) {
    query.username = new RegExp(query.username);
  }
  let total = await RuleModel.countDocuments(query);
  let users = await RuleModel.find(query)
    .sort(sorter)
    .skip((current - 1) * pageSize)
    .limit(pageSize);
  const result = {
    data: users,
    total,
    pageSize,
    current,
  };
  return res.json(result);
});

module.exports = router;
