import { Modal, Button ,Input,message,Checkbox } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../../components/Method/Print'
import {printSaleOrder} from '../../components/Method/Method'
import {dataedit} from '../../utils/commonFc';
import NP from 'number-precision'
import Btnpay from './btnpay'
import Scanbtn from '../../components/Button/scanbtn'


import {getSaleOrderInfo} from '../../components/Method/Print';
//引入打印



class Pay extends React.Component {
     constructor(props) {
        super(props);
        this.firstclick=true
     }

    state = { 
        text:null,
        point:null,
        amount:null,
        amountlist:[{//左边栏展示数组
            name:'微信',
            value:null,
            type:'1'
        }], 
        paytypelisy:[  //右边按钮区展示数组
            {name:'微信',check:false,disabled:false,type:'1'},
            {name:'支付宝',check:false,disabled:false,type:'2'},
            {name:'银联',check:false,disabled:false,type:'3'},
            {name:'现金',check:false,disabled:false,type:'4'},
            {name:'会员卡',check:false,disabled:false,type:'5'},
            {name:'积分',check:false,disabled:false,type:'6'}
        ], 
        initModel:this.initModel,
        group:false,//是否组合支付
        waringfirst:false,
        visible: false,
        backmoney:'0.00',
        cutAmount:'0',
    }

    //初始化方法
    initModel=()=>{
        const ismember=this.props.ismember
        const paytotolamount=this.props.totolamount
        this.props.dispatch({
            type:'cashier/paytotolamount',
            payload:paytotolamount
        })
        if(ismember){
            const values={mbCardId:this.props.mbCardId}
            const result=GetServerData('qerp.pos.mb.card.info',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code=='0'){
                    this.setState({
                        point:json.mbCardInfo.point,
                        amount:json.mbCardInfo.amount,
                        paytypelisy:[  
                            {name:'微信',check:false,disabled:false,type:'1'},
                            {name:'支付宝',check:false,disabled:false,type:'2'},
                            {name:'银联',check:false,disabled:false,type:'3'},
                            {name:'现金',check:false,disabled:false,type:'4'},
                            {name:'会员卡',check:false,disabled:false,type:'5'},
                            {name:'积分',check:false,disabled:false,type:'6'}
                        ], 
                        amountlist:[{
                            name:'微信',
                            value:null,
                            type:'1'
                        }],
                        waringfirst:false,
                        visible:true,
                        cutAmount:'0',
                    },function(){
                        const payvisible=true
                        this.props.dispatch({
                            type:'cashier/payvisible',
                            payload:payvisible
                        })
                        const paytypelisy=this.state.paytypelisy
                        const amountlist=[]
                        var texts=null
                        var waringfirsts=false
                        var groups=false
                        //判断积分是否禁用
                        if(Number(this.state.point)<=0){
                            //禁用
                            paytypelisy[5].disabled=true
                        }
                        if(parseFloat(this.state.amount)>0){
                                //会员卡选中为默认支付方式，不禁用
                                paytypelisy[4].check=true
                                //判断会员卡总额和总消费金额
                                if(parseFloat(this.state.amount)>parseFloat(this.props.paytotolamount)){
                                    amountlist.push({
                                        name:'会员卡',
                                        value:this.props.paytotolamount,
                                        type:'5'
                                    })
                                }else{
                                    amountlist.push({
                                        name:'会员卡',
                                        value:this.state.amount,
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
                                    value:this.props.paytotolamount,
                                    type:'1'
                                })
                        }

                        this.setState({
                            paytypelisy:paytypelisy,
                            amountlist:amountlist,
                            waringfirst:waringfirsts,
                            text:texts,
                            group:groups,
                            backmoney:-NP.minus(this.props.paytotolamount, amountlist[0].value)
                        })
                    })
                }else{
                    message.error(json.message)
                }
            })
        }else{
            //不是会员
            this.setState({
                paytypelisy:[  
                    {name:'微信',check:false,disabled:false,type:'1'},
                    {name:'支付宝',check:false,disabled:false,type:'2'},
                    {name:'银联',check:false,disabled:false,type:'3'},
                    {name:'现金',check:false,disabled:false,type:'4'},
                    {name:'会员卡',check:false,disabled:false,type:'5'},
                    {name:'积分',check:false,disabled:false,type:'6'}
                ], 
                amountlist:[{
                    name:'微信',
                    value:null,
                    type:'1'
                }],
                waringfirst:false,
                visible:true,
                group:false,
                cutAmount:'0',

            },function(){
                const payvisible=true
                this.props.dispatch({
                    type:'cashier/payvisible',
                    payload:payvisible
                })
                const paytypelisy=this.state.paytypelisy
                const amountlist=[]
                paytypelisy[4].disabled=true
                paytypelisy[5].disabled=true
                paytypelisy[0].check=true
                amountlist.push({
                    name:'微信',
                    value:this.props.paytotolamount,
                    type:'1'
                })
                this.setState({
                    paytypelisy:paytypelisy,
                    amountlist:amountlist,
                    backmoney:-NP.minus(this.props.paytotolamount, amountlist[0].value)
                })
            })
            }
        }

        handleOk = (e) => {
            this.setState({
                visible: false,
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
                const payvisible=false
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
            const group=this.state.group
            this.setState({
                group:!group
            },function(){
                if(!this.state.group){
                    const paytypelisy=this.state.paytypelisy //按钮list 
                    for(var i=0;i<paytypelisy.length;i++){
                        paytypelisy[i].check=false
                    }
                    this.setState({
                        paytypelisy:paytypelisy
                    },function(){
                        this.listclick(0)
                    })
                }
            })
        }

    //权重处理方法
     arrarow=(arr)=>{
        console.log(arr)
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
        console.log(arr)
        if(Number(arr[0].types)>Number(arr[1].types)){
            console.log(1)
            for(var i=0;i<arr.length;i++){
                newarr.push(arr[i])
            }
            
        }
        if(Number(arr[0].types)==Number(arr[1].types)){
            console.log(2)
            console.log(arr)
            newarr.push(arr[1])
        
        }
        if(Number(arr[0].types)<Number(arr[1].types)){
            console.log(3)
            newarr.push(arr[1])
            newarr.push(arr[0])
        }
        console.log(newarr)
        return newarr
    }   


    //点击不同支付方式
    listclick=(index)=>{
        const paytypelisy=this.state.paytypelisy //按钮list
        const amountlist=this.state.amountlist //左边栏数组
        var newamountlist=[] //新的左边栏数组
        var waringfirsts=false
        var texts=null
        const paytotolamount=this.props.paytotolamount//支付总额
        const lastpayamount=NP.minus(paytotolamount, amountlist[0].value);  //剩余金额
        if(!paytypelisy[index].check){
            if(this.state.group){
                const newarrlist=[]
                newarrlist.push(amountlist[0])   
                newarrlist.push({
                    name:paytypelisy[index].name,
                    value:NP.minus(paytotolamount, newarrlist[0].value),
                    type:paytypelisy[index].type
                })
                console.log(newarrlist)
                //权重处理方法
                newamountlist=this.arrarow(newarrlist) //权重处理后的数组
                console.log(newamountlist)
                //积分会员卡不同状态value处理
                const i=this.isInArray(newamountlist,'5')
                const j=this.isInArray(newamountlist,'6')
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员余额
                if(i!='-1'){
                    //存在会员
                    if(j=='-1'){
                        console.log('001')
                        //不存在积分
                        if(parseFloat(amount)>=parseFloat(paytotolamount)){
                            newamountlist[i].value=paytotolamount
                            console.log(1)
                        }else{
                            newamountlist[i].value=amount
                            console.log(2)
                        }
                        if(i==0){
                            newamountlist[1].value=NP.minus(paytotolamount, newamountlist[0].value); 
                        }else{
                            newamountlist[0].value=NP.minus(paytotolamount, newamountlist[1].value); 
                        }

                    }else{
                        console.log('002')
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
                    console.log('003')
                    //不存在会员
                    if( j=='-1'){
                        console.log('004')
                        //不存在积分=不存在会员，不存在积分
                        newamountlist[0].value=paytotolamount
                    }else{
                        console.log('005')
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
                console.log('fei')
                //非组合支付
                newamountlist.push({
                    name:paytypelisy[index].name,
                    value:paytotolamount,
                    type:paytypelisy[index].type
                })
                const ismember=this.props.ismember
                if(ismember){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员余额
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
            
            console.log(paytypelisy)
            console.log(newamountlist)
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


            this.setState({
                paytypelisy:paytypelisy,
                amountlist:newamountlist,
                waringfirst:waringfirsts,
                text:texts,
                backmoney:backmoneyed
            })
        }

    }

    //结算
    hindpayclick=()=>{
        if(!this.firstclick){
            return
        }
        const backmoney=this.state.backmoney
        const group=this.state.group
        const amountlist=this.state.amountlist
        var totols=0;
        var orderPay=[];
        if(group){
            if(amountlist.length>1){
                totols=NP.plus(amountlist[0].value,amountlist[1].value); 
                for(var i=0;i<amountlist.length;i++){
                    if(amountlist[i].value!='0.00'){
                        orderPay.push({
                            amount:amountlist[i].value,
                            type:amountlist[i].type,
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
                type:amountlist[0].type
            }]
        }

        if(totols==this.props.paytotolamount && backmoney=='0.00'){
            const amountlist=this.state.amountlist
            let values={
                    mbCard:{mbCardId:this.props.ismember?this.props.mbCardId:null},
                    odOrder:{
                        amount:this.props.totolamount,
                        orderPoint:this.props.thispoint,  
                        payAmount:this.props.paytotolamount,
                        qty:this.props.totolnumber,
                        skuQty:this.props.datasouce.length,
                        cutAmount:this.state.cutAmount,
                    },
                    orderDetails:this.props.datasouce,
                    orderPay:orderPay
                }

            this.paying(values)
        }else{
            message.error('金额有误，不能支付')
        }
    }
    //调用结算接口
    paying=(values)=>{
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
                    message.error(json.message)
                    this.firstclick=true
                }
        })
    }

    //单独输入框失去焦点
    hindonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.state.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            amountlist[0].value=paytotolamount
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
            }
            if(amountlist[0].type=='6'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
            }
        }else{
            amountlist[0].value=values
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(values))?values:amount
            }
            if(amountlist[0].type=='6'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(point)>=parseFloat(values))?values:point
            }

        }
        amountlist[0].value=dataedit(String(amountlist[0].value))
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value)))
        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })
    }
    hindonChange=(e)=>{
        //只能输入最多两位数字
        const values=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.state.amountlist
            amountlist[0].value=values
            this.setState({
                amountlist:amountlist
            })
        }
    }
    payfirstonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.state.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            //大于总额
            amountlist[0].value=paytotolamount
            amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
            if(amountlist[0].type=='5'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                if(amountlist[1].type=='6'){
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                }
            }else{
                //当前是积分
                if(amountlist[0].type=='6'){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员卡余额
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
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                    if(amountlist[1].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
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
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[0].value=(parseFloat(amount)>=parseFloat(values))?values:amount
                amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                if(amountlist[1].type=='6'){
                    amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                }

            }else{
                 //当前是积分
                if(amountlist[0].type=='6'){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员卡余额
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
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                    if(amountlist[1].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }
            }
        }
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(String(amountlist[0].value))
        amountlist[1].value=dataedit(String(amountlist[1].value))
        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })
    }
    paysecondonBlur=(e)=>{
        const values=parseFloat(e.target.value)
        const paytotolamount=this.props.paytotolamount
        const amountlist=this.state.amountlist
        if(parseFloat(values)>=parseFloat(paytotolamount)){
            //大于总额
            amountlist[1].value=paytotolamount
            amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
            if(amountlist[1].type=='5'){
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                if(amountlist[0].type=='6'){
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                }
            }else{
                //当前是积分
                if(amountlist[1].type=='6'){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员卡余额
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
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                    if(amountlist[0].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
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
                const point=NP.divide(this.state.point,100); //积分换算金额
                const amount=this.state.amount //会员卡余额
                amountlist[1].value=(parseFloat(amount)>=parseFloat(values))?values:amount
                amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                if(amountlist[0].type=='6'){
                    amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                }
            }else{
                 //当前是积分
                if(amountlist[1].type=='6'){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员卡余额
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
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                    if(amountlist[0].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }
            } 
        }


        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(String(amountlist[0].value))
        amountlist[1].value=dataedit(String(amountlist[1].value))
        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })
    }

    payfirstonChange=(e)=>{
        const values=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.state.amountlist
            amountlist[0].value=values
            this.setState({
                amountlist:amountlist
            })
        }
    }
    paysecondonChange=(e)=>{
        const values=e.target.value
		const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        const str=re.test(values)
        if(str){
            const amountlist=this.state.amountlist
            amountlist[1].value=values
            this.setState({
                amountlist:amountlist
            })
        }
    }
    //抹零
    nozeroclick=()=>{
        const diffamount=NP.minus(this.props.paytotolamount, parseInt(this.props.paytotolamount))
        if(diffamount>0){
            const amountlist=this.state.amountlist.slice(0)
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
            this.setState({
                cutAmount:'1',
                backmoney:backmoneyed,
                amountlist:amountlist
            }) 

        }


        
       
          
    }

    //扫码按钮点击
    onhindClicks=()=>{
        const backmoney=this.state.backmoney
        const group=this.state.group
        const amountlist=this.state.amountlist
        console.log(amountlist)
        var totols=0;
        var orderPay=[];
        if(group){
            if(amountlist.length>1){
                totols=NP.plus(amountlist[0].value,amountlist[1].value); 
                for(var i=0;i<amountlist.length;i++){
                    if(amountlist[i].value!='0.00'){
                        orderPay.push({
                            amount:amountlist[i].value,
                            // type:amountlist[i].type=='1'?'7':(amountlist[i].type=='2'?'8':amountlist[i].type),
                            type:amountlist[i].type,
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
                // type:amountlist[0].type=='1'?'7':(amountlist[0].type=='2'?'8':amountlist[0].type)
                type:amountlist[0].type
            }]
        }

        if(totols==this.props.paytotolamount && backmoney=='0.00'){
            const amountlist=this.state.amountlist
            let values={
                    mbCard:{mbCardId:this.props.ismember?this.props.mbCardId:null},
                    odOrder:{
                        amount:this.props.totolamount,
                        orderPoint:this.props.thispoint,  
                        payAmount:this.props.paytotolamount,
                        qty:this.props.totolnumber,
                        skuQty:this.props.datasouce.length,
                        cutAmount:this.state.cutAmount,
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
        const result=GetServerData('qerp.web.qpos.od.order.save',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                console.log(json)
                const orderNo=json.orderNo  //订单号
                const odOrderId=json.odOrderId  //订单id
                const consumeType='1' //销售订单
                const type=values.orderPay.length>1?values.orderPay[1].type:values.orderPay[0].type//支付类型
                const amount=values.orderPay.length>1?values.orderPay[1].amount:values.orderPay[0].amount //支付金额
                this.context.router.push({ pathname : '/pay', state : {orderId :odOrderId,type:type,amount:amount,consumeType:consumeType,orderNo:orderNo}});  
            }else{
                message.error(json.message)
            }
            
    })




        
    }   







    //是否勾选打印小票
    choosePrint = (e) =>{
        this.props.dispatch({
            type:'cashier/changeCheckPrint',
            payload:e.target.checked
        })
    }
    render() {
        // const openWechat=sessionStorage.getItem("openWechat")
        // const openAlipay=sessionStorage.getItem("openAlipay")
        const openWechat='1'
        const openAlipay='1'
        console.log(this.state.amountlist)
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
                    className='pay check-box-style'
                >
                    <div className='clearfix'>
                        <div className='fl paylw'>
                            <Input  autoComplete="off" addonBefore='总额' value={this.props.paytotolamount}  disabled className='paylh tr payinputsmodel'/>
                            {
                                this.state.amountlist.length>1
                                ?<div className='clearfix inputcenter'>
                                    <div className={(this.state.amountlist[0].type=='1' || this.state.amountlist[0].type=='2' || this.state.amountlist[0].type=='3')?'payharflwl inputcenterdis':'payharflwl inputcenteropen'}>
                                        <div>
                                            <Input  
                                                autoComplete="off" 
                                                addonBefore={this.state.amountlist[0].name}  
                                                value={this.state.amountlist[0].value}  
                                                onBlur={this.payfirstonBlur.bind(this)} 
                                                className='tr payinputsmodel' 
                                                onChange={this.payfirstonChange.bind(this)} 
                                                addonAfter={(this.state.amountlist[0].type=='1' && openWechat=='1') ||(this.state.amountlist[0].type=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.onhindClicks.bind(this)}/>:null}
                                                disabled={(this.state.amountlist[0].type=='1' || this.state.amountlist[0].type=='2' || this.state.amountlist[0].type=='3')?true:false} 
                                            />
                                        </div>
                                      
                                    </div>
                                    <div className={(this.state.amountlist[1].type=='1' || this.state.amountlist[1].type=='2' || this.state.amountlist[1].type=='3')?'payharflwr inputcenterdis':'payharflwr inputcenteropen'}>
                                        <Input  
                                            autoComplete="off" 
                                            addonBefore={this.state.amountlist[1].name} 
                                            value={this.state.amountlist[1].value}  
                                            onBlur={this.paysecondonBlur.bind(this)} 
                                            className='tr payinputsmodel' 
                                            onChange={this.paysecondonChange.bind(this)} 
                                            addonAfter={(this.state.amountlist[0].type=='1' && openWechat=='1') ||(this.state.amountlist[0].type=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.onhindClicks.bind(this)}/>:null}
                                            disabled={(this.state.amountlist[1].type=='1' || this.state.amountlist[1].type=='2' || this.state.amountlist[1].type=='3')?true:false} 
                                        />
                                        
                                    </div>
                                </div>
                                :<div className={(this.state.amountlist[0].type=='1' || this.state.amountlist[0].type=='2' || this.state.amountlist[0].type=='3')?'inputcenter inputcenterdis':'inputcenter inputcenteropen'}>
                                    <Input  
                                        autoComplete="off" 
                                        addonBefore={this.state.amountlist[0].name} 
                                        value={this.state.amountlist[0].value}  
                                        ref='paymoneys' 
                                        onBlur={this.hindonBlur.bind(this)} 
                                        className={(this.state.amountlist[0].type=='1' || this.state.amountlist[0].type=='2' || this.state.amountlist[0].type=='3')? 'paylh tr payinputsmodel payinputsmodels':'paylh tr payinputsmodel'}  
                                        disabled={(this.state.amountlist[0].type=='1' || this.state.amountlist[0].type=='2' || this.state.amountlist[0].type=='3')?true:false} 
                                        onChange={this.hindonChange.bind(this)}
                                        addonAfter={(this.state.amountlist[0].type=='1' && openWechat=='1') ||(this.state.amountlist[0].type=='2' && openAlipay=='1') ?<Btnpay hindClicks={this.onhindClicks.bind(this)}/>:null}
                                    />
                                   
                                    </div>
                                
                            }
                            <div><Input  autoComplete="off" addonBefore='找零'  value={this.state.backmoney}  disabled className='paylh tr payinputsmodel'/></div>
                            <p className={this.state.waringfirst?'waring':'waringnone'}>{this.state.text}</p>
                            {this.state.amountlist.length==1?<div className='payends'><Button className='paylhs' onClick={this.hindpayclick.bind(this)}>结算<p className='iconk'>「空格键」</p></Button></div>:null}
                            {this.state.amountlist.length==1?<div style={{textAlign:"center"}}><Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox></div>:null}
                        </div>
                        <div className='fr fix-800-fr' style={{width:'274px'}}>
                            <div>
                                <ul className='clearfix'>
                                    {
                                        this.state.paytypelisy.map((item,index)=>{
                                            return(
                                                <li className='fl' onClick={this.listclick.bind(this,index)} key={index} className={item.disabled?'listdis':(item.check?'listoff':'list')}>
                                                    <Button  disabled={item.disabled}>{item.name}</Button>
                                                </li>
                                            )
                                        })

                                    }
                                </ul>
                            </div>
                            <div>
                                <ul className='btnbg'>
                                    <li className='fl' onClick={this.connectclick.bind(this)} className={this.state.paytypelisy[4].disabled==true && this.state.paytypelisy[5].disabled==true?(this.state.amountlist.length>1?'listtdiszu':'listtdis'):(this.state.group?(this.state.amountlist.length>1?'listtoffzu':'listtoff'):(this.state.amountlist.length>1?'listtzu':'listt'))}><Button disabled={this.state.paytypelisy[4].disabled==true && this.state.paytypelisy[5].disabled==true?true:false }>组合<br/>支付</Button></li>
                                    <li className='fl' onClick={this.nozeroclick.bind(this)} className={this.state.amountlist.length>1?(this.state.cutAmount=='0'?'listtzu':'listtoffzu'):(this.state.cutAmount=='0'?'listt':'listtoff')}><Button>抹零</Button></li>
                                </ul>
                            </div>
                        </div>

                        {this.state.amountlist.length>1?<div className='payends'><Button className={this.state.amountlist.length>1?'paylhszu':'paylhs'} onClick={this.hindpayclick.bind(this)}>结算<p className='iconk'>「空格键」</p></Button></div>:null}
                        {this.state.amountlist.length>1?<div style={{textAlign:"center"}}><Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox></div>:null}
              	    </div>
            </Modal>
        </div>
    );
  }
  componentDidMount(){
    const meth1={
        initModel:this.initModel,
        hindpayclick:this.hindpayclick,
        handleOk:this.handleOk,

    }
    this.props.dispatch({
        type:'cashier/meth1',
        payload:meth1
    })
  }

}



Pay.contextTypes= {
    router: React.PropTypes.object
}

function mapStateToProps(state) {
    const {payvisible,totolamount,ismember,mbCardId,paytotolamount,datasouce,totolnumber,thispoint,checkPrint}=state.cashier
    return {payvisible,totolamount,ismember,mbCardId,paytotolamount,datasouce,totolnumber,thispoint,checkPrint};
}
export default connect(mapStateToProps)(Pay);


