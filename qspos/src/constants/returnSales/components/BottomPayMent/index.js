import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, message } from 'antd';
import PayMentModal from '../PayMentModal';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import NP from 'number-precision'
import './index.less';

class BottomPayMent extends Component {
  constructor(props) {
    super(props);
    this.state={
      visiblePay:false,//支付
    }
    this.barCodeInput = null;
  }
  componentDidMount(){
    this.barCodeInput.input.select();
  }
  hindleKeyDown=(e)=> {
    let keyCode=e.keyCode;
    if(keyCode==9){
			e.preventDefault()
		}
  }
  hindleKeyUpBarcode=(e)=> {
    let keyCode=e.keyCode;
    if(keyCode==13) {
      const value=e.target.value
      this.getbarCodeSeach(value)
    }
  }
  getbarCodeSeach=(value)=>{
    this.props.dispatch({
      type:'returnSales/fetchbarCode',
      payload:{ odOrderNo: value }
    })
  }
  //结算
  goSettlingAccount=()=> {
    let { goodsList, memberInfo, payPart, payTotalData, baseOptions, checkedPayTypeOne } = this.props;
    if(payTotalData.totolNumber==0) {
      message.error('请选择商品');
      return;
    }
    let isCardDisabled = memberInfo.mbCardId?true:false;

    if(isCardDisabled) {//会员
      checkedPayTypeOne = { type:'5', amount:payTotalData.payAmount };
    } else {//非会员
      checkedPayTypeOne = { type:'1', amount:payTotalData.payAmount };
    }
    baseOptions.map((el,index) => {
      if(el.type == '5') {
        el.disabled = !isCardDisabled;
      }
    })
    this.props.dispatch({
      type:'returnSales/getCheckedPayType',
      payload:checkedPayTypeOne
    })
    this.props.dispatch({
      type:'returnSales/getPayMentTypeOptions',
      payload:baseOptions
    })
    this.setState({ visiblePay:true })
  }
  onCancelPayMent=()=> {
    this.setState({ visiblePay:false })
  }
  //跳转到收银
	hindchange=(e)=>{
		if(e==true){
			this.context.router.push('/cashier')
		}
	}
  render() {
    const { getFieldDecorator } =this.props.form;
    const { payTotalData, memberInfo } =this.props;
    const { visibleToggle, visiblePay } =this.state;
    return(
      <div className="bottom-payment-action flexBox">
        <div className="part-lt">
          <div className="row-item flexBox">
            <div className="col-item">
              {
                getFieldDecorator('barcode')(
                  <Input
                    ref={(input)=>this.barCodeInput = input}
                    autoComplete="off"
                    placeholder="订单号"
                    onKeyUp={this.hindleKeyUpBarcode}
                    onKeyDown={this.hindleKeyDown}/>
                )
              }

            </div>
            <div className="col-item">
              {
                getFieldDecorator('memberCode',{
                  initialValue:memberInfo.mobile
                })(
                  <Input
                    ref={(input)=>this.memberInput = input}
                    placeholder="会员号/手机号"
                    disabled/>
                )
              }
            </div>
          </div>
          <div className="row-item flexBox row-two">
            <div className="col-item toggle-switch">
              <Switch
                checkedChildren="用户退货"
                unCheckedChildren="对外售卖"
                checked={true}
                onChange={this.hindchange.bind(this)}/>
            </div>
            <div className="col-item member-actions">
              <div className="member-info">
                <div className="flexBox member-info-wrap">
                  {
                    memberInfo.mbCardId&&
                    <div className="members-detail">
                      {memberInfo.name}
                      {
                        memberInfo.isBirthMonth =='true'&&memberInfo.isLocalShop =='true'&&
                        <span className="icon-label">生日月</span>
                      }
                      <span className="icon-label">{memberInfo.levelStr}</span>
                      {
      									memberInfo.isLocalShop =='false'&&<span className='icon-label'>异店</span>
      								}
                    </div>
                  }
                </div>
              </div>
              <div className="memberCard-info flexBox">
                <p className="lable-item">
                  余额
                  <span className="card-num">{memberInfo.amount}</span>
                </p>
              <p className="lable-item">剩余积分<span className="card-num">{memberInfo.point}</span></p>
                <p className="lable-item">本次积分<span className="card-num"></span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="part-rt">
          <div className="part-wrap flexBox">
            <p className="field" onClick={this.goSettlingAccount}><span className="pay-btns">结算</span>「空格键」</p>
            <p className="field">数量<span className="money-num">{payTotalData.totolNumber}</span></p>
            <p className="field">金额<span className="money-num">{payTotalData.totolAmount}</span></p>
          </div>
        </div>
        <PayMentModal
          onCancel={this.onCancelPayMent}
          form={this.props.form}
          visible={visiblePay}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { returnSales } = state;
    return returnSales;
}
export default connect(mapStateToProps)(BottomPayMent);
