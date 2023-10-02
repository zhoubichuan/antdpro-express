var { UserModel } = require("../model/index");
let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
let checkLogin = require("../checkLogin");
let checkPermission = require("../checkPermission");
// 注册用户
router.post("/user", async (req, res) => {
  let { username, password, email, access } = req.body;
  let target = await UserModel.find({ username });
  if (target.length) {
    res.send({ status: "error", message: "用户名重复" });
    return;
  }
  let hash = require("crypto").createHash("md5").update(email).digest("hex");
  let avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
  let user = await UserModel.create({
    username,
    password,
    email,
    avatar,
    access,
  });
  res.send({ status: "success", result: user.toJSON() });
});
//删除用户
router.delete(
  "/user",
  checkLogin,
  checkPermission("access"),
  async (req, res) => {
    let { data } = req.body;
    let result = [],
      del;
    for (let i = 0; i < data.length; i++) {
      let { id, username } = data[i];
      del = await UserModel.findByIdAndDelete(id, { username });
      result.push(del);
    }
    return res.json({ status: "success", result });
  }
);
//修改用户
router.put("/user", checkLogin, checkPermission("access"), async (req, res) => {
  let { data } = req.body;
  let result = [],
    up;
  for (let i = 0; i < data.length; i++) {
    let { id, ...update } = data[i];
    up = await UserModel.findByIdAndUpdate(id, update);
    result.push(up);
  }
  res.send({ status: "success", result });
});
//查询
router.get("/user", checkLogin, async (req, res) => {
  let {
    current = 1,
    pageSize = 10,
    email,
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
  let total = await UserModel.countDocuments(query);
  let users = await UserModel.find(query)
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
//登录接口
router.post("/login/account", async (req, res) => {
  let { username, password } = req.body;
  let dbUser = await UserModel.findOne({ username, password });
  if (dbUser) {
    let user = dbUser.toJSON();
    let token = jwt.sign(user, process.env._SECRET, { expiresIn: "1h" });
    return res.send({
      status: "success",
      token,
      type: "account",
      access: user.access,
    });
  } else {
    return res.send({
      status: "error",
      type: "account",
      access: "guest",
    });
  }
});
router.get("/currentUser", async (req, res) => {
  let authorization = req.headers["authorization"];
  if (authorization) {
    try {
      let user = jwt.verify(authorization.split(" ")[1], process.env._SECRET);
      user = {
        name: user.username,
        avatar: user.avatar,
        userid: "00000001",
        email: "antdesign@alipay.com",
        signature: "海纳百川，有容乃大",
        title: "交互专家",
        group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
        tags: [
          {
            key: "0",
            label: "很有想法的",
          },
          {
            key: "1",
            label: "专注设计",
          },
          {
            key: "2",
            label: "辣~",
          },
          {
            key: "3",
            label: "大长腿",
          },
          {
            key: "4",
            label: "川妹子",
          },
          {
            key: "5",
            label: "海纳百川",
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: "China",
        geographic: {
          province: {
            label: "浙江省",
            key: "330000",
          },
          city: {
            label: "杭州市",
            key: "330100",
          },
        },
        address: "西湖区工专路 77 号",
        phone: "0752-268888888",
      };
      res.json(user);
    } catch (err) {
      res.status(401).send({});
    }
  } else {
    res.status(401).send({ status: "error" });
  }
});

// 注销
router.post("/login/outLogin", async (req, res) => {
  let authorization = req.headers["authorization"];
  if (authorization) {
    try {
      let { username } = jwt.verify(
        authorization.split(" ")[1],
        process.env._SECRET
      );
      let dbUser = await UserModel.findOne({ username });
      if (dbUser) {
        return res.send({ status: "success" });
      } else {
        return res.send({
          status: "error",
          type: "account",
          access: "guest",
        });
      }
    } catch (err) {
      res.send({ status: "success" });
    }
  } else {
    res.send({ status: "success" });
  }
});
module.exports = router;
