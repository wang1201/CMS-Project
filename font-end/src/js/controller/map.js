
import map_template from '../views/map.html'
// import not_allow_template from '../views/not-allow.html'
// import user_model from '../models/user'

const map = async (req, res) => {

    // 判断没有资格访问
    // let _can = await user_model.allow('map')
    // if ( _can.status === 403) {
    //     alert('登陆后操作')
    //     window.location.href = '/admin.html'
    //     return false;
    // }
    // if ( _can.status === 402 ) {
    //     res.render(not_allow_template)
    //     return false;
    // }

    res.render(map_template)
    // // 按需加载 地图js 在这里应该判断是否有这个
    if ( !window.AMap ) {
        let $script = $('<script  src="https://webapi.amap.com/maps?v=1.4.10&key=4b03905b1ff241e6e8a1dc11450661f7&callback=onApiLoaded&plugin=AMap.Transfer,AMap.Geocoder,AMap.PlaceSearch,AMap.Autocomplete" >')
        $('body').append($script)
    }else {
        window.onApiLoaded()
    }  
    
}
// 地图回调
window.onApiLoaded = function () {
    var map = new AMap.Map('map-container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:11, //初始化地图层级
        center: [116.370154, 40.037302] //初始化地图中心点
    });
    AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            var cityinfo = result.city;
            var citybounds = result.bounds;
            document.getElementById('info').innerHTML = '您当前所在城市：'+cityinfo;
            //地图显示当前城市
            map.setBounds(citybounds);
        
          }
        })
      })    
    // $("#search").on("blur",()=>{
    //     console.log("111")
    //     AMap.service(["AMap.PlaceSearch"], function() {
    //         //构造地点查询类
    //         var placeSearch = new AMap.PlaceSearch({ 
    //             pageSize: 5, // 单页显示结果条数
    //             pageIndex: 1, // 页码
    //             city: "010", // 兴趣点城市
    //             citylimit: true,  //是否强制限制在设置的城市内搜索
    //             map: map, // 展现结果的地图实例
    //             panel: "panel", // 结果列表将在此容器中进行展示。
    //             autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    //         });
    //         //关键字查询
    //         placeSearch.search($("#search").val());
    
    //     });

    // })

    

    // // 中心点
    // var marker = new AMap.Marker({
    //     icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    //     position: [116.370154, 40.037302],
    //     offset: new AMap.Pixel(-13, -30)
    // });
    // marker.setMap(map);

    // // 使用插件来进行定位
    // AMap.plugin('AMap.Geolocation', function() {
    //     var geolocation = new AMap.Geolocation({
    //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
    //         timeout: 10000,          //超过10秒后停止定位，默认：5s
    //     });
    //     geolocation.getCurrentPosition(function(status,result){
    //         if(status=='complete'){
    //             onComplete(result)
    //         }else{
    //             onError(result)
    //         }
    //     });
    // });
    // //解析定位结果
    // function onComplete(data) {
    //    console.log('定位结果：' + data.position);
    //    // 地理编码，将经纬度处理成地址
    //    regeoCode(data.position)
    //    // 移动到定位位置
    //    map.panTo(data.position);
    // //    创建当前定位点
    //    var marker = new AMap.Marker({
    //         icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    //         position: data.position,
    //         offset: new AMap.Pixel(-13, -30)
    //     });
    //     marker.setMap(map);

    // }
    
    
    var auto = new AMap.Autocomplete({
        input: "origin"
    });
    var _auto = new AMap.Autocomplete({
        input: "terminus"
    });


$("#search").on("click",()=>{
    var transOptions = {
        map: map,
        city: '北京市',
        panel: 'panel',                           
        policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
    };
    //构造公交换乘类
    var transfer = new AMap.Transfer(transOptions);
    //根据起、终点名称查询公交换乘路线
    transfer.search([
        {keyword: $("#origin").val(),city:'北京'},
        //第一个元素city缺省时取transOptions的city属性
        {keyword: $("#terminus").val(),city:'北京'}
        //第二个元素city缺省时取transOptions的cityd属性
    ], function(status, result) {
        // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
      
    });
})
      
   
    //解析定位错误信息
    function onError(data) {
        console.log('定位失败', data.message)
    }
    // 获取详细地址
    function regeoCode(position) {
        console.log('正在处理')
        if(!geocoder){
            var geocoder = new AMap.Geocoder({
                radius: 1000 //范围，默认：500
            });
        }
        geocoder.getAddress([position.lng, position.lat], function(status, result) {
            if (status === 'complete'&&result.regeocode) {
                // var address = result.regeocode.formattedAddress;
            }else{alert(JSON.stringify(result))}
        });
    }
    

    // 定位到当前的用户所在的位置，从用户位置到marker做一条路线规划
}

export default {
    map
}