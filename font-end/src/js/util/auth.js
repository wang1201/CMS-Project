const URL = require('url')
const _none = () => {}

import user_model from '../models/user'
// 验证用户登录状态
//由于http协议是无状态的，也就是一次请求完成后，不会留下任何痕迹
//1.session，是浏览器中用户第一次登录，发送给服务器数据，服务器接收到数据，生成一个session，
//同时为该条session生成一个唯一的地址id，暂且叫他sessionid,
//然后把该条数据以及该数据的地址id也就是sessionid,以key, value的形式存在
//缓存或者是数据库中，然后再把这个唯一的sessionid，以种一个cookie的方式发送给浏览器
//这样浏览器每次访问http请求，就会自动带着cookie，服务器每次拿到sessionid后,去数据库或者
//缓存中去找到这个对应的库里的sessionid的这条session数据进行匹配

//token:浏览器第一次登录的时候，发送给服务器数据，比如说userid是唯一的，服务器接受到之后
//会通过加密的形式进行加密，生成一个token,然后base64编码之后，发送给浏览器，浏览器保存下来
//再有http请求的时候带上，服务器接受到用相同的加密方式进行解密，如果通过执行业务操作，不通过则不是原来的人



// 验证用户登录状态
const userSigninAuth = async () => {
    let _token = localStorage.getItem('token') || ''
    let isSignIn = await user_model.isSignIn({ token: _token })
    return !!(isSignIn.status === 200)
}


export {
    userSigninAuth
}