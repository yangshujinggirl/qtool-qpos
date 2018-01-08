import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../Method/Print.jsx'
import { connect } from 'dva';
import Modales from '../../constants/cashier/model'
import Operationls from '../../constants/cashier/uesleft'
import Operationr from '../../constants/cashier/userright'


class Operation extends React.Component {
	clearingdatas=(messages,totalamount)=>{
		const clearingdatas=this.refs.operationr.clearingdata
		clearingdatas(messages,totalamount)
	}
	clearingdatasl=(integertotalamount)=>{
		const clearingdatas=this.refs.cashier.clearingdata
		clearingdatas(integertotalamount)
	}
    initdatar=()=>{
        const initdatar=this.refs.cashier.initdatar
        initdatar()
    }
    hindpayclick=()=>{
        const showpops=this.props.showpops
        showpops()
    }
	render() {
		return(
			<div className='count clearfix'>
				<div className='opera'>
      				<div className='operationl fl'>
      					     <Operationls 
                                tabledataset={this.props.tabledataset} 
                                cashrevisetabledatasouce={this.props.cashrevisetabledatasouce} 
                                ref='cashier'  
                                Backmemberinfo={this.props.Backmemberinfo}
                                revisedata={this.props.revisedata}
                                initthisinfo={this.props.initthisinfo}
                            />			
      				</div>
      				<div className='operationr fr' onClick={this.hindpayclick.bind(this)}>
                        <Operationr color={this.props.color} type={this.props.type} ref='operationr' Backemoney={this.props.Backemoney} revisedata={this.props.revisedata}/>
                    </div>
      			</div>
    		</div>
		)
	}
	
}




export default connect()(Operation);