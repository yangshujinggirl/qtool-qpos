import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import Modales from './model'
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {GetServerData} from '../../services/services';

class Btnpay extends React.Component {
	state={}
	hindClick=()=>{
		this.props.hindClicks()
	}
	render(){
		return(
			<div style={{cursor:'pointer'}} onClick={this.hindClick.bind(this)}>
				扫描
    		</div>
		)
	}
}


export default connect()(Btnpay);