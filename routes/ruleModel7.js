var Models = require("../model/index");
let express = require("express");
let xlsx = require('node-xlsx')
let router = express.Router();
["field", "type", "data", "template", "backend", "tab"].forEach((item) => {
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
    // 导入
    router.post("/list/" + item + "/" + key + "/import", async (req, res) => {
      let currentId = "1";
      let preRow =
        (await Models[item + key]?.find({}).sort({ createdAt: -1 }).limit(1)) ||
        [];
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
      Models[item + key].insertMany(data, function (err, result) {
        if (err) {
          console.log("导入数据失败:", err);
        } else {
          console.log("成功导入数据:", result.insertedCount, "条记录");
          return res.json(result);
        }
      });
    });
    // 导出
    router.post("/list/" + item + "/" + key + "/export", async (req, res) => {
      const data = req.body;
      if (JSON.stringify(data) === "{}") {
        data = await Models[item + key]?.find({})
        data = res.json(data)
      }
      const excelData = [
        Object.keys(data[0]),
        ...data.map(item => Object.values(item))
      ];

      const buffer = xlsx.build([{ name: "Sheet1", data: excelData }]);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('导出文件.xlsx'));
      res.send(buffer);
    });
    // 添加
    router.post("/list/" + item + "/" + key, async (req, res) => {
      let currentId = "1";
      let preRow = (await Models[item + key]?.find({})?.sort({ createdAt: -1 })?.limit(1)) || [];
      if (!preRow[0] || !preRow[0].id) {
        currentId = "0000001";
      } else {
        currentId = String(Number(preRow[0].id) + 1);
        currentId = "0".repeat(7 - currentId.length) + currentId;
      }
      let result = await Models[item + key]?.create({
        ...getFileds(key, "add", req.body),
        id: currentId,
      }) || [];
      return res.json(result);
    });
    // 更新
    router.put("/list/" + item + "/" + key, async (req, res) => {
      let { id = 1,...restParams } = req.body;
      let target = await Models[item + key]?.find({ id });
      if (!target.length) {
        res.send({ status: "error", message: "没有找到" });
        return;
      }
      let result = await Models[item + key].updateMany(
        { id },
        { $set: getFileds(key, "edit", restParams) }
      );
      return res.json(result);
    });
    // 删除
    router.delete("/list/" + item + "/" + key, async (req, res) => {
      let { id } = req.body;
      let target = await Models[item + key]?.find({
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
        current,
        pageSize,
        sorter = { createdAt: -1 },
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
      let total = (await Models[item + key]?.countDocuments(query)) || 0;
      let users
      if (pageSize) {
        users = (await Models[item + key]?.find(newQuery, { _id: 0 }).sort(sorter))
      } else {
        users = (await Models[item + key]?.find(newQuery, { _id: 0 })
          .sort(sorter)
          .skip((current - 1) * pageSize)
          .limit(pageSize)) || [];
      }
      let data = [];
      for (let i = 0;i < users.length;i++) {
        let o = users[i];
        if (o.hasChildren) {
          let childrens
          if (pageSize) {
            childrens = (await Models[item + key]?.find({ type: o.hasChildren }, { _id: 0 }))
              .sort(sorter)
          } else {
            childrens = (await Models[item + key]?.find({ type: o.hasChildren }, { _id: 0 })
              .sort(sorter)
              .skip((current - 1) * pageSize)
              .limit(pageSize)) || [];
          }
          o.children = childrens;
        } else {
          o.children = [];
        }
        data.push(o);
      }
      const result = {
        data,
        total,
      };
      if (pageSize) {
        result.pageSize = pageSize
      }
      if (current) {
        result.current = current
      }
      return res.json(result);
    });
  });
});
module.exports = router;
