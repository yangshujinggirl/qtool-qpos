import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../../services/services';
import {GetLodop} from '../../../components/Method/Print.jsx';
import {getRechargeOrderInfo} from '../../../components/Method/Print';

class Operationls extends React.Component { //左边输入订单号组件
	state={
		barcode:'',
		onBlur:true,
		cardNoMobile:null,  //会员手机号
		name:'',  //会员姓名
		levelStr:'',//会员级别
		point:'',//会员积分
		amount:'',//会员金额
		integertotalamount:null,
		checked:true,
		isBirthMonth:false,//是否生日
    cardNo:'',//会员卡号
    mbCardId:null,//会员卡id
    ismbCard:false, //是否是会员,
		mbCardInfo:{}
	}
	componentDidMount(){
		this.focustap()
	}
  //会员id
	clearingdata=(integertotalamount,ismbCard)=>{
        if(integertotalamount==null){
            this.setState({
                cardNoMobile:null,
                ismbCard:ismbCard
            })
        }else{
            this.setState({
                cardNoMobile:integertotalamount.cardNo,
                ismbCard:ismbCard
            },function(){
                this.memberinfo()
            })
        }

	}
	updateintegertotalamount=(messages)=>{
		this.setState({
			integertotalamount:Math.round(messages)
		},()=>{
      this.props.revisedata({type:9,data:this.state.integertotalamount})
    })
	}
	hindchange=(e)=>{
		if(e==false){
			this.context.router.push('/cashier')
		}
	}
	HindonKeyUp=(e)=>{
		//回车
		if(e.keyCode==13){
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.select()
            let barCode={odOrderNo:this.state.barcode}
            const cashrevisetabledatasouce=this.props.cashrevisetabledatasouce
            cashrevisetabledatasouce(barCode)
		}
		if(e.keyCode==9){
			this.focustapmember()
		}
	}
	barcodechange=(e)=>{
    var str=e.target.value.replace(/\s+/g,"");
		this.setState({
			barcode:str
		},()=>{
      this.props.revisedata({type:8,data:this.state.barcode})
    })
	}
	focustapmember=()=>{
		const Valuemember=ReactDOM.findDOMNode(this.refs.member)
         Valuemember.focus()
         this.setState({
         	onBlur:true
         },function(){
         	this.props.setonblue(this.state.onBlur)
         })
	}
	//根据订单号给的id请求会员信息
	memberinfo=()=>{
		let values={cardNoMobile:this.state.cardNoMobile}
    GetServerData('qerp.pos.mb.card.find',values)
    .then((json) => {
				const { mbCardInfo } =json;
				console.log(json)
        if(json.code=='0'){
          this.setState({
          	name:mbCardInfo.name,
          	levelStr:mbCardInfo.levelStr,
          	point:mbCardInfo.point,
          	amount:mbCardInfo.amount,
          	isBirthMonth:mbCardInfo.isBirthMonth,
            cardNo:mbCardInfo.cardNo,
            mbCardId:mbCardInfo.mbCardId,
						mbCardInfo:mbCardInfo
          },()=>{
            this.props.revisedata({type:11,point:this.state.point,amount:this.state.amount})
          })
        }else{
          message.warning(json.message)
        }
    })
	}
	focustap=()=>{
		const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
        ValueorderNoses.focus()
        this.setState({
            onBlur:false
        },function(){
         	this.props.setonblue(this.state.onBlur)
        })
	}
	onKeydown=(e)=>{
		if(e.keyCode==9){
			e.preventDefault()
		}
	}
	cardNoMobilechange=(e)=>{
		this.setState({
			cardNoMobile:e.target.value
		})
	}
  initdatal=()=>{
        this.setState({
            barcode:'',
            onBlur:true,
            cardNoMobile:'',
            name:'',
            levelStr:'',
            point:'',
            amount:'',
            integertotalamount:null,
            checked:true,
            isBirthMonth:false,
            cardNo:'',
            mbCardId:null
        })
    }
	render(){
		const { mbCardInfo } =this.state;
		const { orderInfo } =this.props;
		return(
  		<div>
				<div className='clearfix mt30'>
    			<Input
						placeholder='订单号'
						autoComplete="off"
						className='fl ml30 useinput'
						ref='barcode'
						onKeyUp={this.HindonKeyUp.bind(this)}
						value={this.state.barcode}
						onChange={this.barcodechange.bind(this)}
						onKeyDown={this.onKeydown.bind(this)}/>
    			<Input
						placeholder='会员号/手机号'
						autoComplete="off"
						className='fl ml20 useinput'
						ref='member'
						onKeyDown={this.onKeydown.bind(this)}
						disabled/>
	    		</div>
	    		<div className='clearfix mt20'>
	    			<div className='returngood fl'>
							<Switch
								checkedChildren="用户退货"
								unCheckedChildren="对外售卖"
								onChange={this.hindchange.bind(this)}
								checked={this.state.checked}/>
								{
									orderInfo.messageInfo&&<div className="order-message">{orderInfo.messageInfo}</div>
								}
						</div>
	    			<div className='fl cashierbox'>
	    				<div className='clearfix cashierbox_t'>
                  <div className='fl'>
										<span className='c38 ml10'>{mbCardInfo.name}</span>
										{
											mbCardInfo.levelStr&&<span className='themecolor level-str'>{mbCardInfo.levelStr}</span>
										}
										{ mbCardInfo.isLocalShop == 'false' &&<span className='member-source'>异店</span>}
									</div>
              </div>
	    				<div className='clearfix f14 posion cashierbox_b'>
								<div className='item-label' >
	                <div className='c74 top-action'>
										<span>余额</span>
										<span className="lines"></span>
									</div>
	                <p className='c38 label-num'>{mbCardInfo.amount}</p>
	              </div>

	    					<div className='item-label'>
	              	<div className='c74 top-action'>
										<span>剩余积分</span>
										<span className="lines"></span>
									</div>
	              	<p className='c38 label-num'>{mbCardInfo.point}</p>
	              </div>
								<div className='item-label'>
	                <div className='c74 top-action'>本次积分</div>
	                <p className='c38 label-num'>{this.state.integertotalamount}</p>
	              </div>
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
//操作区
class OperationRe extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			quantity:0,
			totalamount:0,
		}
	}
	clearingdata=(messages,totalamount)=>{
		this.setState({
			quantity:messages, //总数
			totalamount:totalamount, //总价钱
		},()=>{
        this.props.revisedata({
					type:7,quantity:this.state.quantity,
					totalamount:this.state.totalamount
				})
    })
	}
	initdatar=()=>{
    this.setState({
        quantity:0,
        totalamount:0,
    })
	}
	focustap=()=>{
		const focustap=this.refs.cashier.focustap
		focustap()
	}
	clearingdatas=(messages,totalamount)=>{
		// const clearingdatas=this.refs.operationr.clearingdata
		this.clearingdata(messages,totalamount)
	}
	//接收会员信息
	clearingdatasl=(integertotalamount,ismbCard)=>{
		const clearingdatas=this.refs.cashier.clearingdata
		clearingdatas(integertotalamount,ismbCard)
	}
	//积分更新
	updateintegertotalamount=(messages)=>{
		const updateintegertotalamount=this.refs.cashier.updateintegertotalamount
		updateintegertotalamount(messages)
	}
	initdata=()=>{
	  const initdatal=this.refs.cashier.initdatal
	  // const initdatar=this.refs.operationr.initdatar
	  initdatal()
	  this.initdatar()
	}
	hindpayclick=()=>{
	  // const showpops=this.props.showpops
	  this.props.showpops()
	}
	render() {
		const { color, orderInfo } =this.props;
		return(
			<div className='count clearfix'>
				<div className='opera'>
	    				<div className='operationl fl'>
	    					<Operationls
	                tabledataset={this.props.tabledataset}
	                cashrevisetabledatasouce={this.props.cashrevisetabledatasouce}
	                ref='cashier'
									orderInfo={orderInfo}
	                setonblue={this.props.setonblue}
	                revisedata={this.props.revisedata}/>
	    				</div>
	    				<div className='operationr fr' onClick={this.hindpayclick.bind(this)}>
								<div className={color?'operationcon':'operationconbg'}>
						    			<div className='fl list1'>
						    				<div className='con1'>结算</div>
						    				<div className='con2'>「空格键」</div>
						    			</div>
						    			<div className='fl list2'>
						    				<div className='con1'>数量</div>
						    				<div className='con2'>{this.state.quantity}</div>
						    			</div>
						    			<div className='fl list3'>
						    				<div className='con1'>金额</div>
						    				<div className='con2'>{this.state.totalamount}</div>
						    			</div>
						  		</div>
	                {/* <Operationr
	                    color={this.props.color}
	                    type={this.props.type}
	                    ref='operationr'
	                    revisedata={this.props.revisedata}/> */}
	            </div>
	    			</div>
	  		</div>
		)
	}
}


export default OperationRe;
