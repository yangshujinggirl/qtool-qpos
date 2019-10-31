import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router'
import Header from '../../../components/Qheader';
import Buttonico from '../../../components/Button/Button';
import Searchinput from '../../../components/Searchinput/Searchinput';
import {Messagesuccess} from '../../../components/Method/Method';
import {GetServerData} from '../../../services/services';
import {Gettime} from '../../../services/data';
import EditableTable from './table';
import Cardlist from './card';


class Memberinfoindex extends React.Component{
  componentDidMount(){
    const { query } =this.props.location;
    this.props.dispatch({
      type: 'memberinfo/resetPage',
      payload: {}
    })
    this.props.dispatch({
      type: 'memberinfo/fetch',
      payload: {
        code:'qerp.qpos.mb.card.detail',
        values:{mbCardId:query.id}
      }
    })
    this.props.dispatch({
      type: 'memberinfo/fetchList',
      payload: {
        code:'qerp.qpos.mb.card.detail.page',
        values:{mbCardId:query.id,limit:10,currentPage:0}
      }
    })
  }
   render(){
      return (
        <div>
            <Header type={false} color={true} linkRoute="member"/>
            <div className='counters goods-countersme'>
                <div className="memberinfo-wrapper">
                    <div className='mbindocardbox'><Cardlist cardlist={this.props.cardInfolist}/></div>
                        <EditableTable mbCards={this.props.mbCards}
                                        dispatch={this.props.dispatch}
                                        loding={this.props.loding}
                                        total={this.props.total}
                                        current={this.props.current}
                                        ref='memberTable'/>
                </div>
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
