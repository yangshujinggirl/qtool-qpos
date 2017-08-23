import React from 'react';
import ReactEcharts from 'echarts-for-react';


const echartcount={
    width:'553px',
    height:'283px',
    background:'#fff',
    border: '1px solid #E7E8EC',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}

const option = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }
    ]
};
const Echartsaxis = () => (
        <ReactEcharts
            option={option}
            style={echartcount}
            className={'react_for_echarts'}
        />
);

export default Echartsaxis;