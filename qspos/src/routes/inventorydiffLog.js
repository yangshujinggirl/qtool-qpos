import React,{Component} from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Header from '../components/Qheader';
import { Link } from 'dva/router'
import InventorydiffLogIndex from '../constants/inventorydiffLog/index';
import '../style/adjustLog.css';

class InventorydiffLog extends React.Component{
   render(){
      return (
        <div className="common-pages-wrap">
          <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
            <Header type={false} color={true} linkRoute="inventory"/>
            <div className='counters'>
              <div className="adjust-log">
                <InventorydiffLogIndex {...this.props}/>
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

export default connect(mapStateToProps)(InventorydiffLog);
