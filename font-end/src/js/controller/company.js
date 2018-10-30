import companyList_template from '../views/company-list.html'
import companysave_template from '../views/company-save.html'
import companyUpdate_template from '../views/company-update.html'
import company_model from '../models/company'
//引入工具类
import { bus, handleToastByData} from '../util'

import qs from 'querystring'

// 列表视图的控制器
// 因为需要传页码、默认查询的是首页 pageNo = 1, pageSize = 10 后台做的
const list = async (req, res, next) => {
    req.query = req.query || {} // 防止没有参数的时候，req.query为null
    //后台默认页数为1,默认size为10条
    let _page = { // 页面信息， 当点击了分页器按钮后，页面url就会变化，然后list控制器就会重新执行，重新获取数据再渲染
        pageNo: req.query.pageNo || 1,
        pageSize: req.query.pageSize || 10,
        search: req.query.search
    }
    // 编译模板 并传数据
    let html = template.render(companyList_template, {
        data: (await company_model.list(_page)).results
    })
    res.render(html)
    bindListEvent(_page)
}

// company-list页面的事件绑定，一个页面可能有多个点击事件，于是放在一个函数里
const bindListEvent = (_page) => {
    //添加事件
    $('.company-list #addbtn').on('click', function () {
        //路由跳转,于是想到使用router,点击时报错，因为找不到router，因为routr是smeRouter new出来的啊,如果在new一个就不是原来的了
        //router.go('/companySave');  companySave:路由页面配置的company-save路由名字
        bus.emit('goto', '/companySave')
    });
    //修改事件
    $('.company-list .pos-update').on('click', function () {
        let id = $(this).parents('tr').data('id')
        bus.emit('goto', '/companyUpdate', {
            id
        })
    })

    //删除事件，由于有页码分页，所以删除的时候就要知道是那一页进行删除的
    //需要 得知是哪一个进行删除的操作
    $('.pos-remove').on('click', function () {
        handleRemovecompany.call(this, _page) //绑定this
    })

    $('.company-list #pos_search').on('click', function () {
        let _search = $('.company-list #keywords').val()
        // 重新刷新路由 ，注意，页码回复到1
        let _params = {
            search: _search,
            pageNo: 1
        }
        //序列化对象，返回字符串
        //serch=5435&pageNo=1
        bus.emit('goto', `/companyList?${$.param(_params)}`)
    })
}

// 删除操作
const handleRemovecompany = async function (_page) {
    //_page:pageNo pageSize serach,当前页码 多少条数据
    //取到页面的id，根据id删除
    let id = $(this).parents('tr').data('id')
    //并告诉数据层删除的是那一页
    let _data = await company_model.remove({
        id: id,
        ..._page
    })
    // 如果此页就只有一条数据，说明删除之后需要跳转到前一页 
    // 删除的时候需要返回当前页还有多少条数据,如果只剩一个，将pageNo-1,路由跳转paheNo-1
    //处理删除后的事件
    handleToastByData(_data, {
        isReact: false, //是否显示这个toast提示框
        success: (data) => {
            // 删除成功后，i依然需要将pageNo带上，否则，删除后，重新渲染的时候会回到默认的第一页
            //因此接口需要告诉我当前页的数据条数
            console.log(data);
            let _pageNo = _page.pageNo
            _pageNo -= data.isBack ? 1 : 0
            bus.emit('goto', '/companyList?pageNo=' + _pageNo + '&_=' + data.deleteId + '&search=' + (_page.search || ''))
        }
    })
}

//保存
const save = async (req, res, next) => {
    //template.render编译并返回渲染结果。 
    let _html = template.render(companysave_template)
    res.render(_html);
    bindSaveEvent()
}

// company-save页面的事件绑定
const bindSaveEvent = () => {
    //返回列表事件
    $('.company-save #back').on('click', function () {
        //companyList:路由页面配置的company-list路由名字
        bus.emit('goto', '/companyList')
        //方法2router的back事件，从哪儿进来的回退到哪里
        //  bus.emit('back')
    })
    //表单提交的时候，阻止默认提交事件，并拿到提交的值
    $('.company-save #save-form').submit(handleSaveSubmit)
}
//抽离出来表单提交事件，做一个防止重复提交
let _isLoading = false
const handleSaveSubmit = async function (e) {
    //阻止默认的提交事件
    e.preventDefault()
    // 如果已经提交了，则return false
    if (_isLoading) return false;
    //点击时loading为true
    _isLoading = true
    // 拿到form的数据 ajaxSubmit自动提交数据  不需要获取了
    // let data = qs.parse($(this).serialize());
    let results = await company_model.save();
    //数据提交完毕，loading为false
    _isLoading = false
    //根据返回的信息，去处理是成功还是失败
    handleToastByData(results)

}


// company-update页面的事件绑定
const update = async (req, res) => {
    console.log(req);
    let {
        id
    } = req.body // 要更新的数据的id

    // 获取id对应的数据进行渲染
    let _html = template.render(companyUpdate_template, {
        //先查询出来这一个id的对应的列表的信息，显示在表单上
        data: (await company_model.listOne({
            id
        })).results // 获取到列表数据
    })
    res.render(_html)
    bindUpdateEvent()
}
//绑定修改页面的点击事件
const bindUpdateEvent = () => {
    // 返回按钮逻辑
    $('.company-update #back').on('click', function () {
        bus.emit('goto', '/companyList')
    })
    $('.company-update #update-form').submit(handleUpdateSubmit)
}
//提交修改后的信息
const handleUpdateSubmit = async function (e) {
    e.preventDefault();
    let _results = await company_model.update();
    console.log(_results);
    handleToastByData(_results)
}
export default {
    list,
    save,
    update
}