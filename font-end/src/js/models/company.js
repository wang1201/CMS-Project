// 接收页码信息，可以不传值，则为后台初始化第一页并且10条
//可以传值，pageNo  pageSize，返回特定的页数数据
const list = (page) => {
    return $.ajax({
        url: "/api/v1/company/listSome",
        data: page,
        dataType: 'json',
        success: (res) => {
            return res
        }
    });
}
//保存
const save = (data) => {
    return new Promise((resolve) => {
        $('.company-save  #save-form').ajaxSubmit({
            url: '/api/v1/company/saveInfo',
            type: 'POST',
            success: (res) => {
                resolve(res)
            }
        })
    })
}

// // 提供某条数据
const listOne = (data) => {
    return $.ajax({
        url: '/api/v1/company/listOne',
        data,
        dataType: 'json',
        success: (data) => {
            return data
        }
    })
}
//修改信息后提交
// 引入jquery.form.js插件 ajaxSubmit自动获取表单的值并提交
const update = (data) => {
    
    return new Promise((resolve) => {
        $('.company-update #update-form').ajaxSubmit({
            url: '/api/v1/company/update',
            type: 'POST',
            success: (data) => {
                console.log(data);
                resolve(data)
            }
        })
    })
}


// //根据id删除一条记录，
// //需要这一条的id以及该数据所在页数，因为需要删除后依旧停留在该页面
// //并且如果该页删除没了，需要pageNo-1
const remove = (data) => {
    return $.ajax({
        url: '/api/v1/company/remove',
        data,
        dataType: 'json',
        success: (results) => {
            return results
        }
    })
}

export default {
    list,
    save,
    listOne,
    update,
    remove
}