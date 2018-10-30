// node的eventEmiter类， event.eventEmiter的核心就是事件触发和事件监听器功能的封装。
//可以通过require('events');来访问这个模块，node是基于chrome v8引擎的js运行环境因此前台也是可以用的

// 用法：
// event.js文件
// var EventEmitter = require('events').EventEmitter;
// var event = new EventEmitter();
// event.on('some_event', function () {
//     console.log('这个事件触发啦');
// })
// setTimeout(function () {
//     event.emit('some_event') //按参数的顺序执行每个监听器
// }, 1000);

// 运行这个文件 node event.js
// 等待一秒钟之后触发some_eventh函数， 监听到 打印出来 '这个事件触发啦'

import EventEmitter from 'events';

class Bus extends EventEmitter {

}
// var event = new EventEmitter();
// event.on('some_event', function () {
//     console.log('这个事件触发啦');
// })
export default new Bus()