import React, { Component } from 'react';
import { connect } from 'dva';
import NP from 'number-precision'
import { message, Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import {printReturnOrder} from '../../../../components/Method/Method'

import './index.less';

const Option = Select.Option;

class PayMentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remark:'',
      cashRealVal:'',
      disVal:''
    }
  }
  onCancel=()=> {
    this.props.dispatch({
      type:'returnSales/resetPayModalData',
      payload:{}
    })
    this.props.onCancel();
  }
  onChangeRemark=(e)=> {
    this.setState({ remark: e.target.value });
  }
  //切换支付方式
  goTogglePayType=(record)=> {
    let { checkedPayTypeOne } =this.props;
    checkedPayTypeOne.type = record.type
    this.props.dispatch({
      type:'returnSales/getCheckedPayType',
      payload:checkedPayTypeOne
    })
  }
  //抹零
  goCutAmount=()=>{
    let { payTotalData, checkedPayTypeOne } =this.props;
    const diffamount=NP.minus(payTotalData.totolAmount, parseInt(payTotalData.payAmount))
    if(diffamount<=0) {
      return;
    }
    let payAmount = parseInt(payTotalData.payAmount);
    payAmount = fomatNumTofixedTwo(payAmount);
    payTotalData.payAmount = payAmount;
    payTotalData.cutAmount = '1';
    checkedPayTypeOne.amount = payAmount;
    checkedPayTypeOne.amount = fomatNumTofixedTwo(checkedPayTypeOne.amount)
    this.props.dispatch({
      type:'returnSales/getCheckedPayType',
      payload:checkedPayTypeOne
    })
    this.props.dispatch({
      type:'returnSales/getTotalData',
      payload:payTotalData
    })
  }
  //处理结算逻辑
  handleSubmit=()=>{
    let { goodsList, memberInfo, payTotalData,orderTotalData, checkedPayTypeOne } =this.props;
    let odReturnDetails = goodsList.filter((el) => el.checked)
    let params={
          qposMbCard:{ mbCardId:memberInfo.mbCardId?memberInfo.mbCardId:null },
          odReturn:{
            amount:payTotalData.totolAmount,
            refundAmount:payTotalData.payAmount,
            orderNo:orderTotalData.orderNo,
            qty:payTotalData.totolNumber,
            skuQty:goodsList.length,
            cutAmount:payTotalData.cutAmount,
            remark:this.state.remark,
            type:checkedPayTypeOne.type,
            returnPoint:payTotalData.returnPoint
          },
          odReturnDetails,
       };
    GetServerData('qerp.web.qpos.od.return.save',params)
    .then((res) => {
     const { code, odReturnId } =res;
     if(code=='0'){
       const { isPrint } = this.props;
       message.success('退款成功',1)
       printReturnOrder(isPrint,odReturnId)
       this.props.onCancel();
       //页面跳转
      this.context.router.push('/cashier')
     }else {
       message.error(res.message)
     }
    })
  }
  //支付方式1
  onChangePayOne=(e)=> {
    let { payTotalData, checkedPayTypeOne, checkedPayTypeTwo } =this.props;
    let value = e.target.value;
    let regExp=/^\d*((\.)|(\.\d{1,2}))?$/
    if(regExp.test(value)) {
      checkedPayTypeOne.amount = value;
      this.props.dispatch({
        type:'returnSales/getCheckedPayType',
        payload:checkedPayTypeOne
      })
    }
  }
  //现金实收
  onChangeCashReal=(e)=> {
    let value = e.target.value;
    this.setState({ cashRealVal:value })
  }
  onBlurCashReal=()=> {
    let { payTotalData, checkedPayTypeOne } =this.props;
    let { cashRealVal,disVal } =this.state;
    disVal= NP.minus(cashRealVal,payTotalData.payAmount);
    if(Number(cashRealVal)< Number(payTotalData.payAmount)) {
      message.error('金额有误');
      return;
    }
    this.setState({ disVal })
  }
  onChangePrint=(e)=> {
    let value = e.target.checked;
    this.props.dispatch({
      type:'returnSales/getIsPrint',
      payload:value
    })
  }
  render() {
    const { payTotalData, isPrint, visible, memberInfo, baseOptions,checkedPayTypeOne } =this.props;
    const { cashRealVal, disVal } =this.state;

    return(
      <div>
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
              {
                memberInfo.mbCardId&&
                <Form.Item label="会员信息">
                  <Input autoComplete={'off'} disabled defaultValue={`${memberInfo.name}/${memberInfo.mobile}`}/>
                </Form.Item>
              }
              <Form.Item label="退款金额">
                <Input autoComplete={'off'} disabled readOnly value={payTotalData.payAmount}/>
                <div className="btn-wrap">
                  <Button
                    className="scanCode-btn"
                    type="primary"
                    disabled={payTotalData.cutAmount=='1'?true:false}
                    onClick={this.goCutAmount}>抹零</Button>
                </div>
              </Form.Item>
              <p className="separate-line"></p>
              <div className="row-item">
                <label className="item-l">支付方式</label>
                <div className="item-r">
                  {
                    baseOptions.map((el)=> (
                      <Button
                        onClick={()=>this.goTogglePayType(el)}
                        key={el.type}
                        disabled={el.disabled}
                        className={`payType-btn ${el.type ==checkedPayTypeOne.type?'selected':''}`}>
                        {el.name}
                      </Button>
                    ))
                  }
                </div>
              </div>
              {
                checkedPayTypeOne.type=='4'&&
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
                <Input autoComplete={'off'}  placeholder="可输入20字订单备注" onChange={this.onChangeRemark}/>
              </Form.Item>
              <div className="footer-part">
                {/*payPart.errorText&&<p className="error-validate">{payPart.errorText}</p>*/}
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
                  <Checkbox checked={isPrint} onChange={this.onChangePrint}>打印小票</Checkbox>
                </div>
              </div>
            </div>
        </Modal>
      </div>

    )
  }
}
PayMentModal.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const { returnSales } = state;
    return returnSales;
}
export default connect(mapStateToProps)(PayMentModal);
