import { Modal, Button ,Input,message,Checkbox } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../../services/services';
import { GetLodop, getSaleOrderInfo} from '../../../components/Method/Print'
import {printSaleOrder} from '../../../components/Method/Method'
import {dataedit} from '../../../utils/commonFc';
import NP from 'number-precision'
import Btnpay from './Btnpay'
import Scanbtn from '../../../components/Button/scanbtn';
import Btnbrforepay from './Btnbrforepay';
import ValidataModal from './ValidataModal';
import './PayModal.less';



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
          remark:''
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
      let { ismember, paytotolamount, memberinfo, paytypelisy, point, amount } =this.props;
      this.setState({ waringfirst:false });
      let amountlist=[];
      let group= false;
      if(ismember){
        const { point, amount } = memberinfo;
        let text=null;
        let waringfirst=false;
        //判断积分是否禁用
        if(Number(point)<=0){
            paytypelisy[5].disabled=true//禁用
        }
        if(parseFloat(amount)>0&&memberinfo.isLocalShop=='true'){//会员卡选中为默认支付方式
          paytypelisy[4].check=true
          //判断会员卡总额和总消费金额//解决线上会员卡余额==支付金额不能结算的bug。
          let currentAmount;
          if(parseFloat(amount)>=parseFloat(paytotolamount)){
            currentAmount = paytotolamount;
          }else{//组合支付
            currentAmount = amount;
            waringfirst=true
            text='会员卡余额不足，请选择组合支付'
            group=true
          }
          amountlist.push({
            name:'会员卡',
            value:currentAmount,
            type:'5'
          })
        }else{//默认选中微信，会员卡禁用
          paytypelisy[0].check=true
          paytypelisy[4].disabled=true
          amountlist.push({
            name:'微信',
            value:paytotolamount,
            type:'1'
          })
        }
        this.setState({ waringfirst, text })
      }else{//不是会员
        paytypelisy[4].disabled=true
        paytypelisy[5].disabled=true
        paytypelisy[0].check=true
        amountlist.push({
            name:'微信',
            value:this.props.paytotolamount,
            type:'1'
        })
      }
      this.setState({
          backmoney:-NP.minus(paytotolamount, amountlist[0].value)
      })
      this.props.dispatch({
          type:'cashier/groups',
          payload:group
      })
      this.props.dispatch({
          type:'cashier/amountlist',
          payload:amountlist
      })
      this.props.dispatch({
          type:'cashier/paytypelisy',
          payload:paytypelisy
      })
      this.props.dispatch({
          type:'cashier/payvisible',
          payload:true
      })
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
      const { paytypelisy, amountlist, paytotolamount, group, memberinfo, ismember } =this.props;
      let { point, amount } = memberinfo;
      point = point&&NP.divide(point,100); //积分换算金额
      let newamountlist=[] , waringfirst=false, texts=null;
      if(!paytypelisy[index].check){
        if(group){//组合支付
          newamountlist.push(amountlist[0])
          newamountlist.push({
              name:paytypelisy[index].name,
              value:NP.minus(paytotolamount, newamountlist[0].value),
              type:paytypelisy[index].type
          })
          newamountlist=this.arrarow(newamountlist) //权重处理后的数组
          const i=this.isInArray(newamountlist,'5')//会员
          const j=this.isInArray(newamountlist,'6')//积分
          let payOneVal,payTwoVal;
          if(i!='-1'){//会员支付 i===0
            if(parseFloat(amount)>=parseFloat(paytotolamount)){
              payOneVal = paytotolamount
            }else{
              payOneVal = amount
            }
            if(j == '-1') {//无积分
              payTwoVal = NP.minus(paytotolamount, payOneVal);
            } else {//有积分
              const diffjvalue=NP.minus(paytotolamount, payOneVal);
              if(parseFloat(point)>=parseFloat(diffjvalue)){
                payTwoVal= diffjvalue
              }else{
                payTwoVal=point
                waringfirst=true
                texts='积分不足'
              }
            }
          }else{//积分支付，j==0
            if(parseFloat(point)>=parseFloat(paytotolamount)){
              payOneVal=paytotolamount
            }else{
              payOneVal=point
            }
            payTwoVal=NP.minus(paytotolamount, payOneVal);
          }
          newamountlist[0].value= payOneVal;
          newamountlist[1].value= payTwoVal;
        }else{
          newamountlist.push({
              name:paytypelisy[index].name,
              value:paytotolamount,
              type:paytypelisy[index].type
          })
          if(ismember){
            if((newamountlist[0].type=='5') && parseFloat(amount)<parseFloat(paytotolamount) ){
              newamountlist[0].value=amount
              waringfirst=true
              texts='会员卡余额不足'
            }
            if((newamountlist[0].type=='6') && parseFloat(point)<parseFloat(paytotolamount) ){
              newamountlist[0].value=point
              waringfirst=true
              texts='积分不足'
            }
          }
        }
      }else{//当组合支付情况下且是会员卡+积分情况下，选中状态下，会员和积分卡可以切换check状态。
        if(amountlist.length>1 && amountlist[0].type=='5' && amountlist[1].type=='6'){
          if(index=='4'){//判断积分和总额，如果积分最大值大于总额，值为总额，否则为积分最大额
            newamountlist.push(amountlist[1])
            if(parseFloat(point)<parseFloat(paytotolamount)){
              newamountlist[0].value=point
              waringfirst=true
              texts='积分余额不足'
            }else{
              newamountlist[0].value=paytotolamount
              waringfirst=false
              texts=''
            }
          }else{//判断会员卡和总额，如果会员卡最大值大于总额，值为总额，否则为积分最大额
            newamountlist.push(amountlist[0])
            if(parseFloat(amount)<parseFloat(paytotolamount)){
              newamountlist[0].value=amount
              waringfirst=true
              texts='会员卡余额不足'
            }else{
              newamountlist[0].value=paytotolamount
              waringfirst=false
              texts=''
            }
          }
        } else {
          newamountlist = amountlist;
        }
      }
      //格式化所有，然后找到左边栏数组中的type，更新右边展示
      paytypelisy.map((el,index) => {
        el.check = false;
        newamountlist.map((item,idx) => {
          item.value = dataedit(String(item.value))
          if(el.type == item.type) {
            el.check = true;
          }
        })
      });
      let backmoneyed=0, danu;
      if(newamountlist.length>1){
        danu=NP.minus(paytotolamount, newamountlist[0].value,newamountlist[1].value)
      }else{
        danu=NP.minus(paytotolamount, newamountlist[0].value)
      }
      if(danu==0){
        backmoneyed='0.00'
      }else{
        backmoneyed='-'+dataedit(String(danu))
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
          waringfirst,
          text:texts,
          backmoney:backmoneyed
      })
    }
    //处理结算逻辑
    hindpayclick=()=>{
      this.setState({ scanType:false });
      let isValidateArr = [];
      if(!this.firstclick){ return }
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
              ismember,memberinfo,
              totolamount,thispoint,
              totolnumber,datasouce,
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
                  remark:this.state.remark
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
    //表单失焦事件
    payfirstonBlur=(e)=>{
      const values=parseFloat(e.target.value)
      let { amountlist, paytotolamount, memberinfo } =this.props;
      let { point, amount } = memberinfo;
      point=point&&NP.divide(point,100); //积分换算金额
      let payOneVal,payTwoVal;
      let backmoney, dif;
      if(parseFloat(values)>=parseFloat(paytotolamount)){//大于总额
        payOneVal =paytotolamount;
      }else{//小于总额
        payOneVal =values;
      }
      if(amountlist[0].type=='5'){//当前是会员卡
        payOneVal =(parseFloat(amount)>=parseFloat(payOneVal))?payOneVal:amount
      }else if(amountlist[0].type=='6'){
        payOneVal =(parseFloat(point)>=parseFloat(payOneVal))?payOneVal:point
      }
      dif = NP.minus(paytotolamount, payOneVal);
      if(amountlist.length>1) {
        payTwoVal =NP.minus(paytotolamount, payOneVal);
        if(amountlist[1].type=='5' && payTwoVal >= parseFloat(amount)){
          payTwoVal = amount;
        } else if(amountlist[1].type=='6' && payTwoVal >= parseFloat(point)){
          payTwoVal= point;
        }
        amountlist[1].value = payTwoVal;
        dif = NP.minus(paytotolamount, payOneVal, payTwoVal);
      }
      amountlist[0].value = payOneVal;
      amountlist.map((el,index) => el.value = dataedit(String(el.value)));
      if(dif == 0) {
        backmoney = '0.00';
      } else {
        backmoney = '-'+dataedit(String(dif));
      }
      this.props.dispatch({
        type:'cashier/amountlist',
        payload:amountlist
      })
      this.setState({
        backmoney:backmoney
      })
    }
    ////表单change事件
    payfirstonChange=(e,index)=>{
        const values=e.target.value
	      const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.props.amountlist.slice(0)
            amountlist[index].value=values
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
              this.context.router.push({
                pathname : '/pay',
                state : {
                  orderId :odOrderId,
                  type:type,
                  amount:amount,
                  consumeType:consumeType,
                  orderNo:orderNo,
                  remark:this.state.remark
                }
              });
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
    handleRemark =(e)=> {
      console.log(e.target.value)
      this.setState({ remark: e.target.value })
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
      const { amountlist, paytypelisy, group, cutAmount, paytotolamount } =this.props;
      // let inputsSty = amountlist.length>1?'payharflwl':'inputcenter';
      // console.log(this.state.remark)
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
            className="payzu cashier-modal-wrap">
            {/*className={amountlist.length>1?'payzu':'pay'}>*/}
              <div className='clearfix'>
                <div className='fl paylw'>
                    <Input
                      autoComplete="off"
                      addonBefore={<Btnbrforepay title='总额' dis={true}/>}
                      value={paytotolamount}
                      disabled
                      className='tr'/>
                    {
                      amountlist.map((el,index) => (
                        <div className={
                          (el.type=='1' || el.type=='2' || el.type=='3')?
                          `inputcenterdis`
                            :
                          `inputcenteropen`} key={index}>
                            <Input
                              autoComplete="off"
                              addonBefore={
                                <Btnbrforepay
                                  title={el.name}
                                  dis={(el.type=='1' || el.type=='2' || el.type=='3')?true:false}/>
                                }
                              value={el.value}
                              onBlur={this.payfirstonBlur.bind(this)}
                              className='tr'
                              onChange={(e)=>this.payfirstonChange(e,index)}
                              addonAfter={
                                (el.type=='1' && openWechat=='1') ||(el.type=='2' && openAlipay=='1') ?
                                <Btnpay hindClicks={this.onhindClicks.bind(this)}/>
                                :
                                null
                              }
                              disabled={(el.type=='1' || el.type=='2' || el.type=='3')?true:false}/>
                        </div>
                      ))
                    }
                    <Input
                      autoComplete="off"
                      addonBefore={
                        <Btnbrforepay title='找零' dis={true}/>
                      }
                      value={this.state.backmoney}
                      disabled
                      className='tr'/>
                    <p className={this.state.waringfirst?'waring':'waringnone'}>{this.state.text}</p>
                </div>
                <div className='fr fix-800-fr' style={{width:'274px'}}>
                  <ul className='clearfix payType-list-wrap' style={{marginBottom:'0'}}>
                    {
                      paytypelisy.map((item,index)=>{
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
              </div>
              <div className='clearfix row-two'>
                <div className='fl paylw'>
                  <Input
                    autoComplete="off"
                    addonBefore={
                      <Btnbrforepay title='备注' dis={false}/>
                    }
                    placeholder="可输入20字订单备注"
                    maxLength={20}
                    className='tr special-remark'
                    onChange={this.handleRemark}/>
                </div>
                <div className='fr fix-800-fr' style={{width:'274px'}}>
                  <ul className='clearfix payType-list-wrap'>
                    <li
                      className='fl'
                      onClick={this.connectclick.bind(this)}
                      className={
                        paytypelisy[4].disabled==true && paytypelisy[5].disabled==true?
                        'listtdiszu'
                        :
                        (group?'listtoffzu':'listtzu')
                      }>
                      <Button disabled={paytypelisy[4].disabled==true && paytypelisy[5].disabled==true?true:false }>组合<br/>支付</Button>
                    </li>
                    <li
                      className='fl'
                      onClick={this.nozeroclick.bind(this)}
                      className={cutAmount=='0'?'listtzu':'listtoffzu'}>
                      <Button>抹零</Button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='payends'>
                <Button
                  className='paylhszu'
                  onClick={this.hindpayclick.bind(this)}>
                  结算<p className='iconk'>「空格键」</p>
                </Button>
              </div>
              <div className='check_print'>
                <Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox>
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
