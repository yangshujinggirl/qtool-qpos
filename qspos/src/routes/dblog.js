import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import { Link } from 'dva/router'
import DbLogIndexs from '../constants/gooddb/dblog/index';
import '../style/adjustLog.css';

class DbLogIndex extends React.Component{
   render(){
        return (
            <div>
                <Header type={false} color={true} linkRoute="gooddb"/>
                <div className='counters'>
                    <div className="adjust-log">
                        <DbLogIndexs/>
                    </div>
                </div>
            </div>
        )
   }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(DbLogIndex);
