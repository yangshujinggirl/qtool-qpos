import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/Qheader';
import { Link } from 'dva/router'
import Dbloginfos from '../constants/gooddb/dblog/info';
import '../style/adjustLog.css';

class Dbloginfo extends React.Component{
   render(){
        return (
            <div>
                <Header type={false} color={true} linkRoute="dblog"/>
                <div className='counters'>
                    <div className="adjust-log">
                        <Dbloginfos/>
                    </div>
                </div>
            </div>
        )
   }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Dbloginfo);
