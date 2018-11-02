const mongoose = require('../util/mongoose')
const crypto = require('crypto');
let userCollection = new mongoose.Schema({
    telPhone: String,
    userName: String,
    passWord: String,
    signUpTime: String
})
//编译为模型，可以对数据库进行操作
var userModel = mongoose.model('user', userCollection);

//注册 传过来的是req.body,需要解构
//注意到存在数据库的数据是可见的，特别是密码  不安全， 于是我们加密
//node的内置模块crypto


const signUp = async ({ userName, passWord, telPhone }) => {
    const _passWord = crypto.createHmac('sha256', passWord)//我们首先调用crypto模块中的createHmac()方法，通过sha256算法对明文进行哈希化。
                   .update('myProject')//在这段哈希值的基础之上，添加明文myProject。
                   .digest('hex');//在更新之后，我们将更新的内容的进行十六进制的消化吸收。
    return new userModel({
        userName,
        telPhone,
        passWord: _passWord,
        signUpTime: Date.now()
    }).save()
    .then((result) => {
        // delete result.passWord
        let {_id, telPhone, userName } = result
        return {_id,userName, telPhone }
    }).catch(() => {
        return false
    })
}

// 登录
// pwd 是用户传入的密码
// passWord 是此用户根据唯一的手机号匹配到的数据库中的一条数据，解构出来的加密密码
// checkFlag 是否匹配
const signIn =  (pwd, { passWord }) => {
    //将用提交的密码加密
    const _passWord = crypto.createHmac('sha256', pwd)//我们首先调用crypto模块中的createHmac()方法，通过sha256算法对明文进行哈希化。
                   .update('myProject')//在这段哈希值的基础之上，添加明文myProject。
                   .digest('hex');//在更新之后，我们将更新的内容的进行十六进制的消化吸收。
    let checkFlag = _passWord==passWord
    return checkFlag;
}


// 通过用户名验证是否有这个用户
//mongoose查询 
const checkExistsName = (telPhone) => {
    return userModel.find({
            telPhone
    }).then((result) => { //promise  成功，返回结果  相当于resolve
            return result
        }).catch(() => { //失败处理相当于reject
            return false
        })
}

module.exports = {
    signUp,
    signIn,
    checkExistsName
}