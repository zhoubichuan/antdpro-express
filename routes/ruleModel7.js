let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
let config = require("../config");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
let moment = require("moment");

let getFileds = (key, state, data) => {
  let jsonArray = require("../template" + key + ".json");
  let fieldObj = {};
  jsonArray.forEach((item) => {
    if (item[state]) {
      fieldObj[item.name] =
        data[item.name] || state === "add" ? item["addDefault"] : "";
    }
  });
  return fieldObj;
};

Object.keys(require("../template")).forEach((key) => {
  key = key.replace("template", "");
  let Models = require("../model");
  // 添加规则
  router.post("/rule" + key, async (req, res) => {
    let currentId = "1";
    let preRow = await Models["RuleModel" + key]
      .find({})
      .sort({ updatedAt: -1 })
      .limit(1);
    if (!preRow[0] || !preRow[0].id) {
      currentId = "0000001";
    } else {
      currentId = String(Number(preRow[0].id) + 1);
      currentId = "0".repeat(7 - currentId.length) + currentId;
    }
    let result = await Models["RuleModel" + key].create(
      getFileds(7, "add", req.body)
    );
    return res.json(result);
  });
  // 更新规则
  router.put("/rule" + key, async (req, res) => {
    let { id = 1 } = req.body;
    let target = await Models["RuleModel" + key].find({ id });
    if (!target.length) {
      res.send({ status: "error", message: "没有找到" });
      return;
    }
    let result = await Models["RuleModel" + key].updateMany(
      { id },
      { $set: getFileds(7, "edit", req.body) }
    );
    return res.json(result);
  });
  // 删除规则
  router.delete("/rule" + key, async (req, res) => {
    let { id } = req.body;
    let target = await Models["RuleModel" + key].find({
      $or: id.map((id) => ({ id })),
    });
    if (!target.length) {
      res.send({ status: "error", message: "没有找到" });
      return;
    }
    let result = await Models["RuleModel" + key].deleteMany({
      $or: target.map((item) => ({ id: item.id })),
    });
    return res.json(result);
  });
  //查询
  router.get("/rule" + key, async (req, res) => {
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
    let total = await Models["RuleModel" + key].countDocuments(query);
    let users = await Models["RuleModel" + key]
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
});

module.exports = router;
