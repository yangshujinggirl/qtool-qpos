import React from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { Input ,Form,Spin,message,Button,Icon} from 'antd';
import Header from '../../components/Qheader';
import AntIcon from '../../components/loding/payloding';
import {GetServerData} from '../../services/services';
import {printSaleOrder,printRechargeOrder} from '../../components/Method/Method'
import './CashierPayCoupon.less';

const FormItem = Form.Item;
var myVar=0;

class Payamount extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            loding:false,
            erronmsg:null,
            rechargeorderid:null,
            couponInfo:{}
        }
    }
    codeSelect=()=>{
      this.codeInput.input.select();
  	}
    //输入框失去焦点
    hindBlur=(e)=>{
      const { location } =this.props;
      let value = e.target.value;
      if(!value) {
        return;
      }
      let params ={
        couponDetailCode:value,
        spShopId:location.state.spShopId,
        spuList:location.state.spuList
      }
      this.setState({ loding:true })
      GetServerData('qerp.web.qpos.od.coupon.query',params)
      .then((res) => {
        let { code, couponFullAmount,couponId,couponMoney, couponDetailCode, message } =res;
        this.setState({ loding:false })
        if(code != '0') {
          message.error(message);
          return;
        }
        this.setState({
          couponInfo: { couponFullAmount,couponId,couponMoney, couponDetailCode }
        });
      })
    }
    goPay=()=> {
      this.context.router.push({
        pathname : '/cashier',
        state : { couponInfo:this.state.couponInfo }
      });
    }
    render(){
      const { couponInfo } =this.state;
      return (
        <div className='cashierPay-coupon-pages'>
          <Spin tip="loading..." spinning={this.state.loding} indicator={<AntIcon/>}>
            <Header type={false} color={true} title="优惠券核销" backinit={true}/>
            <div className='coupons'>
              <div className='box'>
                <FormItem label="优惠券码" className="coupon-row-item">
                  <Input size="large"
                    onBlur={this.hindBlur}
                    ref={(input)=>this.codeInput = input}/>
                </FormItem>
                <FormItem label="优惠信息" className="coupon-row-item">
                  <Input size="large"
                    disabled
                    value={couponInfo.couponFullAmount&&`满${couponInfo.couponFullAmount}减${couponInfo.couponMoney}`}
                    suffix={<Button onClick={this.goPay.bind(this)}>确定</Button>}/>
                </FormItem>
                <div className='imgbox'>
                  <img src={require('../../images/paya@2x.png')} className='w100 h100'/>
                </div>
                <p className='rmark'>
                  扫码步骤：<br/>
                  （1）顾客打开Qtools APP 或 Qtool+ 小程序；<br/>
                  （2）进入“我的” - “优惠券”，选择要使用的优惠券；<br/>
                  （3）收银员扫描或输入顾客的优惠券码；
                </p>
              </div>
            </div>
          </Spin>
        </div>
      );
    }
}

Payamount.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const { cashierManage }=state
    return cashierManage
}

export default connect(mapStateToProps)(Payamount);
