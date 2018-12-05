import React from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import AntIcon from '../components/loding/payloding';
import AdjustIndex from '../constants/adjust/index.js';

class Adjust extends React.Component {
    render() {
        return (
            <div className="common-pages-wrap">
              <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading} indicator={<AntIcon/>}>
                <AdjustIndex {...this.props}/>
              </Spin>
            </div>
        );
    }
}

function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}

export default connect(mapStateToProps)(Adjust);
