import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';
import './EntryOrdersModal.less';

const FormItem = Form.Item;

class EntryOrdersModal extends React.Component {
  constructor(props) {
    super(props)
  }
  onOk(e) {
    let value = e.nativeEvent.target.value;
    if(e.keyCode==13){
      this.props.onOk(value,this.onCancel);
    } else {
      e.preventDefault()
    }
  }
  onCancel=()=> {
    const remarkInput = ReactDOM.findDOMNode(this.refs.remarkInput);
    remarkInput.value = '';
    this.props.onCancel()
  }
  render() {
    const { visible, onCancel, currentOrderNo, totolnumber, totolamount } =this.props;
    return(
      <Modal
        title="挂单"
        closable
        onOk={this.onCancel}
        onCancel={this.onCancel}
        visible={visible}
        footer={null}
        width={454}
        className="entry-orders-modal">
        <div className="main-content-body">
          <div className="top-action">
            <div className="part-l">
              <div className="inner-con">
                <p className="label">数量</p>
                <p className="field">{totolnumber}</p>
              </div>
              <span className="icon">
                <span className="number">0{currentOrderNo}</span>
              </span>
            </div>
            <div className="part-r">
              <div className="inner-con">
                <p className="label">金额</p>
                <p className="field">{totolamount}</p>
              </div>
            </div>
          </div>
          <div className="bottom-action">
            <span className="label">挂单备注：</span>
            <Input
              ref="remarkInput"
              id="forbid-space"
              className="inputs"
              type="text"
              maxLength={20}
              autoComplete='off'
              placeholder="可输入20字内挂单备注" onKeyUp={(e)=>this.onOk(e)}/>
          </div>
        </div>
      </Modal>
    )
  }
}
function mapStateToProps(state) {
    const {
            datasouce,
            totolnumber,
            totolamount,
          }=state.cashier
    return {
            datasouce,
            totolnumber,
            totolamount,
          };
}
export default connect(mapStateToProps)(EntryOrdersModal);
