import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import ReturngoodsIndex from '../constants/returngoods/index';

class Returngoods extends React.Component {
    render() {
      return (
        <div className="common-pages-wrap">
          <Spin tip="加载中" spinning={this.props.spinLoad.loading}>
            <ReturngoodsIndex {...this.props}/>
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
