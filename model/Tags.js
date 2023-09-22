import { connection } from "./index";
let TagsSchema = new Schema(
  {
    code: { type: Number },
    name: { type: String },
    type: { type: String },
    value: { type: Number },
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
const Tags = connection.model("Tags", TagsSchema);

module.exports = { Tags };
