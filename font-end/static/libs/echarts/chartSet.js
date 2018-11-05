setTimeout(() => {
    let areaChart = document.getElementById('areaChart');
    option = {
      title: {
        show: false,
        text: '网站访问及信息发布情况',
        textStyle: {
          color: '#000',
          fontSize: '14',
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['访客人数', '职位信息发布数', '公司信息发布数'],
        textStyle: {
          color: '#000',
          fontSize: '14',
          border:'1px solid red'
        }
      },

      toolbox: {
        show: true,
      },
      calculable: true,
      xAxis: [{
        splitLine: {
          show: false
        },
        type: 'category',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000'
          }
        },
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000'
          }
        },
        type: 'value'
      }],
      series: [{
          name: '公司信息发布数',
          type: 'line',
          smooth: true,
          symbolSize: 5,
          animationDelay: 1000,
          animationDuration: 1000,
          itemStyle: {
            normal: {
              color: '#ff7c0c',
              areaStyle: {
                type: 'default',
                color: '#ff7c0c',
              },
              lineStyle: {
                color: '#ff7c0c'
              }
            }
          },
          data: [10, 12, 21, 54, 260, 830, 710]
        },
        {
          name: '职位信息发布数',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#7ad206',
              areaStyle: {
                type: 'default',
                color: '#7ad206'
              },
              lineStyle: {
                color: '#7ad206'
              }
            }
          },
          data: [30, 182, 434, 791, 390, 30, 10]
        },
        {
          name: '访客人数',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#0e62fb',
              areaStyle: {
                type: 'default',
                color: '#0e62fb'
              },
              lineStyle: {
                color: '#0e62fb'
              }
            }
          },
          data: [1320, 1132, 601, 234, 120, 90, 20]
        }
      ]
    };
    var myChart = echarts.init(areaChart);
    myChart.setOption(option);



    let waterChart = document.getElementById('waterChart');
    option02 = {
      series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        radius: '65%'
      }]
    };
    var myChart2 = echarts.init(waterChart);
    myChart2.setOption(option02);
  }, 2000)
