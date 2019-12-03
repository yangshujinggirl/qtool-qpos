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
    return(
      <div className="cashier-mainContent-wrap">
        <div className="top-part">
          <GoodsTable form={this.props.form}/>
        </div>
        <div className="middle-part">
          <BtnsAction form={this.props.form}/>
        </div>
        <div className="bottom-part">
          <BottomPayMent form={this.props.form}/>
        </div>
      </div>
    )
  }
}
const CashierManageF = Form.create({
  // onValuesChange(props, changedFields, allFields) {
  //   let currentKey = Object.keys(changedFields)[0];
  //   if(currentKey == 'orderDetails') {
  //     let { goodsList } =props;
  //     let { orderDetails } =allFields;
  //     goodsList = goodsList.map((el,index) =>{
  //       orderDetails.map((item,idx) => {
  //         if(index == idx) {
  //           el = {...el,...item}
  //         }
  //       })
  //       return el;
  //     })
  //     props.dispatch({
  //       type:'cashierManage/getGoodsList',
  //       payload:goodsList
  //     })
  //   }
  // }
})(CashierManage);

function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}

export default connect(mapStateToProps)(CashierManageF);
