const Moment = require('moment') // 时间格式化

// 创建的Model模型 （collection）
const mongoose = require('../util/mongoose');
//定义数据字段以及类型
var positionCollection = new mongoose.Schema({
    companyName: String,
    positionName: String,
    city: String,
    recruitNumbers: String,
    jobNature: String,
    education: String,
    salary: String,
    jobRequirements: String, 
    formatTime:String,
    createTime: String,
    
});
//将模式编译为模型。model是由schema生成的模型，可以对数据库的操作
//自动起名为负数
var Position = mongoose.model('position', positionCollection);

// 查询数据列表-全部
const listAll = () => {
    let _query = {}// 查询的约定条件，因为考虑到搜索的时候也是查询，但是那时候是有条件的
    //mongoose的查询-表.find({条件}).sort({createTime:-1})升序   1 降序 
    return Position.find(_query).sort({createTime: -1}).then((results) => {
        return results
    }).catch((err) => {
        return false
    })
}
// 返回列表数据 根据请求的条件，可能是默认的不传，也就是第一页的初始化的数据
//可能传入点击后的页码
//可能搜索的时候有查询条件
const listSome = async ({ pageNo = 1, pageSize = 10, search = '' }) => {
    //serch进行全局匹配,有内容的时候匹配内容，没有就全局返回
    let reg = new RegExp(search, 'g')
    console.log(reg.test(search),search)
    let _query = { // 匹配各个字段值只要有一个字段含有关键字
        $or: [//搜索的时候，只要几个字段哪个匹配到都行 mongoose语法
            { companyName: reg },   
            { positionName: reg },   
            { city: reg },   
            { recruitNumbers: reg },   
            { jobNature: reg },   
            { education: reg },   
            { salary: reg },   
            { jobRequirements: reg },   
            { formatTime: reg },
        ]
    }// 查询的约定条件
    // limit // 取几条
    // skip // 从哪里开始
    let _all_items = await listAll(_query)//listAll函数，根据条件返回符合条件的所有数据对象
    return Position.find(_query)//moongoose语法，数据库中查找符合条件的
    .sort({createTime: -1})//根据时间排序
    .skip((pageNo - 1) * pageSize)// 从哪一条开始第一个从0-10.第二页从10-20
    .limit(~~pageSize)// 截取多少  ~~机器语言转为number
        .then((results) => {
           //返回数据，如果啥也没传，就是查询列表信息，默认返回10条第一页
            return { 
                data: results, 
                pageInfo: { // 页码信息
                    pageNo, // 当前页
                    pageSize, // 一页数量
                    total: _all_items.length, // 总数
                    totalPage: Math.ceil(_all_items.length / pageSize), // 总页数
                    search // 搜索关键字
                }
            }
    }).catch((err) => {
        return false
    })
}




// 查询数据列表-根据id查询某一条
const listOne = ({ id }) => { 
    return Position.findById(id).then((results) => {
        return results
    }).catch((err) => {
        return false
    })
}
let default_logo = '/uploads/companyLogos/default.png'
//保存数据
const save = (body) => {
    //可以实例化它往里面放数据了,通过调用其save方法将每个文档保存到数据库中。
    // 此时的时间
    let _timestamp = Date.now()
    // 根据这个时间创建moment
    let moment = Moment(_timestamp)
    body.companyLogo = body.companyLogo || default_logo
    return new Position({
        ...body,
        createTime: _timestamp,
        formatTime: moment.format("YYYY-MM-DD hh:mm")
    }).save() 
        .then((result) => {
            return result
        })
        .catch((err) => {
            return err
        })
}
// 更新职位信息， 确认是否重新发布，如果重新发布，更改创建时间
const update = (body) => {
    //如果body.companyLogo为空，则不存在  取反为true，就删掉这个属性
    //jquery的语法delete body.companyLogo
    if (!body.companyLogo) delete body.companyLogo
    //如果前台传来的republish为true,也就是勾选了重新发布，则更新时间
    if ( body.republish ) {
        let _timestamp = Date.now()
        let moment = Moment(_timestamp)
        body.createTime = _timestamp
        body.formatTime = moment.format("YYYY-MM-DD, hh:mm")
    }
    //mongoose语法,更新一条数据，先查询_i为 body.id的内容，再把body解构赋值存到数据库
    return Position.updateOne({ _id: body.id }, { ...body }).then((results) => {
        return results
    }).catch((err) => {
        return false
    }) 
}

// 删除职位的model
const remove = async ({ id, pageNo, pageSize }) => {
    console.log({id, pageNo, pageSize});
    // 删除数据库中的某一条数据
    let _row = await listOne({ id })
    //moongoose语法，删除一跳信息，表.deleteOne({条件})_id为解构出来的id的数据
    return Position.deleteOne({ _id: id }).then(async (results) => {
        //  获取最新的数量
        let _all_items = await listAll();
        //讲当前的id复制给一个新的属性叫deleteId，自动创建这个属性，用于拼接跳转路由的后缀
        results.deleteId = id
        //创建isBack属性，当前的页面比如是第二页，也就是总共可以显示10条数据 pageSize一直为10
        //那么比如我有11条数据一共，删除一条还有10，于是(pageNo-1)*10为10，当前数据库中剩余长度是10
        //大于等于，为true; 证明该页没有数据了，就-1
        //如果没有大于等于，则证明该页就还有数据  就不用改变当前页码
        results.isBack = (pageNo - 1) * pageSize >= _all_items.length;
        console.log(results.isBack, ((pageNo - 1) * pageSize), _all_items.length);
        // 有图片就删图片
        if ( _row.companyLogo && _row.companyLogo !== default_logo ) {
            fs.removeSync(PATH.resolve(__dirname, '../public'+_row.companyLogo))
        }  
        return results
    }).catch((err) => {
        // fs.appendFileSync('./logs/logs.txt', Moment().format("YYYY-MM-DD, hh:mm") + '' +JSON.stringify(err))
        return false
    })
}



module.exports = {
    listAll,
    save,
    listOne,
    update,
    remove,
    listSome
}