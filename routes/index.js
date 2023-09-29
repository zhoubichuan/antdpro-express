const fs = require('fs')
const { request } = require('http')
const files = fs.readdirSync(__dirname)
let routes = {}
for (file of files) {
  if (file !== 'index.js') {
    routes[file] = require('./' + file)
  }
}
module.exports = routes
