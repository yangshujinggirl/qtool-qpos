import { Modal, Button ,Input,message,Checkbox } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../../components/Method/Print'
import {dataedit} from '../../utils/commonFc';
import NP from 'number-precision'
//引入打印
import {getSaleOrderInfo} from '../../components/Method/Print';


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
        cutAmount:'0'
    }

    //初始化方法
    initModel=()=>{
        const ismember=this.props.ismember
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
    //点击不同支付方式
    listclick=(index)=>{
        const paytypelisy=this.state.paytypelisy //按钮list
        const amountlist=this.state.amountlist //左边栏数组
        const newamountlist=[] //新的左边栏数组
        var waringfirsts=false
        var texts=null
        const paytotolamount=this.props.paytotolamount//支付总额
        const lastpayamount=NP.minus(paytotolamount, amountlist[0].value);  //剩余金额
        if(!paytypelisy[index].check){
            if(this.state.group){
                if(amountlist.length>1){
                    newamountlist.push(amountlist[1])  
                }else{
                    newamountlist.push(amountlist[0])    
                }
                newamountlist.push({
                    name:paytypelisy[index].name,
                    value:NP.minus(paytotolamount, newamountlist[0].value),
                    type:paytypelisy[index].type
                })
                //判断是否是会员
                const ismember=this.props.ismember
                if(ismember){
                    const point=NP.divide(this.state.point,100); //积分换算金额
                    const amount=this.state.amount //会员余额
                    const i=this.isInArray(newamountlist,'5')
                    const j=this.isInArray(newamountlist,'6')
                    if(i=='-1'){
                        //不存在会员
                            if(j!='-1'){
                                //存在积分
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
                    }else{
                        //存在会员
                        if(j=='-1'){
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
            newamountlist[0].value=dataedit(newamountlist[0].value)
            if(newamountlist.length>1){
                newamountlist[1].value=dataedit(newamountlist[1].value)
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
        var orderPay=0;
        if(group){
            if(amountlist.length>1){
                totols=NP.plus(amountlist[0].value,amountlist[1].value); 
                orderPay=[{
                    amount:amountlist[0].value,
                    type:amountlist[0].type,
                },{
                    amount:amountlist[1].value,
                    type:amountlist[1].type,
               }]
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
                    if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
                        if(checkPrint){
                            //判断打印纸大小
                            const result=GetServerData('qerp.pos.sy.config.info')
                            result.then((res) => {
                                return res;
                            }).then((json) => {
                                if(json.code == "0"){
                                    //判断是打印大的还是小的
                                    if(json.config.paperSize=='80'){
                                        let valueData =  {type:"1",outId:odOrderIds};
                                        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                        result.then((res) => {
                                            return res;
                                        }).then((data) => {
                                            if(data.code == "0"){
                                                getSaleOrderInfo(data,"80",json.config.submitPrintNum);
                                            }else{
                                                message.error(data.message);
                                            }
                                        });
                                    }else{
                                        let valueData =  {type:"1",outId:odOrderIds};
                                        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                        result.then((res) => {
                                            return res;
                                        }).then((data) => {
                                            if(data.code == "0"){
                                                getSaleOrderInfo(data,"58",json.config.submitPrintNum);
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
                    }else{
                        message.warning('请在win系统下操作打印') 
                    }
                }else{
                    message.error(json.message)
                    this.firstclick=true
                }
        })
    }


    //单独输入框失去焦点
    hindonBlur=(e)=>{
        const values=e.target.value
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
        amountlist[0].value=dataedit(amountlist[0].value)
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value)))
        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })
    }
    hindonChange=(e)=>{
        //只能输入最多两位数字
        const values=e.target.value
        const amountlist=this.state.amountlist
        amountlist[0].value=values
        this.setState({
            amountlist:amountlist
        })
    }
    payfirstonBlur=(e)=>{
        const values=e.target.value
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
                        // amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                       // amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[1].value)

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
                        // amountlist[1].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        // amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                    if(amountlist[1].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        // amountlist[1].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        // amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)
                        amountlist[0].value=values
                        amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[0].value)
                    }
                }

            }
           
        }
        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(amountlist[0].value)
        amountlist[1].value=dataedit(amountlist[1].value)

        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })

    }
    paysecondonBlur=(e)=>{
        const values=e.target.value
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
                        // amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        // amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)>=point?point:NP.minus(this.props.paytotolamount, amountlist[0].value)

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
                        // amountlist[0].value=(parseFloat(amount)>=parseFloat(paytotolamount))?paytotolamount:amount
                        // amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)

                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(amount)?amount:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                    if(amountlist[0].type=='6'){
                        const point=NP.divide(this.state.point,100); //积分换算金额
                        const amount=this.state.amount //会员卡余额
                        // amountlist[0].value=(parseFloat(point)>=parseFloat(paytotolamount))?paytotolamount:point
                        // amountlist[1].value=NP.minus(this.props.paytotolamount, amountlist[0].value)
                        amountlist[1].value=values
                        amountlist[0].value=NP.minus(this.props.paytotolamount, amountlist[1].value)>=parseFloat(point)?point:NP.minus(this.props.paytotolamount, amountlist[1].value)
                    }
                }

            }
           
        }


        const backmoney=NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)==0?'0.00':'-'+dataedit(String(NP.minus(this.props.paytotolamount, amountlist[0].value,amountlist[1].value)))
        amountlist[0].value=dataedit(amountlist[0].value)
        amountlist[1].value=dataedit(amountlist[1].value)
        this.setState({
            amountlist:amountlist,
            backmoney:backmoney
        })
    }

    payfirstonChange=(e)=>{
        const values=e.target.value
        const amountlist=this.state.amountlist
        amountlist[0].value=values
        this.setState({
            amountlist:amountlist
        })
        
    }
    paysecondonChange=(e)=>{
        const values=e.target.value
        const amountlist=this.state.amountlist
        amountlist[1].value=values
        this.setState({
            amountlist:amountlist
        })
    }

    //打印
    handprint = (id,type,orderNo,size) => {
        GetLodop(id,type,orderNo,size)
    }
    //抹零
    nozeroclick=()=>{
        const paytotolamount=parseInt(this.props.paytotolamount)
        const amountlist=this.state.amountlist.slice(0)
        for(var i=0;i<amountlist.length;i++){
            amountlist[i].value=parseInt(amountlist[i].value)
        }
        var backmoney=0;
        if(this.state.amountlist.length>1){
             backmoney=NP.minus(paytotolamount, amountlist[0].value,amountlist[1].value)
        }else{
             backmoney=NP.minus(paytotolamount, amountlist[0].value)
        }
        this.props.dispatch({
            type:'cashier/paytotolamount',
            payload:paytotolamount
        })
        this.setState({
            cutAmount:'1',
            backmoney:backmoney,
            amountlist:amountlist
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
                    className='pay'
                >
                    <div className='clearfix'>
                        <div className='fl paylw'>
                            <Input  addonBefore='总额' value={this.props.paytotolamount}  disabled className='paylh tr payinputsmodel'/>
                            {
                                this.state.amountlist.length>1
                                ?<div className='clearfix inputcenter'>
                                    <div className='payharflwl' ><Input  addonBefore={this.state.amountlist[0].name}  value={this.state.amountlist[0].value}  onBlur={this.payfirstonBlur.bind(this)} className='tr payinputsmodel' onChange={this.payfirstonChange.bind(this)}/></div>
                                    <div className='payharflwr'><Input  addonBefore={this.state.amountlist[1].name} value={this.state.amountlist[1].value}  onBlur={this.paysecondonBlur.bind(this)} className='tr payinputsmodel' onChange={this.paysecondonChange.bind(this)}/></div>
                                </div>
                                :<div className='inputcenter'><Input  addonBefore={this.state.amountlist[0].name} value={this.state.amountlist[0].value}  ref='paymoneys' onBlur={this.hindonBlur.bind(this)} className='paylh tr payinputsmodel' onChange={this.hindonChange.bind(this)}/></div>
                                
                            }
                            <div><Input  addonBefore='找零'  value={this.state.backmoney}  disabled className='paylh tr payinputsmodel'/></div>
                            <p className={this.state.waringfirst?'waring':'waringnone'}>{this.state.text}</p>
                            <div className='payends'><Button className='tc mt25 paylhs' onClick={this.hindpayclick.bind(this)}>结算<p className='iconk'>「空格键」</p></Button></div>
                            <div style={{textAlign:"center"}}><Checkbox onChange={this.choosePrint.bind(this)} checked={this.props.checkPrint}>打印小票</Checkbox></div>
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
                                    <li className='fl' onClick={this.connectclick.bind(this)} className={this.state.group?'listtoff':'listt'}><Button>组合<br/>支付</Button></li>
                                    <li className='fl' onClick={this.nozeroclick.bind(this)} className={this.state.cutAmount=='0'?'listt':'listtoff'}><Button>抹零</Button></li>
                                </ul>
                            </div>
                        </div>
              	    </div>
            </Modal>
        </div>
    );
  }
  componentDidMount(){
    const meth1={
        initModel:this.initModel,
        hindpayclick:this.hindpayclick
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


