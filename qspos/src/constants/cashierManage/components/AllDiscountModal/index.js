import React, { Component } from 'react';
import { Modal, Input, Form } from 'antd';
import './index.less';

const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 12
      },
    };

class  AllDiscountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disVal:''
    }
  }
  onChange=(e)=> {
    var regex = /^\d*((\.)|(\.\d{1}))?$/
    let value = e.target.value;
    if(regex.test(value)) {
      this.setState({ disVal:value })
    }
  }
  onBlur=(e)=> {
    let value = e.target.value;
    var dis=value
    let role=sessionStorage.getItem('role');
    const { goodsList, maxDiscount, minDiscount } =this.props;
    switch(role) {
      case '1':
      case '2':
      // if(dis<=8) {
      //   dis = 8;
      // }
      if(dis<=maxDiscount) {
        dis = maxDiscount;
      }
      break;
    case '3':
      if(dis<=minDiscount) {
        dis = minDiscount;
      }
      break;
    }
    this.setState({ disVal:dis })
  }
  handleOk=()=> {
    let { disVal } =this.state;
    const { goodsList, maxDiscount, minDiscount } =this.props;
    let role=sessionStorage.getItem('role');
    switch(role) {
      case '1':
      case '2':
      // if(disVal<=8) {
      //   disVal = 8;
      // }
      if(disVal<=maxDiscount) {
        disVal = maxDiscount;
      }
      break;
    case '3':
      if(disVal<=minDiscount) {
        disVal = minDiscount;
      }
      break;
    }

    goodsList.map((el)=> {
      if(el.isShowActivity!="1"||el.activityId=='0') {
        el.discount = disVal;
      }
    })
    this.props.dispatch({
      type:'cashierManage/getGoodsList',
      payload:goodsList
    })
    this.onCancel()
  }
  onCancel=()=> {
    this.setState({ disVal:'' })
    this.props.onCancel()
  }
  render() {
    const { disVal } =this.state;
    return(
      <Modal
        className="allDiscount-modal-wrap"
        title="整单折扣"
        visible={this.props.visible}
        width={420}
        onOk={this.handleOk}
        onCancel={this.onCancel}>
          <p className="tips-title">整单折扣仅对非活动商品生效</p>
          <Form.Item label="请输入折扣数" {...formItemLayout}>
            <Input
              placeholder="请输入折扣数"
              autoComplete="off"
              value={disVal}
              onChange={this.onChange}
              onBlur={this.onBlur}/>
          </Form.Item>
      </Modal>
    )
  }
}
export default AllDiscountModal
