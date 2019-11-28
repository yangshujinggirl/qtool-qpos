import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { Form } from 'antd';
import GoodsTable from './components/GoodsTable';
import BottomPayMent from './components/BottomPayMent';
import BtnsAction from './components/BtnsAction';
import './index.less';

class CashierManage extends Component {
  render(){
    console.log(this.props)
    return(
      <div className="cashier-mainContent-wrap">
        <div className="top-part">
          <GoodsTable form={this.props.form}/>
        </div>
        <div className="middle-part">
          <BtnsAction />
        </div>
        <div className="bottom-part">
          <BottomPayMent form={this.props.form}/>
        </div>
      </div>
    )
  }
}
const CashierManageF = Form.create({ name: 'register' })(CashierManage);

function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}

export default connect(mapStateToProps)(CashierManageF);
