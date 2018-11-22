import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Cashierindex from '../constants/cashier/index';
import './common.less';

class Cashier extends React.Component {
    render() {
        return(
          <div className="common-pages-wrap">
            <Spin tip="加载中" spinning={this.props.spinLoad.loading}>
              <Cashierindex {...this.props}/>
            </Spin>
          </div>
        )
    }
}
function mapStateToProps(state) {
    const { spinLoad } = state;
    return { spinLoad };
}
export default connect(mapStateToProps)(Cashier);
