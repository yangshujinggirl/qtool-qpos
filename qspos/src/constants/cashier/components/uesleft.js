import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import Modales from './model'
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {GetServerData} from '../../../services/services';

class Operationls extends React.Component {
	state={
		barcode:'',
		onBlur:true,
		cardNoMobile:'',
		name:'',
		levelStr:'',
		integertotalamount:null,
		checked:false,
		cardNo:'',
		mbCardId:null,
    isBirthMonth:false
	}
	componentDidMount(){
		this.focustap()
		this.props.dispatch({
			type:'cashier/meths',
			payload:{
				focustap:this.focustap
			}
		})
	}
	//阻止默认事件
	onKeydown=(e)=>{
		if(e.keyCode==9){
			e.preventDefault()
		}
	}
	//条码change
	barcodechange=(e)=>{
		const barcode=e.target.value.replace(/\s+/g,"");
		this.props.dispatch({
			type:'cashier/barcode',
			payload:barcode
		})
	}
	//会员卡号onchange
	cardNoMobilechange=(e)=>{
		var cardNoMobile=e.target.value.replace(/\s+/g,"");
		const name=null
		const levelStr=null
		const memberpoint=null
		const memberamount=null
		const cardNo=null
		const mbCardId=null
		const isBirthMonth=null
		const ismember=false
		this.props.dispatch({
			type:'cashier/cardNoMobile',
			payload:cardNoMobile
		})
		this.props.dispatch({
			type:'cashier/memberlist',
			payload:{name,levelStr,memberpoint,memberamount,cardNo,mbCardId,isBirthMonth,ismember}
		})
	}
	//条码框键盘事件
	HindonKeyUp=(e)=>{
		if(e.keyCode==13){
			this.barcodeSelect()
			const barCode=e.target.value
			this.getbarcodeDate(barCode)
		}
		if(e.keyCode==9){
			this.focustapmember()
		}
	}
	//barcode选中
	barcodeSelect=()=>{
		ReactDOM.findDOMNode(this.refs.barcodeRefs).select()
	}
	//barcode请求
	getbarcodeDate=(value)=>{
		const values={barCode:value}
		this.props.dispatch({
			type:'cashier/barfetch',
			payload:{code:'qerp.pos.pd.spu.find',values:values}
		})
	}
	//条码获取焦点
	focustap=()=>{
		const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcodeRefs)
		 ValueorderNoses.focus()
		const onBlur=false
		this.props.dispatch({
			type:'cashier/onbule',
			payload:onBlur
		})
	}
	//会员获取焦点
	focustapmember=()=>{
		const Valuemember=ReactDOM.findDOMNode(this.refs.memberRefs)
		Valuemember.focus()
		const onBlur=true
		 this.props.dispatch({
			 type:'cashier/onbule',
			 payload:onBlur
		 })
	}
	//跳转到退货
	hindchange=(e)=>{
		if(e==true){
			this.setState({
				checked:true
			},()=>{
				this.context.router.push('/returngoods')
			})
		}
	}
	//会员框键盘事件
	memberHindonKeyUp=(e)=>{
		if(e.keyCode==9){
			this.focustap()
		}else if(e.keyCode==13){
			this.searchmemberinfo()
		}
	}
	// 根据会员号或手机号查询会员信息
	searchmemberinfo=()=>{
		let values={cardNoMobile:this.props.cardNoMobile}
		this.props.dispatch({
			type:'cashier/memberinfo',
			payload:{code:'qerp.pos.mb.card.find',values:values}
		})
	}
	render(){
		return(
			<div>
				<div className='clearfix mt30'>
    			<Input
						autoComplete="off"
						placeholder='扫码或输入条码'
						className='fl ml30 useinput'
						ref='barcodeRefs'
						onKeyUp={this.HindonKeyUp.bind(this)}
						value={this.props.barcode}
						onChange={this.barcodechange.bind(this)}
						onKeyDown={this.onKeydown.bind(this)}/>
    			<Input
						autoComplete="off"
						placeholder='会员号/手机号'
						className='fl ml20 useinput'
						ref='memberRefs'
						onKeyUp={this.memberHindonKeyUp.bind(this)}
						onKeyDown={this.onKeydown.bind(this)}
						value={this.props.cardNoMobile}
						onChange={this.cardNoMobilechange.bind(this)}/>
    		</div>
    		<div className='clearfix mt20'>
    			<div className='cashier fl'>
						<Switch
							checkedChildren="用户退货"
							unCheckedChildren="对外售卖"
							onChange={this.hindchange.bind(this)}
							checked={this.state.checked}/>
					</div>
    			<div className='fl cashierbox'>
    				<div className='clearfix cashierbox_t posion'>
              <div className='fl'>
								<span className='c74'>会员姓名</span>
								<span className='c38 ml10'>{this.props.name}</span>
							</div>
              <div className='fr'>
								<span className='themecolor level-margin-style'>{this.props.levelStr}</span>
								<span>{this.props.isBirthMonth=='true'?<span className='birthline'>
								<span className='line'></span>生日</span>:null}</span>
							</div>
            </div>
    				<div className='clearfix posion cashierbox_b'>
  						<div className='fl tc mt10 memberinfobox1 memberinfoboxlist' >
                <div className='c74 clearfix'>
									<p className='fl'>余额</p>
									<div className='rechargebtn'>
										<Modales
											name={this.props.name}
											cardNo={this.props.cardNo}
											amount={this.props.memberamount}
											mbCardId={this.props.mbCardId}
											searchmemberinfo={this.searchmemberinfo.bind(this)}/>
									</div>
								</div>
                <p className='c38 p2'>{this.props.memberamount}</p>
              </div>
              <div className='fr tc mt10 memberinfobox2 memberinfoboxlist'>
                <p className='c74 p1'>本次积分</p>
                <p className='c38 p2'>{this.props.mbCardId?this.props.thispoint:null}</p>
              </div>
    					<div className='w tc mt10 memberinfobox3 memberinfoboxlist'>
              	<p className='c74'>剩余积分</p>
              	<p className='c38 p2'>{this.props.memberpoint}</p>
              </div>
              <div className='lines lines1'></div>
              <div className='lines lines2'></div>
  					</div>
  				</div>
  			</div>
			</div>
		)
	}
}

Operationls.contextTypes= {
    router: React.PropTypes.object
}

function mapStateToProps(state) {
	 const {
					 name,
					 levelStr,
					 memberpoint,
					 memberamount,
					 cardNo,
					 mbCardId,
					 isBirthMonth,
					 ismember,
					 thispoint,
					 barcode,
					 cardNoMobile} = state.cashier;
	return {
						name,
						levelStr,
						memberpoint,
						memberamount,
						cardNo,
						mbCardId,
						isBirthMonth,
						ismember,
						thispoint,
						barcode,
						cardNoMobile
					};
}

export default connect(mapStateToProps)(Operationls);
