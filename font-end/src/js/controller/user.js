import user_model from '../models/user'
import toast from '../util/toast'

const renderUserInfo = async () => {
    // 获取用户信息，再去渲染
    let _result = await user_model.info()
    if ( _result.status === 304 ) { // 用户没有登录信息
        toast('登录信息已过期,请重新登录')
        window.location.href = '/login.html'
    } else {
        $('.userName').html(_result.data.userName)
    }


    $('.exit-btn').click( async function () {    
        localStorage.removeItem('token')
        window.location.href = '/login.html'       
    })
}

export default {
    renderUserInfo
}