const fieldTypes = { string: String, number: Number, array: Array };
let mongoose = require("mongoose");
const Schema = mongoose.Schema;
let rules = (connection) => {
  const target = {};
  ["1", "2", "3", "4", "5", "7", "8"].forEach((key) => {
    let data = require(`./template${key}.json`);
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
