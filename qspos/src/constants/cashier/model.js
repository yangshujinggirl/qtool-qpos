import { Modal, Button ,Input,message} from 'antd'
import { connect } from 'dva';
import {GetServerData} from '../../services/services';
import {printRechargeOrder} from '../../components/Method/Method'
import {getRechargeOrderInfo} from '../../components/Method/Print';
import Btnpay from './btnpay'


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
                printRechargeOrder(mbCardMoneyChargeIds)
                
                
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
    render() {
          const mbCardId=this.props.mbCardId
          // const openWechat=sessionStorage.getItem("openWechat")
        // const openAlipay=sessionStorage.getItem("openAlipay")
        const openWechat='1'
        const openAlipay='1'
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
                <div className='w clearfix w310'>
                    <div className='fl w310l'>充值金额</div> 
                    <div>
                        <Input  
                            autoComplete="off" 
                            className='fr w310ll' 
                            value={this.state.reamount} 
                            onChange={this.reamount.bind(this)}
                            addonAfter={(this.state.type=='1' && openWechat=='1') ||(this.state.type=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.payhindClick.bind(this)}/>:null}
                            />
                       
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
    const {datasouce,meths}=state.cashier
    return {datasouce,meths};
}
export default connect(mapStateToProps)(Modales);
