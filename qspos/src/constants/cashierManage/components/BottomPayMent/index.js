import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch } from 'antd';
import RechargeModal from '../RechargeModal';
import ToggleVipModal from '../ToggleVipModal';
import PayMentModal from '../PayMentModal';
import {GetServerData} from '../../../../services/services';
import './index.less';

class BottomPayMent extends Component {
  constructor(props) {
    super(props);
    this.state={
      visibleRecharge:false,//充值
      isPhone:true,
      visibleToggle:false,//切换会员
      visiblePay:true,//支付
      vipList:[],
      selectedRowKeys:[]
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
  //判断是会员手机号还会员卡号
  checkIsPhone=(value,type)=> {
    let regMb = /^[1][3,4,5,7,8][0-9]{9}$/;
    let isPhone;
    //手机号&&表单输入
    if(!regMb.test(value)&&type=='input') {
      isPhone = false;
    } else {
      isPhone = true;
    }
    this.setState({ isPhone })
  }
  getMemberInfo=(value)=>{
    this.checkIsPhone(value,'input')
    this.props.dispatch({
      type:'cashierManage/fetchMemberInfo',
      payload:{ cardNoMobile: value }
    })
  }
  goRecharge=()=> {
    this.setState({ visibleRecharge:true })
  }
  handleRechargeCancel=()=> {
    this.setState({ visibleRecharge:false })
  }
  handleRechargeOk=()=> {
    this.setState({ visibleRecharge:false })
  }
  //切换会员
  goToggleVip=()=> {
		GetServerData('qerp.pos.mb.card.switch',{ mobile:this.props.memberInfo.cardNoMobile})
		.then((res) => {
			if(res.code == '0') {
				res.iQposMbCards&&res.iQposMbCards.map((el,index) => (el.key = index))
				let selectedRowKeys = res.iQposMbCards.findIndex((value, index, arr) => {
					return value.cardNo == this.props.memberInfo.cardNo
				})
				this.setState({ vipList:res.iQposMbCards, visibleToggle:true });
			}
		})
  }
  onCancelToggle=()=> {
    this.setState({ visibleToggle:false });
  }
  //结算
  goSettlingAccount=()=> {
    this.setState({ visiblePay:false });
  }
  render() {
    const { getFieldDecorator } =this.props.form;
    const { payTotalData,memberInfo } =this.props;
    const { visibleToggle, vipList, isPhone, visiblePay, visibleRecharge } =this.state;
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
                    placeholder="扫码或输入条码"
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
                    onKeyUp={this.hindleKeyUpMember}
                    onKeyDown={this.hindleKeyDown}/>
                )
              }
            </div>
          </div>
          <div className="row-item flexBox row-two">
            <div className="col-item">
              <Switch defaultChecked/>
            </div>
            <div className="col-item member-actions">
              <div className="member-info">
                <div className="flexBox member-info-wrap">
                  <div className="members-detail">
                    {memberInfo.name}
                    {
                      memberInfo.isBirthMonth =='true'&&memberInfo.isLocalShop =='true'&&
                      <span className="icon-label">生日月</span>
                    }
                    <span className="icon-label">金冠兔</span>
                    {
    									memberInfo.isLocalShop =='false'&&<span className='icon-label'>异店</span>
    								}
                  </div>
                  {
                    isPhone&&memberInfo.isMoreShop =='true'&&
                    <p className="toggle-arrow" onClick={this.goToggleVip}>切换会员>></p>
                  }
                </div>
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
            <p className="field" onClick={this.goSettlingAccount}><span className="pay-btns">结算</span>「空格键」</p>
            <p className="field">数量<span className="money-num">{payTotalData.totolNumber}</span></p>
            <p className="field">金额<span className="money-num">{payTotalData.totolAmount}</span></p>
          </div>
        </div>
        <ToggleVipModal
          {...this.props}
          validateToggle={this.checkIsPhone}
          onCancel={this.onCancelToggle}
          visible={visibleToggle}
          dataSource={vipList}/>
        <RechargeModal
          onOk={this.handleRechargeOk}
          onCancel={this.handleRechargeCancel}
          visible={visibleRecharge}/>
        <PayMentModal
          form={this.props.form}
          visible={visiblePay}/>
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
