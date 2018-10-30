
import URL from 'url'

const pageHeaderInfo = (url, prevUrl) => {
    let _urlinfo = URL.parse(url)
    let _pathname = _urlinfo.pathname
    // search ?  是url种解析出来的 ?a=1&b=2&search
    let _search = URL.parse(prevUrl).search
    let _infos = {
        '/home': {
            title: '首页',
            list: []
        },
        '/map': {
            title: '地图显示',
            list: [
                { text: '地图', path: '#/map' }
            ]
        },
        '/positionList': {
            title: '职位管理',
            description: '职位列表',
            list: [
                { text: '职位列表' }
            ]
        },
        '/positionSave': {
            title: '职位管理',
            description: '添加职位',
            list: [
                { text: '职位列表', path: '#/positionList'+_search },
                { text: '添加职位'}
            ]
        },
        '/positionUpdate': {
            title: '职位管理',
            description: '职位更新',
            list: [
                {
                    text: '职位列表',path: '#/companyList' + _search
                },
                { text: '职位更新'}
            ]
        },
        '/companyList': {
            title: '公司管理',
            description: '公司列表',
            list: [{
                text: '公司列表'
            }]
        },
        '/companySave': {
            title: '公司管理',
            description: '添加公司',
            list: [{
                    text: '公司列表',
                    path: '#/companyList' + _search
                },
                {
                    text: '添加公司'
                }
            ]
        },
        '/companyUpdate': {
            title: '公司管理',
            description: '公司更新',
            list: [{
                    text: '公司列表',
                    path: '#/companyList' + _search
                },
                {
                    text: '公司更新'
                }
            ]
        },
        '/notFound': {
            title: '出错啦',
            list: [{
                text: '404',
                path: '#/notFound'
            }]
        }
    }
    return _infos[_pathname] || {  }
}


export default {
    pageHeaderInfo
}