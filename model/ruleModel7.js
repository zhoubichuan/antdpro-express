const fieldTypes = { string: String, number: Number, array: Array };
let mongoose = require("mongoose");
const Schema = mongoose.Schema;
let rules = (connection) => {
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
      target[item + key] = connection.model(
        item + key,
        new Schema(fieldSchema, {
          timestamps: () => Math.floor(Date.now() / 1000),
          toJSON: {
            transform(doc, ret) {
              return ret;
            },
          },
        })
      );
    });
  });

  return target;
};
module.exports = rules;
