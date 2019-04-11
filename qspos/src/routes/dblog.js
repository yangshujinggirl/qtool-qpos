import React,{Component} from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Header from '../components/Qheader';
import { Link } from 'dva/router'
import DbLogIndexs from '../constants/gooddb/dblog/index';
import '../style/adjustLog.css';

class DbLogIndex extends React.Component{
   render(){
      return (
        <div className="common-pages-wrap">
          <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
            <Header type={false} color={true} linkRoute="gooddb"/>
            <div className='counters'>
              <div className="adjust-log">
                <DbLogIndexs {...this.props}/>
              </div>
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
export default connect(mapStateToProps)(DbLogIndex);
