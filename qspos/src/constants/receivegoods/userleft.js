import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
class Operationl extends React.Component {
	componentDidMount(){
			this.initfocus()
			const meth={
				initfocus:this.initfocus
			}
			this.props.dispatch({
				type:'receivegoods/meth',
				payload:meth
			})
	}
	//配货单
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
			const values={pdOrderNo:this.props.pbarcode}
			this.props.dispatch({
				type:'receivegoods/orderfetch',
				payload:{values}
			})
		}
	}
	//配货单change
	hindchange=(e)=>{
		var pbarcode=e.target.value.replace(/\s+/g,"");
		this.props.dispatch({
			type:'receivegoods/pbarcode',
			payload:pbarcode
		})
	}
	//初始化光标
	initfocus=()=>{
		const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
        ValueorderNoses.focus()
	}
	render() {
		return(
			<div>
			<div className='clearfix return-input-search'>
  			<Input
					autoComplete="off"
					placeholder='扫描或输入配货单号/调拨单号/快递单号'
					className='fl ml30 useinputss' ref='barcode'
					onKeyUp={this.HindonKeyUp.bind(this)}
					onChange={this.hindchange.bind(this)}
					value={this.props.pbarcode}/>
  		</div>
			<div className='return-con-remark'>
				<p className='title-p1'>收货须知：</p>
				<p className='title-p2'>• 配货订单（通过Q掌柜下的单）可扫描配货单号/快递单号进行收货；</p>
				<p className='title-p2'>• 调拨订单只可扫描调拨单号进行收货；</p>
			</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const {pbarcode} = state.receivegoods;
   	return {pbarcode};
}

export default connect(mapStateToProps)(Operationl);
