import React from 'react';
import { connect } from 'dva';
import styles from './Pay.css';
import Header from '../components/header/Header';
import AntIcon from '../components/loding/payloding';
import { Input ,Form,Spin,message,Button,Icon} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../services/services';
import {printSaleOrder,printRechargeOrder} from '../components/Method/Method'


const FormItem = Form.Item;
var myVar=0;

class Payamount extends React.Component{
    constructor(props, context) {  
        super(props, context);  
        this.state={
            code:null,
            loding:false,
            erronmsg:null
        }
    }  
    //回车事件
    hindonKeyUp=(e)=>{
        if(e.keyCode=='13'){
            const code=e.target.value
            this.setState({
                code:code,
                erronmsg:null
            },function(){
                this.payok()
            })
        }
    }
    //结算
    payok=()=>{
        const values={
            orderNo:this.props.location.state.orderNo,
            orderId:this.props.location.state.orderId,
            code:this.state.code,
            consumeType:this.props.location.state.consumeType,
            amount:this.props.location.state.amount,
            type:this.props.location.state.type
        }

        this.setState({
            loding:true
        })


        const result=GetServerData('qerp.web.qpos.od.scan.code',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                const odOrderId=json.odOrderId
                const status=json.status
                const msg=json.msg
                //返回我三种状态
                // 1.支付成功 status=30
                // 2.支付失败 status=40
                // 3.支付中  status=20
                if(status=='30'){
                    this.paysuccess(msg)
                }
                if(status=='20'){
                    //每隔1s请求新的查询接口，直到返回成功或者失败，停止查询，在返回成功或者失败之前，页面是loding状态，
                    myVar=setInterval(this.payStateInfo,1000)
                }
                if(status=='40'){
                    this.payerron(msg)
                }
            }else{
                this.setState({
                    loding:false
                },function(){
                    message.error(json.message);
                })
            }
        })
    }

    //支付成功
    paysuccess=(msg)=>{
        //跳转收银界面，初始化数据，loding结束
        this.setState({
            loding:false,
            erronmsg:null
        },function(){
            const consumeType=this.props.location.state.consumeType
            if(consumeType=='1'){
                //销售订单
                this.context.router.push('/cashier')
                this.props.meth1.handleOk()
                message.success(msg)
                printSaleOrder(this.props.checkPrint,this.props.location.state.orderId)
            }
            if(consumeType=='2'){
                //充值订单
                this.context.router.push('/cashier')
                this.props.meth1.handleOk()
                printRechargeOrder(this.props.location.state.orderId)
            }
        })
    }
    //支付失败
    payerron=(msg)=>{
        this.setState({
            loding:false,
            erronmsg:msg

        })
    }
    //支付状态查询接口
    payStateInfo=()=>{
        const values={
            orderNo:this.props.location.state.orderNo,
            orderId:this.props.location.state.orderId,
            consumeType:this.props.location.state.consumeType,
        }
        const result=GetServerData('qerp.web.qpos.od.order.status',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                if(json.status=='30'){
                    const msg=json.msg
                    clearInterval(myVar)
                    this.paysuccess(msg)
                }
                if(json.status=='40'){
                    const msg=json.msg
                    clearInterval(myVar)
                    this.payerron(msg)
                }
            }else{
                this.setState({
                    loding:false
                },function(){
                    clearInterval(myVar)
                    message.error(json.message);
                })
            }
        })
    }
    //输入框失去焦点
    hindBlue=(e)=>{
        this.setState({
            code:e.target.value
        })
    }
    codeChange=()=>{
        this.setState({
            erronmsg:null
        })
    }
    render(){
        console.log(this)
        return (
            <div className='payscanbox'>
                <Spin tip={this.props.location.state.type=='7'?'微信支付中...':'支付宝支付中...'} spinning={this.state.loding} indicator={<AntIcon/>}>
                    <Header type={false} color={true} title={this.props.location.state.type=='7'?'微信':'支付宝'}/>
                    <div className='cons'>
                        <div className='box'>
                            <Form className='payamounts'>
                                <FormItem
                                    label="支付金额::"
                                    
                                >
                                    <p className='scanpayamount'>{this.props.location.state.amount}</p>
                                </FormItem>
                                <FormItem
                                    label="付款码::"
                                    
                                >
                                    <div className='wr'>
                                        <Input size="large"  onKeyUp={this.hindonKeyUp.bind(this)} onBlur={this.hindBlue.bind(this)} onChange={this.codeChange.bind(this)} ref='code'/>
                                        <Button onClick={this.payok.bind(this)}>确定</Button>
                                        <p className='erronremarks'>
                                            <div className='box'>
                                                {this.state.erronmsg?<div><Icon type="exclamation-circle-o" /><span className='txtss'>{this.state.erronmsg}</span></div>:null}
                                                
                                                
                                            </div>
                                        </p>
                                    </div>
                                </FormItem>
                            </Form>
                            <div className='imgbox'>
                                <img src={require('../images/paya@2x.png')} className='w100 h100'/>
                            </div>
                            <p className='rmark'>请扫码顾客{this.props.location.state.type=='7'?'微信':'支付宝'}的付款码</p>
                        
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
    componentDidMount(){
        const ValueorderNoses=ReactDOM.findDOMNode(this.refs.code)
        ValueorderNoses.focus()
    }
}

Payamount.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const {meth1,checkPrint}=state.cashier
    return {meth1,checkPrint};
}

export default connect(mapStateToProps)(Payamount);