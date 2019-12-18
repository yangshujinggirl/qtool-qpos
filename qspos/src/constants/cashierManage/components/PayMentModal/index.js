import React, { Component } from 'react';
import { connect } from 'dva';
import NP from 'number-precision'
import { message, Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import {printSaleOrder} from '../../../../components/Method/Method'
import ValidataModal from '../ValidataModal';

import './index.less';

const Option = Select.Option;

class PayMentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validateVisible:false,//校验弹框
      remark:'',
      cashRealVal:'',
      disVal:'0.00',
      payLoading:false
    }
  }
  //备注
  onChangeRemark=(e)=> {
    this.setState({ remark: e.target.value });
  }
  //切换支付方式
  goTogglePayType=(record)=> {
    let { payPart, payTotalData, memberInfo, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let errorText;
    switch(record.type) {
      case "5":
        let memberAmount = parseFloat(memberInfo.amount);//会员卡余额；
        if(memberAmount < payTotalData.payAmount) {
          errorText = '余额不足，请更换支付方式或组合支付'
        }
        break;
      case "6":
        let pointAmount = NP.divide(memberInfo.point,100);//积分余额
        if(pointAmount < payTotalData.payAmount) {
          errorText = '余额不足，请更换支付方式或组合支付'
        }
        break;
      case "4":
        let { cashRealVal } =this.state;
        if(cashRealVal == '') {
          errorText = '请输入现金金额'
        }
        break;
      default:
        errorText = null;
    }
    payPart.errorText = errorText;
    checkedPayTypeOne = {...checkedPayTypeOne,type:record.type };
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
    this.props.dispatch({
      type:'cashierManage/getPayPart',
      payload:payPart
    })
  }
  //组合支付---切换支付方式
  handleTogglePayType=(option,type)=> {
    let { checkedPayTypeOne, checkedPayTypeTwo, payPart } =this.props;
    if(type == 'checkedPayTypeOne') {
      if(option.key == '5'||option.key=='6') {
        checkedPayTypeOne.type = option.key;
        this.checkCardAndPoint();
      }
    } else {
      checkedPayTypeTwo.type = option.key;
      let { cashRealVal } =this.state;
      if(option.key == '4'&&cashRealVal == '') {
        payPart.errorText = '请输入现金金额';
      }
      this.props.dispatch({
        type:'cashierManage/getPayPart',
        payload:payPart
      })
      this.props.dispatch({
        type:'cashierManage/getCheckedPayType',
        payload:{ checkedPayTypeOne, checkedPayTypeTwo }
      })
    }
  }
  //切换组合《---》单体支付方式
  goToggleGroupPay=()=> {
    let { payPart, payTotalData, payMentTypeOptionsOne,payMentTypeOptionsTwo,
      baseOptions, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
      payMentTypeOptionsOne = baseOptions;
      payPart.errorText = null;
    if(checkedPayTypeTwo.type) {
      checkedPayTypeTwo ={};
      checkedPayTypeOne = { type:'1',amount:payTotalData.payAmount };
      this.props.dispatch({
        type:'cashierManage/getPayMentTypeOptions',
        payload:{ payMentTypeOptionsOne,payMentTypeOptionsTwo }
      })
      this.props.dispatch({
        type:'cashierManage/getCheckedPayType',
        payload:{ checkedPayTypeOne, checkedPayTypeTwo }
      })
    } else {
        let payAmount = parseFloat(payTotalData.payAmount);//应付总额；
        checkedPayTypeTwo.type = '1';
        // checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
        this.props.dispatch({
          type:'cashierManage/getCheckedPayType',
          payload:{ checkedPayTypeOne, checkedPayTypeTwo }
        })
        this.props.initLogic()
    }
    this.setState({ cashRealVal:'', disVal:'0.00' });
    this.props.dispatch({
      type:'cashierManage/getPayPart',
      payload:payPart
    })
  }
  //抹零
  goCutAmount=()=>{
    let { payTotalData, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    const diffamount=NP.minus(payTotalData.totolAmount, parseInt(payTotalData.payAmount))
    if(diffamount<=0) {
      return;
    }
    let payAmount = parseInt(payTotalData.payAmount);
    payAmount = fomatNumTofixedTwo(payAmount);
    payTotalData.payAmount = payAmount;
    payTotalData.cutAmount = '1';
    this.props.dispatch({
      type:'cashierManage/getTotalData',
      payload:payTotalData
    })
    this.checkCardAndPoint()
  }
  //计算组合支付，单体支付金额
  checkCardAndPoint() {
    let { memberInfo, payTotalData, payPart, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let payAmount = payTotalData.payAmount;
    let { cashRealVal, disVal } =this.state;
    if(checkedPayTypeOne.type&&checkedPayTypeTwo.type) {
      let memberAmount = parseFloat(memberInfo.amount);//会员卡余额；
      let pointAmount = NP.divide(memberInfo.point,100);//积分余额
      switch(checkedPayTypeOne.type) {
        case "5":
          if(memberAmount >= payAmount) {
            checkedPayTypeOne.amount = payAmount;
            checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
          } else {//会员卡余额不足
            checkedPayTypeOne.amount = memberAmount;
            checkedPayTypeTwo.amount = NP.minus(payAmount, memberAmount);
          }
          break;
        case "6":
          if(pointAmount >= payAmount) {
            checkedPayTypeOne.amount = payAmount;
            checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
          } else {//会员卡余额不足
            checkedPayTypeOne.amount = pointAmount;
            checkedPayTypeTwo.amount = NP.minus(payAmount, pointAmount);
          }
          break;
      }
    } else {
      checkedPayTypeOne.amount = payTotalData.payAmount;
    }
    checkedPayTypeOne.amount = fomatNumTofixedTwo(checkedPayTypeOne.amount)
    checkedPayTypeTwo.amount = checkedPayTypeTwo.type&&fomatNumTofixedTwo(checkedPayTypeTwo.amount)
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    });
    this.upDateCashVal()
  }
  //现金支付时 更新val；
  upDateCashVal=()=> {
    const { checkedPayTypeOne, checkedPayTypeTwo, payPart } =this.props;
    let { cashRealVal, disVal } =this.state;
    if(checkedPayTypeOne.type&&checkedPayTypeTwo.type) {
      if(checkedPayTypeTwo.type == '4'&& cashRealVal !='') {
        disVal = NP.minus(cashRealVal, checkedPayTypeTwo.amount);
        disVal = fomatNumTofixedTwo(disVal)
      }
      //重置结算按钮
      if(checkedPayTypeTwo.type == '4'&&cashRealVal>= checkedPayTypeTwo.amount) {
        payPart.errorText = null;
        this.props.dispatch({
          type:'cashierManage/getPayPart',
          payload:payPart
        })
      }
    } else {
      if(checkedPayTypeOne.type == '4'&& cashRealVal!='') {
        disVal = NP.minus(cashRealVal, checkedPayTypeOne.amount);
        disVal = fomatNumTofixedTwo(disVal)
      }
      //重置结算按钮
      if(checkedPayTypeOne.type == '4'&&cashRealVal>= checkedPayTypeOne.amount) {
        payPart.errorText = null;
        this.props.dispatch({
          type:'cashierManage/getPayPart',
          payload:payPart
        })
      }
    }
    this.setState({ disVal })
  }
  //处理结算逻辑
  handleSubmit=(func)=>{
    let { goodsList, memberInfo, payTotalData,couponDetail,
      checkedPayTypeOne, checkedPayTypeTwo, errorText } =this.props;
    let orderPay=[];//支付方式
    if(checkedPayTypeOne.type&&checkedPayTypeTwo.type){
      orderPay.push(checkedPayTypeOne,checkedPayTypeTwo)
    }else{
      orderPay.push(checkedPayTypeOne)
    }
    let params={
          mbCard:{ mbCardId:memberInfo.mbCardId?memberInfo.mbCardId:null },
          odOrder:{
            amount:payTotalData.totolAmount,
            orderPoint:payTotalData.thisPoint,
            payAmount:payTotalData.payAmount,
            qty:payTotalData.totolNumber,
            skuQty:goodsList.length,
            cutAmount:payTotalData.cutAmount,
            remark:this.state.remark,
            ...couponDetail
          },
          orderDetails:goodsList,orderPay
       };
    this.goPayApi(params,func);
  }
  //结算Api
  goPayApi=(values,func)=>{
    this.setState({ payLoading:true })
    GetServerData('qerp.web.qpos.od.order.save',values)
    .then((res) => {
      const { code, odOrderId, orderNo } =res;
      this.setState({ payLoading:false })
      if(code=='0'){
        const {isPrint} = this.props;
        message.success('收银成功',.5)
        printSaleOrder(isPrint,odOrderId);
        this.setState({ validateVisible:false, cashRealVal:'', disVal:'0.00', validateVisible:false });
        this.props.dispatch({
          type:'cashierManage/resetData',
          payload:{}
        })
        this.props.dispatch({
          type:'cashierManage/getPayMentVisible',
          payload:false
        })
        func && typeof func == 'function'&&func();
        this.props.form.resetFields();
      }else if(code == 'I_1031'){
        this.setState({ validateVisible:true })
        this.props.dispatch({
          type:'cashierManage/getPayMentVisible',
          payload:false
        })
      } else {
        message.error(res.message)
      }
    })
  }
  //关闭支付弹框
  onCancelPay=()=> {
    this.props.dispatch({
      type:'cashierManage/resetPayModalData',
      payload:{}
    })
    this.props.dispatch({
      type:'cashierManage/getPayMentVisible',
      payload:false
    });
    this.setState({ cashRealVal:'', disVal:'0.00' });
  }
  //支付方式1
  onChangePayOne=(e)=> {
    let { payTotalData, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let value = e.target.value;
    let regExp=/^\d*((\.)|(\.\d{1,2}))?$/
    if(regExp.test(value)) {
      checkedPayTypeOne.amount = value;
      this.props.dispatch({
        type:'cashierManage/getCheckedPayType',
        payload:{ checkedPayTypeOne, checkedPayTypeTwo }
      })
    }
  }
  //支付方式1
  onBlurPayOne=(e)=> {
    let { payTotalData, memberInfo, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let memberAmount = parseFloat(memberInfo.amount);//会员卡余额；
    let pointAmount = NP.divide(memberInfo.point,100);//积分余额
    let payAmount = payTotalData.payAmount;
    checkedPayTypeOne.amount = checkedPayTypeOne.amount==''?0:checkedPayTypeOne.amount;
    if(Number(checkedPayTypeOne.amount)>Number(payAmount)) {
      checkedPayTypeOne.amount = payAmount;
      checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
    }
    switch(checkedPayTypeOne.type) {
      case "5":
        if( memberAmount >= checkedPayTypeOne.amount) {
          checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
        } else {//会员卡余额不足
          checkedPayTypeOne.amount = memberAmount;
          checkedPayTypeTwo.amount = NP.minus(payAmount, memberAmount);
        }
        break;
      case "6":
        if(pointAmount >= checkedPayTypeOne.amount) {
          checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
        } else {//会员卡余额不足
          checkedPayTypeOne.amount = pointAmount;
          checkedPayTypeTwo.amount = NP.minus(payAmount, pointAmount);
        }
        break;
    }
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
    this.upDateCashVal()
  }
  //现金实收
  onChangeCashReal=(e)=> {
    const { payPart } =this.props;
    let value = e.target.value;
    let regexp=/^\d*((\.)|(\.\d{1,2}))?$/;
    if(regexp.test(value)) {
      this.setState({ cashRealVal: value });
      payPart.errorText=null;
      this.props.dispatch({
        type:'cashierManage/getPayPart',
        payload:payPart
      })
    }
  }
  onBlurCashReal=(e)=> {
    let { payTotalData, checkedPayTypeOne, checkedPayTypeTwo, payPart } =this.props;
    let { disVal } =this.state;
    let value = e.target.value;
    value = fomatNumTofixedTwo(value);
    let errorText;
    if(checkedPayTypeOne.type&&checkedPayTypeTwo.type) {
      if(Number(value) < Number(checkedPayTypeTwo.amount)) {
        disVal = '0.00';
        payPart.errorText = '现金实收金额不得小于现金付款金额';
      } else {
        payPart.errorText=null;
        disVal= NP.minus(value,checkedPayTypeTwo.amount);
      }
    } else {
      if(Number(value)< Number(payTotalData.payAmount)) {
        disVal = '0.00';
        payPart.errorText = '现金实收金额不得小于实付金额';
      } else {
        payPart.errorText=null;
        disVal= NP.minus(value,payTotalData.payAmount);
      }
    }
    disVal = fomatNumTofixedTwo(disVal);
    this.setState({ cashRealVal:value, disVal });
    this.props.dispatch({
      type:'cashierManage/getPayPart',
      payload:payPart
    })
  }
  //异店积分校验
  onCancelValidate=()=>{
    this.setState({ validateVisible:false })
  }
  //优惠券核销
  onBlurCoupon=(e)=> {
    //输入框失去焦点
    let { goodsList, payTotalData, couponDetail, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let spShopId = sessionStorage.getItem('spShopId');
    let spuList = goodsList.map((el)=> {
      let item ={};
        item.pdSkuId = el.pdSkuId
        item.pdSpuId = el.pdSpuId
        item.price = el.payPrice
        item.activityId = el.truenumber
        item.pdBrandId = el.pdBrandId
        item.activityNotUseCoupons = el.activityNotUseCoupons;
        return item;
    })
    let value = e.target.value;
    if(!value) {//无优惠券
      this.props.dispatch({
        type:'cashierManage/getCouponDetail',
        payload:{}
      })
      payTotalData.payAmount = payTotalData.totolAmount
      this.props.dispatch({
        type:'cashierManage/getTotalData',
        payload:payTotalData
      })
      this.checkCardAndPoint()
    } else {
      let params ={ couponDetailCode:value, value, spShopId, spuList }
      GetServerData('qerp.web.qpos.od.coupon.query',params)
      .then((res) => {
        let { code, couponFullAmount,couponId,couponMoney, couponDetailCode, message } =res;
        if(code != '0') {
          message.error(message);
          return;
        }
        payTotalData.cutAmount = '0';
        payTotalData.payAmount = NP.minus(payTotalData.totolAmount,couponMoney);
        couponDetail = { couponFullAmount,couponId,couponMoney, couponDetailCode }
        this.props.dispatch({
          type:'cashierManage/getTotalData',
          payload:payTotalData
        })
        this.props.dispatch({
          type:'cashierManage/getCouponDetail',
          payload:couponDetail
        })
        this.checkCardAndPoint()
      })
    }
  }
  //切换打印
  onChangePrint=(e)=> {
    let value = e.target.checked;
    this.props.dispatch({
      type:'cashierManage/getIsPrint',
      payload:value
    })
  }
  render() {
    const { payTotalData, memberInfo, visible,payPart,couponDetail,
            payMentTypeOptionsOne, payMentTypeOptionsTwo,isPrint,
            checkedPayTypeOne,checkedPayTypeTwo } =this.props;
    const { cashRealVal, disVal, payLoading, validateVisible } =this.state;
    return(
      <div>
        <Modal
          closable={false}
          onCancel={this.onCancelPay}
          visible={visible}
          footer={null}
          width={865}
          destroyOnClose={true}
          className="settling-account-modal">
            <div className="main-content-body">
              <Form.Item label="应付金额">
                <Input autoComplete={'off'} disabled defaultValue={payTotalData.totolAmount}/>
              </Form.Item>
              {
                memberInfo.mbCardId&&
                <Form.Item label="会员信息">
                  <Input autoComplete={'off'} disabled defaultValue={`${memberInfo.name}/${memberInfo.mobile}`}/>
                </Form.Item>
              }
              <div className="more-formItem">
                <Form.Item label="优惠券抵扣" className="label-item">
                  <Input
                    autoComplete={'off'}
                    disabled
                    readOnly
                    value={couponDetail.couponFullAmount&&`-${couponDetail.couponMoney}(满${couponDetail.couponFullAmount}减${couponDetail.couponMoney})`}/>
                </Form.Item>
                <div className="coupon-code">
                  <Input autoComplete={'off'} placeholder="请扫码或输入优惠券码" onBlur={this.onBlurCoupon}/>
                </div>
              </div>
              <Form.Item label="实付金额">
                <Input autoComplete={'off'} disabled readOnly value={payTotalData.payAmount}/>
                <div className="btn-wrap">
                  <Button
                    ghost
                    className="scanCode-btn"
                    type="primary"
                    disabled={payTotalData.cutAmount=='1'?true:false}
                    onClick={this.goCutAmount}>抹零</Button>
                </div>
              </Form.Item>
              <p className="separate-line"></p>
              {
                checkedPayTypeOne.type&&checkedPayTypeTwo.type?
                <div>
                  <div className="group-pay-formItem">
                    <Form.Item label="支付方式1" className="label-col">
                      <Select
                        value={checkedPayTypeOne.type}
                        onChange={(value,option)=>this.handleTogglePayType(option,'checkedPayTypeOne')}>
                        {
                          payMentTypeOptionsOne.map((el)=> (
                            <Option  disabled={el.disabled} value={el.type} key={el.type}>{el.name}</Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item className="field-col">
                      <Input
                        autoComplete={'off'}
                        value={checkedPayTypeOne.amount}
                        onChange={this.onChangePayOne}
                        onBlur={this.onBlurPayOne}/>
                    </Form.Item>
                  </div>
                  <div className="group-pay-formItem">
                    <Form.Item label="支付方式2" className="label-col">
                      <Select
                        value={checkedPayTypeTwo.type}
                        onChange={(value,option)=>this.handleTogglePayType(option,'checkedPayTypeTwo')}>
                        {
                          payMentTypeOptionsTwo.map((el)=> (
                            <Option value={el.type} key={el.type}>{el.name}</Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item className="field-col">
                      <Input autoComplete={'off'} disabled value={checkedPayTypeTwo.amount}/>
                    </Form.Item>
                  </div>
                </div>
                :
                <div className="row-item">
                  <label className="item-l">支付方式</label>
                  <div className="item-r">
                    {
                      payMentTypeOptionsOne.map((el)=> (
                        <Button
                          onClick={()=>this.goTogglePayType(el)}
                          key={el.type}
                          disabled={el.disabled}
                          className={`payType-btn ${el.type ==checkedPayTypeOne.type?'selected':''}`}>
                          {el.name}
                          {el.type=='5'&&<span className="desc-tips">余额 {memberInfo.amount}</span>}
                          {el.type=='6'&&<span className="desc-tips">可抵 {NP.divide(memberInfo.point,100)}元</span>}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              }
              {
                (checkedPayTypeOne.type=='4'||checkedPayTypeTwo.type=='4')&&
                <div className="more-formItem">
                  <Form.Item label="现金实收" className="label-item">
                    <Input
                      autoComplete={'off'}
                      value={cashRealVal}
                      onChange={this.onChangeCashReal}
                      onBlur={this.onBlurCashReal}/>
                  </Form.Item>
                  <Form.Item label="找零" className="field-item">
                    <Input autoComplete={'off'}  disabled readOnly value={disVal}/>
                  </Form.Item>
                </div>
              }
              <Form.Item label="备注信息">
                <Input
                  maxLength={20}
                  autoComplete={'off'}
                  placeholder="可输入20字订单备注"
                  onChange={this.onChangeRemark}/>
              </Form.Item>
              <div className="footer-part">
                {payPart.errorText&&<p className="error-validate">{payPart.errorText}</p>}
                <div className="footer-row">
                  <Button
                    loading={payLoading}
                    type="primary"
                    disabled={payPart.errorText?true:false}
                    onClick={this.handleSubmit}
                    className="go-settling-btn">
                      结算
                  </Button>
                  <Button
                    onClick={this.goToggleGroupPay}
                    className="go-group-btn"
                    type="primary"
                    disabled={payPart.isGroupDisabled}
                    ghost={checkedPayTypeOne.type&&checkedPayTypeTwo.type?false:true}>组合支付</Button>

                </div>
                <div className='footer-row'>
                  <Checkbox checked={isPrint} onChange={this.onChangePrint}>打印小票</Checkbox>
                </div>
              </div>
            </div>
        </Modal>
        <ValidataModal
          onCancel={this.onCancelValidate}
          visible={validateVisible}
          onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}
PayMentModal.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(PayMentModal);
