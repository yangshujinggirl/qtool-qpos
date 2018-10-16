import {
	Table,
	Input,
	Icon,
	Button,
	Popconfirm ,
	Tabs,
	Tooltip ,
	DatePicker,
	Select,
	message,
	Switch,
	Modal,
	Radio,
	Checkbox
} from 'antd';
import Modales from './model'
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {GetServerData} from '../../../services/services';
import {printRechargeOrder} from '../../../components/Method/Method';
import Btnpay from './btnpay'
import Btnbrfore from './btnbefore'
import './uesleft.less';


const columns = [{
			title:'会员名称',
			dataIndex: 'name',
			key: 'name',
	},{
			title:'可用积分',
			dataIndex: 'level',
			key: 'level',
	}]
class Operationls extends React.Component {
	constructor(props) {
		super(props);
		this.state={
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
		this.rowSelection={
			onChange:this.checkChange,
			type:'radio'
		}
		this.firstclick=true
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
	componentDidUpdate(){
   if(this.input){
       const ValueorderNoses = ReactDOM.findDOMNode(this.input.input)
       ValueorderNoses.focus()
   }
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
	//切换会员
	toggleEvent() {
		this.setState({ visible:true })
		GetServerData('qerp.pos.mb.card.switch',{mobile:this.props.cardNoMobile})
		.then((res) => {
			if(res.code == '200') {
				this.setState({ dataSource:res.iQposMbCards, visible:true });
			}
		},(error) => {
			console.log(error)
		})
	}
	onCancel() {
		this.setState({ visible:false })
	}
	//选择会员
	checkChange(selectedRowKeys, selectedRows) {
		let cardNoMobile = selectedRows[0].key;
		GetServerData('qerp.pos.mb.card.find',{ cardNoMobile })
		.then((res) => {
			if(res.code == '200') {
				this.setState({ visible: false })
			}
		},(error) => {
			console.log(error)
		})
	}
	//充值
	showModal = () => {
		//判断有没有填写会员信息
		if(this.props.mbCardId==null || undefined || ''){
				message.warning('请输入正确的会员卡号')
		}else{
				const uservalues={"urUserId":null}
				GetServerData('qerp.pos.ur.user.info',uservalues)
				.then((json) => {
						if(json.code=='0'){
								sessionStorage.setItem('openWechat',json.urUser.shop.openWechat);
								sessionStorage.setItem('openAlipay',json.urUser.shop.openAlipay);
								GetServerData('qerp.pos.sy.config.info')
								.then((json) => {
									if(json.code == "0"){
											if(json.config.rechargePrint=='1'){
													const recheckPrint=true
													this.props.dispatch({
															type:'cashier/rechangeCheckPrint',
															payload:recheckPrint
													})
											}else{
													const recheckPrint=false
													this.props.dispatch({
															type:'cashier/rechangeCheckPrint',
															payload:recheckPrint
													})
											}
									}
								})
								const rechargevisible=true
								this.props.dispatch({
										type:'cashier/rechargevisible',
										payload:rechargevisible
								})
						}
				})
		}
	}
	handleOk = (e) => {
		if(this.firstclick){
				this.firstclick=false
		}else{
				return
		}
		let values={mbCardId:this.props.mbCardId,amount:this.props.reamount,type:this.props.rechargetype}
		GetServerData('qerp.pos.mb.card.charge',values)
		.then((json) => {
				if(json.code=='0'){
						const rechargevisible=false
						this.props.dispatch({
								type:'cashier/rechargevisible',
								payload:rechargevisible
						})
						const reamount=null
						this.props.dispatch({
								type:'cashier/reamount',
								payload:reamount
						})
						setTimeout(()=>{
								this.firstclick=true
								this.searchmemberinfo()
								message.success('充值成功',1)
								const mbCardMoneyChargeIds=json.mbCardMoneyChargeId;
								const chargeNos=json.chargeNo;
								printRechargeOrder(this.props.recheckPrint,mbCardMoneyChargeIds)

						},1)
				}else{
						message.warning(json.message)
						this.firstclick=true
				}
		})
	}
		//打印
	handprint = (id,type,orderNo,size) => {
			GetLodop(id,type,orderNo,size)
	}
	handleCancel = (e) => {
			const rechargevisible=false
			this.props.dispatch({
					type:'cashier/rechargevisible',
					payload:rechargevisible
			})
	}
	typelist=(index)=>{
			if(index==1){
					const typeclick1=true
					const typeclick2=false
					const typeclick3=false
					const typeclick4=false
					const rechargetype=1
					this.props.dispatch({
							type:'cashier/typeclicks',
							payload:{typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
					})
			}
			if(index==2){
					const typeclick1=false
					const typeclick2=true
					const typeclick3=false
					const typeclick4=false
					const rechargetype=2
					this.props.dispatch({
							type:'cashier/typeclicks',
							payload:{typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
					})
			}
			if(index==3){
					const typeclick1=false
					const typeclick2=false
					const typeclick3=true
					const typeclick4=false
					const rechargetype=3
					this.props.dispatch({
							type:'cashier/typeclicks',
							payload:{typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
					})
			}
			if(index==4){
					const typeclick1=false
					const typeclick2=false
					const typeclick3=false
					const typeclick4=true
					const rechargetype=4
					this.props.dispatch({
							type:'cashier/typeclicks',
							payload:{typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
					})
			}
	}
	reamount=(e)=>{
		const reamount=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
		const str=re.test(reamount)
		if(str){
				this.props.dispatch({
						type:'cashier/reamount',
						payload:reamount
				})
		}
	}
	reamountblue=(e)=>{
		const values=e.target.value
		if(values){
				const reamount=parseFloat(e.target.value)
				if(reamount){
						this.props.dispatch({
								type:'cashier/reamount',
								payload:reamount
						})
				}

		}
	}
	payhindClick=()=>{
		if(!this.props.reamount || Number(this.props.reamount)<=0){
				message.warning('金额有误')
				return
		}
		let values={mbCardId:this.props.mbCardId,amount:this.props.reamount,type:this.props.rechargetype}
		if(values.type=='1'){
				values.type='7'
		}
		if(values.type=='2'){
				values.type='8'
		}
		GetServerData('qerp.pos.mb.card.charge',values)
		.then((json) => {
				if(json.code=='0'){
						const rechargevisible=false
						this.props.dispatch({
								type:'cashier/rechargevisible',
								payload:rechargevisible
						})
						const reamount=null
						this.props.dispatch({
								type:'cashier/reamount',
								payload:reamount
						})
						setTimeout(()=>{
								const orderNo=json.chargeNo  //订单号
								const odOrderId=json.mbCardMoneyChargeId  //订单id
								const consumeType='2' //充值订单
								const type=values.type//支付类型
								const amount=values.amount //支付金额
								this.context.router.push({ pathname : '/pay', state : {orderId :odOrderId,type:type,amount:amount,consumeType:consumeType,orderNo:orderNo}});
						})
				}else{
						message.warning(json.message)
						this.context.router.push({ pathname : '/pay', state : {orderId :'100',type:'7',amount:'100',consumeType:'1',orderNo:'0898u'}});
				}
		})
	}
	choosePrint=(e)=>{
			const recheckPrint=e.target.checked
			this.props.dispatch({
					type:'cashier/rechangeCheckPrint',
					payload:recheckPrint
			})
	}
	render(){
		const { dataSource } =this.state;
    const openWechat=sessionStorage.getItem("openWechat")
    const openAlipay=sessionStorage.getItem("openAlipay")
		return(
			<div className="uesleft-components-wrap">
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
								<span className='c74'>{this.props.name}</span>
								<span className='level-str'>{this.props.levelStr}</span>
								<span className='member-source'>{this.props.levelStr}</span>
							</div>
              <div className='fr'>
								<span className='themecolor level-margin-style' onClick={this.toggleEvent.bind(this)}>切换其他会员>></span>
								<span>{this.props.isBirthMonth=='true'?<span className='birthline'>
								<span className='line'></span>生日</span>:null}</span>
							</div>
            </div>
    				<div className='clearfix posion cashierbox_b'>
  						<div className='fl tc mt10 memberinfobox1 memberinfoboxlist' >
                <div className='c74 clearfix'>
									<p className='fl'>余额</p>
									<span onClick={this.showModal} className='themecolor'>充值</span>
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
				<Modal
					title="切换会员"
	        visible={this.state.visible}
	        onCancel={()=>this.onCancel()}
	        width={420}
	        closable={true}
	        className="toggle-modal-wrap"
	        footer={null}>
					<div>
						切换会员
						<Table
							bordered
							pagination={false}
							rowSelection={this.rowSelection}
							dataSource={dataSource}
							columns={columns}/>
					</div>
				</Modal>
				<Modal
          className='rechargepays'
          visible={this.props.rechargevisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={842}>
            <div className='clearfix'>
              <div className='fl'>
                <div className='rechargepays-list clearfix'>
                  <div className='fl listl'>会员姓名</div>
                  <div className='fr listr'>{this.props.name}</div>
                </div>
                <div className='rechargepays-list'>
                  <div className='fl listl'>会员卡号</div>
                  <div className='fr listr'>{this.props.cardNo}</div>
                </div>
                <div className='rechargepays-list'>
                  <div className='fl listl'>账户余额</div>
                  <div className='fr listr'>{this.props.amount}</div>
                </div>
              </div>
              <div className='fr'>
                <ul className='rechargelist'>
                  <li onClick={this.typelist.bind(this,1)} className={this.props.typeclick1?'rechargetype':'rechargetypeoff'}><Button>微信</Button></li>
                  <li onClick={this.typelist.bind(this,2)} className={this.props.typeclick2?'rechargetype':'rechargetypeoff'}><Button>支付宝</Button></li>
                  <li onClick={this.typelist.bind(this,3)} className={this.props.typeclick3?'rechargetype':'rechargetypeoff'}><Button>银联</Button></li>
                  <li onClick={this.typelist.bind(this,4)} className={this.props.typeclick4?'rechargetype':'rechargetypeoff'}><Button>现金</Button></li>
                </ul>
                <div className='rechargeover'>
                  <Input
                    autoComplete="off"
                    value={this.props.reamount}
                    onChange={this.reamount.bind(this)}
                    onBlur={this.reamountblue.bind(this)}
                    ref={(node)=>{this.input=node}}
                    addonBefore={<Btnbrfore title={this.props.rechargetype=='1'?'微信':(this.props.rechargetype=='2'?'支付宝':(this.props.rechargetype=='3'?'银联':(this.props.rechargetype=='4'?'现金':null)))}/>}
                    addonAfter={(this.props.rechargetype=='1' && openWechat=='1') ||(this.props.rechargetype=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.payhindClick.bind(this)}/>:null}
                    autoFocus/>
                </div>
              </div>
            </div>
            <div>
              <div className='tc rechargeok' onClick={this.handleOk.bind(this)}>
                  确定
              </div>
              <div style={{textAlign:"center",marginTop:"10px"}}>
                <Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.recheckPrint}>打印小票</Checkbox>
              </div>
            </div>
        </Modal>
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
					 datasouce,
					 meths,
					 recheckPrint,
					 rechargevisible,
					 reamount,
					 rechargetype,
					 typeclick1,
					 typeclick2,
					 typeclick3,
					 typeclick4,
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
						cardNoMobile,
						datasouce,
						meths,
						recheckPrint,
						rechargevisible,
						reamount,
						rechargetype,
						typeclick1,
						typeclick2,
						typeclick3,
						typeclick4,
					};
}

export default connect(mapStateToProps)(Operationls);
