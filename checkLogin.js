let jwt = require('jsonwebtoken');
let { UNAUTHORIZED } = require("http-status-codes");
const checkLogin = async (req, res, next) => {
    let authorization = req.headers['authorization'];
    if (authorization) {
        try {
            let user = jwt.verify(authorization.split(' ')[1], process.env._SECRET);
            req.user = user;
            return next();
        } catch (err) {
            return res.status(UNAUTHORIZED).send({
                status: 'error',
                message: '请先登录'
            });
        }
    } else {
        return res.status(UNAUTHORIZED).send({
            status: 'error',
            message: '请先登录'
        });
    }
};
module.exports = checkLogin;