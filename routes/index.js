const fs = require("fs");
const files = fs.readdirSync(__dirname);
var Models = require("../model/index");
let routes = {};
for (file of files) {
  if (file !== "index.js") {
    routes[file] = require("./" + file)(Models);
  }
}
module.exports = routes;
