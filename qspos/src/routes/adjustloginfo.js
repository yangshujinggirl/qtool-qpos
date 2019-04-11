import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/Qheader';
import { Link } from 'dva/router'
import Adjustloginfochil from '../constants/adjustLog/info';
import '../style/adjustLog.css';

class AdjustLoginfo extends React.Component{

   render(){

        return (
            <div>
                <Header type={false} color={true} linkRoute="adjustLog"/>
                <div className='counters'>
                    <div className="adjust-log">
                        <Adjustloginfochil query={this.props.location.query}/>
                    </div>
                </div>
            </div>
        )
   }
}


export default connect()(AdjustLoginfo);
