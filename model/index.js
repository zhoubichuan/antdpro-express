let mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Schema = mongoose.Schema;
// //连接mongodb数据库
// const { MongoClient } = require('mongodb');
// const client = new MongoClient(process.env.MONGO_URL, {
//   authSource: process.env._AUTHSOURCE, // 权限认证（添加这个属性！！！！！）
//   user: process.env._USER,
//   pass: process.env._PASS,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// const dbName = 'antdesignpro5'; // 数据库名称
// const collectionName = 'myCollection'; // 集合名称

// client.connect().then(() => {
//   const db = client.db(dbName);
//   const collection = db.collection(collectionName);

//   // 在这里执行查询操作
// });
let { MONGO_URL, _AUTHSOURCE, _USER, _PASS, LOCAL } = process.env;
let config = { useNewUrlParser: true, useUnifiedTopology: true };
if (!LOCAL) {
  config.authSource = _AUTHSOURCE; // 权限认证（添加这个属性！！！！！）
  config.user = _USER;
  config.pass = _PASS;
}
let db = mongoose.createConnection(MONGO_URL, config);
//规定数据库中集合的字段和类型
let UserSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String },
    access: { type: String }, // user admin
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);
let NoticeSchema = new Schema(
  {
    id: { type: String },
    avatar: { type: String },
    title: { type: String },
    datetime: { type: String },
    read: { type: String },
    type: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);
let ActiveSchema = new Schema(
  {
    user: { type: Object },
    group: { type: Object },
    project: { type: Object },
    template: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);
let FormSchema = new Schema(
  {
    client: { type: String },
    date: { type: Array },
    goal: { type: String },
    invites: { type: String },
    publicType: { type: String },
    publicUser: { type: String },
    standard: { type: String },
    title: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);
let AdvancedFormSchema = new Schema(
  {
    approver: { type: String },
    approver2: { type: String },
    dateRange: { type: String },
    dateRange2: { type: String },
    members: { type: Array },
    name: { type: String },
    name2: { type: String },
    owner: { type: String },
    owner2: { type: String },
    type: { type: String },
    type2: { type: String },
    url: { type: String },
    url2: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);

let ProfileSchema = new Schema(
  {
    approver: { type: String },
    approver2: { type: String },
    dateRange: { type: String },
    dateRange2: { type: String },
    members: { type: Array },
    name: { type: String },
    name2: { type: String },
    owner: { type: String },
    owner2: { type: String },
    type: { type: String },
    type2: { type: String },
    url: { type: String },
    url2: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);
let RuleSchema = new Schema(
  {
    name: { type: String },
    type: { type: String },
    value: { type: String },
    id: { type: String },
    updatedAt: { type: Number },
    createdAt: { type: Number },
  },
  {
    timestamps: () => Math.floor(Date.now() / 1000),
    toJSON: {
      transform(doc, ret) {
        return ret;
      },
    },
  }
);

//创建User模型 可以操作数据库
const UserModel = db.model("User", UserSchema);
const NoticeModel = db.model("Notices", NoticeSchema);
const ActiveModel = db.model("Active", ActiveSchema);
const FormModel = db.model("FormModel", FormSchema);
const AdvancedFormModel = db.model("AdvancedFormModel", AdvancedFormSchema);
const ProfileModel = db.model("ProfileModel", ProfileSchema);
const RuleModel = db.model("RuleModel", RuleSchema);
const fieldTypes = {
  string: String,
  number: Number,
  array: Array,
  boolean: Boolean,
  object: Object,
};
const target = {};
["field", "type", "data", "template"].forEach((item) => {
  const targetObj = require("../" + item);
  Object.keys(targetObj).forEach((key) => {
    let data = targetObj[key];
    key = key.replace(".json", "");
    let fieldSchema = data.reduce((pre, cur) => {
      pre[cur.name] = { type: fieldTypes[cur.type] };
      return pre;
    }, {});
    let defaultSchema = {
      timestamps: () => Math.floor(Date.now() / 1000),
      toJSON: {
        transform(doc, ret) {
          return ret;
        },
      },
    };
    console.log(`${item}${key}`, "-----------------item------------");
    target[`${item}${key}`] = db.model(
      `${item}${key}`,
      new Schema(fieldSchema, defaultSchema)
    );
  });
});
module.exports = {
  db: db,
  UserModel,
  NoticeModel,
  FormModel,
  AdvancedFormModel,
  ActiveModel,
  ProfileModel,
  RuleModel,
  ...target,
};
