import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message} from 'antd';
import NP from 'number-precision'
import {GetServerData} from '../../services/services';
import {dataedit} from '../../utils/commonFc';

const inputwidth={width:'80%',height:'30px',border:'1px solid #E7E8EC',background: '#FFF',textAlign:'center'}
	
class EditableTable extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
			title: '序号',
			dataIndex: 'key',
			width:'8%'
		}, {
			title: '商品条码',
			width:'10%',
			dataIndex: 'barcode'

		}, {
			title: '商品名称',
			width:'15%',
			dataIndex: 'name'
		},{
			title: '规格',
			width:'10%',
			dataIndex: 'displayName'
		},{
			title: '零售价',
			width:'10%',
			dataIndex: 'toCPrice'
		},{
			title: '数量',
			width:'10%',
			dataIndex: 'qty',
			render: (text, record, index) => {
				return (
					<Input style={inputwidth} 
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
				return (
					<Input style={inputwidth} 
						onKeyDown={this.onKeydown.bind(this)} 
						value={text}
						onChange={this.discountonchange.bind(this,index)}
						onBlur={this.discountblur.bind(this,index)}
					/>
				)
			}
		},{
			title: '折后价',
			width:'10%',
			dataIndex: 'payPrice',
			render: (text, record, index) => {
				return (
					<Input style={inputwidth} 
						onKeyDown={this.onKeydown.bind(this)} 
						value={text}
						onChange={this.payPriceonchange.bind(this,index)}
						onBlur={this.payPriceblur.bind(this,index)}
					/>
				)
			}
		}];
		this.state = {
			dataSource: [],
			count: 1,
			index:0,
			quantity:0,//数量
			totalamount:0,//总金额
			integertotalamount:0,//总金额取整,
			windowHeight:'',
			nofirstent:false
		};
	}


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
			datasouce[index].payPrice=String(parseFloat(editpayPrice)+0.01)
		}else{
			datasouce[index].payPrice=editpayPrice
		}
		this.props.dispatch({
			type:'cashier/datasouce',
			payload:datasouce
		})

	}
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
	discountblur=(index,e)=>{
		var values=parseFloat(e.target.value)
		const datasouce=this.props.datasouce.splice(0)
		let role=sessionStorage.getItem('role');
		datasouce[index].discount=values
		if((role=='2'||role=='1') && values<8){
			datasouce[index].discount=8 	
		}
		if((role=='3') && values<9){
			datasouce[index].discount=9 	
		}
		
		var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
		const editpayPrice =dataedit(zeropayPrice)
		if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
			datasouce[index].payPrice=String(parseFloat(editpayPrice)+0.01)
		}else{
			datasouce[index].payPrice=editpayPrice
		}
		this.props.dispatch({
			type:'cashier/datasouce',
			payload:datasouce
		})
	}


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
				datasouce[index].payPrice=String(parseFloat(editpayPrice)+0.01)
			}else{
				datasouce[index].payPrice=editpayPrice
			}
		}
		if((role=='3') && datasouce[index].discount<9){
			datasouce[index].discount=9 	
			var zeropayPrice=String(NP.divide(NP.times(datasouce[index].toCPrice, datasouce[index].qty,datasouce[index].discount),10)); //计算值
			const editpayPrice =dataedit(zeropayPrice)       
			if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
				datasouce[index].payPrice=String(parseFloat(editpayPrice)+0.01)
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
		const themeindex=index
		this.props.dispatch({
			type:'cashier/themeindex',
			payload:themeindex
		})
	}
	onKeydown=(e)=>{
		if(e.keyCode==9){
			e.preventDefault()
		} 
	}
	windowResize = () =>{
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

	render() {
		const { dataSource } = this.state;
		const columns = this.columns;
		return (
			<div className='bgf'>
				<Table bordered 
					dataSource={this.props.datasouce} 
					columns={columns} 
					pagination={false} 
					scroll={{ y: this.state.windowHeight }}
					onRowClick={this.rowclick.bind(this)}
					rowClassName={this.rowClassName.bind(this)}
				/>
			</div>
		);
	}
	componentDidMount(){
		if(document.body.offsetWidth>800){
			this.setState({
				windowHeight:document.body.offsetHeight-495,
			});
		}else{
			this.setState({
				windowHeight:document.body.offsetHeight-295,
			});
		}
		window.addEventListener('resize', this.windowResize);    
	}
	componentWillUnmount(){   
		window.removeEventListener('resize', this.windowResize);
	}
}

function mapStateToProps(state) {
	const {datasouce,themeindex} = state.cashier;
	return {datasouce,themeindex};
}

export default connect(mapStateToProps)(EditableTable);


	