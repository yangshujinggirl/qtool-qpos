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
            console.log(userSalesd)
            var datarow=[]
            var dataclum=[]
            for(var i=0;i<userSalesd.length;i++){
                datarow.push(userSalesd[i].nickname)
                dataclum.push(
                        {
                            value:userSalesd[i].amount,name:userSalesd[i].nickname

                        }
                    )
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
                    data:datarow
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
                        data:dataclum,
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