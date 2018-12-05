import React,{Component} from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import MemberIndex from '../constants/member';

class Member extends React.Component {
  render() {
    return(
      <div className="common-pages-wrap">
        <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
          <MemberIndex {...this.props}/>
        </Spin>
      </div>
    )
  }
}
function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}
export default connect(mapStateToProps)(Member)
