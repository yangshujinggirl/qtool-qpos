import React from 'react';
import ReactEcharts from 'echarts-for-react';


const echartcount={
    width:'553px',
    height:'283px',
    background:'#fff',
    border: '1px solid #E7E8EC',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}

const echartcountMin ={
     width:'280px',
    height:'283px',
    background:'#fff',
    border: '1px solid #d8d8d8',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.10)'
}
let widthFlag = true;

class EchartsPie extends React.Component {
    render(){
            const userSalesd=this.props.userSales
            console.log(userSalesd)
            var datarow=[]
            var dataclum=[]
            let orderCount = '';
            for(var i=0;i<userSalesd.length;i++){
                datarow.push(userSalesd[i].nickname)
                dataclum.push(
                        {
                            value:userSalesd[i].amount,name:userSalesd[i].nickname

                        }
                    )
               orderCount = userSalesd[i].orderQty
            }
            
            const option = {
                title: {
                    subtext: '订单数：'+orderCount,
                    left: '5%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '75%',
                    y:'25%',
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
                        center:['40%','60%']
                    },

                ]
};
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


export default EchartsPie;