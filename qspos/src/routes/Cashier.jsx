import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Header from '../components/Qheader';
// import Cashierindex from '../constants/cashier/index';
import CashierManage from '../constants/cashierManage';
import './common.less';

function Cashier ({ dispatch, spinLoad }) {
    return(
      <div className="cashier-manage-pages">
        <Spin tip='加载中，请稍后...'  spinning={spinLoad.loading}>
          <Header type={true} color={true}/>
          <CashierManage />
        </Spin>
      </div>
    )
}
function mapStateToProps(state) {
    const { spinLoad } = state;
    return { spinLoad };
}
export default connect(mapStateToProps)(Cashier);
