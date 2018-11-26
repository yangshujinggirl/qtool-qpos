import React from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import MemberBirthIndex from '../constants/memberBirth';

class MemberBirth extends React.Component {
  render() {
    return (
      <div className="common-pages-wrap">
        <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
          <MemberBirthIndex {...this.props}/>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}
export default connect(mapStateToProps)(MemberBirth)
