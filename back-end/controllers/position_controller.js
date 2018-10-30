//list控制器,负责拿到数据并响应数据返回给前台
// const positionList_temp = require('../views/positionList');
const position_model = require('../models/position')
const { handleData } = require('../util')

// smeRouter不需要引入才渲染，而是可以直接找到

// req.body不是nodejs默认提供的， 需要载入中间件body-parser中间件,通常用于解析post请求的数据
// req.query是node自带的插件，用于解析get请求的数据


//职位列表查询，返回全部数据
const listAll = async (req, res) => {
    let _data = await position_model.listAll()
    handleData(_data, res, 'position')
}
// 返回部分数据例如分页，只返回一部分
//根据传入的参数，参数可能为空也就是默认的，也可能为页码 
const listSome = async (req, res) => {
    // res.set('content-type', 'application/json; charset=utf8')
    console.log(req.query);
    let _data = await position_model.listSome(req.query)
    handleData(_data, res, 'position')
}
//职位列表查询，根据id返回某一条数据
const listOne = async (req, res) => {
    let _data = await position_model.listOne(req.query)
    handleData(_data, res, 'position')
}

//职位列表添加，规定一个formData格式
const save = async (req, res, next) => {
    // 接受到req.body的数据，并且存到数据库中
    res.set('content-type', 'application/json; charset=utf8');
    let _data = await position_model.save(req.body);
     handleData(_data, res, 'position')
}

//职位列表修改信息
const update = async (req, res, next) => {
    // 接受到req.body的数据，并且根据传过来的id，更新数据存到到数据库中
    res.set('content-type', 'application/json; charset=utf8');
    let _data = await position_model.update(req.body);
    handleData(_data, res, 'position')
}

//职位列表删除信息
const remove = async (req, res, next) => {
    // 接受到req.body的数据,也就是id 和当前页的pageNo pageSize serach,因为需要根据页数知晓删除后依旧还在当前页
    //如果删除后该页没有数据了，则pageNo-1
    let _data = await position_model.remove(req.query);
    handleData(_data, res, 'position')
}
module.exports = {
    listAll,
    save,
    listOne,
    update,
    remove,
    listSome
}