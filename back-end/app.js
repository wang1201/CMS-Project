
//发现app.js这里是用来编写这个应用的一些配置等
//项目的入口文件

//错误处理文件
var createError = require('http-errors');

var express = require('express');
//内置模块 用于处理目录的对象，提高开发效率
var path = require('path');
//加载cookie模块，用于获取web浏览器发送的cookie中的内容
var cookieParser = require('cookie-parser');
// 在控制台中， 显示req请求的信息
var logger = require('morgan');

//引入config下面的index.js,解构出来version
var { version } = require('./config');
// 引入js文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var positionRouter = require('./routes/position');


var app = express();//生成一个express实例 app

// view engine setup
//app.set配置内容 app.set('title','1111')
//可用app.get取到 app.get('title') 得到 1111
//设置VIEWS文件夹，__dirname是node.js里面的全局变量。取得执行js所在的路径
app.set('views', path.join(__dirname, 'views')); //join用于连接路径,识别当前系统的路径分隔符，windows是‘\’
//视图引擎设置--ejs模块
app.set('view engine', 'ejs');

//加载日志中间件，定义日志和输出级别
app.use(logger('dev'));
//此时的express内部集成了bosy-parser,解析form-data数据 解析request payload数据
//加载解析json的中间件,接受json请求,
app.use(express.json());
//加载解析urlencoded请求体的中间件，
app.use(express.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());

//静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

//路由控制器 默认进入indexRouter
//定义路由规则，也就是/的时候走后面的indexRouter回调函数
// app.get() 看作app.use的特定请求(get) 的简要写法。 
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/api/positionList', positionRouter)改为
app.use('/api/' + version + '/position', positionRouter)



//配置接口
// app.use('/api/position/list', (req, res, next) => {
//   res.json({
//     name: '张三',
//     age: 12
//   })
//   next();
// });




// catch 404 and forward to error handler
//捕获404错误，并转发到错误处理器
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// 开发环境下的500错误处理器，将错误信息渲染error模版并显示到浏览器中
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//导出
module.exports = app;
