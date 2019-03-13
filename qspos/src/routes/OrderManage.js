import React , { Component } from 'react';
import { Spin} from 'antd';
import { connect } from 'dva';
import Header from '../components/header/Header';
import OrderManageIndex from '../constants/orderManage/index';

function OrderManage({ dispatch, spinLoad }) {
  return (
    <div className="ordere-manage-pages common-pages-wrap">
      <Spin tip='加载中，请稍后...'  spinning={spinLoad.loading}>
        <Header type={false} color={true}/>
        <div className="common-main-contents-wrap">
          <OrderManageIndex />
        </div>
      </Spin>
    </div>
  )
}

function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}

export default connect(mapStateToProps)(OrderManage);
