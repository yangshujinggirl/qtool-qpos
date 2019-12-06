import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';

import NP from 'number-precision'

import './index.less';

const Option = Select.Option;

class PayMentModal extends Component {
  constructor(props) {
    super(props)
  }
  onCancel=()=> {
    this.props.dispatch({
      type:'cashierManage/resetPayModalData',
      payload:{}
    })
    this.props.onCancel();
    // this.props.form.setFieldsValue({
    //
    // })
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
  //组合支付切换支付方式
  handleTogglePayType=(option,type)=> {
    let { checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    if(type == 'checkedPayTypeOne') {
      if(option.key == '5'||option.key=='6') {
        checkedPayTypeOne.type = option.key;
        this.checkCardAndPoint();
      }
    } else {
      checkedPayTypeTwo.type = option.key;
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
        checkedPayTypeTwo.amount = NP.minus(payAmount, checkedPayTypeOne.amount);
         // checkedPayTypeTwo = { type:'1', amount: NP.minus(payAmount, checkedPayTypeOne.amount) };
        this.props.dispatch({
          type:'cashierManage/getCheckedPayType',
          payload:{ checkedPayTypeOne, checkedPayTypeTwo }
        })
        this.props.initLogic()
        // this.props.initLogic(checkedPayTypeTwo)
    }
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
    this.props.form.setFieldsValue({ payAmount: payAmount })
  }
  //计算组合支付，单体支付金额
  checkCardAndPoint() {
    let { memberInfo, payTotalData, payPart, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let payAmount = payTotalData.payAmount;
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
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
  }
  //处理结算逻辑
  handleSubmit=()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      let { goodsList, memberInfo, payTotalData,
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
              remark:values.remark
            },
            orderDetails:goodsList,orderPay
         };
         console.log(params)
      this.goPayApi(params);
    });
  }
  //结算Api
  goPayApi=(values)=>{
      GetServerData('qerp.web.qpos.od.order.save',values)
      .then((res) => {
        const { code, odOrderId, orderNo } =res;
        if(code=='0'){
          const orderAll  = res,odOrderIds= odOrderId,orderNos= orderNo
          const checkPrint = this.props.checkPrint;
          // this.handleOk()
          this.props.onCancel()
          message.success('收银成功',1)
          // printSaleOrder(checkPrint,odOrderIds)
        }else if(code == 'I_1031'){
          //是否校验弹框
          // this.props.setSpace(false);//非结算弹框时，不可空格结算;
          // this.setState({ validateVisible:true });
          // this.props.dispatch({
          //   type:'cashierManage/payvisible',
          //   payload:false
          // })
        } else {
          message.error(json.message)
        }
      })
  }
  render() {
    const { payTotalData, memberInfo, visible,payPart,
            payMentTypeOptionsOne, payMentTypeOptionsTwo,
            checkedPayTypeOne,checkedPayTypeTwo } =this.props;
    const { getFieldDecorator } =this.props.form;
    return(
        <Modal
          closable={false}
          onOk={this.onCancel}
          onCancel={this.onCancel}
          visible={visible}
          footer={null}
          width={865}
          className="settling-account-modal">
            <div className="main-content-body">
              <Form.Item label="应付金额">
                {getFieldDecorator('amount',{
                  initialValue:payTotalData.totolAmount
                })(
                  <Input autoComplete={'off'} disabled/>
                )}
              </Form.Item>
              {
                memberInfo.mbCardId&&
                <Form.Item label="会员信息">
                  {getFieldDecorator('memberInfo',{
                    initialValue:`${memberInfo.name}/${memberInfo.mobile}`
                  })(
                    <Input autoComplete={'off'} disabled/>
                  )}
                </Form.Item>
              }
              <Form.Item label="优惠券抵扣">
                {getFieldDecorator('password')(
                  <Input autoComplete={'off'} disabled/>
                )}
                <div className="btn-wrap">
                  <Button className="scanCode-btn" type="primary" ghost>扫码核销</Button>
                </div>
              </Form.Item>
              <Form.Item label="实付金额">
                {getFieldDecorator('payAmount',{
                  initialValue:payTotalData.payAmount
                })(
                  <Input autoComplete={'off'} disabled/>
                )}
                <div className="btn-wrap">
                  <Button
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
                      {getFieldDecorator('checkedPayTypeOne',{
                        initialValue:checkedPayTypeOne.type,
                        onChange:(value, option)=>this.handleTogglePayType(option,'checkedPayTypeOne')
                      })(
                        <Select>
                          {
                            payMentTypeOptionsOne.map((el)=> (
                              <Option  disabled={el.disabled} value={el.type} key={el.type}>{el.name}</Option>
                            ))
                          }
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item className="field-col">
                      {getFieldDecorator('amountOne',{
                        initialValue:checkedPayTypeOne.amount,
                      })(
                        <Input autoComplete={'off'}/>
                      )}
                    </Form.Item>
                  </div>
                  <div className="group-pay-formItem">
                    <Form.Item label="支付方式2" className="label-col">
                      {getFieldDecorator('checkedPayTypeTwo',{
                        initialValue:checkedPayTypeTwo.type,
                        onChange:(value, option)=>this.handleTogglePayType(option,'checkedPayTypeTwo')
                      })(
                        <Select>
                          {
                            payMentTypeOptionsTwo.map((el)=> (
                              <Option value={el.type} key={el.type}>{el.name}</Option>
                            ))
                          }
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item className="field-col">
                      {getFieldDecorator('amountTwo',{
                        initialValue:checkedPayTypeTwo.amount,
                      })(
                        <Input autoComplete={'off'} disabled/>
                      )}
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
                    {getFieldDecorator('cashier')(
                      <Input autoComplete={'off'}/>
                    )}
                  </Form.Item>
                  <Form.Item label="找零" className="field-item">
                    {getFieldDecorator('dispenser')(
                      <Input autoComplete={'off'} disabled/>
                    )}
                  </Form.Item>
                </div>
              }
              <Form.Item label="备注信息">
                {getFieldDecorator('remark')(
                  <Input autoComplete={'off'}  placeholder="可输入20字订单备注"/>
                )}
              </Form.Item>
              <div className="footer-part">
                {payPart.errorText&&<p className="error-validate">{payPart.errorText}</p>}
                <div className="footer-row">
                  <Button
                    type="primary"
                    disabled={payPart.errorText?true:false}
                    onClick={this.handleSubmit}
                    className="go-settling-btn">
                      结算
                      <span className="space-code">「空格键</span>
                  </Button>
                  <Button
                    onClick={this.goToggleGroupPay}
                    className="go-group-btn"
                    type="primary"
                    disabled={payPart.isGroupDisabled?false:true}
                    ghost={checkedPayTypeOne.type&&checkedPayTypeTwo.type?false:true}>组合支付</Button>

                </div>
                <div className='footer-row'>
                  <Checkbox>打印小票</Checkbox>
                </div>
              </div>
            </div>
        </Modal>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(PayMentModal);
