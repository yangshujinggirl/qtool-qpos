import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Header from '../components/Qheader';
// import ReturngoodsIndex from '../constants/returngoods/index';
import ReturnSales from '../constants/returnSales';

class Returngoods extends React.Component {
    render() {
      return (
        <div className="cashier-manage-pages">
          <Spin tip="加载中" spinning={this.props.spinLoad.loading}>
            <Header type={false} color={false}/>
            <ReturnSales {...this.props}/>
          </Spin>
        </div>
      )
    }
}

function mapStateToProps(state) {
    const { spinLoad } = state;
    return { spinLoad };
}

export default connect(mapStateToProps)(Returngoods);
