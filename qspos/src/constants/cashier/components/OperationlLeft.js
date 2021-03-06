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

import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {GetServerData} from '../../../services/services';
import {printRechargeOrder} from '../../../components/Method/Method';
import Btnpay from './Btnpay';
import Btnbrforepay from './Btnbrforepay';
import './OperationlLeft.less';


const columns = [{
			title:'会员名称',
			dataIndex: 'name',
			key: 'name',
	},{
			title:'可用积分',
			dataIndex: 'point',
			key: 'point',
	}]
class Operationls extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			barcode:'',
			onBlur:true,
			cardNoMobile:'',
			name:'',
			// levelStr:'',
			integertotalamount:null,
			checked:false,
			cardNo:'',
			mbCardId:null,
	    isBirthMonth:false,
			dataSource:[],
			selectedRowKeys:[],
			loading:false,
			remark:''
		}

		this.firstclick=true
	}
	componentDidMount(){
		this.props.setDom(this.refs.barcodeRefs)
	}
	componentDidUpdate(){
		// debugger
   // if(this.input){
   //     const ValueorderNoses = ReactDOM.findDOMNode(this.input.input)
   //     ValueorderNoses.focus()
   // }
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
		const ismember=false
		this.props.dispatch({
			type:'cashier/cardNoMobile',
			payload:cardNoMobile
		})
		this.props.dispatch({
			type:'cashier/memberlist',
			payload:{ismember,memberinfo:{isLocalShop:true}}
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
	//会员获取焦点
	focustapmember=()=>{
		if(!this.refs.memberRefs) {
			return;
		}
		const Valuemember=ReactDOM.findDOMNode(this.refs.memberRefs)
		Valuemember.focus()
		this.props.dispatch({
		 type:'cashier/onbule',
		 payload:true
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
			// this.focustap();
			this.props.setDom(this.refs.barcodeRefs)
		}else if(e.keyCode==13){
			this.searchmemberinfo()
		}
	}
	// 根据会员号或手机号查询会员信息
	searchmemberinfo=()=>{
		const { cardNoMobile } =this.props;
		this.props.checkIsPhone(cardNoMobile,'input')
		this.props.dispatch({
			type:'cashier/memberinfo',
			payload:{cardNoMobile}
		});
		this.props.setDom(this.refs.barcodeRefs)
	}
	//选择会员
	checkChange=(selectedRowKeys, selectedRows)=> {
		let cardNoMobile = selectedRows[0].cardNo;
		this.props.checkIsPhone(cardNoMobile,'cardNo')
		this.props.dispatch({
			type:'cashier/memberinfo',
			payload:{
				cardNoMobile
			}
		})
		this.setState({ visible: false });
		this.props.setSpace(true);//非结算弹框时，不可空格结算;
	}
	//切换会员
	toggleEvent() {
		GetServerData('qerp.pos.mb.card.switch',{mobile:this.props.cardNoMobile})
		.then((res) => {
			if(res.code == '0') {
				res.iQposMbCards&&res.iQposMbCards.map((el,index) => (el.key = index))
				let selectedRowKeys = res.iQposMbCards.findIndex((value, index, arr) => {
					return value.cardNo == this.props.memberinfo.cardNo
				})
				this.props.setSpace(false);//非结算弹框时，不可空格结算;
				this.setState({
					dataSource:res.iQposMbCards,
					visible:true,
					selectedRowKeys:[selectedRowKeys]
				});
			}
		},(error) => {
			console.log(error)
		})
	}
	onCancel() {
		this.props.setSpace(true);//非结算弹框时，不可空格结算;
		this.setState({ visible:false })
	}
	//充值
	showModal = () => {
		const { memberinfo } =this.props;
		//判断有没有填写会员信息
		if(memberinfo.mbCardId==null || undefined || ''){
				message.warning('请输入正确的会员卡号');
				return;
		}
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
						this.props.setSpace(false);//非结算弹框时，不可空格结算;
						const rechargevisible=true
						this.props.dispatch({
								type:'cashier/rechargevisible',
								payload:rechargevisible
						})
				}
		})
	}
	handleOk = (e) => {
		if(this.firstclick){
				this.firstclick=false
		}else{
				return
		}
		const { memberinfo } = this.props;
		this.setState({ loading: true })
		let values={
			mbCardId:memberinfo.mbCardId,
			amount:this.props.reamount,
			type:this.props.rechargetype,
			remark:this.state.remark
		}
		GetServerData('qerp.pos.mb.card.charge',values)
		.then((json) => {
				if(json.code=='0'){
						const reamount=null
						this.props.dispatch({
								type:'cashier/reamount',
								payload:reamount
						})
						const rechargevisible=false
						this.props.dispatch({
								type:'cashier/rechargevisible',
								payload:rechargevisible
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
				this.setState({ loading: false, remark:'' })
		})
	}
		//打印
	handprint = (id,type,orderNo,size) => {
			GetLodop(id,type,orderNo,size)
	}
	handleCancel = (e) => {
		this.setState({ remark:'' })
		//清除表单历史数据
			const reamount=null
			this.props.dispatch({
					type:'cashier/reamount',
					payload:reamount
			})
			const rechargevisible=false
			this.props.dispatch({
					type:'cashier/rechargevisible',
					payload:rechargevisible
			})
	}
	typelist=(index)=>{
		let typeclick1,typeclick2,typeclick3,typeclick4,rechargetype;
		switch(index) {
			case 0:
				typeclick1=true
				typeclick2=false
				typeclick3=false
				typeclick4=false
				rechargetype=1;
				break;
			case 1:
				typeclick1=false
				typeclick2=true
				typeclick3=false
				typeclick4=false
				rechargetype=2;
				break;
			case 2:
				typeclick1=false
				typeclick2=false
				typeclick3=true
				typeclick4=false
				rechargetype=3
				break;
			case 3:
				typeclick1=false
				typeclick2=false
				typeclick3=false
				typeclick4=true
				rechargetype=4
				break;
		}
		this.props.dispatch({
				type:'cashier/typeclicks',
				payload:{typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
		})
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
		const { memberinfo, reamount, rechargetype } = this.props;
		if(!reamount || Number(reamount)<=0){
				message.warning('金额有误')
				return
		}
		let values={
			mbCardId:memberinfo.mbCardId,
			amount:reamount,
			type:rechargetype,
			orderRemark:this.state.remark
		}
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
								this.context.router.push({
									pathname : '/pay',
									state : {
										orderId :odOrderId,
										type:type,
										amount:amount,
										consumeType:
										consumeType,
										orderNo:orderNo,
										remark:this.state.remark
									}
								});
						})
				}else{
						message.warning(json.message)
						this.context.router.push({
							pathname : '/pay',
							state : {
								orderId :'100',
								type:'7',
								amount:'100',
								consumeType:'1',
								orderNo:'0898u',
								remark:this.state.remark
							}
						});
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
	addonBeforeLabel() {
		let {rechargetype} = this.props;
		let title;
		switch(rechargetype) {
			case '1':
				title = '微信';
				break;
			case '2':
				title = '支付宝';
				break;
			case '3':
				title = '银联';
				break;
			case '4':
				title = '现金';
				break;
			default:
				title = null;
		}
		return <Btnbrforepay title={title}/>
	}
	addonAfterLabel() {
		let { rechargetype } = this.props;
		const openWechat=sessionStorage.getItem("openWechat")
		const openAlipay=sessionStorage.getItem("openAlipay");
		if((rechargetype=='1' && openWechat=='1')||(rechargetype=='2' && openAlipay=='1')) {
			return <Btnpay hindClicks={this.payhindClick.bind(this)}/>
		} else {
			return null;
		}
	}
	handleRemark =(e)=> {
		this.setState({ remark: e.target.value })
	}
	render(){
		const { memberinfo, isPhone } =this.props;
		const { dataSource, loading, remark } =this.state;
    const openWechat=sessionStorage.getItem("openWechat")
    const openAlipay=sessionStorage.getItem("openAlipay");

		const rowSelection={
			onChange:this.checkChange,
			type:'radio',
			selectedRowKeys:this.state.selectedRowKeys
		};
		const payBtnList=[
			{
				typeclick:this.props.typeclick1,
				type:'微信'
			},{
				typeclick:this.props.typeclick2,
				type:'支付宝'
			},{
				typeclick:this.props.typeclick3,
				type:'银联'
			},{
				typeclick:this.props.typeclick4,
				type:'现金'
			}]
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
								<span className='c74 member-name'>{memberinfo.name}</span>
								{memberinfo.levelStr&&<span className='level-str'>{memberinfo.levelStr}</span>}
								{memberinfo.isBirthMonth =='true'&&memberinfo.isLocalShop =='true'&&
									<span className='level-str birth-level'>生日月</span>}
								{
									memberinfo.isLocalShop =='false'&&<span className='member-source'>异店</span>
								}
							</div>
              <div className='fr'>
								{
									isPhone&&memberinfo.isMoreShop =='true'&&<span
										className='themecolor toggle-btn'
										onClick={this.toggleEvent.bind(this)}>切换会员>></span>
								}
							</div>
            </div>
    				<div className='clearfix posion cashierbox_b'>
  						<div className='item-label' >
                <div className='c74 top-action'>
									<span>余额</span>
									{
										memberinfo.mbCardId&&memberinfo.isLocalShop =='true'&&
										<span
											onClick={this.showModal}
											className='themecolor recharge'
											style={{'cursor':'pointer','marginLeft':'4px'}}>充值</span>
									}
									<span className="lines"></span>
								</div>
                <p className='c38  label-num'>{memberinfo.amount}</p>
              </div>
              <div className='item-label'>
                <p className='c74 top-action'>
									本次积分<span className="lines"></span>
								</p>
                <p className='c38  label-num'>{memberinfo.mbCardId?this.props.thispoint:null}</p>
              </div>
    					<div className='item-label'>
              	<div className='c74'>剩余积分</div>
              	<p className='c38  label-num'>{memberinfo.point}</p>
              </div>
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
					<div className="main-content">
						<Table
							className="member-table"
							bordered
							pagination={false}
							rowSelection={rowSelection}
							dataSource={dataSource}
							columns={columns}/>
					</div>
				</Modal>
				<Modal
          className='rechargepays recharge-modal'
          visible={this.props.rechargevisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={842}>
            <div className='clearfix'>
              <div className='fl'>
                <div className='rechargepays-list clearfix'>
                  <div className='fl listl'>会员姓名</div>
                  <div className='fr listr'>{memberinfo.name}</div>
                </div>
                <div className='rechargepays-list'>
                  <div className='fl listl'>会员卡号</div>
                  <div className='fr listr'>{memberinfo.cardNo}</div>
                </div>
                <div className='rechargepays-list'>
                  <div className='fl listl'>账户余额</div>
                  <div className='fr listr'>{memberinfo.amount}</div>
                </div>
              </div>
              <div className='fr'>
                <ul className='rechargelist'>
								{
									payBtnList.map((el,index) => (
										<li
											key={index}
											onClick={this.typelist.bind(this,index)}
											className={el.typeclick?'rechargetype':'rechargetypeoff'}>
											<Button>{el.type}</Button>
										</li>
									))
								}
                </ul>
                <div className='rechargeover'>
                  <Input
                    autoComplete="off"
                    value={this.props.reamount}
                    onChange={this.reamount.bind(this)}
                    onBlur={this.reamountblue.bind(this)}
                    ref={(node)=>{this.input=node}}
                    addonBefore={this.addonBeforeLabel()}
                    addonAfter={this.addonAfterLabel()}
                    autoFocus/>
                </div>
              </div>
            </div>
						<div className='rechargeover remark-wrap'>
							<Input
								autoComplete="off"
								addonBefore={
									<Btnbrforepay title='备注' dis={false}/>
								}
								placeholder="可输入20字订单备注"
								maxLength={20}
								id="odRemarkInput"
								className='tr'
								value={remark}
								onChange={this.handleRemark}/>
						</div>
            <div>
							<Button
								loading={loading}
								className='tc rechargeok'
								onClick={this.handleOk.bind(this)}>
									确定
							</Button>
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
					 cardNoMobile,
					 memberinfo
				 } = state.cashier;
	return {
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
						memberinfo
					};
}

export default connect(mapStateToProps)(Operationls);
