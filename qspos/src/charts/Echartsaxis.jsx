import React from 'react';
import ReactEcharts from 'echarts-for-react';


const echartcount={
    width:'553px',
    height:'283px',
    background:'#fff',
    border: '1px solid #E7E8EC',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}

class Echartsaxis extends React.Component {
    render(){
        const userSalesd=this.props.userSales
        console.log(userSalesd)
        var datarow=[]
        var dataclum=[]
        for(var i=0;i<userSalesd.length;i++){
            datarow.push(userSalesd[i].nickname)
            dataclum.push(userSalesd[i].amount)
        }
        console.log(datarow)
        console.log(dataclum)

        const option={
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
                    data : datarow,
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
            data:dataclum
        }
    ]


        }

        return(
            <ReactEcharts
            option={option}
            style={echartcount}
            className={'react_for_echarts'}
        />
            )
    }

}

export default Echartsaxis;