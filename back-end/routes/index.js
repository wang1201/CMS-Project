//生成的路由实例用来捕获访问主页的GET请求，
//导出这个路由，并在app.js里引入，此时，页面初始化的时候就会加载该路由，
// 关于路由 路由中有两个常用的功能
// 1. app.route()函数，创建可链接的途径处理程序的路由路径，也就是比如
//    app.route('/home').get(function(req,res,next){
//       console.log(1111);，路由访问/home的时候就会显示1111
//    })
// 2. express.Router类，创建模块化安装路径的处理程序，组织代码结构
//比如匹配get请求，express.Router()匹配多个可自己判断
//app.get / post / put / delect指定确定的
// 可用var router = express.Router();然后router.get('/',function(){}) 然后app.use('/',router);
//也可以 直接app.get('/',function(){})
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //渲染views下面的index.ejs模版引擎并且输出
  // res.json(); 返回一个json
  // res.sendFile();返回一个文件
  res.render('index', { title: 'Express',name:'<h2>wm</h2>' });
});

module.exports = router;

