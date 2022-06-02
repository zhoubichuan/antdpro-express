let config = require('./config');
let jwt = require('jsonwebtoken');
let { FORBIDDEN } = require("http-status-codes");
const checkPermission = (...allowed) => {//allowed=['user','admin']
  return async (req, res, next) => {
    //当前用户已经登录过了，并且当登录用户的角色是在allowed数组里的话就可以访问，
    if (req.user && allowed.indexOf(req.user.access) != -1) {
      next();
    } else {
      return res.status(FORBIDDEN).send({
        status: 'error',
        message: '用户没权限'
      });
    }
  };
}

module.exports = checkPermission;