import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';
import './index.less';

const FormItem = Form.Item;

class PutedOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefault:true,
      remarkValue:this.props.memberInfo.mbCardId?(`会员姓名：${this.props.memberInfo.name}`):''
    }
    this.remarkInput=null;
  }
  componentWillReceiveProps(props) {
    this.setState({
      remarkValue:props.memberInfo.mbCardId?(`会员姓名：${props.memberInfo.name}`):''
    })
  }
  onOk(e) {
    this.props.onOk(this.state.remarkValue,this.onCancel);
  }
  changeEvent =(e)=> {
    let value = e.nativeEvent.target.value;
    this.setState({ remarkValue: value });
  }
  onCancel=()=> {
    this.remarkInput.value = '';
    this.props.onCancel()
  }
  changeFontStyle =(e)=> {
    const target = e.nativeEvent.target;
    if(target.value == target.placeholder) {
      this.setState({ isDefault: true })
    } else {
      this.setState({ isDefault: false })
    }
  }
  render() {
    const { visible,onCancel,currentOrderNo,payTotalData,loading } =this.props;
    let { remarkValue, isDefault } =this.state;
    return(
      <Modal
        title="挂单"
        closable
        onOk={this.onCancel}
        onCancel={this.onCancel}
        visible={visible}
        footer={
          <div className="handle-btn-list">
            <Button onClick={this.onCancel} >取消</Button>
            <Button type="primary" onClick={()=>this.onOk()} loading={loading}>确定</Button>
          </div>
        }
        width={454}
        className="entry-orders-modal">
        <div className="main-content-body">
          <div className="top-action">
            <div className="part-l">
              <div className="inner-con">
                <p className="label">数量</p>
              <p className="field">{payTotalData.totolNumber}</p>
              </div>
              <span className="icon">
                <span className="number">0{currentOrderNo}</span>
              </span>
            </div>
            <div className="part-r">
              <div className="inner-con">
                <p className="label">金额</p>
              <p className="field">{payTotalData.totolAmount}</p>
              </div>
            </div>
          </div>
          <div className="bottom-action">
            <span className="label">挂单备注：</span>
            <Input
              onFocus={this.changeFontStyle}
              onBlur={this.changeFontStyle}
              key={currentOrderNo}
              ref={(input) =>this.remarkInput = input}
              id="forbid-space"
              className={`${isDefault?'inputs':'valColor inputs'}`}
              type="text"
              maxLength={20}
              autoComplete='off'
              value={remarkValue}
              onChange={this.changeEvent}
              placeholder="可输入20字内挂单备注"/>
          </div>
        </div>
      </Modal>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage }=state;
    return cashierManage;
}
export default connect(mapStateToProps)(PutedOrderModal);
