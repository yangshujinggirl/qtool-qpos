import React,{Component} from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Header from '../components/header/Header';
import { Link } from 'dva/router'
import AdjustLogIndex from '../constants/adjustLog/index';
import '../style/adjustLog.css';

class AdjustLog extends React.Component{
   render(){
        return (
            // <div>
            //     <Header type={false} color={true} linkRoute="adjust"/>
            //     <div className='counters'>
            //         <div className="adjust-log">
            //             <AdjustLogIndex/>
            //         </div>
            //     </div>
            // </div>

            <div className="common-pages-wrap">
              <Spin tip="加载中" spinning={this.props.spinLoad.loading}>
                <Header type={false} color={true} linkRoute="adjust"/>
                <div className='counters'>
                  <div className="adjust-log">
                    <AdjustLogIndex {...this.props}/>
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

export default connect(mapStateToProps)(AdjustLog);
