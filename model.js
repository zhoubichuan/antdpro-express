let mongoose = require('mongoose');
const Schema = mongoose.Schema;
let config = require('./config');
//连接mongodb数据库
let connection = mongoose.createConnection(config.dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
//规定数据库中集合的字段和类型
let UserSchema = new Schema({
    username:{type:String},
    password:{type:String},
    email:{type:String},
    avatar:{type:String},
    access:{type:String}// user admin
},{timestamps:true,toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
}});
let NoticesSchema = new Schema({
    id:{type:String},
    avatar:{type:String},
    title:{type:String},
    datetime:{type:String},
    read:{type:String},
    type:{type:String}
},{
    timestamps:true,
    toJSON:{
        transform(doc,ret){
            return ret
        }
    }
})
//创建User模型 可以操作数据库
const UserModel = connection.model('User',UserSchema);
const Notices = connection.model('Notices',NoticesSchema)
module.exports ={
    UserModel,
    Notices
}