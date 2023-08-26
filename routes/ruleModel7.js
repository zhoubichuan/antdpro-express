let express = require("express");
let router = express.Router();
let { RuleModel7 } = require("../model");
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require("moment");
// 添加规则
router.post("/rule7", async (req, res) => {
  let {
    ip = "",
    network = "",
    version = "",
    city = "",
    region = "",
    region_code = "",
  } = req.body;
  let currentId = "1";
  let preRow = await RuleModel7.find({}).sort({ updatedAt: -1 }).limit(1);
  if (!preRow[0] || !preRow[0].id) {
    currentId = "0000001";
  } else {
    currentId = String(Number(preRow[0].id) + 1);
    currentId = "0".repeat(7 - currentId.length) + currentId;
  }
  let target = await RuleModel7.find({ ip });
  if (target.length) {
    res.send({ status: "error", message: "规则重复" });
    return;
  }
  let result = await RuleModel7.create({
    id: currentId,
    ip,
    network,
    version,
    city,
    region,
    region_code,
  });
  return res.json(result);
});
// 更新规则
router.put("/rule7", async (req, res) => {
  let { id = 1, ip = "", network = "", city = "" } = req.body;
  let target = await RuleModel7.find({ id });
  if (!target.length) {
    res.send({ status: "error", message: "没有找到" });
    return;
  }
  let result = await RuleModel7.updateMany(
    { id },
    { $set: { ip, network, city } }
  );
  return res.json(result);
});
// 删除规则
router.delete("/rule7", async (req, res) => {
  let { id } = req.body;
  let target = await RuleModel7.find({ $or: id.map((id) => ({ id })) });
  if (!target.length) {
    res.send({ status: "error", message: "没有找到" });
    return;
  }
  let result = await RuleModel7.deleteMany({
    $or: target.map((item) => ({ id: item.id })),
  });
  return res.json(result);
});
//查询
// router.get('/rule', checkLogin, async (req, res) => {
router.get("/rule7", async (req, res) => {
  let { current = 1, pageSize = 10, sorter, filter, ...query } = req.query;
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
  if (query && query.userip) {
    query.userip = new RegExp(query.userip);
  }
  let total = await RuleModel7.countDocuments(query);
  let users = await RuleModel7
    .find(query)
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
