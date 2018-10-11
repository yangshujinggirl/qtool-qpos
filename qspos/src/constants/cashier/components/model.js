import { Modal, Button ,Input,message,Checkbox} from 'antd'
import { connect } from 'dva';
import {GetServerData} from '../../../services/services';
import {printRechargeOrder} from '../../../components/Method/Method'
import {getRechargeOrderInfo} from '../../../components/Method/Print';
import Btnpay from './btnpay'
import Btnbrfore from './btnbefore'
import ReactDOM from 'react-dom';


class Modales extends React.Component {
  constructor(props) {
      super(props);
      this.firstclick=true
      this.state = {}
   }
  componentDidUpdate(){
   if(this.input){
       const ValueorderNoses = ReactDOM.findDOMNode(this.input.input)
       ValueorderNoses.focus()
   }
  }
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
                this.props.searchmemberinfo()
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
    const mbCardId=this.props.mbCardId
    const openWechat=sessionStorage.getItem("openWechat")
    const openAlipay=sessionStorage.getItem("openAlipay")
    return (
      <div>
        <span onClick={this.showModal} className='themecolor'>充值</span>
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
    );
  }

}


Modales.contextTypes= {
    router: React.PropTypes.object
}

function mapStateToProps(state) {
    const {datasouce,meths,recheckPrint,rechargevisible,reamount,rechargetype,typeclick1,typeclick2,typeclick3,typeclick4}=state.cashier
    return {datasouce,meths,recheckPrint,rechargevisible,reamount,rechargetype,typeclick1,typeclick2,typeclick3,typeclick4};
}
export default connect(mapStateToProps)(Modales);
