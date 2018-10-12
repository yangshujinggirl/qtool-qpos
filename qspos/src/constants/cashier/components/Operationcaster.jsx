import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../../services/services';
import {GetLodop} from '../../../components/Method/Print.jsx'
import { connect } from 'dva';
import Modales from './model'
import OperationlLeft from './uesleft'


class Operation extends React.Component {
	hindclick=()=>{
    if(Number(this.props.totolnumber)>0 && parseFloat(this.props.totolamount)>0){
	    GetServerData('qerp.pos.sy.config.info')
	    .then((json) => {
		    if(json.code == "0"){
		        if(json.config.submitPrint=='1'){
	            this.props.dispatch({
	              type:'cashier/changeCheckPrint',
	              payload:true
	            })
		        }else{
	            this.props.dispatch({
	              type:'cashier/changeCheckPrint',
	              payload:false
	            })
		        }
		    }
	    })
      this.props.meth1.initModel()
    }else{
      message.error('数量为0，不能结算')
      return
    }
	}
	render() {

		return(
			<div className='count clearfix'>
				<div className='opera'>
  				<div className='operationl fl'>
				     <OperationlLeft getBarCodeRefs={this.props.getBarCodeRefs}/>
  				</div>
  				<div className='operationr fr'>
						<div className={this.props.color?'operationcon':'operationconbg'}>
			        <div className='fl list1' onClick={this.hindclick.bind(this)}>
			          <div className='con1'>结算</div>
			          <div className='con2'>「空格键」</div>
			        </div>
			        <div className='fl list2'>
			          <div className='con1'>数量</div>
			          <div className='con2'>{this.props.totolnumber}</div>
			        </div>
			        <div className='fl list3'>
			          <div className='con1'>金额</div>
			          <div className='con2'>{this.props.totolamount}</div>
			        </div>
			      </div>
          </div>
  			</div>
  		</div>
		)
	}

}
function mapStateToProps(state) {
	const { totolnumber, totolamount, meth1 } = state.cashier;
	return { totolnumber, totolamount, meth1 };
}

export default connect(mapStateToProps)(Operation);
