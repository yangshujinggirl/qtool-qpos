import React from 'react';
import { connect } from 'dva';
import styles from './Pay.css';
import Header from '../components/header/Header';
import { Input ,Form,Spin,message,Button} from 'antd';
import {GetServerData} from '../services/services';
import {printSaleOrder,printRechargeOrder} from '../components/Method/Method'

const FormItem = Form.Item;
var myVar=0;

class Payamount extends React.Component{
    constructor(props, context) {  
        super(props, context);  
        this.state={
            code:null,
            loding:false
        }
    }  
    //回车事件
    hindonKeyUp=(e)=>{
        if(e.keyCode=='13'){
            const code=e.target.value
            this.setState({
                code:code
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
            loding:false
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
            loding:false
        },function(){
            message.error('支付失败');
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
    render(){
        console.log(this)
        return (
            <div className={styles.normal}>
                <Header type={false} color={true} title={this.props.location.state.type=='7'?'微信':'支付宝'}/>
                <div className='cons'>
                    <div className='box'>
                    <Spin tip="支付中" spinning={this.state.loding}>
                        <Form className='payamounts'>
                            <FormItem
                                label="支付金额"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 10 }}
                            >
                                <p className='scanpayamount'>{this.props.location.state.amount}</p>
                            </FormItem>
                            <FormItem
                                label="付款码"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 10 }}
                            >
                                <div className='w200 wr'>
                                    <Input size="large" className='w200s' onKeyUp={this.hindonKeyUp.bind(this)} onBlur={this.hindBlue.bind(this)}/>
                                    <Button className='w200btn' onClick={this.payok.bind(this)}>确定</Button>
                                    <p>{122}</p>
                                </div>
                            </FormItem>
                        </Form>
                    </Spin>
                    </div>
                </div>
            </div>
        );
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
