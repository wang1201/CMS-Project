const express = require('express');
const router = express.Router();

const fileUpload = require('../middlewares/fileUpload')
const company_controller = require('../controllers/company_controller');
// //前面已经有了/api/companyList了，所有这里直接/就是/api/companyList/
// router.get('/', function (req, res, next) {
//     // res.json(companyData_model.list())
//     res.set('content-type','application/json;charset=utf8');
//     res.render('companyList', {
//         data: JSON.stringify(companyData_model.list()),code:200,log:'成功' 
//     }) 

// })


//前面已经有了/api/company了，所有这里直接/就是/api/company/listAll
//查询全部的数据
router.get('/listInfo', company_controller.listAll);
//查询部分数据
router.get('/listSome', company_controller.listSome)
//查询一条数据
router.get('/listOne', company_controller.listOne);
//修改信息
router.post('/update',fileUpload,  company_controller.update);
//添加数据
// express 中间件栈， 一个功能模块可以利用一个或者多个中间件来完成，每一个中间件顺序执行，可以传参，也可以阻止下面的中间件运行
router.post('/saveInfo', fileUpload, company_controller.save);
//删除信息
router.get('/remove', company_controller.remove);

module.exports = router