
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm,message } from 'antd';
import Operation from '../../components/Operation/Operationsh.jsx';
import Header from '../../components/header/Header';
import EditableTable from './table';

class Receivegoodsindex extends React.Component {
    handleokent=(e)=>{
         //上箭头
        if(e.keyCode==38){
            const themeindex=Number(this.props.themeindex)=='0'?Number(this.props.datasouce.length)-1:Number(this.props.themeindex)-1
            console.log(themeindex)
            this.props.dispatch({
                type:'receivegoods/themeindex',
                payload:themeindex
            })
        }
        //下箭头
        if(e.keyCode==40){  
            const themeindex=Number(this.props.themeindex)==Number(this.props.datasouce.length)-1?0:Number(this.props.themeindex)+1
            console.log(themeindex)
            this.props.dispatch({
                type:'receivegoods/themeindex',
                payload:themeindex
            })
        }
        //空格
        if(e.keyCode=='32'){  
           this.payok()
        }
    }

    //结算
    payok=()=>{
        const initfocus=this.props.meth.initfocus
        initfocus()
        if(Number(this.props.totolsamount)>0 && Number(this.props.datasoucelen)>0){
            const datasouce=this.props.datasouce.slice(0)
            const pdOrderReceives=datasouce.filter(item => item.receiveQty!=0) 
            //判断有没有配货单号id
            let values={
                pdOrderId:this.props.pdOrderId,
                pdOrderReceives:pdOrderReceives
            }
            if(this.props.isfetchover){
                this.props.dispatch({
                    type:'receivegoods/payok',
                    payload:{code:'qerp.pos.pd.order.receive',values:values}
                })
                const isfetchover=false
                this.props.dispatch({
                    type:'receivegoods/isfetchover',
                    payload:isfetchover
                })

            }
			
        }else{
            message.warning('数量为0，不能收货');
        }
    }

    render(){
        return(
                <div>
                    <Header type={false} color={true}/>
                    <div className='counter'>
                        <EditableTable/>    
                    </div>  
                    <div className='mt30 footers'>        
                        <div className='mt20'>
                            <Operation color={true} type={true} index={false} payok={this.payok.bind(this)}/>
                        </div> 
                    </div>
                </div> 
            )
    }
    componentDidMount(){
        this.props.dispatch({
            type:'receivegoods/initstate',
            payload:{}
        })

        window.addEventListener('keyup', this.handleokent,true);    
    }
    componentWillUnmount(){   
        window.removeEventListener('keyup', this.handleokent,true);
    }
}

function mapStateToProps(state) {
    const {datasouce,themeindex,totolsamount,datasoucelen,meth,pdOrderId,isfetchover} = state.receivegoods;
    return {datasouce,themeindex,totolsamount,datasoucelen,meth,pdOrderId,isfetchover};
}

export default connect(mapStateToProps)(Receivegoodsindex);



















