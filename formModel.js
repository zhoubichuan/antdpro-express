let express = require('express');
let router = express.Router();
let { FormModel, AdvancedFormModel } = require('../model');
let jwt = require('jsonwebtoken');
let config = require('../config');
let checkLogin = require('../checkLogin');
let signupValidation = require('../checkForm');
let checkPermission = require('../checkPermission');
//基础表单
router.post('/basicForm', checkLogin, checkPermission('access'), signupValidation, async (req, res) => {
    let { client, date, goal, invites, publicType, publicUser, standard, title } = req.body;
    let form = await FormModel.create({ client, date, goal, invites, publicType, publicUser, standard, title });
    res.send({ status: 'success', data: form });
});
//高级表单
router.post('/advancedForm', checkLogin, checkPermission('access'), async (req, res) => {
    let { approver, approver2, dateRange, dateRange2, members, name, name2, owner, owner2, type, type2, url, url2 } = req.body;
    let form = await AdvancedFormModel.create({ approver, approver2, dateRange, dateRange2, members, name, name2, owner, owner2, type, type2, url, url2 });
    res.send({ status: 'success', data: form.toJSON() });
});

module.exports = router;