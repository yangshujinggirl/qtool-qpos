import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Header from '../../../components/Qheader';
import GoodsDetailIndex from './components/GoodsDetail/index';

class GoodsDetail extends Component {
  render() {
    return(
      <div className="common-pages-wrap">
        <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
          <Header type={false} color={true} linkRoute="dataManage"/>
          <div className="common-main-contents-wrap">
            <GoodsDetailIndex {...this.props}/>
          </div>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}
export default connect(mapStateToProps)(GoodsDetail)
