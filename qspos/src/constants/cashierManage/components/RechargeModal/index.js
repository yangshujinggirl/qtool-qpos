import React, { Component } from 'react';
import { connect } from 'dva';
import NP from 'number-precision'
import { message, Modal, Form, Input, Button, Checkbox,Select } from 'antd';
import { fomatNumTofixedTwo } from '../../../../utils/CommonUtils';
import {GetServerData} from '../../../../services/services';
import {printRechargeOrder} from '../../../../components/Method/Method'
import ValidataModal from '../ValidataModal';


const Option = Select.Option;

class RechargeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remark:'',
      amount:'',
      rechargeType:'1',
      rechargeLoading:false,
      rechargeOptions:[
        {name:'微信',checked:false,disabled:false,type:'1'},
        {name:'支付宝',checked:false,disabled:false,type:'2'},
        {name:'银联',checked:false,disabled:false,type:'3'},
        {name:'现金',checked:false,disabled:false,type:'4'},
      ]
    }
  }
  onCancel=()=> {
    this.setState({
      remark:'',
      amount:'',
      rechargeType:'1',
    })
    this.props.onCancel();
  }
  onChangeRemark=(e)=> {
    this.setState({ remark: e.target.value });
  }
  onChangeRecharge=(e)=> {
    let value = e.target.value;
    let regexp=/^\d*((\.)|(\.\d{1,2}))?$/;
    if(regexp.test(value)) {
      this.setState({ amount: e.target.value });
    }
  }
  //切换支付方式
  goTogglePayType=(record)=> {
    this.setState({ rechargeType:record.type })
  }
  //处理结算逻辑
  handleSubmit=()=>{
    const { memberInfo, rechargePayType } =this.props;
    const { amount, rechargeType, remark } =this.state;
    this.setState({ rechargeLoading:true })
    GetServerData('qerp.pos.mb.card.charge',{
      mbCardId:memberInfo.mbCardId,
      amount:amount,
      type:rechargeType,
      remark:remark
    })
    .then((res) => {
      const { code, mbCardMoneyChargeId } =res;
      if(code=='0'){
        const { isPrint } = this.props;
        this.setState({ remark:'', amount:'',rechargeType:'1'});
        message.success('充值成功',1);
        this.setState({ rechargeLoading:false })
        this.props.dispatch({
          type:'cashierManage/fetchMemberInfo',
          payload:{cardNoMobile:memberInfo.mobile}
        })
        printRechargeOrder(isPrint,mbCardMoneyChargeId);
        this.props.onCancel();
      } else {
        message.error(res.message)
      }
    })
  }
  onChangePrint=(e)=> {
    let value = e.target.checked;
    this.props.dispatch({
      type:'cashierManage/getIsPrint',
      payload:value
    })
  }
  render() {
    const { payTotalData, memberInfo, visible, isPrint } =this.props;
    const { rechargeOptions, rechargeType, amount, rechargeLoading } =this.state;
    return(
        <Modal
          closable={false}
          onOk={this.onCancel}
          onCancel={this.onCancel}
          visible={visible}
          footer={null}
          width={716}
          destroyOnClose={true}
          className="settling-account-modal">
            <div className="main-content-body">
              <Form.Item label="会员信息">
                <Input autoComplete={'off'} disabled defaultValue={`${memberInfo.name}/${memberInfo.mobile}`}/>
              </Form.Item>
              <Form.Item label="账户余额">
                <Input autoComplete={'off'} disabled readOnly value={memberInfo.amount}/>
              </Form.Item>
              <Form.Item label="充值金额">
                <Input autoComplete={'off'} value={amount} onChange={this.onChangeRecharge}/>
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
                        className={`payType-btn ${el.type ==rechargeType?'selected':''}`}>
                        {el.name}
                      </Button>
                    ))
                  }
                </div>
              </div>
              <Form.Item label="备注信息">
                <Input
                  autoComplete={'off'}
                  placeholder="可输入20字订单备注"
                  onChange={this.onChangeRemark} maxLength={20}/>
              </Form.Item>
              <div className="footer-part">
                <div className="footer-row">
                  <Button
                    loading={rechargeLoading}
                    disabled={amount?false:true}
                    type="primary"
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
