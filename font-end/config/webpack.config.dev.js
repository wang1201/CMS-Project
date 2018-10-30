let PATH = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        main: ['./src/js/app']
    },
    output: {
        filename: '[name].js',
        // path路径模块
        // path.join([path1],[path2]) 连接
        // path.resolve([from...],to);将to的参数解析成绝对路径
        // __dirname全局变量，存储的是文件所在的文件目录
        //__filename全局变量，存储的是文件名字
        path: PATH.resolve(__dirname, '../dev')
    },
    module: {
        rules: [{
            //处理js中引入的html文件，解析成字符串
            test: /\.html$/,
            use: [{
                loader: 'string-loader'
            }]
        }, {

            // 开发的时候可以在js文件中引入css / scss文件
            // loader从后向前使用，所以这里要先用sass解析，在编译成css，在加载成style

            // css-loader使当前的js文件里引入的css文件放到该js文件中；
            // style-loader将js中所有的计算后的css样式加一个style标签加入页面中；可在谷歌控制台查看
            // 二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中并生成style标签包裹使样式生效

            //安装node-sass,否则scss的语法，他不认识
            // Node - Sass是一个非常不错的解析Sass的工具, 并且能够很好的整合到webpack中去使用
            //sass-loader使当前的js文件里引入的scss文件放到该js文件中；
            //于是app.js中可以引入
            //生成后的代码可在main.js里面搜索查看
            test: /\.(css|scss)$/,
            use: [ // loader从后向前使用
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                //安装file-loader 或者 url-loader
                //url-loader类似与file-loader，只不过可以限制大小，
                //小于限制时返回一个dataurl(base64)，大于的时候显示图片
                //使用base64可以减少一次http请求，直接嵌入到页面中，而不需要外部载入
                //适用于小图标，并且HTTP响应时间远远大于下载时间的时候,因为请求时带的额外信心可能比图片本身还要大
                //当然，当前页面的大小也就变大了，因此适用于一些小图标
                loader: 'url-loader',
                options: {
                    //小于8192kb的图片将转换成base64格式
                    //大于的还是img格式
                    limit: 8192,
                    // limit: 81920
                }
            }]
        }, {
            //babel用于处理es的高级语法转成低级可兼容的语法
            //babel 在每个文件都插入了辅助代码，使代码体积过大！
            //引入 babel runtime 作为一个独立模块， 来避免重复引入
            //参考官方文档https://www.webpackjs.com/loaders/babel-loader/
            //cnpm install babel-loader @babel/core @babel/preset-env -D
            // cnpm install @babel/runtime -S
            //cnpm install @babel-plugin-transform-runtime -D
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: { // 'transform-runtime' 插件告诉 babel 要引用 runtime 来代替注入。
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }
        }]
    },
    // plugin解决一些loader干不了的事，比如我的html文件，我想也复制到dev文件下
    //webpack官方插件，需安装
    plugins: [
        //直接new HtmlWebpackPlugin()简化了创建，并且自动引入main.js,但是html的内容没过去
        //也可以配置项，这里配置一下,规定自定义的东西，此时内容也过去了
        new HtmlWebpackPlugin({
            // title:'',//标题
            template: './src/index.html', //模版 就是指源文件
            filename: 'index.html', //输出的名字
            // minify: {//是否压缩
            //     removeAttributeQuotes:true,
            // }
        }),


        //将单个文件或整个目录复制到构建目录
        new CopyWebpackPlugin([{
            //相对于当前页面的路径
            from: PATH.resolve(__dirname, '../static'),
            to: PATH.resolve(__dirname, '../dev/static')
        }, ])
    ],
    //接着去安装并配置webpack-dev-server进行热更新服务快捷方式，
    //会自动监听文件内容的改变, 而不会和webpack一样打包到本地，它只存在与缓存区
    //默认服务器接口为8080/于是需要配置，webpack官方文档
    devServer: {
        //来自dev的目录都会做处理，在需要提供静态资源时才需要
        contentBase: PATH.resolve(__dirname, "../dev"),
        compress: true, //gzip 压缩
        port: 9000,
        // WebPack中devServer的proxy代理其实是集成了http - proxy - middleware
        proxy: {
            //此时请求/api/index  === http://localhost:3000/api/index
            '/api': {
                target: 'http://localhost:3000',//目标地址
                changeOrigin:true//是否中间服务器代理转发
            }
        }
    },


}