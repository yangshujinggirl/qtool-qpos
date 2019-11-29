import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch } from 'antd';
import RechargeModal from '../RechargeModal';
import './index.less';

class BottomPayMent extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false
    }
    this.barCodeInput = null;
    this.memberInput = null;
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
    if(keyCode == 9) {
      this.memberInput.input.select();
    }
  }
  getbarCodeSeach=(value)=>{
    this.props.dispatch({
      type:'cashierManage/fetchbarCode',
      payload:{ barCode: value }
    })
  }
  hindleKeyUpMember=(e)=> {
    let keyCode=e.keyCode;
    if(keyCode==13) {
      const value=e.target.value
      this.getMemberInfo(value);
      this.barCodeInput.input.select();
    }
    if(keyCode == 9) {
      this.barCodeInput.input.select();
    }
  }
  getMemberInfo=(value)=>{
    this.props.dispatch({
      type:'cashierManage/fetchMemberInfo',
      payload:{ cardNoMobile: value }
    })
  }
  goRecharge=()=> {
    this.setState({ visible:true })
  }
  handleRechargeCancel=()=> {
    this.setState({ visible:false })
  }
  handleRechargeOk=()=> {
    this.setState({ visible:false })
  }
  render() {
    const { getFieldDecorator } =this.props.form;
    const { payTotalData,memberInfo } =this.props;
    return(
      <div className="bottom-payment-action flexBox">
        <div className="part-lt">
          <div className="row-item flexBox">
            <div className="col-item">
              <Input
                ref={(input)=>this.barCodeInput = input}
                autoComplete="off"
                placeholder="扫码或输入条码"
                onKeyUp={this.hindleKeyUpBarcode}
                onKeyDown={this.hindleKeyDown}/>
            </div>
            <div className="col-item">
              <Input
                ref={(input)=>this.memberInput = input}
                placeholder="会员号/手机号"
                onKeyUp={this.hindleKeyUpMember}
                onKeyDown={this.hindleKeyDown}/>
            </div>
          </div>
          <div className="row-item flexBox row-two">
            <div className="col-item">
              <Switch defaultChecked/>
            </div>
            <div className="col-item member-actions">
              <div className="member-info flexBox">
                <div className="members-detail">
                  祖国的花朵
                  <span className="icon-label">生日月</span>
                </div>
                <p>切换会员>></p>
              </div>
              <div className="memberCard-info flexBox">
                <p className="lable-item">
                  余额
                  <span className="recharge-btn" onClick={this.goRecharge}>充值</span>
                  <span className="card-num">{memberInfo.amount}</span>
                </p>
              <p className="lable-item">剩余积分<span className="card-num">{memberInfo.point}</span></p>
                <p className="lable-item">本次积分<span className="card-num">{payTotalData.thisPoint}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="part-rt">
          <div className="part-wrap flexBox">
            <p className="field"><span className="pay-btns">结算</span>「空格键」</p>
            <p className="field">数量<span className="money-num">{payTotalData.totolNumber}</span></p>
            <p className="field">金额<span className="money-num">{payTotalData.totolAmount}</span></p>
          </div>
        </div>
        <RechargeModal
          onOk={this.handleRechargeOk}
          onCancel={this.handleRechargeCancel}
          visible={this.state.visible}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(BottomPayMent);
// export default BottomPayMent;
