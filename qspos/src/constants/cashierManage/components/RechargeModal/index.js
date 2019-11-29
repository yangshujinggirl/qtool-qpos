import React, { Component } from 'react';
import { Modal,Button } from 'antd';

class RechargeModal extends Component {
  handleOk=()=> {

  }
  handleCancel=()=> {

  }
  render() {
    const { visible } =this.props;
    return(
      <Modal
        visible={visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        footer={null}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <Button>结算</Button>
      </Modal>
    )
  }
}
export default RechargeModal;
