const { check } = require('express-validator')

let signupValidation = [
    check('name', '请输入用户名').not().isEmpty()
]

module.exports = signupValidation