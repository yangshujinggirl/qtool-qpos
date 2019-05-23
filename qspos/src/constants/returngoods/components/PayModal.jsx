import React from 'react';
import { Modal, Button ,Input,message,Checkbox} from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import NP from 'number-precision';
import {GetServerData} from '../../../services/services';
import {GetLodop} from '../../../components/Method/Print.jsx';
import {getSaleOrderInfo} from '../../../components/Method/Print';
import {getReturnOrderInfo} from '../../../components/Method/Print';
import './PayModal.less';

class PayModal extends React.Component {
    constructor(props) {
      super(props);
      this.lists=[]
      this.firstclick=true;
      this.state = {
          remark:'',
          visible: false,
          group:true,//是否组合
          payfirst:{
              name:'会员卡',
              value:''
          },
          paysecond:{
              name:'微信',
              value:''
          },
          paynext:{
              name:'会员卡',
              value:''
          },
          backmoney:0,
          listarrs:[
                  {name:'微信',style:'list',disabled:false},
                  {name:'支付宝',style:'list',disabled:false},
                  {name:'银联',style:'list',disabled:false},
                  {name:'现金',style:'list',disabled:false},
                  {name:'会员卡',style:'list',disabled:false},
                  {name:'积分',style:'list',disabled:false}
              ],
          type:'1',
          waringfirst:true,//警告
          usetype:true, //收银 退货false,
          warning:false,
          text:'',
          membermoney:'' ,//会员卡金额
          pointmoney:'',//积分金额,
          cutAmount:'0', //是否抹零
          totolamount:0,//第一个输入框
          paperSize:'80',  //打印
          submitPrint:'1',
          rechargePrint:'1',
          //收银接收数据
          datadatasoucer:[],  //table
          datadatasoucerlength:0,
          datamember:null,//会员
          datanumber:0, //数量
          datatotalamount:'0.00', //总额
          datajifen:0, //积分

          //退货接收数据
          redatasouce:[],//退货table选中数据
          odOrderId:null,//订单id
          rembCardId:null,//会员卡id
          quantity:0,//总数量
          retotalamount:0,//总金额
          rejifen:0,//本次积分,
          returnismbCard:false,//是否是会员
          returndataSource:[],//退货table所有数据,
          rebarcode:null, //退货订单号
          loading:false
      }
    }
    componentDidMount(){
      this.onfocus()
    }
    //接收函数
    revisedata=(message)=>{
      const messageData = message;
      const {
              data, type, totalamount,
              quantity, amount, point,
              ismbCard, mbCard,odOrderNo
            } = messageData;
      switch(messageData.type) {
        case 1:
          message.data.map((el,index) => (el.price = el.toCPrice ));
          this.setState({
              datadatasoucer:data,
              datadatasoucerlength:data.length
          })
          break;
        case 2:
          this.setState({ datamember:data })
          break;
        case 4:
          this.setState({
              datanumber:data,
              datatotalamount:totalamount
          })
          break;
        case 5:
          this.setState({ datajifen:data })
          break;
        case 6:
          this.setState({ redatasouce:data })
          break;
        case 7:
          this.setState({
              quantity:quantity,
              retotalamount:totalamount,
              totolamount:totalamount
          })
          break;
        case 11:
          this.setState({
              membermoney:amount,
              pointmoney:point
          })
          break;
        case 9:
          this.setState({ rejifen:data })
          break;
        case 10:
          let rembCardId;
          if(ismbCard){
            rembCardId = mbCard.mbCardId;
          }else{
            rembCardId = null;
          }
          this.setState({
              returndataSource:data,
              rembCardId,
              returnismbCard:ismbCard,
              rebarcode:odOrderNo
          })
          break;
      }
    }
    showModal=(type,data) => {
      switch(type) {
        case 7:
          this.formDataTypeSeve(type,data);
          break;
        case 8:
          this.formDataTypeEig(type,data);
          break;
      }
    }
    formDataTypeSeve(type,data) {
      const backmoney=this.backmoneymeth(data.totolamount,data.totolamount,0)
      let listarrs=this.state.listarrs
      listarrs[5].disabled=true
      listarrs[5].style='listdis'
      listarrs[4].disabled=true
      listarrs[4].style='listdis'
      const payinput=this.state.paynext
      payinput.name='现金'
      payinput.value=data.totolamount
      this.setState({
          visible: true,
          group:false,
          paynext:payinput,
          totolamount:data.totolamount,
          backmoney:backmoney,
          listarrs:listarrs,
          type:7,
          usetype:false,
          warning:false,
          text:''
      },function(){
          this.listclick(0)
      });
    }
    formDataTypeEig(type,data) {
      const backmoney=this.backmoneymeth(data.totolamount,data.totolamount,0)
      let listarrs=this.state.listarrs
      listarrs[5].disabled=true
      listarrs[5].style='listdis'
      const payinput=this.state.paynext
      payinput.name='会员卡'
      payinput.value=data.totolamount
      this.setState({
          visible: true,
          group:false,
          paynext:payinput,
          totolamount:data.totolamount,
          backmoney:backmoney,
          listarrs:listarrs,
          type:8,
          usetype:false,
          warning:false,
          text:''
      },function(){
          this.listclick(4)
      });
    }
    handleOk = (e) => {
        this.setState({
          visible: false,

          group:true,
            payfirst:{
                name:'会员卡',
                value:''
            },
            paysecond:{
                name:'微信',
                value:''
            },
            paynext:{
                name:'会员卡',
                value:''
            },
            totolamount:'',//总金额
            backmoney:0,
            listarrs:[
                    {name:'微信',style:'list',disabled:false},
                    {name:'支付宝',style:'list',disabled:false},
                    {name:'银联',style:'list',disabled:false},
                    {name:'现金',style:'list',disabled:false},
                    {name:'会员卡',style:'list',disabled:false},
                    {name:'积分',style:'list',disabled:false}
                ],
            type:'1',
            usetype:true, //收银 false，退货,

            datamember:null,
            datadatasoucer:[],
            datadatasoucerlength:0,
            datanumber:0,
            datatotalamount:'0.00',
            datajifen:0,
            warning:false,
            text:'',
            membermoney:'' ,//会员卡金额
            pointmoney:'',//积分金额,
            cutAmount:'0',
            waringfirst:true
        });
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
          waringfirst:true,
          cutAmount:0
        });
    }
    //js判断是否在数组中
    isInArray=(arr,value)=>{
        for(var i = 0; i < arr.length; i++){
        if(value == arr[i]){
            return i;
        }
    }
      return false;
    }
    //点击不同支付方式
    listclick=(index)=>{
      const listarrs=this.state.listarrs
      for(var i=0;i<listarrs.length;i++){
          if(listarrs[i].disabled==false){
              listarrs[i].style='list'
          }
      }
      if(this.state.group){
        // 组合支付
        if(!this.isInArray(this.lists,index)){
          this.lists.push(index)
          if(this.lists.length>2){
              this.lists.splice(0,this.lists.length-2)
          }
          if(this.lists.length>1){
            const payfirst=this.state.payfirst
            const paysecond=this.state.paysecond
            if(this.lists[0]<0){
                listarrs[this.lists[1]].style='listoff'
                paysecond.name=listarrs[this.lists[1]].name
                paysecond.value=this.state.paynext.value
                if(this.state.waringfirst){
                    this.setState({
                      listarrs:listarrs,
                      paysecond:paysecond,
                      warning:true,
                      waringfirst:false
                    })
                }else{
                  this.setState({
                    listarrs:listarrs,
                    paysecond:paysecond,
                    warning:false,
                    waringfirst:false
                  })
                }
            }else{
              listarrs[this.lists[0]].style='listoff'
              listarrs[this.lists[1]].style='listoff'
              payfirst.name=listarrs[this.lists[0]].name
              payfirst.value=this.state.paysecond.value
              paysecond.name=listarrs[this.lists[1]].name
              paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
              if(payfirst.name=='会员卡' && parseFloat(this.state.membermoney)<parseFloat(this.state.totolamount)){
                  payfirst.value=this.state.membermoney,
                  paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
              }
              if(payfirst.name=='积分' && parseFloat(this.state.pointmoney)< parseFloat(this.state.totolamount)){
                  payfirst.value=this.state.pointmoney
                  paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
              }
              if(paysecond.name=='会员卡' && parseFloat(this.state.membermoney)<parseFloat(this.state.totolamount)){
                  paysecond.value=this.state.membermoney
                  payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
              }
              if(paysecond.name=='积分' && parseFloat(this.state.pointmoney)< parseFloat(this.state.totolamount)){
                  paysecond.value=this.state.pointmoney
                  payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
              }
              if(this.state.waringfirst){
                  this.setState({
                      listarrs:listarrs,
                      payfirst:payfirst,
                      paysecond:paysecond,
                      backmoney:'0.00',
                      warning:true,
                      waringfirst:false
                  })
              }else{
                   this.setState({
                      listarrs:listarrs,
                      payfirst:payfirst,
                      paysecond:paysecond,
                      backmoney:'0.00',
                      warning:false,
                      waringfirst:false
                  })
              }
            }
          }
        }
      }else{
        //非组合支付
        this.lists=[-1]
        this.lists.push(index)
        listarrs[this.lists[1]].style='listoff'
        const payinput=this.state.paynext
        const paysecond=this.state.paysecond
        payinput.name=listarrs[this.lists[1]].name
        payinput.value=this.state.totolamount
        //计算找零
        const backmoney=this.backmoneymeth(this.state.totolamount,this.state.paynext.value,0)
        // if(this.state.waringfirst){
        //     this.setState({
        //         listarrs:listarrs,
        //         paynext:payinput,
        //         paysecond:paysecond,
        //         warning:false,
        //         backmoney:backmoney,
        //         waringfirst:false
        //     })
        // }else{
        //     this.setState({
        //         listarrs:listarrs,
        //         paynext:payinput,
        //         paysecond:paysecond,
        //         warning:false,
        //         backmoney:backmoney,
        //         waringfirst:false
        //     })
        // }
        this.setState({
            listarrs:listarrs,
            paynext:payinput,
            paysecond:paysecond,
            warning:false,
            backmoney:backmoney,
            waringfirst:false
        })
      }
    }
    connectclick=()=>{
      if(this.state.group){
        this.setState({
            group:false,
        },function(){
            this.listclick(0)
        })
      }else{
        this.setState({
            group:true,
        })
      }
    }
    totolamountchange=(e)=>{
        this.setState({
            totolamount:e.target.value
        })
    }
    paymoney=(e)=>{
      const values=e.target.value
      const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
      const str=re.test(values)
      if(str){
        const payinput=this.state.paynext
        payinput.value=values
        this.setState({
          paynext:payinput
        })
      }
    }
    backmoney=(e)=>{
      this.setState({
          backmoney:e.target.value
      })
    }
    //减法计算
    backmoneymeth=(a,b,c)=>{
        var a=parseFloat(a)
        var b=parseFloat(b)
        var c=parseFloat(c)
        var z;
        var s=parseFloat(b+c)
        if(a>s){
            z=s-a
            z=z.toFixed(2)
        }
        if(a==s){
            z=0
            z=z.toFixed(2)
        }
        if(a<s){
            z=s-a
            z=z.toFixed(2)
        }
        return z
    }
    //结算
    hindpayclick=()=>{
        if(!this.firstclick){
            return;
        }
        this.firstclick=false;
        const list=this.lists
        let type=list[1]+1
        let values={
            "odReturn":{
                "amount":this.state.totolamount,
                "orderNo":this.state.rebarcode,
                "qty":this.state.quantity,
                "refundAmount":this.state.paynext.value,
                "returnPoint":this.state.rejifen,
                "skuQty":this.state.quantity,
                "type":type,
                 cutAmount:this.state.cutAmount,
                 remark:this.state.remark
            },
            "odReturnDetails":this.state.redatasouce,
            "qposMbCard":{"mbCardId":this.state.rembCardId}
        }
        this.repaying(values)
    }
    //退货支付
    repaying=(values)=>{
      this.setState({ loading: true })
      GetServerData('qerp.web.qpos.od.return.save',values)
      .then((json) => {
          if(json.code=='0'){
              this.firstclick=true
              const odReturnIds=json.odReturnId
              const returnNos=json.returnNo
              const orderAll = json;
              const checkPrint = this.props.checkPrint;
              this.handleOk()
              message.success('退货成功',1)
              this.props.reinitdata();
              this.setState({ loading: false })
               //页面跳转
              this.context.router.push('/cashier')
              if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
                  if(checkPrint){
                      const result=GetServerData('qerp.pos.sy.config.info')
                      result.then((res) => {
                          return res;
                      }).then((json) => {
                          if(json.code == "0"){
                              //判断是打印大的还是小的
                              if(json.config.paperSize=='80'){
                                  let valueData =  {type:"3",outId:odReturnIds};
                                  const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                  result.then((res) => {
                                      return res;
                                  }).then((data) => {
                                      if(data.code == "0"){
                                          getReturnOrderInfo(data,"80",json.config.submitPrintNum);
                                      }else{
                                          message.error(data.message);
                                      }
                                  });
                              }else{
                                  let valueData =  {type:"3",outId:odReturnIds};
                                  const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                  result.then((res) => {
                                      return res;
                                  }).then((data) => {
                                      if(data.code == "0"){
                                          getReturnOrderInfo(data,"58",json.config.submitPrintNum);
                                      }else{
                                          message.error(data.message);
                                      }
                                  });
                              }
                          }else{
                              message.warning('打印失败')
                          }
                      })
                  }
              }
          }else{
            this.props.useinitdata()
            message.error(json.message)
            this.firstclick=true;
            this.setState({ loading: false })
          }
      })
    }
    onfocus=()=>{
      const ValueorderNoses=ReactDOM.findDOMNode(this.refs.paymoneys)
    }
    //单独输入框失去焦点
    hindonBlur=(e)=>{
      //退货
      const values=parseFloat(e.target.value)
      const moneyvalue=this.state.paynext
      moneyvalue.value=values
      const totolamount=this.state.totolamount
      var backmoneymeths=this.backmoneymeth(totolamount,moneyvalue.value,0)
      this.setState({
          backmoney:backmoneymeths,
          paynext:moneyvalue
      })
    }
    nozeroclick=()=>{
      //是整的就不用抹零，如果抹零，下面输入框之间减去
      const diffs=this.state.totolamount-parseInt(this.state.totolamount).toFixed(2)
      if(diffs>0){
        const list=this.lists
        const group=this.state.group
        const totolamount=parseInt(this.state.totolamount).toFixed(2) //整数
        var backmoney=this.state.backmoney
        //判断出现的是一个框还是两个框
        if(list[0]>0 || list[0]==0){
            const payfirst=this.state.payfirst
            const paysecond=this.state.paysecond
            if(paysecond.name=='会员卡' || paysecond.name=='积分'){
                paysecond.value=paysecond.value
                payfirst.value=(-this.backmoneymeth(totolamount,paysecond.value,0)).toFixed(2)
                backmoney='0.00'
            }else{
                payfirst.value=payfirst.value
                paysecond.value=(-this.backmoneymeth(totolamount,payfirst.value,0)).toFixed(2)
                backmoney='0.00'
            }
            this.setState({
                payfirst:payfirst,
                totolamount:totolamount,
                paysecond:paysecond,
                backmoney:backmoney,
                cutAmount:'1'
            })
        }else{
          const paynextvalue=this.state.paynext
          paynextvalue.value=totolamount
          this.setState({
              totolamount:totolamount,
              paynext:paynextvalue,
              backmoney:this.backmoneymeth(totolamount,paynextvalue.value,0),
              cutAmount:'1'
          })
        }
      }
    }
    payfirstchange=(e)=>{
      const payfirst=this.state.payfirst
      payfirst.value=e.target.value
      this.setState({
          payfirst:payfirst
      })
    }
    paysecondchange=(e)=>{
      const paysecond=this.state.paysecond
      paysecond.value=e.target.value
      this.setState({
          paysecond:paysecond
      })
    }
    payfirstonBlur=()=>{
        const payfirst=this.state.payfirst
        const paysecond=this.state.paysecond
        const totolamount=this.state.totolamount
         var backmoney=this.state.backmoney
        if(parseFloat(payfirst.value)>parseFloat(totolamount)){
          payfirst.value=totolamount
          paysecond.value='0.00'
          if(payfirst.name=='会员卡'){
            //会员卡余额大于总额
            if(parseFloat(this.state.membermoney)>parseFloat(totolamount)){
              payfirst.value=totolamount
              paysecond.value='0.00'
              backmoney='0.00'
            }else{
              payfirst.value=this.state.membermoney
              paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
              backmoney='0.00'
            }
          }
          if(payfirst.name=='积分'){
              if(parseFloat(this.state.pointmoney)>parseFloat(totolamount)){
                //总额
                payfirst.value=totolamount
                paysecond.value='0.00'
                backmoney='0.00'
              }else{
                //积分总额
                payfirst.value=this.state.pointmoney
                paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                backmoney='0.00'
              }
          }
        }else{
            payfirst.value=payfirst.value
            paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
            backmoney='0.00'
            if(payfirst.name=='会员卡'){
              //输入金额大于会员卡余额
              if(parseFloat(payfirst.value)>parseFloat(this.state.membermoney)){
                  payfirst.value=this.state.membermoney
                  paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                  backmoney='0.00'
              }else{
                  payfirst.value=payfirst.value
                  paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                  backmoney='0.00'
              }
            }
            if(paysecond.name=='会员卡'){
              if(parseFloat(paysecond.value)>parseFloat(this.state.membermoney)){
                paysecond.value=this.state.membermoney
                //找零显示
                backmoney=this.backmoneymeth(this.state.totolamount,payfirst.value,paysecond.value)
              }
            }
            if(payfirst.name=='积分'){
                //输入金额大于会员卡余额
                if(parseFloat(payfirst.value)>parseFloat(this.state.pointmoney)){
                    payfirst.value=this.state.pointmoney
                    paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                    backmoney='0.00'
                }else{
                    payfirst.value=payfirst.value
                    paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                    backmoney='0.00'
                }
            }
            if(paysecond.name=='积分'){
                if(parseFloat(paysecond.value)>parseFloat(this.state.pointmoney)){
                    paysecond.value=this.state.pointmoney
                   //找零显示
                   backmoney=this.backmoneymeth(this.state.totolamount,payfirst.value,paysecond.value)
                }
            }
        }
         this.setState({
            payfirst:payfirst,
            paysecond:paysecond,
            backmoney:backmoney
         })
    }
    paysecondonBlur=()=>{
        const payfirst=this.state.payfirst
        const paysecond=this.state.paysecond
        const totolamount=this.state.totolamount
        var backmoney=this.state.backmoney
        if(parseFloat(paysecond.value)>parseFloat(totolamount)){
            paysecond.value=totolamount
            payfirst.value='0.00'
            backmoney='0.00'
            if(paysecond.name=='会员卡'){
                //会员卡余额大于总额
                if(parseFloat(this.state.membermoney)>parseFloat(totolamount)){
                    paysecond.value=totolamount
                    payfirst.value='0.00'
                }else{
                    paysecond.value=this.state.membermoney
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }
            }
            if(paysecond.name=='积分'){
                if(parseFloat(this.state.pointmoney)>parseFloat(totolamount)){
                    //总额
                    paysecond.value=totolamount
                    payfirst.value='0.00'
                    backmoney='0.00'
                }else{
                    //积分总额
                    paysecond.value=this.state.pointmoney
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }
            }

        }else{
            paysecond.value=paysecond.value
            payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
            if(paysecond.name=='会员卡'){
                //输入金额大于会员卡余额
                if(parseFloat(paysecond.value)>parseFloat(this.state.membermoney)){
                    paysecond.value=this.state.membermoney
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }else{
                    paysecond.value=paysecond.value
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }
            }
            if(payfirst.name=='会员卡'){
                if(parseFloat(payfirst.value)>parseFloat(this.state.membermoney)){
                    payfirst.value=this.state.membermoney
                    paysecond.value=paysecond.value
                   //找零显示
                   backmoney=this.backmoneymeth(this.state.totolamount,paysecond.value,payfirst.value)
                }
            }
            if(paysecond.name=='积分'){
                //输入金额大于会员卡余额
                if(parseFloat(paysecond.value)>parseFloat(this.state.pointmoney)){
                    paysecond.value=this.state.pointmoney
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }else{
                    paysecond.value=paysecond.value
                    payfirst.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,paysecond.value,0))).toFixed(2)
                    backmoney='0.00'
                }
            }
            if(payfirst.name=='积分'){
                if(parseFloat(payfirst.value)>parseFloat(this.state.pointmoney)){
                    payfirst.value=this.state.pointmoney
                   //找零显示
                   backmoney=this.backmoneymeth(this.state.totolamount,paysecond.value,payfirst.value)
                }
            }

        }

         this.setState({
            payfirst:payfirst,
            paysecond:paysecond,
            backmoney:backmoney
         })
    }
    //打印
    handprint = (id,type,orderNo,size) => {
        GetLodop(id,type,orderNo,size)
    }
    hindpay=()=>{
        this.hindpayclick()
    }
    //是否勾选打印小票
    choosePrint = (e) =>{
        //调用父组件的方法
        this.props.changeCheckPrint(e.target.checked);
    }
    handleRemark =(e)=> {
      this.setState({ remark: e.target.value })
    }
    render() {

      return (
        <div>
          <Modal
            title=""
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={924}
            closable={true}
            footer={null}
            className='pay check-box-style returnpay return-modal-wrap'>
            <div>
              <div className='clearfix'>
              	<div className='fl paylw'>
               		<Input
                    autoComplete="off"
                    addonBefore='总额'
                    value={this.state.totolamount}
                    onChange={this.totolamountchange.bind(this)}
                    disabled
                    className='paylh tr payinputsmodel'/>
      	         	{
      	         		this.state.group && this.lists.length>1 && (this.lists[0]==0 || this.lists[0]>0)?
                    <div className='clearfix inputcenter'>
          						<div className='payharflwl' >
                        <Input
                          autoComplete="off"
                          addonBefore={this.state.payfirst.name}
                          value={this.state.payfirst.value}
                          onChange={this.payfirstchange.bind(this)}
                          onBlur={this.payfirstonBlur.bind(this)}
                          className='tr payinputsmodel'/>
                      </div>
          						<div className='payharflwr'>
                        <Input
                          autoComplete="off"
                          addonBefore={this.state.paysecond.name}
                          value={this.state.paysecond.value}
                          onChange={this.paysecondchange.bind(this)}
                          onBlur={this.paysecondonBlur.bind(this)}
                          className='tr payinputsmodel'/>
                      </div>
      	         		</div>
      	         		:
                    <div className='inputcenter'>
                      <Input
                         autoComplete="off"
                         addonBefore={this.state.paynext.name}
                         value={this.state.paynext.value}
                         onChange={this.paymoney.bind(this)}
                         ref='paymoneys'
                         onBlur={this.hindonBlur.bind(this)}
                         className='paylh tr payinputsmodel'/>
                     </div>
      	         	}
                  <Input
                    autoComplete="off"
                    addonBefore='找零'
                    value={this.state.backmoney}
                    onChange={this.backmoney.bind(this)}
                    disabled
                    className='paylh tr payinputsmodel'/>
               		<p className={this.state.warning?'waring':'waringnone'}>{this.state.text}</p>
             	 	</div>
                <div className='fr fix-800-fr' style={{width:'274px'}}>
                  <ul className='clearfix'>
                    {
                      this.state.listarrs.map((item,index)=>{
                        return(
                          <li
                            className='fl'
                            onClick={this.listclick.bind(this,index)}
                            key={index}
                            className={item.style}>
                              <Button  disabled={item.disabled}>{item.name}</Button>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
            	</div>
              <div className="pay-action">
                <div className='clearfix'>
                	<div className='fl paylw'>
                    <div className="inputcenter  remark-input">
                      <Input
                        id="remarkInput"
                        autoComplete="off"
                        addonBefore='备注'
                        placeholder="可输入20字订单备注"
                        maxLength={20}
                        onChange={this.handleRemark.bind(this)}
                        className='tr payinputsmodel'/>
                    </div>
               	 	</div>
                  <div className='fr fix-800-fr' style={{width:'274px'}}>
                    <ul className='btnbg'>
                      <li
                        className='fl'
                        onClick={this.connectclick.bind(this)}
                        className={this.state.usetype?(this.state.group?'listtoff':'listt'):'listdis'}>
                        <Button disabled={!this.state.usetype}>组合<br/>支付</Button>
                      </li>
                      <li
                        className='fl'
                        onClick={this.nozeroclick.bind(this)}
                        className={this.state.cutAmount=='0'?'list':'listoff'}>
                        {/*className={
                          this.state.usetype?
                          (this.state.cutAmount=='0'?'listt':'listtoff')
                            :
                          (this.state.cutAmount=='0'?'listnonezero':'listnonezeros')}>*/}
                        <Button>抹零</Button>
                      </li>
                    </ul>
                  </div>
              	</div>
                <div className='payends'>
                  <Button
                    loading={this.state.loading}
                    className='tc mt25 paylhs'
                    onClick={this.hindpayclick.bind(this)}
                    onKeyUp={this.hindpay.bind(this)}>
                    结算<p className='iconk'>「空格键」</p>
                  </Button>
                </div>
                <div style={{textAlign:"center"}}>
                  <Checkbox
                    onChange={this.choosePrint.bind(this)}
                    checked={this.props.checkPrint}>
                    打印小票
                  </Checkbox>
                </div>
              </div>
            </div>
          </Modal>
        </div>
    );
  }


}
PayModal.contextTypes= {
    router: React.PropTypes.object
}

export default PayModal;
