import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import {GetServerData} from '../../../../services/services';
import NP from 'number-precision'

import './index.less';

const Option = Select.Option;

class PayMentModal extends Component {
  onCancel=()=> {
    this.props.onCancel()
  }
  //切换支付方式
  goTogglePayType=(record)=> {
    let { checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    checkedPayTypeOne = {...checkedPayTypeOne,type:record.type };
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
  }
  handleTogglePayType=(option,type)=> {
    console.log(option,type)
  }
  //切换组合支付方式
  goToggleGroupPay=()=> {
    let { checkedPayTypeTwo } =this.props;
    if(checkedPayTypeTwo) {
      checkedPayTypeTwo =null;
    } else {
      checkedPayTypeTwo = '4'
    }
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{checkedPayTypeOne:'5',checkedPayTypeTwo}
    })
  }
  //抹零
  goCutAmount=()=>{
    const { payTotalData } =this.props;
    const diffamount=NP.minus(payTotalData.totolAmount, parseInt(payTotalData.payAmount))
    if(diffamount<=0) {
      return;
    }
    payTotalData.payAmount = parseInt(payTotalData.payAmount)
    payTotalData.cutAmount = '1';
    this.props.dispatch({
      type:'cashierManage/getTotalData',
      payload:payTotalData
    })
    this.props.form.setFieldsValue({ payAmount: payTotalData.payAmount })
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
    const { payTotalData, memberInfo, visible,
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
                      onChange:(value, option)=>this.handleTogglePayType(value,option,'checkedPayTypeOne')
                    })(
                      <Select>
                        {
                          payMentTypeOptionsOne.map((el)=> (
                            <Option value={el.type} key={el.type}>{el.name}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="field-col">
                    {getFieldDecorator('password')(
                      <Input autoComplete={'off'}/>
                    )}
                  </Form.Item>
                </div>
                <div className="group-pay-formItem">
                  <Form.Item label="支付方式2" className="label-col">
                    {getFieldDecorator('checkedPayTypeTwo',{
                      initialValue:checkedPayTypeTwo.type,
                      onChange:(value, option)=>this.handleTogglePayType(value,option,'checkedPayTypeTwo')
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
                    {getFieldDecorator('password')(
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
              <p className="error-validate">余额不足，请更换支付方式或组合支付</p>
              <div className="footer-row">
                <Button
                  onClick={this.handleSubmit}
                  className="go-settling-btn">
                    结算
                    <span className="space-code">「空格键</span>
                </Button>
                <Button
                  onClick={this.goToggleGroupPay}
                  className="go-group-btn"
                  type="primary"
                  disabled={memberInfo.mbCardId&&checkedPayTypeOne.type&&checkedPayTypeTwo.type?false:true}
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
