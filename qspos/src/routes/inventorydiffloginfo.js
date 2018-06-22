import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import { Link } from 'dva/router'
import Inventoryloginfos from '../constants/inventorydiffLog/info';
import '../style/adjustLog.css';

class Inventoryloginfo extends React.Component{

   render(){

        return (
            <div>
                <Header type={false} color={true} linkRoute="inventorydiffLog"/>
                <div className='counters'>
                    <div className="adjust-log">
                        <Inventoryloginfos query={this.props.location.query}/>
                    </div>
                </div>
            </div>
        )
   }
}


export default connect()(Inventoryloginfo);
