let express = require("express");
let router = express.Router();
["field", "type", "data", "template"].forEach((item) => {
  let templateData = require("../" + item);
  let getFileds = (key, state, data) => {
    let jsonArray = templateData[key + ".json"];
    let fieldObj = {};
    jsonArray.forEach((item) => {
      if (item[state]) {
        fieldObj[item.name] =
          data[item.name] || (state === "add" ? item["addDefault"] : "");
      }
    });
    return fieldObj;
  };

  Object.keys(templateData).forEach((key) => {
    key = key.replace(".json", "");
    let Models = require("../model");
    // 导入
    router.post("/list/" + item + "/" + key + "/export", async (req, res) => {
      let currentId = "1";
      let preRow = await Models[item + key]
        .find({})
        .sort({ updatedAt: -1 })
        .limit(1);
      if (!preRow[0] || !preRow[0].id) {
        currentId = "0000001";
      } else {
        currentId = String(Number(preRow[0].id) + 1);
        currentId = "0".repeat(7 - currentId.length) + currentId;
      }
      // 将数据插入到集合中
      let row1 = req.body[0];
      let data = req.body.slice(1).map((item, index) => {
        currentId = String(Number(preRow[0] ? preRow[0].id : 0) + 1 + index);
        currentId = "0".repeat(7 - currentId.length) + currentId;
        let target = { id: currentId };
        row1.forEach((o, i) => {
          target[o] = item[i];
        });
        return target;
      });
      Models.db
        .collection(`${item}${key}`)
        .insertMany(data, function (err, result) {
          if (err) {
            console.log("导入数据失败:", err);
          } else {
            console.log("成功导入数据:", result.insertedCount, "条记录");
            return res.json(result);
          }
        });
    });
    // 添加
    router.post("/list/" + item + "/" + key, async (req, res) => {
      let currentId = "1";
      let preRow = await Models[item + key]
        .find({})
        .sort({ updatedAt: -1 })
        .limit(1);
      if (!preRow[0] || !preRow[0].id) {
        currentId = "0000001";
      } else {
        currentId = String(Number(preRow[0].id) + 1);
        currentId = "0".repeat(7 - currentId.length) + currentId;
      }
      let result = await Models[item + key].create({
        ...getFileds(key, "add", req.body),
        id: currentId,
      });
      return res.json(result);
    });
    // 更新
    router.put("/list/" + item + "/" + key, async (req, res) => {
      let { id = 1 } = req.body;
      let target = await Models[item + key].find({ id });
      if (!target.length) {
        res.send({ status: "error", message: "没有找到" });
        return;
      }
      let result = await Models[item + key].updateMany(
        { id },
        { $set: getFileds(key, "edit", req.body) }
      );
      return res.json(result);
    });
    // 删除
    router.delete("/list/" + item + "/" + key, async (req, res) => {
      let { id } = req.body;
      let target = await Models[item + key].find({
        $or: id.map((id) => ({ id })),
      });
      if (!target.length) {
        res.send({ status: "error", message: "没有找到" });
        return;
      }
      let result = await Models[item + key].deleteMany({
        $or: target.map((item) => ({ id: item.id })),
      });
      return res.json(result);
    });
    //查询
    router.get("/list/" + item + "/" + key, async (req, res) => {
      let {
        current = 1,
        pageSize = 10,
        sorter = { updatedAt: -1 },
        filter,
        ...query
      } = req.query;
      // if (sorter) {
      //   sorter = JSON.parse(sorter);
      //   for (let key in sorter) {
      //     if (key === "ascend") sorter[key] = sorter[key] === "ascend" ? 1 : -1;
      //   }
      // }
      if (filter) {
        filter = filter ? JSON.parse(filter) : {};
        for (let key in filter) {
          if (filter[key]) query[key] = filter[key];
        }
      }
      current = parseInt(current);
      pageSize = parseInt(pageSize);
      let newQuery = {};
      Object.keys(query).forEach((key) => {
        if (!query[key]) return;
        if (key === "userip") {
          newQuery[key] = new RegExp(query[key]);
        } else {
          newQuery[key] = query[key];
        }
      });

      let total = await Models[item + key].countDocuments(query);
      let users = await Models[item + key]
        .find(newQuery)
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
});

module.exports = router;
