import React from 'react';
import ReactEcharts from 'echarts-for-react';


const echartcount={
    width:'553px',
    height:'283px',
    background:'#fff',
    border: '1px solid #E7E8EC',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}

const a='1000'


class EchartsPie extends React.Component {
    render(){
            const userSalesd=this.props.userSales
            var datarow=[]
            var dataclum=[]
            for(var i=0;i<userSalesd.length;i++){
                datarow.push(userSalesd[i].nickname)
                dataclum.push(userSalesd[i].amount)
            }
            const option = {
                title: {
                    subtext: '订单数'+a,
                    left: '5%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '50%',
                    y:'30%',
                    data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                },
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        center:['20%','60%']
                    },

                ]
};
        return(
             <ReactEcharts
            option={option}
            style={echartcount}
            className={'react_for_echarts'}
        />


            )
    }







}














export default EchartsPie;