import React from 'react';
import ReactEcharts from 'echarts-for-react';


const echartcount={
    width:'553px',
    height:'283px',
    background:'#fff',
    border: '1px solid #E7E8EC',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}
const echartcountMin = {
     width:'280px',
    height:'283px',
    background:'#fff',
    border: '1px solid #d8d8d8',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}

let widthFlag = true;

class Echartsaxis extends React.Component {
    render(){
        const userSalesd=this.props.userSales
        console.log(userSalesd)
        var datarow=[]
        var dataclum=[]
        //销售额
        let sellMoney ='';
        for(var i=0;i<userSalesd.length;i++){
            datarow.push(userSalesd[i].nickname)
            dataclum.push(userSalesd[i].amount)
            sellMoney = userSalesd[i].amount
        }
        console.log(datarow)
        console.log(dataclum)

        const option={
            color: ['#3398DB'],
            title: {
                    subtext: '销售额：'+sellMoney,
                    left: '5%'
            },
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


        }

        return(
            <ReactEcharts
            option={option}
            style={widthFlag?echartcount:echartcountMin}
            className={'react_for_echarts'}
        />
            )
    }

    componentWillMount(){
      console.log(document.body.clientWidth);
         if( document.body.clientWidth > 800 ) {
                /* 这里是要执行的代码 */
              widthFlag = true;
            }else{
               widthFlag = false;
            }
            console.log(widthFlag);
    }

}

export default Echartsaxis;