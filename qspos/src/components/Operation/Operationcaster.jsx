import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../Method/Print.jsx'


//收银操作左边区
class Operationls extends React.Component {
	state={
		barcode:'',
		onBlur:true,
		cardNoMobile:'',
		name:'',
		levelStr:'',
		point:'',//积分
		amount:'',//余额
		integertotalamount:null,
		checked:false,
		cardNo:'',
		mbCardId:null,
        isBirthMonth:false

	}
	clearingdata=(integertotalamount)=>{
		this.setState({
			integertotalamount:integertotalamount
		},function(){
            this.props.revisedata({type:5,data:this.state.integertotalamount})
        })
	}
	hindchange=(e)=>{
		console.log(e)
		if(e==true){
			this.setState({
				checked:true
			},function(){
				this.context.router.push('/returngoods')
			})
		}
	}

	//barcode keyup
	HindonKeyUp=(e)=>{
        console.log(e.keyCode)
		//回车
		if(e.keyCode==13){
			const ValueorderNoses=ReactDOM.findDOMNode(this.refs.barcode)
            ValueorderNoses.select()
            let barCode={barCode:this.state.barcode}
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
		})
	}
	focustapmember=()=>{
		const Valuemember=ReactDOM.findDOMNode(this.refs.member)
         Valuemember.focus()
         console.log(12)
         this.setState({
         	onBlur:true
         },function(){
         	this.props.setonblue(this.state.onBlur)
         })
	}

	//会员号
	memberHindonKeyUp=(e)=>{
		if(e.keyCode==9){
         	this.focustap()
         }
         if(e.keyCode==13){
			this.searchmemberinfo()
         }
	}

	// 根据会员号或手机号查询会员信息
	searchmemberinfo=()=>{
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
                            	cardNo:json.mbCardInfo.cardNo,
                            	mbCardId:json.mbCardInfo.mbCardId,
                                isBirthMonth:json.mbCardInfo.isBirthMonth
                            },function(){
                                this.props.Backmemberinfo(this.state.amount,this.state.point)
                                this.props.revisedata({type:2,data:this.state.mbCardId})
                                this.props.revisedata({type:5,data:this.state.integertotalamount})
                                this.focustap()
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
        var str=e.target.value.replace(/\s+/g,""); 
		this.setState({
			cardNoMobile:str
		},function(){
            this.clearmamberinfo()
        })
	}

    initdatar=()=>{
        this.setState({
            barcode:'',
            onBlur:true,
            cardNoMobile:'',
            name:'',
            levelStr:'',
            point:'',//积分
            amount:'',//余额
            integertotalamount:null,
            checked:false,
            cardNo:'',
            mbCardId:null,
            isBirthMonth:false
        })
    }
    clearmamberinfo=()=>{
        this.setState({
            name:'',
            levelStr:'',
            point:'',//积分
            amount:'',//余额
            cardNo:'',
            mbCardId:null,
            isBirthMonth:false

        })
    }


	render(){
		return(
			<div>
				<div className='operationl clearfix mt30'>
	      			<Input placeholder='扫码或输入条形码' className='fl ml30 useinput' ref='barcode' onKeyUp={this.HindonKeyUp.bind(this)} value={this.state.barcode} onChange={this.barcodechange.bind(this)} onKeyDown={this.onKeydown.bind(this)}/>
	      			<Input placeholder='会员号/手机号' className='fl ml20 useinput' ref='member' onKeyUp={this.memberHindonKeyUp.bind(this)} onKeyDown={this.onKeydown.bind(this)} value={this.state.cardNoMobile} onChange={this.cardNoMobilechange.bind(this)}/>
	    		</div>
	    		<div className='clearfix mt20'>
	    			<div className='cashier fl'><Switch checkedChildren="用户退货" unCheckedChildren="对外售卖" onChange={this.hindchange.bind(this)} checked={this.state.checked}/></div>
	    			<div className='fl cashierbox'>
	    				<div className='clearfix cashierbox_t'>
                            <div className='fl'><span className='c74'>会员姓名</span><span className='c38 ml10'>{this.state.name}</span></div>
                            <div className='fr'><span className='themecolor level-margin-style'>{this.state.levelStr}</span><span>{this.state.isBirthMonth=='true'?<span className='birthline'><span className='line'></span>生日</span>:null}</span></div>
                        </div>
	    				<div className='clearfix posion cashierbox_b'>
	    					<div className='fl tc mt10 memberinfobox1 memberinfoboxlist' >
                                <p className='c74 clearfix'><div className='fl'>余额</div><div className='rechargebtn'><Modales name={this.state.name} cardNo={this.state.cardNo} amount={this.state.amount} mbCardId={this.state.mbCardId} searchmemberinfo={this.searchmemberinfo.bind(this)}/></div></p>
                                <p className='c38 p2'>{this.state.amount}</p>
                            </div>
                            <div className='fr tc mt10 memberinfobox2 memberinfoboxlist'>
                                <p className='c74 p1'>本次积分</p>
                                <p className='c38 p2'>{this.state.mbCardId?this.state.integertotalamount:null}</p>
                            </div>
	    					<div className='w tc mt10 memberinfobox3 memberinfoboxlist'>
                                <p className='c74'>剩余积分</p>
                                <p className='c38 p2'>{this.state.point}</p>
                            </div>
                            <div className='lines lines1'></div>
                            <div className='lines lines2'></div>
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



//金额区
class Operationr extends React.Component {
	state={
		quantity:0,
		totalamount:0,
	
	}
	hindclick=()=>{
		console.log(1)
	}
	clearingdata=(messages,totalamount)=>{
		console.log(messages)
		this.setState({
			quantity:messages,
			totalamount:totalamount,//总金额
			
		},function(){
            this.props.Backemoney(this.state.totalamount)
            this.props.revisedata({type:4,data:this.state.quantity,totalamount:this.state.totalamount})
        })
	}


	render() {
		const color=this.props.color
		const type=this.props.type
		return(   
            <div className={color?'operationcon':'operationconbg'}>
                <div className='fl list1' onClick={this.hindclick.bind(this)}>
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

//充值弹窗
class Modales extends React.Component {
    constructor(props) {
        super(props);
        this.firstclick=true
     }
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
    //判断有没有填写会员信息
    if(this.props.mbCardId==null || undefined || ''){
            message.warning('请输入正确的会员卡号')
    }else{
        this.setState({
            visible: true,
        });
    }
    
  }
  handleOk = (e) => {
    if(this.firstclick){
            //可以执行
            this.firstclick=false

    }else{
            //不可以执行
            return
    }
  	let values={mbCardId:this.props.mbCardId,amount:this.state.reamount,type:this.state.type}
         	 const result=GetServerData('qerp.pos.mb.card.charge',values)
         	  result.then((res) => {
                        return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                           	this.setState({
     							 visible: false,
                                 reamount:''
    						},function(){
                                this.firstclick=true
    							this.props.searchmemberinfo()
                                message.success('充值成功',1)
                                const mbCardMoneyChargeIds=json.mbCardMoneyChargeId
                                const chargeNos=json.chargeNo
                                //判断打印
                                if(navigator.platform == "Windows"){
                                    const result=GetServerData('qerp.pos.sy.config.info')
                                    result.then((res) => {
                                    return res;
                                    }).then((json) => {
                                    console.log(json);
                                        if(json.code == "0"){
                                             if(json.config.rechargePrint=='1'){
                                                //判断是打印大的还是小的
                                                if(json.config.paperSize=='80'){
                                                    this.handprint(mbCardMoneyChargeIds,'mbCardMoneyCharge',chargeNos,true)
                                                }else{
                                                    this.handprint(mbCardMoneyChargeIds,'mbCardMoneyCharge',chargeNos,true)
                                                }
                                                
                                             }
                                        }else{
                                            message.warning('打印失败')
                                            }
                                    })

                            }
                                
    						});
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
    console.log(e);
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
  render() {
  	const mbCardId=this.props.mbCardId
    return (
      <div>
        <span onClick={this.showModal} className='themecolor'>充值</span>
        <Modal
            className='rechargepays'
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
        
          <div className='w clearfix w310'><div className='fl w310l'>充值金额</div> <Input className='fr w310ll' value={this.state.reamount} onChange={this.reamount.bind(this)}/></div>
        </Modal>
      </div>
    );
  }
}




//操作区
class Operation extends React.Component {
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
    initdatar=()=>{
        const initdatar=this.refs.cashier.initdatar
        initdatar()
    }
    hindpayclick=()=>{
        const showpops=this.props.showpops
        showpops()
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
                                Backmemberinfo={this.props.Backmemberinfo}
                                revisedata={this.props.revisedata}
                            />			
      				</div>
      				<div className='operationr fr' onClick={this.hindpayclick.bind(this)}>
                        <Operationr color={this.props.color} type={this.props.type} ref='operationr' Backemoney={this.props.Backemoney} revisedata={this.props.revisedata}/>
                    </div>
      			</div>
    		</div>
		)
	}
	
}
export default Operation;