import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';


//收货	
class Operationl extends React.Component {
	state={
		pbarcode:null,
		barcode:null
	}

//配货单	
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
            const revisedata=this.props.revisedata
            let pdOrderNo={pdOrderNo:this.state.pbarcode}
            revisedata(pdOrderNo)
		}
	}
//条码
	HindonKeyUps=(e)=>{
		if(e.keyCode==13){
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcodes)
            ValueorderNoses.select()
            let barCode={barCode:this.state.barcode}
            const barcoderevisedata=this.props.barcoderevisedata
            barcoderevisedata(barCode)
		}
	}

//配货单
	hindchange=(e)=>{
		var str=e.target.value.replace(/\s+/g,"");  
		this.setState({
			pbarcode:str,
		})
	}
//条码
	hindchanges=(e)=>{
		var str=e.target.value.replace(/\s+/g,""); 
		this.setState({
			barcode:str,
		})
	}
	//光标跳转
	focustap=()=>{
		const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcodes)
         ValueorderNoses.focus()
	}

	//初始化光标
	initfocus=()=>{
		const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
        ValueorderNoses.focus()
	}

	//初始化
	initdatal=()=>{
		this.setState({
			pbarcode:null,
			barcode:null
		},function(){
			this.initfocus()
		})
	}
	render() {
		return(
			<div className='operationl clearfix mt30'>
      			<Input placeholder='扫码或输入配货单号'  className='fl ml30 useinput' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)} onChange={this.hindchange.bind(this)} value={this.state.pbarcode}/>
      			<Input placeholder='扫码或输入条形码'  className='fl ml20 useinput' onKeyUp={this.HindonKeyUps.bind(this)} onChange={this.hindchanges.bind(this)} value={this.state.barcode} ref='barcodes'/>
    		</div>
		)
	}
	componentDidMount(){
			this.initfocus()
	}
}


// 右边操作区
class Operationr extends React.Component {
	state={
		quantity:0,
		totalamount:0,
	}
	clearingdata=(messages,totalamount)=>{
		this.setState({
			quantity:messages,
			totalamount:totalamount,
		},function(){
			this.receivenumber(this.state.quantity,this.state.totalamount)
		})
	}
	receivenumber=(spu,number)=>{
		const receivenumber=this.props.receivenumber
		receivenumber(spu,number)
	}
	initdatar=()=>{
		this.setState({
			quantity:0,
			totalamount:0,
		})
	}
	render() {
		const color=this.props.color
		const type=this.props.type
		return(
    		<div className={color?'operationcon':'operationconbg'}>
      			<div className='fl list1'>
      				<div className='con1'>收货</div>
      				<div className='con2'>「空格键」</div>
      			</div>
      			<div className='fl list2'>
      				<div className='con1'>商品</div>
      				<div className='con2'>{this.state.quantity}</div>
      			</div>
      			<div className='fl list3'>
      				<div className='con1'>数量</div>
      				<div className='con2'>{this.state.totalamount}</div>
      			</div>
    		</div>
		)
	}
}

//操作区
class Operation extends React.Component {
	focustap=()=>{
		const focustap=this.refs.usel.focustap
		focustap()
	}
	clearingdatas=(messages,totalamount)=>{
		const clearingdatas=this.refs.operationr.clearingdata
		clearingdatas(messages,totalamount)
	}
	initdata=()=>{
		const initdatal=this.refs.usel.initdatal
		const initdatar=this.refs.operationr.initdatar
		initdatal()
		initdatar()
	}
	render() {
		return(
			<div className='count clearfix'>
				<div className='opera'>
      				<div className='operationl fl'>
      					<Operationl 
      						tabledataset={this.props.tabledataset} 
      						barcoderevisedata={this.props.barcoderevisedata} 
      						ref='usel'
      						revisedata={this.props.revisedata}
      					/>
      				</div>
      				<div className='operationr fr'>
      					<Operationr 
      						color={this.props.color} 
      						type={this.props.type} 
      						ref='operationr' 
      						receivenumber={this.props.receivenumber}
      						/>
      				</div>
      			</div>
    		</div>
		)
	}
	
}
export default Operation;