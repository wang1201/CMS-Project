import router from './router/index'

//打包app.js   $webpack ./src/js/app.js
//发现会压缩app,因此$webpack ./src/js/app.js --mode development,则发现main.js不压缩
//发现到了dist文件夹里，而我们需要放到dev里面，于是需要$webpack ./src/js/app.js --mode development --output ../dev/main
//因此太麻烦  于是配置文件快捷方式scripts
// require('../css/index.css')
// require('../css/app.scss')
import '../css/app.scss';
// let imgurl = require("../img/icon.png");//得到用url-loader编译之后的路径
// let box = document.getElementById('img');
// box.innerHTML = "<img src=" + imgurl + " />" //放到html上
// console.log('app.js'); 


//这里的路径是相对于app.js本身的
const commonTemp_template = require('./views/commonTemp.html');
// 引入登录权限验证
import { userSigninAuth } from './util/auth'
import user_controller from './controller/user'

// //验证是否登录了
$("#wrapper").html(commonTemp_template);
let init = async () => {
    let isSignIn = await userSigninAuth()
    if ( isSignIn ) {//验证成功
        $('#wrapper').removeClass('hidden')
            
        router.init()
        user_controller.renderUserInfo()       
    }else {//验证失败-login
        window.location.href="/login.html"
    }
}


init()


