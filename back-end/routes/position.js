const express = require('express');
const router = express.Router();

const fileUpload = require('../middlewares/fileUpload')
const position_controller = require('../controllers/position_controller');
// //前面已经有了/api/positionList了，所有这里直接/就是/api/positionList/
// router.get('/', function (req, res, next) {
//     // res.json(positionData_model.list())
//     res.set('content-type','application/json;charset=utf8');
//     res.render('positionList', {
//         data: JSON.stringify(positionData_model.list()),code:200,log:'成功' 
//     }) 
    
// })


//前面已经有了/api/position了，所有这里直接/就是/api/position/listAll
//查询全部的数据
router.get('/listInfo', position_controller.listAll);
//查询部分数据
router.get('/listSome', position_controller.listSome)
//查询一条数据
router.get('/listOne', position_controller.listOne);
//修改信息
router.post('/update', position_controller.update);
//添加数据
// express 中间件栈， 一个功能模块可以利用一个或者多个中间件来完成，每一个中间件顺序执行，可以传参，也可以阻止下面的中间件运行
router.post('/saveInfo', fileUpload, position_controller.save);
//删除信息
router.get('/remove', position_controller.remove);

module.exports = router