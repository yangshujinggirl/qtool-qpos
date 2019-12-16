import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { Form } from 'antd';
import GoodsTable from './components/GoodsTable';
import BottomPayMent from './components/BottomPayMent';
import './index.less';

class CashierManage extends Component {
  componentDidMount() {
    this.props.dispatch({
      type:'returnSales/resetData',
      payload:{}
    })
  }
  render(){
    const { orderTotalData } =this.props;
    return(
      <div className="cashier-mainContent-wrap returnSales-mainContent-wrap">
        <div className="top-part">
          <GoodsTable form={this.props.form}/>
        </div>
        <div className="middle-part">
          {
            orderTotalData.amount&&
            <div className="handle-rt">
              <label className="mon-item">实付金额：{orderTotalData.payAmount}</label>
              <label className="mon-item">已退金额：{orderTotalData.returnAmount}</label>
              <label className="mon-item">可退金额：<label className="highCol">{orderTotalData.canReturnAmount}</label></label>
            </div>
          }
        </div>
        <div className="bottom-part">
          <BottomPayMent form={this.props.form}/>
        </div>
      </div>
    )
  }
}
const CashierManageF = Form.create()(CashierManage);

function mapStateToProps(state) {
    const { returnSales } = state;
    return returnSales;
}

export default connect(mapStateToProps)(CashierManageF);
