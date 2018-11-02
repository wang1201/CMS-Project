const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/login_controller');

// 抽离响应头的设置 中间件
const resApplicationJson = (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf8')
    next()
}
// 为login中所有的路由都使用这个中间件
router.use(resApplicationJson)
// /api/v1/login/signUp 

//注册
router.post('/signUp', login_controller.signUp)

//登录
router.post('/signIn', login_controller.signIn)


module.exports = router;
