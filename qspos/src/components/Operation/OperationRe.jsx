import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../Method/Print.jsx'

//充值弹窗
class Modales extends React.Component {
    state = { 
      	visible: false,
      	typeclick1:true,
      	typeclick2:false,
      	typeclick3:false,
      	typeclick4:false,
      	reamount:'',
      	type:1
   }
  showModal = () => {
    this.setState({
        visible: true,
    });
  }
  handleOk = (e) => {
  	let values={mbCardId:this.props.mbCardId,amount:this.state.reamount,type:this.state.type}
    const result=GetServerData('qerp.pos.mb.card.charge',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            console.log(json)
            if(json.code=='0'){
               	this.setState({
					visible: false,
				},function(){
					this.props.searchmemberinfo()
                    this.chargeInfo(json.mbCardMoneyChargeId)
				});
            }else{  
                console.log(json.message)   
            }
        })
    }

    //根据订单id请求订单详情
    chargeInfo=(mbCardMoneyChargeId)=>{
        let values={mbCardMoneyChargeId:mbCardMoneyChargeId}
        const result=GetServerData('qerp.pos.mb.card.charge.info',values)
            result.then((res) => {
                    return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        //打印
                            this.handprint(json.chargeInfo.mbCardMoneyChargeId,'mbCardMoneyCharge',json.chargeInfo.chargeNo)
                            message.success('充值成功')
                        }else{   
                            message.warning(json.message)
                        }
                    })
    }

    //打印
    handprint = (id,type,orderNo) => {
        GetLodop(id,type,orderNo)
    }

  handleCancel = (e) => {
    this.setState({
        visible: false,
    });
  }
  typelist=(index)=>{
  	if(index==1){
  		this.setState({
  			typeclick1:true,
		  	typeclick2:false,
		  	typeclick3:false,
		  	typeclick4:false,
		  	type:1
  		})
  	}
  	if(index==2){
  		this.setState({
  			typeclick1:false,
		  	typeclick2:true,
		  	typeclick3:false,
		  	typeclick4:false,
		  	type:2
  		})
  	}
  	if(index==3){
  		this.setState({
  			typeclick1:false,
		  	typeclick2:false,
		  	typeclick3:true,
		  	typeclick4:false,
		  	type:3
  		})
  	}
  	if(index==4){
  		this.setState({
  			typeclick1:false,
		  	typeclick2:false,
		  	typeclick3:false,
		  	typeclick4:true,
		  	type:4
  		})
  	}
  }
  reamount=(e)=>{
  	this.setState({
  		reamount:e.target.value
  	})
  }
  render(){
  	const mbCardId=this.props.mbCardId
    return (
        <div>
            <span onClick={this.showModal} className='themecolor'>充值</span>
            <Modal
                title="会员充值"
                visible={this.state.visible}
                width={350}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <div className='fl tc footleft' key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                    <div className='fr tc footright' key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                    <div key='line' className='footcen'></div>
                    ]}
                closable={false}
            >
                <p className='clearfix chargep'><span className='fl'>会员姓名</span><span className='fr'>{this.props.name}</span></p>
                <p className='clearfix chargep'><span className='fl'>会员卡号</span><span className='fr'>{this.props.cardNo}</span></p>
                <p className='clearfix chargep'><span className='fl'>账户余额</span><span className='fr'>{this.props.amount}</span></p>
              	<ul className='rechargelist'>
              		<li onClick={this.typelist.bind(this,1)}><Button className={this.state.typeclick1?'rechargetype':'rechargetypeoff'}>微信</Button></li>
              		<li onClick={this.typelist.bind(this,2)}><Button className={this.state.typeclick2?'rechargetype':'rechargetypeoff'}>支付宝</Button></li>
              		<li onClick={this.typelist.bind(this,3)}><Button className={this.state.typeclick3?'rechargetype':'rechargetypeoff'}>银联</Button></li>
              		<li onClick={this.typelist.bind(this,4)}><Button className={this.state.typeclick4?'rechargetype':'rechargetypeoff'}>现金</Button></li>
              	</ul>
                <div className='w clearfix mb30 w310'><div className='fl w310l'>充值金额</div> <Input className='fr w310ll' value={this.state.reamount} onChange={this.reamount.bind(this)}/></div>
            </Modal>
        </div>
    );
  }
}





class Operationls extends React.Component {
	state={
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
        mbCardId:''
	}
	clearingdata=(integertotalamount)=>{
        if(integertotalamount==null){
            this.setState({
                cardNoMobile:null
            },function(){
                // this.memberinfo()
            })


        }else{
            this.setState({
                cardNoMobile:integertotalamount.cardNo
            },function(){
                this.memberinfo()
            })


        }
		
	}
	updateintegertotalamount=(messages)=>{
		console.log(messages)
		this.setState({
			integertotalamount:Math.round(messages)
		},function(){
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
		},function(){
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
	
	//请求会员信息
	memberinfo=()=>{
		let values={cardNoMobile:this.state.cardNoMobile}
        const result=GetServerData('qerp.pos.mb.card.find',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            console.log(json)
            if(json.code=='0'){
                this.setState({
                	name:json.mbCardInfo.name,
                	levelStr:json.mbCardInfo.levelStr,
                	point:json.mbCardInfo.point,
                	amount:json.mbCardInfo.amount,
                	isBirthMonth:json.mbCardInfo.isBirthMonth,
                    cardNo:json.mbCardInfo.cardNo,
                    mbCardId:json.mbCardInfo.mbCardId
                })
            }else{  
                console.log(json.message)   
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
            mbCardId:''
        })
    }


	render(){
		return(
    		<div>
				<div className='clearfix mt30'>
	      			<Input placeholder='订单号' className='fl ml30 useinput' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)} value={this.state.barcode} onChange={this.barcodechange.bind(this)} onKeyDown={this.onKeydown.bind(this)}/>
	      			<Input placeholder='会员号/手机号' className='fl ml20 useinput' ref='member'  onKeyDown={this.onKeydown.bind(this)}  disabled/>
	    		</div>
	    		<div className='clearfix mt20'>
	    			<div className='returngood fl'><Switch checkedChildren="用户退货" unCheckedChildren="对外售卖" onChange={this.hindchange.bind(this)} checked={this.state.checked}/></div>
	    			<div className='fl cashierbox'>
	    				<div className='clearfix cashierbox_t'>
                            <div className='fl'><span className='c74 ml10'>会员姓名</span><span className='c38 ml10'>{this.state.name}</span></div>
                            <div className='fr'><span className='themecolor mr10'>{this.state.levelStr}</span><span className='mr10'>{this.state.isBirthMonth?'| 生日':null}</span></div>
                        </div>
	    				<div className='clearfix f14 posion cashierbox_b'>
	    					<div className='fl tc mt10'>
                                <p className='c74 clearfix'>
                                    <div className='fl'>余额</div>
                                    <div className='rechargebtn'>
                                        <Modales name={this.state.name} cardNo={this.state.cardNo} amount={this.state.amount} mbCardId={this.state.mbCardId} searchmemberinfo={this.memberinfo.bind(this)}/>
                                    </div>
                                </p>
                                <p className='c38'>{this.state.amount}</p>
                            </div>
	    					<div className='fr tc mt10'><p className='c74'>本次积分</p><p className='c38'>{this.state.integertotalamount}</p></div>
	    					<div className='w tc mt10'><p className='c74'>剩余积分</p><p className='c38'>{this.state.point}</p></div>
	    				</div>
	    			</div>
	    		</div>
    		</div>
		)
	}
	componentDidMount(){
		this.focustap()
	}
}

Operationls.contextTypes= {
    router: React.PropTypes.object
}

class Operationr extends React.Component {
	state={
		quantity:0,
		totalamount:0,
	}
	clearingdata=(messages,totalamount)=>{
		console.log(messages)
		this.setState({
			quantity:messages,
			totalamount:totalamount,
		},function(){
            this.props.revisedata({type:7,quantity:this.state.quantity,totalamount:this.state.totalamount})
        })
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
		)
	}
}


//操作区
class OperationRe extends React.Component {
	focustap=()=>{
		const focustap=this.refs.cashier.focustap
		focustap()
	}
	clearingdatas=(messages,totalamount)=>{
		const clearingdatas=this.refs.operationr.clearingdata
		clearingdatas(messages,totalamount)

	}
	clearingdatasl=(integertotalamount)=>{
		const clearingdatas=this.refs.cashier.clearingdata
		clearingdatas(integertotalamount)
	}
	//积分更新
	updateintegertotalamount=(messages)=>{
		const updateintegertotalamount=this.refs.cashier.updateintegertotalamount
		updateintegertotalamount(messages)
	}
    initdata=()=>{
        const initdatal=this.refs.cashier.initdatal
        const initdatar=this.refs.operationr.initdatar
        initdatal()
        initdatar()
    }
	render() {
		return(
			<div className='count clearfix'>
				<div className='opera'>
      				<div className='operationl fl'>
      					<Operationls 
                            tabledataset={this.props.tabledataset} 
                            cashrevisetabledatasouce={this.props.cashrevisetabledatasouce} 
                            ref='cashier' 
                            setonblue={this.props.setonblue}
                            revisedata={this.props.revisedata}
                            />
      				</div>
      				<div className='operationr fr'>
                        <Operationr 
                            color={this.props.color} 
                            type={this.props.type} 
                            ref='operationr'
                            revisedata={this.props.revisedata}
                            />
                    </div>
      			</div>
    		</div>
		)
	}
	
}
export default OperationRe;