let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema;
let config = require('./config');
//连接mongodb数据库
console.log(process.env.MODE_USER,process.env.MODE_PWD)
let connection = mongoose.createConnection(config.dbUrl, {
    authSource: 'admin', // 权限认证（添加这个属性！！！！！）
    user: 'root',
    pass: 'ZBCzbc123',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//规定数据库中集合的字段和类型
let UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String },
    access: { type: String }// user admin
}, {
    timestamps: true, toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});
let NoticeSchema = new Schema({
    id: { type: String },
    avatar: { type: String },
    title: { type: String },
    datetime: { type: String },
    read: { type: String },
    type: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let ActiveSchema = new Schema({
    user: { type: Object },
    group: { type: Object },
    project: { type: Object },
    template: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let FormSchema = new Schema({
    client: { type: String },
    date: { type: Array },
    goal: { type: String },
    invites: { type: String },
    publicType: { type: String },
    publicUser: { type: String },
    standard: { type: String },
    title: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let AdvancedFormSchema = new Schema({
    approver: { type: String },
    approver2: { type: String },
    dateRange: { type: String },
    dateRange2: { type: String },
    members: { type: Array },
    name: { type: String },
    name2: { type: String },
    owner: { type: String },
    owner2: { type: String },
    type: { type: String },
    type2: { type: String },
    url: { type: String },
    url2: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})

let ProfileSchema = new Schema({
    approver: { type: String },
    approver2: { type: String },
    dateRange: { type: String },
    dateRange2: { type: String },
    members: { type: Array },
    name: { type: String },
    name2: { type: String },
    owner: { type: String },
    owner2: { type: String },
    type: { type: String },
    type2: { type: String },
    url: { type: String },
    url2: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema = new Schema({
    key: { type: String },
    disabled: { type: String },
    href: { type: String },
    avatar: { type: String },
    name: { type: Array },
    owner: { type: String },
    desc: { type: String },
    callNo: { type: String },
    status: { type: String },
    updatedAt: { type: String },
    createdAt: { type: String },
    progress: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema1 = new Schema({
    code: { type: Number },
    work: { type: String },
    area: { type: Number },
    mileage: { type: Number },
    time: { type: String },
    workStatus: { type: Number },
    assessStatus: { type: Number },
    option: { type: Array },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema2 = new Schema({
    code: { type: Number },
    device: { type: String },
    content: { type: String },
    task: { type: String },
    count: { type: Number },
    time: { type: String },
    type: { type: Number },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema3 = new Schema({
    code: { type: Number },
    device: { type: String },
    content: { type: String },
    type: { type: Number },
    grade: { type: Number },
    time: { type: String },
    status: { type: Number },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema4 = new Schema({
    code: { type: Number },
    name: { type: String },
    type: { type: String },
    machine: { type: String },
    time: { type: String },
    status: { type: Number },
    remark: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let RuleSchema5 = new Schema({
    code: { type: Number },
    name: { type: String },
    type: { type: String },
    count: { type: Number },
    number: { type: Number },
    status: { type: Number },
    remark: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let TagsSchema = new Schema({
    code: { type: Number },
    name: { type: String },
    type: { type: String },
    value: { type: Number },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
//创建User模型 可以操作数据库
const UserModel = connection.model('User', UserSchema);
const NoticeModel = connection.model('Notices', NoticeSchema)
const ActiveModel = connection.model('Active', ActiveSchema)
const FormModel = connection.model('FormModel', FormSchema)
const AdvancedFormModel = connection.model('AdvancedFormModel', AdvancedFormSchema)
const ProfileModel = connection.model('ProfileModel',ProfileSchema)
const RuleModel = connection.model('RuleModel',RuleSchema)
const RuleModel1 = connection.model('RuleModel1',RuleSchema1)
const RuleModel2= connection.model('RuleModel2',RuleSchema2)
const RuleModel3 = connection.model('RuleModel3',RuleSchema3)
const RuleModel4 = connection.model('RuleModel4',RuleSchema4)
const RuleModel5 = connection.model('RuleModel5',RuleSchema5)
const Tags = connection.model('Tags',TagsSchema)
module.exports = {
    UserModel,
    NoticeModel,
    FormModel,
    AdvancedFormModel,
    ActiveModel,
    ProfileModel,
    RuleModel,
    RuleModel1,
    RuleModel2,
    RuleModel3,
    RuleModel4,
    RuleModel5,
    Tags
}