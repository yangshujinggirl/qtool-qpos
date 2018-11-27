import React, { Component } from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';
import './PutedOrderListModal.less';

const FormItem = Form.Item;

class PutedOrderListModal extends React.Component {
  render() {
    const { visible, onCancel, data } =this.props;
    return(
      <Modal
        title="取单"
        closable
        onOk={onCancel}
        onCancel={onCancel}
        visible={visible}
        footer={null}
        width={818}
        className="puted-order-list-modal">
        <div className="main-content-body">
          <p className="con-title">点击要选择的订单</p>
          <ul className="card-list">
            {
              data.map((el,index) => (
                <li className="card-item" key={index} onClick={()=>this.props.getOrder(el.putNo)}>
                  <div className="top-action">
                    <div className="part-l">
                      <div className="inner-con">
                        <p className="label">数量</p>
                        <p className="field">{el.putAmount}</p>
                      </div>
                      <span className="icon">
                        <span className="number">0{el.putNo}</span>
                      </span>
                    </div>
                    <div className="part-r">
                      <div className="inner-con">
                        <p className="label">金额</p>
                        <p className="field">{el.putPrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bottom-action">
                    {el.putMessage}
                  </div>
                  <span className="put-time">挂单时间：{moment(el.putTime).format('h:mm')}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </Modal>
    )
  }
}

export default PutedOrderListModal;
