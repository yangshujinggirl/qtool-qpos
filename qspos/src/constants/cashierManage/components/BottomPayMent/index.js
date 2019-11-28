import React, { Component } from 'react';
import { Form, Input, Row, Col, Switch } from 'antd';
import './index.less';

class BottomPayMent extends Component {
  hindleKeyUp(e) {
    let keyCode=e.keyCode;
    console.log(keyCode)
  }
  hindleKeyDown(e) {
    let keyCode=e.keyCode;
    console.log('hindleKeyDown')
  }
  getbarcodeDate=(value)=>{
    const values={barCode:value}
    this.props.dispatch({
      type:'cashier/barfetch',
      payload:{code:'qerp.pos.pd.spu.find',values:values}
    })
  }
  render() {
    const { getFieldDecorator } =this.props.form;
    return(
      <div className="bottom-payment-action flexBox">
        <div className="part-lt">
          <div className="row-item flexBox">
            <div className="col-item">
              <Input
                autoComplete="off"
                placeholder="扫码或输入条码"
                onKeyUp={this.hindleKeyUp}
                onKeyDown={this.hindleKeyDown}/>
            </div>
            <div className="col-item">
              <Input placeholder="会员号/手机号"/>
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
                <p className="lable-item">余额<span className="recharge-btn">充值</span><span className="card-num">200.00</span></p>
                <p className="lable-item">剩余积分<span className="card-num">200.00</span></p>
                <p className="lable-item">本次积分<span className="card-num">200.00</span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="part-rt">
          <div className="part-wrap flexBox">
            <p className="field"><span className="pay-btns">结算</span>「空格键」</p>
            <p className="field">数量<span className="money-num">0</span></p>
            <p className="field">金额<span className="money-num">0</span></p>
          </div>
        </div>
      </div>
    )
  }
}
export default BottomPayMent;
