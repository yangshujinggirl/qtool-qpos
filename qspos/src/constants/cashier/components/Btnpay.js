import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';

import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {GetServerData} from '../../../services/services';

class Btnpay extends React.Component {
	state={}
	hindClick=()=>{
		this.props.hindClicks()
	}
	render(){
		return(
			<div style={{cursor:'pointer'}} onClick={this.hindClick.bind(this)}>
				 <Button className='payscanbtn'>扫码</Button>
  		</div>
		)
	}
}


export default connect()(Btnpay);
