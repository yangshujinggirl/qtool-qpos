import React from 'react';
import ReactEcharts from 'echarts-for-react';

class BarChart extends React.Component{
    getOption = () => { 
        const userSalesd=this.props.userSales
        const totalUserSale=this.props.totalUserSale
        var datarow=[]
        var dataclum=[]
        //销售额
        let sellMoney ='';
        for(var i=0;i<userSalesd.length;i++){
            datarow.push(userSalesd[i].name)
            dataclum.push(userSalesd[i].saleAmount)
        }
        
        return ({
            title: {
                subtext: '销售额：'+totalUserSale.saleAmountTotal,
                left: 'left'
            },
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
                    name:'销售额',
                    type:'bar',
                    barWidth: '60%',
                    data:dataclum
                }
            ]
        })
    };

    render(){
        return (
            <ReactEcharts
            notMerge={true}
            lazyUpdate={true}
            style={{height: 300,width:"100%",
                    background:'#fff',
                    border: '1px solid #d8d8d8',
                    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
                }}
            option={this.getOption()}
            />
        )
    }
}

export default BarChart;