import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Checkbox,Select } from 'antd';

import './index.less';

const Option = Select.Option;

class PayMentModal extends Component {
  onCancel=()=> {

  }
  //切换支付方式
  goTogglePayType=(value)=> {
    console.log(value)
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
  goCutAmount=()=>{

  }
  render() {
    const { visible, payMentTypeOptionsOne, payMentTypeOptionsTwo, checkedPayTypeOne,checkedPayTypeTwo } =this.props;
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
                initialValue:'1234'
              })(
                <Input autoComplete={'off'} disabled/>
              )}
            </Form.Item>
            <Form.Item label="会员信息">
              {getFieldDecorator('password')(
                <Input autoComplete={'off'} disabled/>
              )}
            </Form.Item>
            <Form.Item label="优惠券抵扣">
              {getFieldDecorator('password')(
                <Input autoComplete={'off'} disabled/>
              )}
              <div className="btn-wrap">
                <Button className="scanCode-btn" type="primary" ghost>扫码核销</Button>
              </div>
            </Form.Item>
            <Form.Item label="实付金额">
              {getFieldDecorator('payAmount')(
                <Input autoComplete={'off'} disabled/>
              )}
              <div className="btn-wrap">
                <Button className="scanCode-btn" type="primary" onClick={this.goCutAmount}>抹零</Button>
              </div>
            </Form.Item>
            <p className="separate-line"></p>

            {
              checkedPayTypeTwo?
              <div>
                <div className="group-pay-formItem">
                  <Form.Item label="支付方式1" className="label-col">
                    {getFieldDecorator('checkedPayTypeOne',{
                      initialValue:checkedPayTypeOne,
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
                      initialValue:checkedPayTypeTwo,
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
                        className={`payType-btn ${el.type ==checkedPayTypeOne?'selected':''}`}>
                        {el.name}
                        {el.type=='5'&&<span className="desc-tips">余额 20000.00</span>}
                        {el.type=='6'&&<span className="desc-tips">可抵 20000.00元</span>}
                      </Button>
                    ))
                  }
                </div>
              </div>
            }
            {
              (checkedPayTypeOne=='4'||checkedPayTypeTwo=='4')&&
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
                <Button className="go-settling-btn">结算<span className="space-code">「空格键</span></Button>
                <Button
                  onClick={this.goToggleGroupPay}
                  className="go-group-btn" type="primary" ghost>组合支付</Button>
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
