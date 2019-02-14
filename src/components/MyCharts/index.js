import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/dist/echarts.common';
// 引入折线图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import autoHeight from './autoHeight';
@autoHeight()
export default class MyCharts extends React.Component {
  start = {
    xAxis:[],
    series:[],
    yAxis:{},
  };
  componentWillUpdate (props){
    const {data ,config,yAxis} = props;
    this.start.yAxis = yAxis;
    this.filter(data,config);
    this.initChart();
  };
  filter(data,config){
    this.start.xAxis =[];
    const {x} = config;
    const {series} = config;

    for(let k in series){
      series[k] ={
        ...series[k],
        'data':[]
      }
    }
    for (let i in data){
      let arr = data[i]
      for(let j  in arr){
        let query = arr[j]
        if(j == x){
          this.start.xAxis.push(query);
        }
        for(let n in series){
          if(j == series[n].title){
            if(typeof query=='string'&&query.indexOf('%')>-1){
              query = query.replace('%','')
              query = parseInt(query);
            }
            series[n].data.push(query)
            break
          }
        }
      }
    }
    this.start.series = series
  }
  initChart(){
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      grid: {
        left: '0',
        right: '0',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      xAxis: [
        {
          type: 'category',
          data: this.start.xAxis,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.start.yAxis.y1.name,
          min: 0,
          interval: 50,
          axisLabel: {
            formatter: '{value} '+this.start.yAxis.y1.value
          },
          // 控制网格线是否显示
          splitLine: {
            show: true,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: 'rgba(255,0,0,.2)',
            }
          },
        },
        {
          type: 'value',
          name: '比率',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      dataZoom: [{
        type: 'inside',
      }, {
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: this.start.series
    });
    setTimeout(function (){
      window.onresize = function () {
        myChart.resize();
      }
    },200)

  };
  render() {
    return (
      <div id="main" style={{ height: 600,width:'100%'}}>
      </div>
    );
  }
}
