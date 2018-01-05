import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
class Operationl extends React.Component {
	//配货单	
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
			const values={pdOrderNo:this.props.pbarcode} 
			this.props.dispatch({
				type:'receivegoods/orderfetch',
				payload:{code:'qerp.pos.pd.phorder.info',values:values}
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
			<div className='clearfix mt30'>
      			<Input placeholder='扫码或输入配货单号/快递单号'  className='fl ml30 useinputss' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)} onChange={this.hindchange.bind(this)} value={this.props.pbarcode}/>
    		</div>
		)
	}
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
}

function mapStateToProps(state) {
	const {pbarcode} = state.receivegoods;
   	return {pbarcode};
}

export default connect(mapStateToProps)(Operationl);