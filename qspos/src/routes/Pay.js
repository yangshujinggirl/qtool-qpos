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
            code:this.state.code,
            id:this.props.location.state.msg
        }
        const result=GetServerData('qerp.web.qpos.od.order.save',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                //返回我三种状态
                // 1.支付成功 type=1
                // 2.支付失败 type=0
                // 3.支付中  type=2
                const type=json.type
                const payid=json.payid
                if(type=='1'){
                    this.paysuccess()
                }
                if(type=='2'){
                    //每隔1s请求新的查询接口，直到返回成功或者失败，停止查询，在返回成功或者失败之前，页面是loding状态，
                    //当返回的成功，则执行type==1中的方法，
                    //当返回的是失败，则执行type==3的方法
                    this.setState({
                        loding:true
                    },function(){
                         myVar=setInterval('this.payStateInfo(payid)',1000)
                    })
                }
                if(type=='3'){
                    this.payerron()
                }
            }
        })
    }
    //支付成功
    paysuccess=()=>{
        //跳转收银界面，初始化数据，loding结束
        this.setState({
            loding:false
        },function(){
            const ordertype=this.props.location.state.ordertype
            if(ordertype=='1'){
                //销售订单
                this.context.router.push('/cashier')
                this.props.meth1.handleOk()
                printSaleOrder(this.props.checkPrint,this.props.location.state.msg)
            }
            if(ordertype=='2'){
                //充值订单
                this.context.router.push('/cashier')
                this.props.meth1.handleOk()
                printRechargeOrder(this.props.location.state.msg)
            }
        })
    }
    //支付失败
    payerron=()=>{
        //报message,message销售后，点返回按钮我要跳转到弹窗页面,loding结束,分为充值和销售两种弹窗
        this.setState({
            loding:false
        },function(){
            message.error('支付失败');
        })
    }
    //支付状态查询接口
    payStateInfo=(id)=>{
        const values={
            payid:id
        }
        const result=GetServerData('qerp.web.qpos.od.order.save',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                if(json.type=='1'){
                    clearInterval(myVar)
                    this.paysuccess()
                }
                if(json.type=='0'){
                    clearInterval(myVar)
                    this.payerron()
                }
            }else{
                clearInterval(myVar)
                message.error(json.message);
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
        return (
            <div className={styles.normal}>
                <Header type={false} color={true}/>
                <div className='cons'>
                    <Spin tip="支付中" spinning={this.state.loding}>
                        <Form className='payamounts'>
                            <FormItem
                                label="支付金额"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 10 }}
                            >
                                <Input size="large"  className='w200' disabled value={this.props.location.state.amount}/>
                            </FormItem>
                            <FormItem
                                label="付款码"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 10 }}
                            >
                                <div className='w200 wr'>
                                    <Input size="large" className='w200s' onKeyUp={this.hindonKeyUp.bind(this)} onBlur={this.hindBlue.bind(this)}/>
                                    <Button className='w200btn' onClick={this.payok.bind(this)}>确定</Button>
                                </div>
                            </FormItem>
                        </Form>
                    </Spin>
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
