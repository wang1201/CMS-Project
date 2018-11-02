const login_model = require('../models/login')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const PATH = require('path')
const { handleData } = require('../util')

//注册
const signUp = async (req, res, next) => {
    //判断该用户是否已经存在,若手机号库里已存在，则说明用户已存在
    let _checkExists = await login_model.checkExistsName(req.body.telPhone);
    //不存在
    if (!_checkExists.length) {
        let _results = await login_model.signUp(req.body);
        handleData(_results, res, 'login');
    } else { 
         res.render('login', {
            code: 201,
            data: JSON.stringify('该手机号码已注册，请直接登录')
        })
    }
}

// 加密的方式：对称加密和非对称加密，对称加密指的是加密解密使用同一个密钥，
// 非对称加密使用公钥和私钥，加密用私钥加密，解密用公钥解密
// 1. 用户登录的时候，后台生成token
//     jwt -> json web tokens JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户
//     token->中应该包含 payload （数据） cert （密钥） 确定加密方式 SHA256
//     npmjs -> jsonwebtoken
// 2. 返回给前端 cookie 
// 3. 前端进行存储
// 4. 前端在进行数据请求的时候发送token到后端
// 5. 后端进行token验证，而且进行过期时间的验证

//登录
const signIn = async (req, res, next) => {
     //判断该用户是否已经存在,若手机号库里已存在，则说明用户已存在
     let _checkExists = await login_model.checkExistsName(req.body.telPhone);//得到的是一个数组
     //存在该用户
     if (!!_checkExists.length) {
         //验证改用户的密码与数据库中的密码是否一致 true则证明一致登录成功，否则失败
         let _results = await login_model.signIn(req.body.passWord, _checkExists[0]);
          // 非对称加密，也就是说服务器用自己的私钥给每个浏览器用户加密后返回，每人不同，再把自己的公钥发给他们
          //这样公钥就可以解开自己的私钥
         if (_results) {//如果一致
            let _payload = { // 钥加密的数据
                userid: _checkExists[0]._id,
                telPhone: _checkExists[0].telPhone,
                level: 8,
            }
            // 取出来私钥加密
            let _private = fs.readFileSync(PATH.resolve(__dirname, '../keys/private.key'))
            // let cart = "wo wo wo";
            // let _token = jwt.sign(_payload, cart)//给数据加上cart的加密文字返回
            var _token = jwt.sign(_payload, _private, {
                algorithm: 'RS256'
            });

            // res.cookie('token',_token);
            res.render('login', {
                code: 200,
                data: JSON.stringify({
                    token: _token
                })
            })
        } else { 
            res.render('login', {
                code: 203,
                data: JSON.stringify('密码错误')
            })
        }

    } else { // 如果没有这个用户
        res.render('login', {
            code: 202,
            data: JSON.stringify('用户名不存在')
        })
    }

}


module.exports = {
    signUp,
    signIn
}