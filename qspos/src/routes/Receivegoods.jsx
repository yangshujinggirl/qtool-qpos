import React from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Receivegoodsindex from '../constants/receivegoods/index';

class Receivegoods extends React.Component {
  render(){
    return(
        <div className="common-pages-wrap">
          <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
            <Receivegoodsindex {...this.props}/>
          </Spin>
        </div>
    )
  }
}
function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}
export default connect(mapStateToProps)(Receivegoods)
