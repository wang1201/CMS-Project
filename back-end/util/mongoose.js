  // getting-started.js
var mongoose = require('mongoose');

//这里是我的mongodb的数据库的地址，去Robo 3T发现是在
//localhost:27017下，新建一个库叫做quanzhi
mongoose.connect('mongodb://localhost:27017/quanzhi', {
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
//因为这个工具js文件  只为了配置数据库，而这个mongoose也就是只有一个，于是我们
//就可以直接抛出这个数据库
//之前抛出的对象啥的  都是因为不确定是否抛出有多个函数
module.exports = mongoose