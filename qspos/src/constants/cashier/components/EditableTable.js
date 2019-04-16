import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message, Popover} from 'antd';
import NP from 'number-precision'
import {GetServerData} from '../../../services/services';
import {dataedit} from '../../../utils/commonFc';

import './EditableTable.less';

const inputwidth={
	width:'80%',
	height:'30px',
	border:'1px solid #E7E8EC',
	background: '#FFF',
	textAlign:'center'
}

class EditableTable extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: '序号',
				dataIndex: 'key',
				width:'8%',
				render: (text, record, index) => {
	        return <div className="td-wrap">
	          {this.renderCol(record, text)}
	          {record.isJoin=="1"&&<span className="activity-mark"></span>}
	        </div>
	      }
			}, {
				title: '商品条码',
				width:'10%',
				dataIndex: 'barcode',
				render: (text, record, index) => {
	        return <div className="td-wrap">
	          {this.renderCol(record, text)}
	        </div>
	      }
			}, {
				title: '商品名称',
				width:'15%',
				dataIndex: 'name',
				render: (text, record, index) => {
	        return <div className="td-wrap">
	          {this.renderCol(record, text)}
	        </div>
	      }
			},{
				title: '规格',
				width:'10%',
				dataIndex: 'displayName',
				render: (text, record, index) => {
	        return <div className="td-wrap">
	          {this.renderCol(record, text)}
	        </div>
	      }
			},{
				title: '零售价',
				width:'10%',
				dataIndex: 'toCPrice',
				render: (text, record, index) => {
	        return <div className="td-wrap">
	          {this.renderCol(record, text)}
	        </div>
	      }
			},{
				title: '数量',
				width:'10%',
				dataIndex: 'qty',
				render: (text, record, index) => {
					return (
						<Input
							autoComplete="off"
							style={inputwidth}
							onKeyDown={this.onKeydown.bind(this)}
							value={text}
							onBlur={this.qtyblur.bind(this,index)}
							onChange={this.qtyonchange.bind(this,index)}/>
					)
				}
			},{
				title: '折扣',
				width:'10%',
				dataIndex: 'discount',
				render: (text, record, index) => {
					let value;
					if(record.isJoin=="1") {
						value = record.activityDiscount
					}else {
						value = record.discount
					}
					return (
						<Input
							disabled={record.isJoin=="1"}
							style={inputwidth}
							autoComplete="off"
							onKeyDown={this.onKeydown.bind(this)}
							value={value}
							onChange={this.discountonchange.bind(this,index)}
							onBlur={this.discountblur.bind(this,index)}/>
					)
				}
			},{
				title: '折后价',
				width:'10%',
				dataIndex: 'payPrice',
				render: (text, record, index) => {
					let value;
					if(record.isJoin=="1") {
						value = record.specialPrice
					}else {
						value = record.payPrice
					}
					return (
						<Input
							disabled={record.isJoin=="1"}
							style={inputwidth}
							autoComplete="off"
							onKeyDown={this.onKeydown.bind(this)}
							value={value}
							onChange={this.payPriceonchange.bind(this,index)}
							onBlur={this.payPriceblur.bind(this,index)}/>
					)
				}
		}];
		this.state = {
			count: 1,
			index:0,
			quantity:0,//数量
			totalamount:0,//总金额
			integertotalamount:0,//总金额取整,
			windowHeight:'',
			nofirstent:false
		};
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.windowResize);
	}
	componentDidMount(){
		this.windowResize();
		window.addEventListener('resize', this.windowResize);
	}
	//适配屏幕
	windowResize = () =>{
		if(!this.refs.tableWrapper){
      return
    }
		if(document.body.offsetWidth>800){
			this.setState({
				windowHeight:document.body.offsetHeight-495,
			});
		}else{
			this.setState({
				windowHeight:document.body.offsetHeight-295,
			});
		}
	}
	//列渲染
	renderCol = (record, text) => {
	  const popverContent = <span>{record.activityName}</span>;
	  let Mod;
	  if (record.isJoin=="1") {
	    Mod = <Popover content={popverContent} placement="bottom">
	            <span className="pover-text">
	              {text}
	            </span>
	          </Popover >
	  } else {
	    Mod = <span> { text }</span>;
	  }
	  return Mod;
	}
	//change事件
	qtyonchange=(index,e)=>{
		const values=e.target.value
		const datasouce=this.props.datasouce.splice(0)
		const re=/^[0-9]*$/
		const str=re.test(values)
		if(str){
			datasouce[index].qty=values
		}else{
			message.warning('数量只能输入数字')
		}
		this.props.dispatch({
			type:'cashier/changedatasouce',
			payload:datasouce
		})
	}
	//失去焦点事件
	qtyblur=(index,e)=>{
		const values=e.target.value
		const re=/^([1-9][0-9]*)$/
		const str=re.test(values)
		const datasouce=this.props.datasouce.splice(0)
		if(str){
			//判断库存
			if(Number(values)>Number(datasouce[index].inventory)){
				datasouce[index].qty=datasouce[index].inventory
				message.warning('商品库存不足')
			}else{
				datasouce[index].qty=values
			}
		}else{
			datasouce[index].qty=1
			message.warning('数量只能输入大于0的数字')
		}
		var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
		const editpayPrice =dataedit(zeropayPrice)
		if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
			datasouce[index].payPrice=String(NP.plus(editpayPrice, 0.01));
		}else{
			datasouce[index].payPrice=editpayPrice
		}
		this.props.dispatch({
			type:'cashier/datasouce',
			payload:datasouce
		})
	}
	//折扣change事件
	discountonchange=(index,e)=>{
		const values=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,1})?$/
		const str=re.test(values)
		if(str){
			const datasouce=this.props.datasouce.splice(0)
			datasouce[index].discount=values
			this.props.dispatch({
				type:'cashier/changedatasouce',
				payload:datasouce
			})
		}
	}
	//折扣失焦事件
	discountblur=(index,e)=>{
		var values=parseFloat(e.target.value)
		const datasouce=this.props.datasouce.splice(0)
		let role=sessionStorage.getItem('role');
		datasouce[index].discount=values
		if((role=='2'||role=='1') && values<6){
			datasouce[index].discount=6
		}
		if((role=='3') && values<9){
			datasouce[index].discount=9
		}
		var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
		const editpayPrice =dataedit(zeropayPrice)
		if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
			datasouce[index].payPrice=String(NP.plus(editpayPrice, 0.01));
		}else{
			datasouce[index].payPrice=editpayPrice
		}
		this.props.dispatch({
			type:'cashier/datasouce',
			payload:datasouce
		})
	}
	//折后价change事件
	payPriceonchange=(index,e)=>{
		const values=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
		const str=re.test(values)
		if(str){
			const datasouce=this.props.datasouce.splice(0)
			datasouce[index].payPrice=values
			this.props.dispatch({
				type:'cashier/changedatasouce',
				payload:datasouce
			})
		}
	}
	//折扣价失焦事件
	payPriceblur=(index,e)=>{
		var values=parseFloat(e.target.value)
		const datasouce=this.props.datasouce.splice(0)
		let role=sessionStorage.getItem('role');
		values =dataedit(String(values))
		datasouce[index].payPrice=values
		datasouce[index].discount=NP.times(NP.divide(datasouce[index].payPrice,datasouce[index].toCPrice,datasouce[index].qty),10)
		if((role=='2'||role=='1') && datasouce[index].discount<8){
			datasouce[index].discount=8
			var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
			//判断是否有小数点，及小数点时候有两位，当不满足时候补零
			const editpayPrice =dataedit(zeropayPrice)
			if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
				datasouce[index].payPrice=String(NP.plus(editpayPrice, 0.01))
			}else{
				datasouce[index].payPrice=editpayPrice
			}
		}
		if((role=='3') && datasouce[index].discount<9){
			datasouce[index].discount=9
			var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
			const editpayPrice =dataedit(zeropayPrice)
			if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
				datasouce[index].payPrice=String(NP.plus(editpayPrice, 0.01))
			}else{
				datasouce[index].payPrice=editpayPrice
			}
		}
		//判断折扣是否有小数点
		if(String(datasouce[index].discount).indexOf(".")>-1){
			datasouce[index].discount=NP.round(datasouce[index].discount,1)
		}
		this.props.dispatch({
			type:'cashier/datasouce',
			payload:datasouce
		})
	}
	rowClassName=(record, index)=>{
		if(index==this.props.themeindex){
			return 'themebgcolor'
		}else{
			if (index % 2) {
				return 'table_white'
			}else{
				return 'table_gray'
			}
		}
	}
	//行点击
	rowclick=(record,index,event)=>{
		const themeindex=index;
		this.props.dispatch({
			type:'cashier/themeindex',
			payload:themeindex
		})
		//重置活动列表
		this.props.dispatch({
			type:'cashier/getActivityList',
			payload:{
				currentActivityList:record.spActivities,
				selectActivityId:record.activityId
			}
		})
	}
	onKeydown=(e)=>{
		if(e.keyCode==9){
			e.preventDefault()
		}
	}
	render() {
		const columns = this.columns;
		return (
			<div className='bgf casher-goods-table' ref="tableWrapper">
				<Table
					bordered
					dataSource={this.props.datasouce}
					columns={columns}
					pagination={false}
					scroll={{ y: this.state.windowHeight }}
					onRow={(record,index)=> {
						return {
							onClick:this.rowclick.bind(this,record,index)
						}
					}}
					rowClassName={this.rowClassName.bind(this)}/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const {datasouce,themeindex} = state.cashier;
	return {datasouce,themeindex};
}

export default connect(mapStateToProps)(EditableTable);
