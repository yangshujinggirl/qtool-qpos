import React from 'react';
import { Modal, Button ,Input,message} from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {GetLodop} from '../Method/Print.jsx'

const lw={width:'580px'}
const lh={height:'90px'}
const lhs={width:'580px',height:'144px',background: '#35BAB0',border: '1px solid #E7E8EC',
boxShadow: '0 0 10px 0 rgba(0,0,0,0.10)',borderRadius: '3px',fontSize:'40px',color:'#fff'}
const harflw={width:'280px',height:'90px',}
const harflwl={width:'280px',height:'90px',float:'left'}
const harflwr={width:'280px',height:'90px',float:'right'}

class Pay extends React.Component {
     constructor(props) {
        super(props);
        this.lists=[]
     }
    state = { 
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
        totolamount:'',
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
        nonezero:false, //是否禁用
        usetype:true, //收银 false，退货,
        nozero:false,
        datamember:null,
        datadatasoucer:[],
        datadatasoucerlength:0,
        datanumber:0,
        datatotalamount:'0.00',
        datajifen:0,
        warning:false,
        text:''
    }

    //接收函数
    revisedata=(message)=>{
        var messagedata=message
        if(messagedata.type==1){
            //datasouce和数量
                var datasouce=messagedata.data
                for(var i=0;i<datasouce.length;i++){
                    datasouce[i].price=datasouce[i].toCPrice
                }
                var skuQty=datasouce.length
                this.setState({
                    datadatasoucer:datasouce,
                    datadatasoucerlength:skuQty
                })
        }
        if(messagedata.type==2){
            //会员卡
            this.setState({
                datamember:messagedata.data
            })
        }
        if(messagedata.type==4){
            console.log(messagedata)
            //数量和总额
            this.setState({
                datanumber:messagedata.data,
                datatotalamount:messagedata.totalamount
            })
        }
         if(messagedata.type==5){
            //积分
            this.setState({
                datajifen:messagedata.data
            })
        }
        if(messagedata.type==6){
            //退货datasouce 和订单id odOrderId 会员id 还要计算商品数 
            const redatasouce=messagedata.data
            console.log(redatasouce)
            const odOrderId=redatasouce[0].odOrderId
            const mbCardId=messagedata.mbCardId
            var renumber=0
            for(var i=0;i<redatasouce.length;i++){
                renumber=renumber+Number(redatasouce[i].qty)
                redatasouce[i].refundPrice=redatasouce[i].payPrice
            }
            this.setState({
                redatasouce:redatasouce, //datasouce
                odOrderId:odOrderId, //订单id
                renumber:renumber, //总数量
                rembCardId:mbCardId
            })
        }
        if(messagedata.type==7){
            //退货种类数 金额，实际退钱
            this.setState({
                quantity:messagedata.quantity,
                totalamount:messagedata.totalamount,
                intotalamount:messagedata.totalamount
            })
        }
        if(messagedata.type==8){
            //订单号
            this.setState({
                rebarcode:messagedata.data
            })
        }
        if(messagedata.type==9){
            // 积分
            this.setState({
                rejifen:messagedata.data
            })
        }
    }
    showModal=(type,data) => {
        if(type==1){
            //先判断谁是被禁用的：index:5被禁用
            const backmoney=this.backmoneymeth(data.totalamount,data.totalamount,0)
            let listarrs=this.state.listarrs
            listarrs[5].disabled=true
            listarrs[5].style='listdis'
            const payinput=this.state.paynext
            payinput.name='会员卡'
            payinput.value=data.totalamount
            this.setState({
                visible: true,
                group:false,
                paynext:payinput,
                totolamount:data.totalamount,
                backmoney:backmoney,
                listarrs:listarrs,
                type:1,
                usetype:true,
                warning:false,
                text:''
            },function(){
                this.listclick(4)
            });
        }
        if(type==2){
            this.lists=[-1]
            const backmoney=this.backmoneymeth(data.totalamount,data.memberinfo,0)
            let listarrs=this.state.listarrs
            listarrs[5].disabled=true
            listarrs[5].style='listdis'
            const payinput=this.state.paynext
            payinput.name='会员卡'
            payinput.value=data.memberinfo
            console.log(backmoney)
            this.setState({
                totolamount:data.totalamount,
                visible: true,
                group:true,
                paynext:payinput,
                backmoney:backmoney,
                listarrs:listarrs,
                type:2,
                usetype:true,
                warning:true,
                text:'会员卡余额不足，请组合其他付款方式'
              },function(){
                this.listclick(4)
            })
        }
        if(type==3){
            //先判断谁是被禁用的：index:5被禁用
            const backmoney=this.backmoneymeth(data.totalamount,data.totalamount,0)
            let listarrs=this.state.listarrs
            listarrs[4].disabled=true
            listarrs[4].style='listdis'
            const payinput=this.state.paynext
            payinput.name='积分'
            payinput.value=data.totalamount
            this.setState({
                visible: true,
                group:false,
                paynext:payinput,
                totolamount:data.totalamount,
                backmoney:backmoney,
                listarrs:listarrs,
                type:3,
                usetype:true,
                warning:false,
                text:''
            },function(){
                this.listclick(5)
            });
        }
        if(type==4){
            this.lists=[-1]
            const backmoney=this.backmoneymeth(data.totalamount,data.integral,0)
            let listarrs=this.state.listarrs
            listarrs[4].disabled=true
            listarrs[4].style='listdis'
            const payinput=this.state.paynext
            payinput.name='积分'
            payinput.value=data.integral
            this.setState({
                totolamount:data.totalamount,
                visible: true,
                group:true,
                paynext:payinput,
                backmoney:backmoney,
                listarrs:listarrs,
                type:4,
                usetype:true,
                warning:true,
                text:'积分低值余额不足，请组合其他付款方式'
            },function(){
                this.listclick(5)
            })
        }
        if(type==5){
            this.lists=[-1]
            //先判断谁是被禁用的：index:5被禁用
            const backmoney=this.backmoneymeth(data,data,0)
            console.log(backmoney)
            let listarrs=this.state.listarrs
            listarrs[5].disabled=true
            listarrs[5].style='listdis'
            listarrs[4].disabled=true
            listarrs[4].style='listdis'
            const payinput=this.state.paynext
            payinput.name='微信'
            payinput.value=data
            this.setState({
                visible: true,
                group:false,
                paynext:payinput,
                totolamount:data,
                backmoney:backmoney,
                listarrs:listarrs,
                type:5,
                usetype:true,
                warning:false,
                text:''
            },function(){
                this.listclick(0)
            });
        }
        if(type==6){
            //先判断谁是被禁用的
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
                type:6,
                usetype:false,
                warning:false,
                text:''
            },function(){
                this.listclick(4)
            });
        }
        if(type==7){
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
        if(type==8){
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
    }
    handleOk = (e) => {
        this.setState({
          visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
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
        if(index==0){
            this.setState({
                nonezero:false
            })
        }else{
            this.setState({
                nonezero:true
            })
        }
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
                    this.setState({
                        listarrs:listarrs,
                        paysecond:paysecond,
                        warning:false,
                        text:''
                    })
                }else{
                    listarrs[this.lists[0]].style='listoff'
                    listarrs[this.lists[1]].style='listoff'
                    payfirst.name=listarrs[this.lists[0]].name
                    payfirst.value=this.state.paysecond.value
                    paysecond.name=listarrs[this.lists[1]].name
                    paysecond.value=(-parseFloat(this.backmoneymeth(this.state.totolamount,payfirst.value,0))).toFixed(2)
                    this.setState({
                        listarrs:listarrs,
                        payfirst:payfirst,
                        paysecond:paysecond,
                        backmoney:'0.00',
                        warning:false,
                        text:''
                    })
                } 
            }
        }else{
            console.log(this.lists)
        }



        }else{
            //非组合支付
            this.lists=[-1]
            this.lists.push(index)
            console.log(this.lists)
            listarrs[this.lists[1]].style='listoff'
            const payinput=this.state.paynext
            payinput.name=listarrs[this.lists[1]].name
            payinput.value=this.state.totolamount
            const paysecond=this.state.paysecond
            paysecond.name=listarrs[this.lists[1]].name
            paysecond.value=this.state.paynext.value
            this.setState({
                listarrs:listarrs,
                paynext:payinput,
                paysecond:paysecond,
                warning:false,
                text:''
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
        const payinput=this.state.paynext
        payinput.value=e.target.value
        this.setState({
            paynext:payinput
        })
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
        //判断是收银结算还是退货结算
        const usetype=this.state.usetype
        if(usetype){
            //判断能不能支付
            // 1.如果支付金额小于总额，总额等于0，不能支付
            // 2.支付方式没有选择，不能支付
            //支付类型
            const list=this.lists
            var orderPay=[]
            if(list==[] || list==[-1] || list=='' || list==null || list==undefined){
                //不能结算
                message.warning('支付数据有错误，不能支付');
            }else{
                if(list[0]<0){
                    if(parseFloat(this.state.paynext.value)< parseFloat(this.state.totolamount)){
                        //不能支付
                        message.warning('支付数据有错误，不能支付');
                    }else{
                        //可以支付
                        let type=list[1]+1
                        let amount=this.state.paynext.value
                        orderPay.push({amount:amount,type:type})
                        //组合参数
                        let values={
                            mbCard:{mbCardId:this.state.datamember},
                            odOrder:{
                                amount:this.state.datatotalamount,
                                orderPoint:this.state.datajifen,
                                payAmount:this.state.datatotalamount,
                                qty:this.state.datanumber,
                                skuQty:this.state.datadatasoucerlength
                            },
                            orderDetails:this.state.datadatasoucer,
                            orderPay:orderPay
                        }
                        //数据请求
                        this.paying(values)
                    }
                }
                if(list[0]>0){
                    const totol=parseFloat(this.state.payfirst.value)+parseFloat(this.state.paysecond.value)
                    if(totol< parseFloat(this.state.totolamount)){
                        //不能支付
                        message.warning('支付数据有错误，不能支付');
                    }else{
                        //可以支付
                        let type0=list[0]+1
                        let type1=list[1]+1
                        let type0value=this.state.payfirst.value
                        let type1value=this.state.paysecond.value
                        orderPay.push({amount:type0value,type:type0},{amount:type1value,type:type1})
                        //组合参数
                        let values={
                            mbCard:{mbCardId:this.state.datamember},
                            odOrder:{
                                amount:this.state.datatotalamount,
                                orderPoint:this.state.datajifen,
                                payAmount:this.state.datatotalamount,
                                qty:this.state.datanumber,
                                skuQty:this.state.datadatasoucerlength
                            },
                            orderDetails:this.state.datadatasoucer,
                            orderPay:orderPay
                        }
                        //数据请求
                        this.paying(values)
                    }
                }
            }
        }else{
            // 退货结算
            //先判断什么条件能退货，然后是退货，最后是数据初始化
            const list=this.lists
            let type=list[1]+1
            let values={
                "odReturn":{
                    "amount":this.state.totalamount, 
                    "orderNo":this.state.rebarcode, 
                    "qty":this.state.renumber,
                    "refundAmount":this.state.intotalamount,
                    "returnPoint":this.state.rejifen,
                    "skuQty":this.state.quantity,
                    "type":type
                },
                "odReturnDetails":this.state.redatasouce,
                "qposMbCard":{"mbCardId":this.state.rembCardId}
            }
            this.repaying(values)
        }
    }
    //调用结算接口
    paying=(values)=>{
        const result=GetServerData('qerp.web.qpos.od.order.save',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                console.log(json)
                if(json.code=='0'){
                    this.handleOk()
                    this.props.initdata()
                    // 打印
                     // this.handprint(json.odOrderId,'odOrder',json.orderNo)
                }else{
                    message.error(json.message)
                }
        })
    }

    //退货支付
    repaying=(values)=>{
        const result=GetServerData('qerp.web.qpos.od.return.save',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code=='0'){
                     this.handleOk()
                     this.props.reinitdata()
                     this.props.useinitdata()
                     //打印
                      // this.handprint(json.odReturnId,'odReturn',json.returnNo)
                }else{
                    message.error(json.message)
                }
        })
    }




    onfocus=()=>{
        const ValueorderNoses=ReactDOM.findDOMNode(this.refs.paymoneys)
        console.log(ValueorderNoses)
    }
    //单独输入框失去焦点
    hindonBlur=()=>{
        const moneyvalue=this.state.paynext
        var  moneyvaluedata=parseFloat(this.state.paynext.value)
        var totolamount=parseFloat(this.state.totolamount)
        moneyvalue.value=moneyvaluedata.toFixed(2)
        const backmoneymeths=this.backmoneymeth(this.state.totolamount,moneyvalue.value,0)
        this.setState({
            backmoney:backmoneymeths,
            paynext:moneyvalue
        })
    }

    nozeroclick=()=>{
        this.setState({
            nozero:true
        },function(){
            const group=this.state.group
            const totolamount=parseInt(this.state.totolamount).toFixed(2)
            if(group){
                var paysecond=this.state.paysecond
                paysecond.value=(-this.backmoneymeth(totolamount,this.state.payfirst.value,0)).toFixed(2)
                this.setState({
                    totolamount:totolamount,
                    paysecond:paysecond,
                    backmoney:this.backmoneymeth(totolamount,this.state.payfirst.value,paysecond.value)
                })
            }else{
                const paynextvalue=this.state.paynext.value
                this.setState({
                    totolamount:totolamount,
                    backmoney:this.backmoneymeth(totolamount,paynextvalue,0)
                })
            }
        })
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
         if(parseFloat(payfirst.value)>parseFloat(totolamount)){
            payfirst.value=totolamount
         }
         payfirst.value=parseFloat(payfirst.value).toFixed(2)
         paysecond.value=(-this.backmoneymeth(totolamount,payfirst.value,this.state.backmoney)).toFixed(2)
         this.setState({
            payfirst:payfirst,
            paysecond:paysecond
         })
    }
    paysecondonBlur=()=>{
        const payfirst=this.state.payfirst
        const paysecond=this.state.paysecond
        const totolamount=this.state.totolamount
        if(parseFloat(paysecond.value)>parseFloat(totolamount)){
            paysecond.value=totolamount
        }
        paysecond.value=parseFloat(paysecond.value).toFixed(2)
        payfirst.value=(-this.backmoneymeth(totolamount,paysecond.value,this.state.backmoney)).toFixed(2)
        this.setState({
            payfirst:payfirst,
            paysecond:paysecond
         })
    }
    //打印
     handprint = (id,type,orderNo) => {
        GetLodop(id,type,orderNo)
    }
    hindpay=()=>{
        this.hindpayclick()
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
              closable={false}
              footer={null}
              className='pay'
            >
                <div className='clearfix'>
                	<div style={lw} className='fl'>
                 		<Input  addonBefore='总额' style={lh} value={this.state.totolamount} onChange={this.totolamountchange.bind(this)} disabled/>
        	         	{
        	         		this.state.group && this.lists.length>1 && (this.lists[0]==0 || this.lists[0]>0)
        	         		?<div className='clearfix inputcenter'>
        						<Input  addonBefore={this.state.payfirst.name} style={harflwl} value={this.state.payfirst.value} onChange={this.payfirstchange.bind(this)} onBlur={this.payfirstonBlur.bind(this)}/>
        						<Input  addonBefore={this.state.paysecond.name} style={harflwr} value={this.state.paysecond.value} onChange={this.paysecondchange.bind(this)} onBlur={this.paysecondonBlur.bind(this)}/>
        	         		</div>
        	         		:<div className='inputcenter'><Input  addonBefore={this.state.paynext.name} style={lh} value={this.state.paynext.value} onChange={this.paymoney.bind(this)} ref='paymoneys' onBlur={this.hindonBlur.bind(this)}/></div>
                            
        	         	}
                 		<Input  addonBefore='找零' style={lh} value={this.state.backmoney} onChange={this.backmoney.bind(this)} disabled/>
                 		<p className={this.state.warning?'waring':'waringnone'}>{this.state.text}</p>
                        <Button style={lhs} className='tc mt25' onClick={this.hindpayclick.bind(this)} onKeyUp={this.hindpay.bind(this)}>结算<p className='iconk'>「回车键」</p></Button>
               	 	</div>
                    <div className='fr' style={{width:'274px'}}>
                        <div>
                            <ul className='clearfix'>
                                {
                                    this.state.listarrs.map((item,index)=>{
                                        return(
                                            <li className='fl' onClick={this.listclick.bind(this,index)} key={index}>
                                                <Button className={item.style} disabled={item.disabled}>{item.name}</Button>
                                            </li>
                                        )
                                    })

                                }
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li className='fl' onClick={this.connectclick.bind(this)}><Button className={this.state.usetype?(this.state.group?'listtoff':'listt'):'listtdis'}>组合<br/>支付</Button></li>
                                <li className='fl' onClick={this.nozeroclick.bind(this)}><Button className={this.state.usetype?(this.state.nozero?'listtoff':'listt'):'listtdis'}  disabled={this.state.nonezero}>抹零</Button></li>
                            </ul>
                        </div>
                    </div>
              	</div>
            </Modal>
        </div>
    );
  }
  componentDidMount(){
    this.onfocus()
  }
}


export default Pay