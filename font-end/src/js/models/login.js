//注册
const signUp = () => {
    return new Promise((resolve) => {
        $('#loginWrap .sign-up-htm').ajaxSubmit({
            url: '/api/v1/login/signUp',
            type: 'post',
            success: (results) => {
                console.log(results);
                resolve(results);
            }
        })
    })
}
// 登录
const signIn = () => {
    return new Promise((resolve)=>{
        $('#loginWrap .sign-in-htm').ajaxSubmit({
            url: '/api/v1/login/signIn',
            type: 'post',
            success: (results) => {
                console.log(results);
                resolve(results);
            }
        })
    })
}



export default {
    signUp,
    signIn
}