import loginForm from '../views/login-form.html'
import login_model from '../models/login'
import toast from '../util/toast'
//初始化
const init = () => {
    //渲染视图，并绑定事件
    $('.login-wrap').html(loginForm);
    bindEvent()
}

const bindEvent = () => { 
    // 注册表单
    $('#loginWrap .sign-up-htm').on('submit', async function(e){
        e.preventDefault();
        let _result = await login_model.signUp();
        handelSignUp(_result);
    });
    // 登陆表单
     $('#loginWrap .sign-in-htm').on('submit', async function(e){
        e.preventDefault();
        let _result = await login_model.signIn();
        handelSignIn(_result);
    });
}
//处理注册
const handelSignUp = (result) => {
    switch ( result.status ) {
        case 500: toast('失败，服务器出了问题'); break;
        case 201:  toast('该手机号码已注册，请直接登录'); break;
        default: 
        console.log(result);
            toast('注册成功');
            break;
    } 
}
//处理登录
const handelSignIn = (result) => {
    console.log(result);
    switch ( result.status ) {
        case 203:  toast('密码错误'); break;
        case 202:  toast('用户不存在'); break;
        default: 
            //  //获取当前时间
            // var date=new Date();
            // var expiresDays=10;
            // //将date设置为10天以后的时间
            // date.setTime(date.getTime()+expiresDays*24*3600*1000);
            // document.cookie="_token="+result.results.token+"expires="+date.toGMTString();
            localStorage.token = result.results.token;
            window.location.href = "/"; 
        break;
    } 
}
export default {
    init,
}