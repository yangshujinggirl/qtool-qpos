import { Modal, Button ,Input,message,Checkbox} from 'antd'
import { connect } from 'dva';
import {GetServerData} from '../../services/services';
import {printRechargeOrder} from '../../components/Method/Method'
import {getRechargeOrderInfo} from '../../components/Method/Print';
import Btnpay from './btnpay'
import Btnbrfore from './btnbefore'


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
        type:1,

   }
  showModal = () => {
    //判断有没有填写会员信息
    if(this.props.mbCardId==null || undefined || ''){
            message.warning('请输入正确的会员卡号')
    }else{
        const result=GetServerData('qerp.pos.sy.config.info')
        result.then((res) => {
           return res;
         }).then((json) => {
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

        this.setState({
            visible: true,
        });
    }
  }
  handleOk = (e) => {
    if(this.firstclick){
        this.firstclick=false
    }else{
        return
    }
  	let values={mbCardId:this.props.mbCardId,amount:this.state.reamount,type:this.state.type}
    const result=GetServerData('qerp.pos.mb.card.charge',values)
    result.then((res) => {
        return res;
    }).then((json) => {
        if(json.code=='0'){
            this.setState({
                visible: false,
                reamount:''
            },function(){
                this.firstclick=true
                this.props.searchmemberinfo()
                message.success('充值成功',1)
                const mbCardMoneyChargeIds=json.mbCardMoneyChargeId;
                const chargeNos=json.chargeNo;
                printRechargeOrder(this.props.recheckPrint,mbCardMoneyChargeIds)
                
                
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
  payhindClick=()=>{
      console.log(1)
      let values={mbCardId:this.props.mbCardId,amount:this.state.reamount,type:this.state.type}
        // if(values.type=='1'){
        //     values.type='7'
        // }
        // if(values.type=='2'){
        //     values.type='8'
        // }
        const result=GetServerData('qerp.pos.mb.card.charge',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                this.setState({
                    visible: false,
                    reamount:''
                },function(){
                    const orderNo=json.chargeNo  //订单号
                    const odOrderId=json.mbCardMoneyChargeId  //订单id
                    const consumeType='2' //充值订单
                    const type=values.type//支付类型
                    const amount=values.amount //支付金额
                    this.context.router.push({ pathname : '/pay', state : {orderId :odOrderId,type:type,amount:amount,consumeType:consumeType,orderNo:orderNo}});  
                });
            }else{
                message.warning(json.message)
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
            const mbCardId=this.props.mbCardId
            const openWechat=sessionStorage.getItem("openWechat")
            const openAlipay=sessionStorage.getItem("openAlipay")
        return (
        <div>
            <span onClick={this.showModal} className='themecolor'>充值</span>
            <Modal
                className='rechargepays'
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                width={842}
                
            >   
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
                            <li onClick={this.typelist.bind(this,1)}><Button className={this.state.typeclick1?'rechargetype':'rechargetypeoff'}>微信</Button></li>
                            <li onClick={this.typelist.bind(this,2)}><Button className={this.state.typeclick2?'rechargetype':'rechargetypeoff'}>支付宝</Button></li>
                            <li onClick={this.typelist.bind(this,3)}><Button className={this.state.typeclick3?'rechargetype':'rechargetypeoff'}>银联</Button></li>
                            <li onClick={this.typelist.bind(this,4)}><Button className={this.state.typeclick4?'rechargetype':'rechargetypeoff'}>现金</Button></li>
                        </ul>
                        <div className='rechargeover'>
                            <Input  
                                autoComplete="off" 
                                value={this.state.reamount} 
                                onChange={this.reamount.bind(this)}
                                addonBefore={<Btnbrfore title={this.state.type=='1'?'微信':(this.state.type=='2'?'支付宝':(this.state.type=='3'?'银联':(this.state.type=='4'?'现金':null)))}/>}
                                addonAfter={(this.state.type=='1' && openWechat=='1') ||(this.state.type=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.payhindClick.bind(this)}/>:null}
                                />
                        </div>
                    </div>
                </div>
                <div>
                    <div className='tc rechargeok' onClick={this.handleOk.bind(this)}>
                        确定
                    </div>
                    <div style={{textAlign:"center"}}><Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.recheckPrint}>打印小票</Checkbox></div>
                </div>

                
                
            </Modal>
        </div>
    );
  }
}


Modales.contextTypes= {
    router: React.PropTypes.object
}

function mapStateToProps(state) {
    const {datasouce,meths,recheckPrint}=state.cashier
    return {datasouce,meths,recheckPrint};
}
export default connect(mapStateToProps)(Modales);
