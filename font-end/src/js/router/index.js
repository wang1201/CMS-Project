import SMERouter from 'sme-router'

import home_template from  '../views/home.html';
// const positionList_template = require('../views/position-list.html');
import notFound_template from  '../views/404.html';
import position_controller from '../controller/position';
// 头部面包屑导航
import pageHeader_model from '../models/page-header'
// page-header 控制器
import pageHeader_controller from '../controller/page-header'
// map 控制器
import map_controller from '../controller/map'

//发现不包括在函数里面会报错，因为页面加载app.js时，import必须放在最前面，
//但是此时找不到main模版在后面才加载 于是创建了init函数包裹着，在app.js里模版之后在运行这个函数
//此时配置路由，模版拿过来了，于是可以找到main了
 import bus from '../util/bus'

//在哪里切换路由也就是在#main的时候位置切换
var router = null

// 记录上一次路由跳转的url
var prevUrl = ''

const _init = () => {
    router = new SMERouter('main');

    //路由中间件会先执行，无论顺序放在哪里
    //路由守卫
    router.use((req) => {
        // req.body 包含所有传入的参数
        // console.log(req);//req.body req.query req.params  req.url req.route
        _activeLink(req.route)
    })
   // 保证都能匹配到，中间都能执行
   router.route('/', renderPageHeader)

    router.route('/home', (req, res, next) => { //localhost:9000/#/home
        res.render(home_template); //插入字符串，渲染一下home，于是导入
        // _activeLink(req.route)//传入当前的路由，req.route
    })
    //获取列表信息
    router.route('/positionList', position_controller.list)
    //添加保存
    router.route('/positionSave', position_controller.save)
    //修改
    router.route('/positionUpdate', position_controller.update)

    // / 地图
    router.route('/map', map_controller.map)
   
    router.route('/notFound', (req, res, next) => { 
        res.render(notFound_template);
        _navlink('.notFound a[to]')
    })


    //也就是初始化没有hash值的时候，重定向到home
    //没有匹配到的hash值就404
    router.route('*', (req, res, next) => {
        console.log(req);
        if (req.url === '') {
            res.redirect('/home')
        } else {
            res.redirect('/notFound')
        }
    })

    //给bus绑定事件    
    //因为node中router.go就是跳转，router.back就是回退
    bus.on('goto', (path, body = {}) => {
        router.go(path,body)
    })
    // // back的时候可以直接，返回上一次的路径
    // bus.on('back', () => {
    //     router.back()
    // })
  // 给按钮添加事件
  _navlink()
}
// 渲染页面头部
const renderPageHeader = (req, res, next) => {
    // 这里的prevUrl就是上一次的URL
    pageHeader_controller.render(pageHeader_model.pageHeaderInfo(req.url, prevUrl))
    // 已经进入到当前路由了，将上一次路由改成当前的路由
    prevUrl = req.url
}

// 导航切换路由
const _navlink = (selector) => {
    //传值的时候为notFound跳转home
    //不传值时为点击哪个跳哪个
    let $navs = $(selector || '.sidebar-menu li.nav-link[to]'); //获取菜单的li中含有to属性的
    // console.log($navs); 
    $navs.on('click', function (e) {
        // e.stopPropagation();
        let routeTo = $(this).attr('to');
        //点击时。sme-router路由跳转，逗号后面可以传参数(可省略)router.go('/user/123?name=hwen', { mes: 'hallo world' })
        router.go(routeTo);
    })
}
//切换菜单时切换样式,判断当前的菜单li上的to属性的值，与当前router停留的页面的值是否一直
//注意，不能局限于点击时切换样式，因为可能直接地址栏输入跳转页面
//所以该事件是在路由跳转的时候切换，并且传入当前的路由，去对比
//因此在_init函数里每次跳转都要运行一下_activeLink
const _activeLink = (route) => {
    let $navs = $('.sidebar-menu li[to]'); //获取菜单的li中含有to属性的
    // $navs.filter(`[to='${route}']`) //过滤出li中含有to属性 并且等于页面的路由值的
    //     .addClass('active')
    //     .siblings()
    //     .removeClass('active')
     $navs.removeClass('active')
     $navs.filter(`[to='${route}']`)
         .addClass('active')
}


export default {
    init: _init,
    navlink: _navlink
}