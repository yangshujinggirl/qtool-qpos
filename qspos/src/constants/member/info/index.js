import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router'
import Header from '../../../components/header/Header';
import Buttonico from '../../../components/Button/Button';
import Searchinput from '../../../components/Searchinput/Searchinput';
import {Messagesuccess} from '../../../components/Method/Method';
import {GetServerData} from '../../../services/services';
import {Gettime} from '../../../services/data';

import EditableTable from './table';
import Cardlist from './card';


class Memberinfoindex extends React.Component{
    pagefresh=(currentPage,pagesize)=>{
        const pagefreshs=this.refs.search.pagefresh
        pagefreshs(currentPage,pagesize)
    }

    //初始化页码方法
    initPageCurrent = (current) =>{
        this.refs.memberTable.initPageCurrent(current);
    }

   render(){
      return (
        <div>
            <Header type={false} color={true}/>
            <div className='counters goods-countersme'>
                <div className='mbindocardbox'><Cardlist cardlist={this.props.cardInfolist}/></div>
                <EditableTable mbCards={this.props.mbCards} 
                                dispatch={this.props.dispatch} 
                                loding={this.props.loding} 
                                total={this.props.total} 
                                pagefresh={this.pagefresh.bind(this)}
                                current={this.props.current}
                                ref='memberTable'/>
              
            </div>
        </div>
     )
   }
}

function mapStateToProps(state) {
    const {cardInfolist} = state.memberinfo;
    return {cardInfolist};
}

export default connect(mapStateToProps)(Memberinfoindex);
