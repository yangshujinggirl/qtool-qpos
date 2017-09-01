import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch} from 'antd';
import {Focus} from '../Method/Method';
import ReactDOM from 'react-dom';

const Operationrstyle={width:'100%',height:'225px',background: '#35BAB0',overfloe:'hidden'}
const Operationrstyleano={width:'100%',height:'225px',background:'#FC4F4F',overfloe:'hidden'}
const opera={width:'100%',height:'225px',background:'#fff'}
const w55={width:'824px',height:'225px',float:'left'}
const w45={width:'546px',height:'225px',float:'right'}
const name36={fontSize: '36px',color: '#FFF',marginTop:'47px'}
const name18={fontSize: '18px',color: '#FFF'}
const name20={fontSize: '20px',color: '#FFF',marginLeft:'37px',marginTop:'46px'}
const name40={fontSize: '40px',color: '#FFF',marginLeft:'37px'}
const list1={width:'177px',height:'150px',borderRight:'1px solid rgba(255,255,255,0.5)',marginTop:'38px',textAlign:'center'}
const list2={width:'155px',height:'150px',borderRight:'1px solid rgba(255,255,255,0.5)',marginTop:'38px'}
const list3={width:'212px',height:'150px',marginTop:'38px'}

//配置常量
const title=[
			 {
				name:'收货',
				name2:'商品',
				name3:'数量'
			 },{
				name:'结算',
				name2:'数量',
				name3:'金额'
			}
		]

//收货	
class Operationl extends React.Component {
	state={
		pbarcode:'',
		barcode:''
	}

//配货单	
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
			console.log(23)
			//const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            //ValueorderNoses.select()
            const tabledataset=this.props.tabledataset
            let pdOrderNo={pdOrderNo:this.state.pbarcode}
            tabledataset(pdOrderNo)
		}
	}
//条码
	HindonKeyUps=(e)=>{
		if(e.keyCode==13){
			console.log(33)
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.select()
            let barCode={barCode:this.state.barcode}
            const barcoderevisedata=this.props.barcoderevisedata
            barcoderevisedata(barCode)
		}
	}

//配货单
	hindchange=(e)=>{
		this.setState({
			pbarcode:e.target.value,
		})
	}
//条码
	hindchanges=(e)=>{
		this.setState({
			barcode:e.target.value,
		})
	}

	render() {
		return(
			<div className='operationl clearfix'>
      			<Input placeholder='扫码或输入配货单号' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl ml30' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)} onChange={this.hindchange.bind(this)} value={this.state.pbarcode}/>
      			<Input placeholder='扫码或输入条形码' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl ml20' onKeyUp={this.HindonKeyUps.bind(this)} onChange={this.hindchanges.bind(this)} value={this.state.barcode}/>
    		</div>
		)
	}
	componentDidMount(){
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.focus()
	}
}
//收银

class Operationls extends React.Component {
	hindchange=(e)=>{
		console.log(e)
		if(e=='true'){
			this.context.router.push('/cashier')
		}else{
			this.context.router.push('/returngoods')
		}
	}
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
			console.log(23)
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.select()
		}
	}
	render(){
		return(
			<div>
				<div className='operationl clearfix'>
	      			<Input placeholder='扫码或输入条形码' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl ml30' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)}/>
	      			<Input placeholder='会员号/手机号' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl ml20'/>
	    		</div>
	    		<div className='clearfix mt20'>
	    			<div className='cashier fl'><Switch checkedChildren="开" unCheckedChildren="关" onChange={this.hindchange.bind(this)}/></div>
	    			<div style={{width:'300px',height:'96px',border:'1px solid #E7E8EC',borderRadius:'3px',marginLeft:'20px'}} className='fl'>
	    				<div style={{borderBottom:'1px solid #E7E8EC',height:'40px',lineHeight:'40px',fontSize:'14px',textAlign:'center'}} className='clearfix'><div className='fl'><span className='c74 ml10'>会员姓名</span><span className='c38 ml10'>yelin96</span></div><div className='fr'><span className='themecolor mr10'>金牌会员 | 生日</span></div></div>
	    				<div className='clearfix f14 posion' style={{margin:'0 auto',width:'250px'}}>
	    					<div className='fl tc mt10'><p className='c74 clearfix'><div className='fl'>余额</div><div style={{width:'35px',height:'16px',border:'1px solid #35BAB0',textAlign:'center',lineHeight:'14px',fontSize:'10px',float:'left',marginLeft:'5px',cursor: 'pointer'}}>充值</div></p><p className='c38'>999.00</p></div>
	    					<div className='fr tc mt10'><p className='c74'>本次积分</p><p className='c38'>999</p></div>
	    					<div className='w tc mt10'><p className='c74'>剩余积分</p><p className='c38'>999000</p></div>
	    				</div>
	    			</div>
	    		</div>
    		</div>
			)
	}
	componentDidMount(){
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.focus()
	}
}

Operationls.contextTypes= {
    router: React.PropTypes.object
}

class Operationr extends React.Component {
	hindclick=()=>{
		console.log(1)
	}
	render() {
		const color=this.props.color
		const type=this.props.type
		return(
			<div style={color?Operationrstyle:Operationrstyleano}>
      			<div className='fl' style={list1} onClick={this.hindclick.bind(this)}>
      				<div style={name36}>{type?title[0].name:title[1].name}</div>
      				<div style={name18}>「空格键」</div>
      			</div>
      			<div className='fl' style={list2}>
      				<div style={name20}>{type?title[0].name2:title[1].name2}</div>
      				<div style={name40}>9999</div>
      			</div>
      			<div className='fl' style={list3}>
      				<div style={name20}>{type?title[0].name3:title[1].name3}</div>
      				<div style={name40}>8900.00</div>
      			</div>
    		</div>
		)
	}
}


//操作区
class Operation extends React.Component {
	handleokent=(e)=>{
		if(e.keyCode=='32'){
			//判断当前是收银回车还是退货回车还是收货回车
			console.log(this)	

		}
	}
	render() {
		return(
			<div className='count clearfix'>
				<div style={opera}>
      				<div style={w55}>
      					{
      						this.props.index==true
      						?<Operationls tabledataset={this.props.tabledataset}/>
      						:<Operationl tabledataset={this.props.tabledataset} barcoderevisedata={this.props.barcoderevisedata}/>
      					}
      				</div>
      				<div style={w45}><Operationr color={this.props.color} type={this.props.type}/></div>
      			</div>
    		</div>
		)
	}
	componentDidMount(){
		window.addEventListener('keyup', this.handleokent,true);
	}
	componentWillUnmount(){
		window.removeEventListener('keyup', this.handleokent,true);
	}
}
export default Operation;