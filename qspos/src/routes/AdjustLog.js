import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import { Link } from 'dva/router'
import AdjustLogIndex from '../constants/adjustLog/index';
import '../style/adjustLog.css';

class AdjustLog extends React.Component{
   render(){
        return (
            <div>
                <Header type={false} color={true}/>
                <div className='counters'>
                    <div className="adjust-log">
                        <AdjustLogIndex/>
                    </div>
                </div>
            </div>
        )
   }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(AdjustLog);
