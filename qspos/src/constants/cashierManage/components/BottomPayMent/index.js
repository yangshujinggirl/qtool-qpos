import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, message } from 'antd';
import RechargeModal from '../RechargeModal';
import ToggleVipModal from '../ToggleVipModal';
import PayMentModal from '../PayMentModal';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import NP from 'number-precision'
import './index.less';

class BottomPayMent extends Component {
  constructor(props) {
    super(props);
    this.state={
      visibleRecharge:false,//充值
      isPhone:true,
      visibleToggle:false,//切换会员
      visiblePay:false,//支付
      vipList:[],
      selectedRowKeys:[],
      validateVisible:false
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
  //更新用户信息
  upDateUserInfo=(func)=> {
    GetServerData('qerp.pos.sy.config.info')
    .then((res)=> {
      let { config } =res;
      this.props.dispatch({
        type:'cashierManage/getIsPrint',
        payload:config.submitPrint==1?true:false
      })
      func && typeof func == 'function' && func()
    })
  }
  //enter搜索商品
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
  //enter搜索会员信息
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
    this.checkIsPhone(value,'input')
    this.props.dispatch({
      type:'cashierManage/fetchMemberInfo',
      payload:{ cardNoMobile: value }
    })
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
  //充值
  goRecharge=(value)=> {
    if(value) {
      this.upDateUserInfo()
    }
    this.setState({ visibleRecharge:value })
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
  //结算==》弹框
  goSettlingAccount=()=> {
    let { goodsList, memberInfo, payTotalData, baseOptions, payMentTypeOptionsOne,
      payMentTypeOptionsTwo,checkedPayTypeOne, checkedPayTypeTwo } = this.props;
    if(goodsList.length==0) {
      message.error('请选择商品');
      return;
    }
    this.upDateUserInfo();
    if(memberInfo.mbCardId) {//会员
      this.hasCardOrPoint()
    } else {//非会员
      checkedPayTypeOne = { type:'1', amount:payTotalData.payAmount };
      payMentTypeOptionsOne = baseOptions;
      payMentTypeOptionsOne = payMentTypeOptionsOne.filter((el)=>el.type!='5'&&el.type!='6');
      this.props.dispatch({
        type:'cashierManage/getCheckedPayType',
        payload:{ checkedPayTypeOne, checkedPayTypeTwo }
      })
      this.props.dispatch({
        type:'cashierManage/getPayMentTypeOptions',
        payload:{ payMentTypeOptionsOne,payMentTypeOptionsTwo }
      })
    }
    this.props.dispatch({
      type:'cashierManage/getPayMentVisible',
      payload:true
    })
  }
  //会员：初始化时；//单体《--》组合切换时计算。
  hasCardOrPoint=()=> {
    let { memberInfo, payPart, payTotalData, baseOptions, payMentTypeOptionsOne,
          payMentTypeOptionsTwo,checkedPayTypeOne, checkedPayTypeTwo } = this.props;
    payPart.isGroupDisabled = true;
    let isCardDisabled = Number(memberInfo.amount)<=0?true:false;
    let isPointDisabled = Number(memberInfo.point)<=0?true:false;
    let payAmount = parseFloat(payTotalData.payAmount);//应付总额；
    let memberAmount = parseFloat(memberInfo.amount);//会员卡余额；
    let pointAmount = NP.divide(memberInfo.point,100);//积分余额换算；
    checkedPayTypeOne = { type:'5', amount: payAmount };

    if(isCardDisabled&&isPointDisabled) {//会员余额:0，积分余额:0
      checkedPayTypeOne.type = '1';
      payPart.isGroupDisabled = false;
    } else if(!isCardDisabled) {//会员有余额
      if(memberAmount < payAmount){
        checkedPayTypeOne.amount = memberAmount;
        checkedPayTypeTwo = { type:'1', amount:NP.minus(payAmount, memberAmount) }
      }
    } else if(!isPointDisabled) {//积分有余额
      checkedPayTypeOne.type = '6';
      if(pointAmount < payAmount) {
        checkedPayTypeOne.amount = pointAmount;
        checkedPayTypeTwo = {
          type:'1',
          amount:NP.minus(payAmount, pointAmount)
        }
      }
    }
    if(memberInfo.isLocalShop == 'false') {//异店会员
      isCardDisabled = true;
      if(!isPointDisabled) {//积分有余额
        checkedPayTypeOne.type = '6';
        if(pointAmount < payAmount) {
          checkedPayTypeOne.amount = pointAmount;
          checkedPayTypeTwo = {
            type:'1',
            amount:NP.minus(payAmount, pointAmount)
          }
        }
      }
    }
    payMentTypeOptionsOne = baseOptions;
    payMentTypeOptionsOne.map((el,index) => {
      switch(el.type) {
        case "5":
          el.disabled = isCardDisabled;
          break;
        case "6":
          el.disabled = isPointDisabled;
          break;
      }
    })
    //组合支付,支付方法渲染
    if(checkedPayTypeOne.type&&checkedPayTypeTwo.type) {
      payMentTypeOptionsOne = baseOptions.filter((el) => el.type=='5'||el.type=='6');
      payMentTypeOptionsTwo = baseOptions.filter((el) => el.type!='5'&&el.type!='6');
    }
    checkedPayTypeOne.amount = fomatNumTofixedTwo(checkedPayTypeOne.amount)
    checkedPayTypeTwo.amount = checkedPayTypeTwo.type&&fomatNumTofixedTwo(checkedPayTypeTwo.amount)
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
    this.props.dispatch({
      type:'cashierManage/getPayMentTypeOptions',
      payload:{ payMentTypeOptionsOne,payMentTypeOptionsTwo }
    });
    this.props.dispatch({
      type:'cashierManage/getPayPart',
      payload:payPart
    })
  }
  onCancelPayMent=()=> {
    this.props.dispatch({
      type:'cashierManage/getPayMentVisible',
      payload:false
    })
    this.props.form.resetFields()
  }
  //跳转到退货
	hindchange=(e)=>{
		this.context.router.push('/returngoods')
	}
  render() {
    const { getFieldDecorator } =this.props.form;
    const { payTotalData,memberInfo, odOrder, payMentVisible } =this.props;
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
            <div className="col-item toggle-switch">
              <Switch
                checkedChildren="用户退货"
  							unCheckedChildren="对外售卖"
                checked={false}
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
                  {
                    isPhone&&memberInfo.isMoreShop =='true'&&
                    <p className="toggle-arrow" onClick={this.goToggleVip}>切换会员>></p>
                  }
                </div>
              </div>
              <div className="memberCard-info flexBox">
                <p className="lable-item">
                  余额
                  {
                    memberInfo.mbCardId&&memberInfo.isMoreShop=='true'&&
                    <span className="recharge-btn" onClick={()=>this.goRecharge(true)}>充值</span>
                  }
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
          onCancel={()=>this.goRecharge(false)}
          visible={visibleRecharge}/>
        <PayMentModal
          initLogic={this.hasCardOrPoint}
          onCancel={this.onCancelPayMent}
          form={this.props.form}
          visible={payMentVisible}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
BottomPayMent.contextTypes= {
    router: React.PropTypes.object
}
export default connect(mapStateToProps)(BottomPayMent);
