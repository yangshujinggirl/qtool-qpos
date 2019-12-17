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
      disVal:'0.00',
      loading:false,
      errorText:null
    }
  }
  onCancel=()=> {
    this.props.dispatch({
      type:'returnSales/resetPayModalData',
      payload:{}
    })
    this.setState({ cashRealVal:'', disVal:'0.00' });
    this.props.onCancel();
  }
  onChangeRemark=(e)=> {
    this.setState({ remark: e.target.value });
  }
  //切换支付方式
  goTogglePayType=(record)=> {
    let { checkedPayTypeOne } =this.props;
    let { errorText, cashRealVal } =this.state;
    checkedPayTypeOne.type = record.type;
    if(checkedPayTypeOne.type == '4'&& cashRealVal == '') {
      errorText = '请输入现金金额';
    } else {
      errorText = null;
    }
    this.setState({ errorText });
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
    this.upDateCashVal()
  }
  //现金支付时 更新val；
  upDateCashVal=()=> {
    const { checkedPayTypeOne } =this.props;
    let { cashRealVal, disVal } =this.state;
    if(checkedPayTypeOne.type == '4'&& cashRealVal!='') {
      disVal = NP.minus(cashRealVal, checkedPayTypeOne.amount);
      disVal = fomatNumTofixedTwo(disVal)
    }
    this.setState({ disVal })
  }
  //处理结算逻辑
  handleSubmit=()=>{
    let { goodsList, memberInfo, payTotalData,orderTotalData, checkedPayTypeOne } =this.props;
    let odReturnDetails = goodsList.filter((el) => el.checked)
    let params={
          qposMbCard:{ mbCardId:memberInfo.mbCardId?memberInfo.mbCardId:null },
          odReturn:{
            amount:payTotalData.payAmount,
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
    this.setState({ loading:true });
    GetServerData('qerp.web.qpos.od.return.save',params)
    .then((res) => {
      const { code, odReturnId } =res;
      this.setState({ loading:false });
      if(code=='0'){
        const { isPrint } = this.props;
        message.success('退货成功',.5)
        printReturnOrder(isPrint,odReturnId)
        this.props.onCancel();
        //页面跳转
        this.context.router.push('/cashier')
      }else {
        message.error(res.message,.5)
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
    let regexp=/^\d*((\.)|(\.\d{1,2}))?$/;
    if(regexp.test(value)) {
      this.setState({ cashRealVal: value, errorText:null});
    }
  }
  onBlurCashReal=()=> {
    let { payTotalData, checkedPayTypeOne } =this.props;
    let { cashRealVal,disVal, errorText } =this.state;
    disVal= NP.minus(cashRealVal,payTotalData.payAmount);
    errorText =null;
    if(Number(cashRealVal)< Number(payTotalData.payAmount)) {
      disVal= '0.00'
      errorText = '金额有误'
    }
    this.setState({ disVal, errorText})
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
    const { cashRealVal, disVal, loading, errorText } =this.state;

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
          className="settling-account-modal returnSales-account-modal">
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
                    ghost
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
                        {el.type=='5'&&<span className="desc-tips">余额 {memberInfo.amount}</span>}
                      </Button>
                    ))
                  }
                </div>
              </div>
              {
                checkedPayTypeOne.type=='4'&&
                <div className="more-formItem">
                  <Form.Item label="现金实退" className="label-item">
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
                {errorText&&<p className="error-validate">{errorText}</p>}
                <div className="footer-row">
                  <Button
                    loading={loading}
                    type="primary"
                    disabled={errorText?true:false}
                    onClick={this.handleSubmit}
                    className="go-settling-btn">
                      结算
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
