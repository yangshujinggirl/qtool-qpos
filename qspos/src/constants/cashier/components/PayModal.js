import { Modal, Button ,Input,message,Checkbox } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../../services/services';
import { GetLodop, getSaleOrderInfo} from '../../../components/Method/Print'
import {printSaleOrder} from '../../../components/Method/Method'
import {dataedit} from '../../../utils/commonFc';
import NP from 'number-precision'
import Btnpay from './btnpay'
import Scanbtn from '../../../components/Button/scanbtn';
import Btnbrforepay from './btnbeforepay';
import ValidataModal from './ValidataModal';


class PayModal extends React.Component {
    constructor(props) {
      super(props);
      this.firstclick=true;
      this.state = {
          text:null,
          initModel:this.initModel,
          waringfirst:false,
          visible: false,
          backmoney:'0.00',
          validateVisible:false,
          validatePhoneCode:'',
          loading:false,//弹框确定按钮Loading
          scanType:false,
      }
    }
    componentDidMount(){
     this.props.dispatch({
         type:'cashier/meth1',
         payload:{
             initModel:this.initModel,
             hindpayclick:this.hindpayclick,
             handleOk:this.handleOk,
         }
     })
    }
    //初始化方法
    initModel=()=>{
      const uservalues={"urUserId":null}
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:true
      })
      GetServerData('qerp.pos.ur.user.info',uservalues)
      .then((json) => {
          const { ismember, paytotolamount, memberinfo } =this.props;
          if(json.code!='0'){
            message.error(json.message);
            this.props.dispatch({
              type:'spinLoad/setLoading',
              payload:false
            })
            return ;
          }
          sessionStorage.setItem('openWechat',json.urUser.shop.openWechat);
          sessionStorage.setItem('openAlipay',json.urUser.shop.openAlipay);
          this.props.dispatch({
              type:'cashier/resetPayModal',
              payload:{}
          })
          this.isMemberInit();
          this.props.dispatch({
            type:'spinLoad/setLoading',
            payload:false
          })
      })
    }
    //是否是会员时的弹框初始值
    isMemberInit() {
      const { ismember, paytotolamount, memberinfo, paytypelisy, point, amount } =this.props;
      if(ismember){
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:true
        })
        const values={mbCardId:memberinfo.mbCardId}
        GetServerData('qerp.pos.mb.card.info',values)
        .then((json) => {
            if(json.code!='0'){
              message.error(json.message);
              this.props.dispatch({
                type:'spinLoad/setLoading',
                payload:false
              })
              return;
            }
            this.setState({
                waringfirst:false
              },()=>{
                const { mbCardInfo } =json;
                const point=mbCardInfo.point
                const amount=mbCardInfo.amount
                const payvisible=true
                const amountlist=[]
                var texts=null
                var waringfirsts=false
                var groups=false
                this.props.dispatch({
                    type:'cashier/amountpoint',
                    payload:{amount,point}
                })
                this.props.dispatch({
                    type:'cashier/payvisible',
                    payload:payvisible
                })
                setTimeout(()=>{
                    //判断积分是否禁用
                  if(Number(point)<=0){
                      paytypelisy[5].disabled=true//禁用
                  }
                  if(parseFloat(amount)>0&&mbCardInfo.isLocalShop=='true'){
                      //会员卡选中为默认支付方式，不禁用
                      paytypelisy[4].check=true
                      //判断会员卡总额和总消费金额
                      //解决线上会员卡余额==支付金额不能结算的bug。
                      if(parseFloat(amount)>=parseFloat(paytotolamount)){
                        amountlist.push({
                          name:'会员卡',
                          value:paytotolamount,
                          type:'5'
                        })
                      }else{
                        amountlist.push({
                          name:'会员卡',
                          value:amount,
                          type:'5'
                        })
                        //报警告
                        waringfirsts=true
                        texts='会员卡余额不足，请选择组合支付'
                        groups=true
                      }
                  }else{
                    //默认选中微信，会员卡禁用
                    paytypelisy[0].check=true
                    paytypelisy[4].disabled=true
                    amountlist.push({
                      name:'微信',
                      value:paytotolamount,
                      type:'1'
                    })
                  }
                  this.props.dispatch({
                      type:'cashier/amountlist',
                      payload:amountlist
                  })
                  this.props.dispatch({
                      type:'cashier/groups',
                      payload:groups
                  })
                  this.setState({
                      waringfirsts,
                      text:texts,
                      backmoney:-NP.minus(paytotolamount, amountlist[0].value)
                  })
                },1)
            })
            this.props.dispatch({
              type:'spinLoad/setLoading',
              payload:false
            })
        })
      }else{
        //不是会员
        this.setState({
            waringfirst:false,
            visible:true,
        },()=>{
            const payvisible=true
            this.props.dispatch({
                type:'cashier/payvisible',
                payload:payvisible
            })
            const paytypelisy=this.props.paytypelisy
            const amountlist=[]
            paytypelisy[4].disabled=true
            paytypelisy[5].disabled=true
            paytypelisy[0].check=true
            amountlist.push({
                name:'微信',
                value:this.props.paytotolamount,
                type:'1'
            })
            this.props.dispatch({
                type:'cashier/amountlist',
                payload:amountlist
            })
            this.props.dispatch({
                type:'cashier/paytypelisy',
                payload:paytypelisy
            })
            this.setState({
                backmoney:-NP.minus(this.props.paytotolamount, amountlist[0].value)
            })
        })
      }
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
            validateVisible:false
        },function(){
            const payvisible=false
            this.props.dispatch({
                type:'cashier/payvisible',
                payload:payvisible
            })
            this.props.initdata()
        });
    }
    handleCancel = (e) => {
        this.setState({
        visible: false,
        },function(){
          const { amountlist, paytotolamount, totolamount } = this.props;
          //关闭弹框时，重置实际支付金额为应付金额
          this.props.dispatch({
              type:'cashier/paytotolamount',
              payload:totolamount
          })
            const payvisible=false;
            this.props.dispatch({
                type:'cashier/payvisible',
                payload:payvisible
            })
        });
    }
    //js判断是否在数组中
    isInArray=(arr,value)=>{
      for(var i = 0; i < arr.length; i++){
          if(value == arr[i].type){
              return i;
          }
      }
      return '-1';
    }
    //组合支付
    connectclick=()=>{
        const { memberinfo, paytotolamount, point } =this.props;
        const group=this.props.group;
        const groups=this.props.group?false:true;
        let amountlist = [];//更改支付方式
        const paytypelisy=this.props.paytypelisy //按钮list
        this.props.dispatch({
            type:'cashier/groups',
            payload:groups
        })
        if(!groups){
            for(var i=0;i<paytypelisy.length;i++){
                paytypelisy[i].check=false
            }
            this.props.dispatch({
                type:'cashier/paytypelisy',
                payload:paytypelisy
            })
            setTimeout(()=>{
                this.listclick(0)
            },1)
        } else {
          //异地会员默认选中积分支付
          if(memberinfo.isLocalShop == 'false'&&point>0) {
            for(var i=0;i<paytypelisy.length;i++){
                paytypelisy[i].check=false;
                paytypelisy[5].check=true;
            }
            amountlist.push({
              name:'积分',
              value:paytotolamount,
              type:'6'
            })
            this.props.dispatch({
                type:'cashier/amountlist',
                payload:amountlist
            })
            this.props.dispatch({
                type:'cashier/paytypelisy',
                payload:paytypelisy
            })
            setTimeout(()=>{
                this.listclick(5)
            },1)
          }
        }
    }
    //权重处理方法
    arrarow=(arr)=>{
      const newarr=[]
      for(var i=0;i<arr.length;i++){
        if(Number(arr[i].type)==5){
          arr[i].types=6
        }
        if(Number(arr[i].type)==6){
          arr[i].types=5
        }
        if(Number(arr[i].type)<5){
          arr[i].types=4
        }
      }
      if(Number(arr[0].types)>Number(arr[1].types)){
        for(var i=0;i<arr.length;i++){
          newarr.push(arr[i])
        }
      }
      if(Number(arr[0].types)==Number(arr[1].types)){
        newarr.push(arr[1])
      }
      if(Number(arr[0].types)<Number(arr[1].types)){
        newarr.push(arr[1])
        newarr.push(arr[0])
      }
      return newarr
    }
    //点击不同支付方式
    listclick=(index)=>{
        const paytypelisy=this.props.paytypelisy //按钮list
        const amountlist=this.props.amountlist //左边栏数组
        var newamountlist=[] //新的左边栏数组
        var waringfirsts=false
        var texts=null
        const paytotolamount=this.props.paytotolamount//支付总额
        const lastpayamount=NP.minus(paytotolamount, amountlist[0].value);  //剩余金额
        if(!paytypelisy[index].check){
            if(this.props.group){
                const newarrlist=[]
                newarrlist.push(amountlist[0])
                newarrlist.push({
                    name:paytypelisy[index].name,
                    value:NP.minus(paytotolamount, newarrlist[0].value),
                    type:paytypelisy[index].type
                })
                //权重处理方法
                newamountlist=this.arrarow(newarrlist) //权重处理后的数组
                //积分会员卡不同状态value处理
                const i=this.isInArray(newamountlist,'5')
                const j=this.isInArray(newamountlist,'6')
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员余额
                if(i!='-1'){
                    //存在会员
                    if(j=='-1'){
                        //不存在积分
                        if(parseFloat(amount)>=parseFloat(paytotolamount)){
                            newamountlist[i].value=paytotolamount
                        }else{
                            newamountlist[i].value=amount
                        }
                        if(i==0){
                            newamountlist[1].value=NP.minus(paytotolamount, newamountlist[0].value);
                        }else{
                            newamountlist[0].value=NP.minus(paytotolamount, newamountlist[1].value);
                        }

                    }else{
                        //存在积分
                        if(parseFloat(amount)>=parseFloat(paytotolamount)){
                            newamountlist[i].value=paytotolamount
                            newamountlist[j].value=NP.minus(paytotolamount, newamountlist[i].value);

                        }else{
                            newamountlist[i].value=amount
                            const diffjvalue=NP.minus(paytotolamount, newamountlist[i].value);  //剩余
                            if(parseFloat(point)>=parseFloat(diffjvalue)){
                                newamountlist[j].value=diffjvalue
                            }else{
                                newamountlist[j].value=point
                                waringfirsts=true
                                texts='积分不足'
                            }
                        }
                    }
                }else{
                    //不存在会员
                    if( j=='-1'){
                        //不存在积分=不存在会员，不存在积分
                        newamountlist[0].value=paytotolamount
                    }else{
                        //存在积分==不存在会员，存在积分
                        if(parseFloat(point)>=parseFloat(paytotolamount)){
                            newamountlist[j].value=paytotolamount
                        }else{
                            newamountlist[j].value=point
                        }
                        if(j==0){
                            newamountlist[1].value=NP.minus(paytotolamount, newamountlist[0].value);
                        }else{
                            newamountlist[0].value=NP.minus(paytotolamount, newamountlist[1].value);
                        }
                    }
                }


            }else{
                //非组合支付
                newamountlist.push({
                    name:paytypelisy[index].name,
                    value:paytotolamount,
                    type:paytypelisy[index].type
                })
                const ismember=this.props.ismember
                if(ismember){
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员余额
                    if(newamountlist[0].type=='5'){
                        if(parseFloat(amount)<parseFloat(paytotolamount)){
                            newamountlist[0].value=amount
                            waringfirsts=true
                            texts='会员卡余额不足'
                        }
                    }
                    if(newamountlist[0].type=='6'){
                        if(parseFloat(point)<parseFloat(paytotolamount)){
                            newamountlist[0].value=point
                            waringfirsts=true
                            texts='积分不足'
                        }

                    }
                }
            }


            //格式化所有，然后找到左边栏数组中的type，更新右边展示
            for(var i=0;i<paytypelisy.length;i++){
                paytypelisy[i].check=false
            }
            for(var i=0;i<paytypelisy.length;i++){
                for(var j=0;j<newamountlist.length;j++){
                    if(paytypelisy[i].type==newamountlist[j].type){
                        paytypelisy[i].check=true
                    }
                }
            }

            // const backmoney='-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
            newamountlist[0].value=dataedit(String(newamountlist[0].value))
            if(newamountlist.length>1){
                newamountlist[1].value=dataedit(String(newamountlist[1].value))
            }

            var backmoneyed=0
            if(newamountlist.length>1){
                const danu=NP.minus(paytotolamount, newamountlist[0].value,newamountlist[1].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, newamountlist[0].value,newamountlist[1].value)))
                }

            }else{
                const danu=NP.minus(paytotolamount, newamountlist[0].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, newamountlist[0].value)))
                }

            }


            this.props.dispatch({
                type:'cashier/newamountlist',
                payload:newamountlist
            })
            this.props.dispatch({
                type:'cashier/paytypelisy',
                payload:paytypelisy
            })
            this.setState({
                waringfirst:waringfirsts,
                text:texts,
                backmoney:backmoneyed
            })
        }else{
            //当组合支付情况下且是会员卡+积分情况下，处理
            if(amountlist.length>1 && amountlist[0].type=='5' && amountlist[1].type=='6'){
                if(index=='4'){
                    //判断积分和总额，如果积分最大值大于总额，值为总额，否则为积分最大额
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员余额
                    newamountlist.push(amountlist[1])

                    if(parseFloat(point)<parseFloat(paytotolamount)){
                        newamountlist[0].value=point
                        waringfirsts=true
                        texts='积分余额不足'
                    }else{
                        newamountlist[0].value=paytotolamount
                        waringfirsts=false
                        texts=''
                    }
                }else{
                    //判断会员卡和总额，如果会员卡最大值大于总额，值为总额，否则为积分最大额
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员余额
                    newamountlist.push(amountlist[0])
                    if(parseFloat(amount)<parseFloat(paytotolamount)){
                        newamountlist[0].value=amount
                        waringfirsts=true
                        texts='会员卡余额不足'
                    }else{
                        newamountlist[0].value=paytotolamount
                        waringfirsts=false
                        texts=''
                    }
                }

            //格式化所有，然后找到左边栏数组中的type，更新右边展示
            for(var i=0;i<paytypelisy.length;i++){
                paytypelisy[i].check=false
            }
            for(var i=0;i<paytypelisy.length;i++){
                for(var j=0;j<newamountlist.length;j++){
                    if(paytypelisy[i].type==newamountlist[j].type){
                        paytypelisy[i].check=true
                    }
                }
            }

            // const backmoney='-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
            newamountlist[0].value=dataedit(String(newamountlist[0].value))
            if(newamountlist.length>1){
                newamountlist[1].value=dataedit(String(newamountlist[1].value))
            }

            var backmoneyed=0
            if(newamountlist.length>1){
                const danu=NP.minus(paytotolamount, newamountlist[0].value,newamountlist[1].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, newamountlist[0].value,newamountlist[1].value)))
                }

            }else{
                const danu=NP.minus(paytotolamount, newamountlist[0].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, newamountlist[0].value)))
                }

            }


            this.props.dispatch({
                type:'cashier/newamountlist',
                payload:newamountlist
            })
            this.props.dispatch({
                type:'cashier/paytypelisy',
                payload:paytypelisy
            })
            this.setState({
                waringfirst:waringfirsts,
                text:texts,
                backmoney:backmoneyed
            })


            }


        }

    }
    //处理结算逻辑
    hindpayclick=()=>{
      this.setState({ scanType:false });
      let isValidateArr = [];
      if(!this.firstclick){ return }
      // this.goPay()
      let { backmoney } =this.state;
      let { paytotolamount, group, amountlist } =this.props;
      var totols=0;//支付金额
      var orderPay=[];//支付方式
      if(group){
        if(amountlist.length>1){
          totols=NP.plus(amountlist[0].value,amountlist[1].value);
          amountlist.map((el,index) => {
            if(el.value!='0.00'){
                orderPay.push({
                    amount:el.value,
                    type:el.type,
                })
            }
            return el;
          })
        }else{
            message.error('金额有误，不能支付')
            return
        }
      }else{
          totols=amountlist[0].value
          orderPay=[{
              amount:amountlist[0].value,
              type:amountlist[0].type
          }]
      }
      const {
              ismember,
              memberinfo,
              totolamount,
              thispoint,
              totolnumber,
              datasouce,
              cutAmount
            } = this.props;
      if(totols != paytotolamount && backmoney !='0.00'){
          message.error('金额有误，不能支付')
          return;
      }
      let values={
              mbCard:{ mbCardId:ismember?memberinfo.mbCardId:null },
              odOrder:{
                  amount:totolamount,
                  orderPoint:thispoint,
                  payAmount:paytotolamount,
                  qty:totolnumber,
                  skuQty:datasouce.length,
                  cutAmount:cutAmount,
              },
              orderDetails:datasouce,
              orderPay:orderPay
          };
      this.payApi(values);
    }
    //调用结算接口
    payApi=(values)=>{
        this.setState({ loading:true })
        this.firstclick=false
        const result=GetServerData('qerp.web.qpos.od.order.save',values)
            result.then((res) => {
                return res;
            }).then((json) => {
              if(json.code=='0'){
                    this.firstclick=true;
                    const orderAll = json;
                    const odOrderIds=json.odOrderId
                    const orderNos=json.orderNo
                    const checkPrint = this.props.checkPrint;
                    this.handleOk()
                    message.success('收银成功',1)
                    printSaleOrder(checkPrint,odOrderIds)
              }else{
                //是否校验弹框
                  if(json.code == 'I_1031') {
                    this.props.setSpace(false);//非结算弹框时，不可空格结算;
                    this.setState({ validateVisible:true });
                    this.props.dispatch({
                      type:'cashier/payvisible',
                      payload:false
                    })
                  } else {
                    message.error(json.message)
                  }
                  this.firstclick=true;
              }
              this.setState({ loading:false })
        })
    }
    //单独输入框失去焦点
    hindonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.props.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            amountlist[0].value=paytotolamount
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
            }
            if(amountlist[0].type=='6'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
            }
        }else{
            amountlist[0].value=values
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(values))?values:amount
            }
            if(amountlist[0].type=='6'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(point)>=parseFloat(values))?values:point
            }

        }
        amountlist[0].value=dataedit(String(amountlist[0].value))
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value)))
        this.props.dispatch({
            type:'cashier/amountlist',
            payload:amountlist
        })



        this.setState({
            backmoney:backmoney
        })
    }
    hindonChange=(e)=>{
      //只能输入最多两位数字
      const values=e.target.value
	    const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
      const str=re.test(values)
      if(str){
          const amountlist=this.props.amountlist.slice(0)
          amountlist[0].value=values
          this.props.dispatch({
              type:'cashier/amountlist',
              payload:amountlist
          })
      }
    }
    payfirstonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.props.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            //大于总额
            amountlist[0].value=paytotolamount
            amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                if(amountlist[1].type=='6'){
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                }
            }else{
                //当前是积分
                if(amountlist[0].type=='6'){
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员卡余额
                    if(amountlist[1].type=='5'){
                        amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }else{
                        amountlist[0].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }else{
                    //当前不是积分也不是会员卡
                    amountlist[0].value=paytotolamount
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    if(amountlist[1].type=='5'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                    if(amountlist[1].type=='6'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[1].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }

            }

        }else{
            //小于总额
            amountlist[0].value=values
            amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
            //当前是会员卡
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(values))?values:amount
                amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                if(amountlist[1].type=='6'){
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                }

            }else{
                 //当前是积分
                if(amountlist[0].type=='6'){
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员卡余额
                    if(amountlist[1].type=='5'){
                       amountlist[0].value=(parseFloat(point)>=parseFloat(values))?values:point
                       amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }else{
                        amountlist[0].value=(parseFloat(point)>=parseFloat(values))?values:point
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }else{
                    //当前不是会员卡也不是积分
                    amountlist[0].value=values
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    if(amountlist[1].type=='5'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                    if(amountlist[1].type=='6'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }
            }
        }
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(String(amountlist[0].value))
        amountlist[1].value=dataedit(String(amountlist[1].value))

        this.props.dispatch({
            type:'cashier/amountlist',
            payload:amountlist
        })
        this.setState({
            backmoney:backmoney
        })
    }
    paysecondonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.props.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            //大于总额
            amountlist[1].value=paytotolamount
            amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
            if(amountlist[1].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                if(amountlist[0].type=='6'){
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                }
            }else{
                //当前是积分
                if(amountlist[1].type=='6'){
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员卡余额
                    if(amountlist[0].type=='5'){
                        amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }else{
                        amountlist[1].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }else{
                    //当前不是积分也不是会员卡
                    amountlist[1].value=paytotolamount
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    if(amountlist[0].type=='5'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                    if(amountlist[0].type=='6'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[0].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }
            }
        }else{
            //小于总额
            amountlist[1].value=values
            amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
            //当前是会员卡
            if(amountlist[1].type=='5'){
                const point=NP.divide(this.props.point,100); //积分换算金额
                const amount=this.props.amount //会员卡余额
                amountlist[1].value=(parseFloat(amount)>=parseFloat(values))?values:amount
                amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                if(amountlist[0].type=='6'){
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                }
            }else{
                 //当前是积分
                if(amountlist[1].type=='6'){
                    const point=NP.divide(this.props.point,100); //积分换算金额
                    const amount=this.props.amount //会员卡余额
                    if(amountlist[0].type=='5'){
                        amountlist[1].value=(parseFloat(point)>=parseFloat(values))?values:point
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }else{
                        amountlist[1].value=(parseFloat(point)>=parseFloat(values))?values:point
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }else{
                    //当前不是会员卡也不是积分
                    amountlist[1].value=values
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    if(amountlist[0].type=='5'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                    if(amountlist[0].type=='6'){
                        const point=NP.divide(this.props.point,100); //积分换算金额
                        const amount=this.props.amount //会员卡余额
                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }
            }
        }


        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(String(amountlist[0].value))
        amountlist[1].value=dataedit(String(amountlist[1].value))
        this.props.dispatch({
            type:'cashier/amountlist',
            payload:amountlist
        })
        this.setState({
            backmoney:backmoney
        })
    }
    payfirstonChange=(e)=>{
        const values=e.target.value
	      const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.props.amountlist.slice(0)
            amountlist[0].value=values
            this.props.dispatch({
                type:'cashier/amountlist',
                payload:amountlist
            })
        }
    }
    paysecondonChange=(e)=>{
        const values=e.target.value
	      const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.props.amountlist.slice(0)
            amountlist[1].value=values
            this.props.dispatch({
                type:'cashier/amountlist',
                payload:amountlist
            })
        }
    }
    //抹零
    nozeroclick=()=>{
        const diffamount=NP.minus(this.props.paytotolamount, parseInt(this.props.paytotolamount))
        if(diffamount>0){
            const amountlist=this.props.amountlist.slice(0)
            if(amountlist.length>1){
                //抹第二个
                var moer=NP.minus(amountlist[1].value, diffamount)
                if(moer<0){
                    amountlist[0].value=NP.plus(amountlist[0].value, moer)
                    amountlist[1].value='0.00'
                }else{
                    amountlist[1].value=moer
                }
            }
            if(amountlist.length==1){
                amountlist[0].value=NP.minus(amountlist[0].value, diffamount)
            }

            const paytotolamount=dataedit(String(parseInt(this.props.paytotolamount)))
            var backmoneyed=0
            if(amountlist.length>1){
                const danu=NP.minus(paytotolamount, amountlist[0].value,amountlist[1].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, amountlist[0].value,amountlist[1].value)))
                }



            }else{
                const danu=NP.minus(paytotolamount, amountlist[0].value)
                if(danu==0){
                    backmoneyed='0.00'
                }else{
                    backmoneyed='-'+dataedit(String(NP.minus(paytotolamount, amountlist[0].value)))
                }

            }

            amountlist[0].value=dataedit(String(amountlist[0].value))
            if(amountlist.length>1){
                amountlist[1].value=dataedit(String(amountlist[1].value))
            }


            this.props.dispatch({
                type:'cashier/paytotolamount',
                payload:paytotolamount
            })
            this.props.dispatch({
                type:'cashier/amountlist',
                payload:amountlist
            })
            const cutAmount='1'
            this.props.dispatch({
                type:'cashier/cutAmount',
                payload:cutAmount
            })


            this.setState({
                backmoney:backmoneyed,
            })

        }





    }
    //扫码按钮点击
    onhindClicks=()=>{
      debugger
        const backmoney=this.state.backmoney
        const group=this.props.group
        const amountlist=this.props.amountlist
        var totols=0;
        var orderPay=[];

        if(amountlist.length>1){
            if(Number(amountlist[1].value<=0)){
                message.error('金额有误，不能支付')
                return
            }
        }else{
            if(Number(amountlist[0].value<=0)){
                message.error('金额有误，不能支付')
                return
            }
        }
        if(group){
            if(amountlist.length>1){
                totols=NP.plus(amountlist[0].value,amountlist[1].value);
                for(var i=0;i<amountlist.length;i++){
                    if(amountlist[i].value!='0.00'){
                        orderPay.push({
                            amount:amountlist[i].value,
                            type:amountlist[i].type=='1'?'7':(amountlist[i].type=='2'?'8':amountlist[i].type)
                        })
                    }
                }
            }else{
                message.error('金额有误，不能支付')
                return
            }
        }else{
            totols=amountlist[0].value
            orderPay=[{
                amount:amountlist[0].value,
                type:amountlist[0].type=='1'?'7':(amountlist[0].type=='2'?'8':amountlist[0].type)
            }]
        }

        if(totols==this.props.paytotolamount && backmoney=='0.00'){
            const amountlist=this.props.amountlist;
            const { mbCardId } =this.props.memberinfo;
            let values={
                    mbCard:{mbCardId:this.props.ismember?mbCardId:null},
                    odOrder:{
                        amount:this.props.totolamount,
                        orderPoint:this.props.thispoint,
                        payAmount:this.props.paytotolamount,
                        qty:this.props.totolnumber,
                        skuQty:this.props.datasouce.length,
                        cutAmount:this.props.cutAmount,
                    },
                    orderDetails:this.props.datasouce,
                    orderPay:orderPay
                }
                this.btnSaoPay(values)
        }else{
            message.error('金额有误，不能支付')
        }
    }
    //扫码支付
    btnSaoPay=(values)=>{
      this.setState({ scanType:true });
      GetServerData('qerp.web.qpos.od.order.save',values)
      .then((json) => {
          if(json.code=='0'){
              const orderNo=json.orderNo  //订单号
              const odOrderId=json.odOrderId  //订单id
              const consumeType='1' //销售订单
              const type=values.orderPay.length>1?values.orderPay[1].type:values.orderPay[0].type//支付类型
              const amount=values.orderPay.length>1?values.orderPay[1].amount:values.orderPay[0].amount //支付金额
              this.context.router.push({ pathname : '/pay', state : {orderId :odOrderId,type:type,amount:amount,consumeType:consumeType,orderNo:orderNo}});
          }else{
              if(json.code == 'I_1031') {
                this.props.setSpace(false);//非结算弹框时，不可空格结算;
                this.setState({ validateVisible:true });
                this.props.dispatch({
                  type:'cashier/payvisible',
                  payload:false
                })
              } else {
                message.error(json.message)
              }
          }

      })
    }
    //是否勾选打印小票
    choosePrint = (e) =>{
        const checkPrint=e.target.checked
        this.props.dispatch({
            type:'cashier/changeCheckPrint',
            payload:checkPrint
        })
    }
    //关闭校验弹框
    onCancel() {
      this.props.setSpace(true);//非结算弹框时，不可空格结算;
      this.setState({
        validateVisible:false,
      })
    }
    changePhone(value) {
      this.setState({
        validatePhone:value
      })
    }
    changePhoneCode(value) {
      this.setState({
        validatePhoneCode:value
      })
    }
    onSubmit() {
      if(this.state.scanType) {
        this.onhindClicks()
      } else {
        this.hindpayclick()
      }
    }
    render() {
      const openWechat=sessionStorage.getItem("openWechat")
      const openAlipay=sessionStorage.getItem("openAlipay");
      const { amountlist } =this.props;
      return (
        <div>
          <Modal
            title=""
            visible={this.props.payvisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={924}
            closable={true}
            footer={null}
            className={amountlist.length>1?'payzu':'pay'}>
              <div className='clearfix'>
                <div className='fl paylw'>
                    <Input
                      autoComplete="off"
                      addonBefore={<Btnbrforepay title='总额' dis={true}/>}
                      value={this.props.paytotolamount}
                      disabled
                      className='tr payinputsmodel'/>
                    {
                        amountlist.length>1?
                        <div className='clearfix inputcenter'>
                          <div className={
                            (amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?'payharflwl inputcenterdis':'payharflwl inputcenteropen'
                          }>
                            <div>
                              <Input
                                autoComplete="off"
                                addonBefore={
                                  <Btnbrforepay
                                    title={amountlist[0].name}
                                    dis={(amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?true:false}/>
                                  }
                                value={amountlist[0].value}
                                onBlur={this.payfirstonBlur.bind(this)}
                                className='tr payinputsmodel'
                                onChange={this.payfirstonChange.bind(this)}
                                addonAfter={
                                  (amountlist[0].type=='1' && openWechat=='1') ||(amountlist[0].type=='2' && openAlipay=='1') ?
                                  <Btnpay hindClicks={this.onhindClicks.bind(this)}/>
                                  :
                                  null
                                }
                                disabled={(amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?true:false}/>
                            </div>
                          </div>
                          <div
                            className={
                              (amountlist[1].type=='1' || amountlist[1].type=='2' || amountlist[1].type=='3')?
                              'payharflwr inputcenterdis'
                              :
                              'payharflwr inputcenteropen'}>
                            <Input
                              autoComplete="off"
                              addonBefore={
                                <Btnbrforepay
                                  title={amountlist[1].name}
                                  dis={(amountlist[1].type=='1' || amountlist[1].type=='2' || amountlist[1].type=='3')?true:false}/>
                                }
                              value={amountlist[1].value}
                              onBlur={this.paysecondonBlur.bind(this)}
                              className='tr payinputsmodel'
                              onChange={this.paysecondonChange.bind(this)}
                              addonAfter={
                                (amountlist[1].type=='1' && openWechat=='1') ||(amountlist[1].type=='2' && openAlipay=='1') ?
                                <Btnpay hindClicks={this.onhindClicks.bind(this)}/>
                                :
                                null
                              }
                              disabled={(amountlist[1].type=='1' || amountlist[1].type=='2' || amountlist[1].type=='3')?true:false}/>
                          </div>
                        </div>
                        :
                        <div
                          className={
                            (amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?
                            'inputcenter inputcenterdis'
                            :
                            'inputcenter inputcenteropen'}>
                          <Input
                            autoComplete="off"
                            addonBefore={
                              <Btnbrforepay
                                title={amountlist[0].name}
                                dis={(amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?true:false}/>
                              }
                            value={amountlist[0].value}
                            ref='paymoneys'
                            onBlur={this.hindonBlur.bind(this)}
                            className={
                              (amountlist[0].type=='1' || amountlist[0].type=='2' || amountlist[0].type=='3')?
                              'tr payinputsmodel payinputsmodels'
                              :
                              'tr payinputsmodel'
                            }
                            disabled={(amountlist[0].type=='1' ||amountlist[0].type=='2' ||amountlist[0].type=='3')?true:false}
                            onChange={this.hindonChange.bind(this)}
                            addonAfter={
                              (amountlist[0].type=='1' && openWechat=='1') ||(amountlist[0].type=='2' && openAlipay=='1') ?
                              <Btnpay hindClicks={this.onhindClicks.bind(this)}/>
                              :
                              null
                            }/>
                        </div>
                    }
                    <div>
                      <Input
                        autoComplete="off"
                        addonBefore={
                          <Btnbrforepay title='找零' dis={true}/>
                        }
                        value={this.state.backmoney}
                        disabled
                        className='tr payinputsmodel'/>
                    </div>
                    <p className={this.state.waringfirst?'waring':'waringnone'}>{this.state.text}</p>
                    {
                      amountlist.length==1?
                      <div className='payends'>
                        <Button
                          loading={this.state.loading}
                          className='paylhs'
                          onClick={this.hindpayclick.bind(this)}>
                            结算<p className='iconk'>「空格键」</p>
                        </Button>
                      </div>
                      :
                      null
                    }
                    {
                      amountlist.length==1?
                      <div className='check_print'><Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox></div>
                      :
                      null
                    }
                </div>
                <div className='fr fix-800-fr' style={{width:'274px'}}>
                  <div>
                    <ul className='clearfix' style={{paddingLeft:'0',marginBottom:'0'}}>
                      {
                        this.props.paytypelisy.map((item,index)=>{
                          return(
                            <li
                              className='fl'
                              onClick={this.listclick.bind(this,index)}
                              key={index}
                              className={item.disabled?'listdis':(item.check?'listoff':'list')}>
                                <Button  disabled={item.disabled}>{item.name}</Button>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                  <div >
                    <ul className='btnbg'>
                      <li
                        className='fl'
                        onClick={this.connectclick.bind(this)}
                        className={this.props.paytypelisy[4].disabled==true && this.props.paytypelisy[5].disabled==true?(amountlist.length>1?'listtdiszu':'listtdis'):(this.props.group?(amountlist.length>1?'listtoffzu':'listtoff'):(amountlist.length>1?'listtzu':'listt'))}>
                        <Button disabled={this.props.paytypelisy[4].disabled==true && this.props.paytypelisy[5].disabled==true?true:false }>组合<br/>支付</Button>
                      </li>
                      <li
                        className='fl'
                        onClick={this.nozeroclick.bind(this)}
                        className={amountlist.length>1?(this.props.cutAmount=='0'?'listtzu':'listtoffzu'):(this.props.cutAmount=='0'?'listt':'listtoff')}>
                        <Button>抹零</Button>
                      </li>
                    </ul>
                  </div>
                </div>
                {
                  amountlist.length>1?
                  <div className='payends'>
                    <Button
                      className={amountlist.length>1?'paylhszu':'paylhs'}
                      onClick={this.hindpayclick.bind(this)}>
                      结算<p className='iconk'>「空格键」</p>
                    </Button>
                  </div>
                  :
                  null
                }
                {
                  amountlist.length>1?
                  <div className='check_print'>
                    <Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox>
                  </div>
                  :
                  null
                }
        	    </div>
          </Modal>
          <ValidataModal
            memberinfo={this.props.memberinfo}
            loading={this.state.loading}
            changePhoneCode={this.changePhoneCode.bind(this)}
            changePhone={this.changePhone.bind(this)}
            onSubmit={this.onSubmit.bind(this)}
            onCancel={this.onCancel.bind(this)}
            visible={this.state.validateVisible}/>
        </div>

    );
  }
}
PayModal.contextTypes= {
    router: React.PropTypes.object
}

function mapStateToProps(state) {
    const {
            payvisible,
            totolamount,
            ismember,
            mbCardId,
            paytotolamount,
            datasouce,
            totolnumber,
            thispoint,
            checkPrint,
            amountlist,
            paytypelisy,
            group,
            amount,
            point,
            cutAmount,
            memberinfo
          }=state.cashier
    return {
            payvisible,
            totolamount,
            ismember,
            mbCardId,
            paytotolamount,
            datasouce,
            totolnumber,
            thispoint,
            checkPrint,
            amountlist,
            paytypelisy,
            group,
            amount,
            point,
            cutAmount,
            memberinfo
          };
}
export default connect(mapStateToProps)(PayModal);
