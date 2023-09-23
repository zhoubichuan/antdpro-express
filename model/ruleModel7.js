const fieldTypes = { string: String, number: Number, array: Array };
let mongoose = require("mongoose");
const Schema = mongoose.Schema;
const targetObj = require("../template")
let rules = (connection) => {
  const target = {};
  Object.keys(targetObj).forEach((key) => {
    let data = targetObj[key];
    key = key.slice(0,-5).replace("template", "");
    target["RuleModel" + key] = connection.model(
      "RuleModel" + key,
      new Schema(
        data.reduce((cur, pre) => {
          return (pre[cur.name] = { type: String });
        }, {}),
        {
          timestamps: () => Math.floor(Date.now() / 1000),
          toJSON: {
            transform(doc, ret) {
              return ret;
            },
          },
        }
      )
    );
  });
  return target;
};
module.exports = rules;
