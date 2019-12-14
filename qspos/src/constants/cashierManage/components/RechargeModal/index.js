import React, { Component } from 'react';
import { connect } from 'dva';
import NP from 'number-precision'
import { message, Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import ValidataModal from '../ValidataModal';

import './index.less';

const Option = Select.Option;

class RechargeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remark:'',
    }
  }
  onCancel=()=> {
    this.props.dispatch({
      type:'cashierManage/resetPayModalData',
      payload:{}
    })
    this.props.onCancel();
  }
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
    checkedPayTypeOne.amount = fomatNumTofixedTwo(checkedPayTypeOne.amount)
    checkedPayTypeTwo.amount = checkedPayTypeTwo.type&&fomatNumTofixedTwo(checkedPayTypeTwo.amount)
    this.props.dispatch({
      type:'cashierManage/getCheckedPayType',
      payload:{ checkedPayTypeOne, checkedPayTypeTwo }
    })
  }
  //处理结算逻辑
  handleSubmit=()=>{
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
    this.goPayApi(params);
  }
  //结算Api
  goPayApi=(values)=>{
      GetServerData('qerp.web.qpos.od.order.save',values)
      .then((res) => {
        const { code, odOrderId, orderNo } =res;
        if(code=='0'){
          const orderAll  = res,odOrderIds= odOrderId,orderNos= orderNo
          const checkPrint = this.props.checkPrint;
          this.props.onCancel()
          message.success('收银成功',1)
          // printSaleOrder(checkPrint,odOrderIds)
        }else if(code == 'I_1031'){
          this.setState({ validateVisible:true });
          this.props.dispatch({
            type:'cashierManage/getPayMentVisible',
            payload:false
          })
        } else {
          message.error(res.message)
        }
      })
  }
  render() {
    const { payTotalData, memberInfo, visible,checkedPayTypeOne,rechargePayType,
            rechargeOptions } =this.props;
    const { validateVisible, cashRealVal, disVal } =this.state;
    console.log(this.props)
    return(
        <Modal
          closable={false}
          onOk={this.onCancel}
          onCancel={this.onCancel}
          visible={visible}
          footer={null}
          width={865}
          destroyOnClose={true}
          className="settling-account-modal">
            <div className="main-content-body">
              <Form.Item label="会员信息">
                <Input autoComplete={'off'} disabled defaultValue={`${memberInfo.name}/${memberInfo.mobile}`}/>
              </Form.Item>
              <Form.Item label="账户金额">
                <Input autoComplete={'off'} disabled readOnly value={payTotalData.payAmount}/>
              </Form.Item>
              <Form.Item label="充值金额">
                <Input autoComplete={'off'}  value={payTotalData.payAmount}/>
              </Form.Item>
              <p className="separate-line"></p>
              <div className="row-item">
                <label className="item-l">支付方式</label>
                <div className="item-r">
                  {
                    rechargeOptions.map((el)=> (
                      <Button
                        onClick={()=>this.goTogglePayType(el)}
                        key={el.type}
                        disabled={el.disabled}
                        className={`payType-btn ${el.type ==rechargePayType?'selected':''}`}>
                        {el.name}
                      </Button>
                    ))
                  }
                </div>
              </div>
              <Form.Item label="备注信息">
                <Input autoComplete={'off'}  placeholder="可输入20字订单备注" onChange={this.onChangeRemark}/>
              </Form.Item>
              <div className="footer-part">
                <div className="footer-row">
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    className="go-settling-btn">
                      结算
                      <span className="space-code">「空格键</span>
                  </Button>
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
RechargeModal.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(RechargeModal);
