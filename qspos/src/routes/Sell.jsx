import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import EchartsPie from '../charts/EchartsPie';
import Echartsaxis from '../charts/Echartsaxis';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,Pagination,message} from 'antd';
import {GetServerData} from '../services/services';
// css
const slideinfo={width:'300px',height:'75px',marginLeft:'30px',borderBottom: '1px solid #d8d8d8',overflow:'hidden'}
const slideinfos={fontSize: '12px',color: ' #74777F',marginTop:'10px'}
const slideinfosTwo={fontSize: '12px',color: ' #74777F',marginTop:'5px'}
const infocount={display: 'flex',justifyContent:'space-between'}
const tit={fontSize: '14px',color: '#384162',margin:'10px'}


const TabPane = Tabs.TabPane;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const { MonthPicker, RangePicker } = DatePicker;
const saletext='门店销售门店内商品所获得的金额（不包含充值／退货）'
const sale=<Tooltip placement="top" title={saletext}>销售额&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>
const netreceiptstext='门店销售商品，用户充值及退货所造成的实际金额变化'
const netreceipts=<Tooltip placement="top" title={netreceiptstext}>净收款&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>   
const tabStyle = {width:'330px',height:'450px'}
const tabStyleTwo = {width:'330px',height:'330px'}
let widthFlag = true;
//切换tag
class Tags extends React.Component {
    render() {
        return (
            <div className='h100'>
                <Tabs type="card">
		    	     <TabPane tab="销售订单" key="1"><Sellorder qposStSaleOrders={this.props.qposStSaleOrders} dispatch={this.props.dispatch} total={this.props.total}/></TabPane>
		    	     <TabPane tab="店员销售" key="2"><Sellclerk dispatch={this.props.dispatch}/></TabPane>
 			    </Tabs>
            </div>
        )
    }
}
//搜索组件
class Searchcompon extends React.Component {
    state={
        selectvalue:null,
        inpurvalue:'',
        startTime:null,
        endTime:null,
        page:0
    }
    timechange=(date, dateString)=>{
        console.log(dateString)

        if(dateString[0]==''){
            dateString[0]=null
        }
        if(dateString[1]==''){
            dateString[1]=null
        }


        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        },function(){
            this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:6,currentPage:this.state.page} }})
        })
    }
    handleChange=(value)=>{
        this.setState({
            selectvalue:value
        },function(){
            this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:6,currentPage:this.state.page} }})
        })
    }
    revisemessage=(messages)=>{
        this.setState({
            inpurvalue:messages
        })
    }
    hindsearch=()=>{
        this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:6,currentPage:this.state.page} }})
    }


    pagechange=()=>{
        this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:6,currentPage:this.state.page} }})
    }
    setpage=(page)=>{
        console.log(page)
        this.setState({
            page:page-1
        },function(){
            this.pagechange()
        })
    }



    render(){
        return(
            <div className='clearfix searchqery'>
                <div className='fl clearfix'>
                    <p style={{lineHeight:'40px',height:'40px',float:'left',fontSize: '14px',color: '#74777F',marginRight:'10px',marginLeft:'5px'}}>订单时间</p>
                    <RangePicker format={dateFormat} onChange={this.timechange.bind(this)} className='selltime'/>
                </div>
                <div className='fr clearfix'>
                    <div className='searchselect clearfix fl'>
                        <label style={{fontSize: '14px',color: '#74777F',marginRight:'5px'}}>订单分类</label>
                        <Select defaultValue="0" style={{ width: 100,height:40,marginRight:'5px' }} onChange={this.handleChange.bind(this)}>
                            <Option value="0">全部分类</Option>
                            <Option value="1">销售订单</Option>
                            <Option value="2">充值订单</Option>
                            <Option value="3">退货订单</Option>
                        </Select>
                    </div>
                    <div className='fl' style={{marginRight:'5px'}}>
                        <Searchinput text='请输入商品条码、名称、订单号' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindsearch.bind(this)}/>
                    </div>
                </div>
          </div>
        )
    }
}

//tap tit
function Slidetitle({item}) {
    return (
        <div className='slidetitle slideinfo-height-style'>
            <p className='clearfix p1'><div className='fl p2'>{item.outNo}</div><div className='fr p3'>{item.createTime}</div></p>
            <p className='clearfix' style={widthFlag?slideinfos:slideinfosTwo}><div className='fl'><span>客户：{item.levelStr}</span><span style={{marginLeft:'60px'}}>{item.isdiscount=='0'?null:'折'}</span></div><div className='fr' style={{marginRight:'30px'}}>收银：{item.amount}元</div></p>
        </div>
  );
}

//tap count 销售
class Slidecountsell extends React.Component {
    render(){
        return(
                <div>
                    <ul className='sellinfolist'>
                        <li>
                            <p><div><span>销售订单</span>：{this.props.odOrder.orderNo}</div></p>
                            <p><div><span>销售时间</span>：{this.props.odOrder.saleTime}</div><div><span>销售员</span>：{this.props.odOrder.nickname}</div></p>
                        </li>
                        <li>
                            {

                                this.props.orderDetails.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            <p><div><span>商品名称</span>：{item.name} </div></p>
                                            <p><div><span>商品条码</span>：{item.code}</div> <div><span>规格</span>：{item.displayName}</div></p>
                                            <p><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price}</div><div><span>折后价</span>：{item.payPrice}</div><div><span>折扣</span>：{item.discount}</div></p>
                                        </div>
                                        )
                                })

                            }
                        </li>
                        {

                            this.props.mbCard1==null || undefined || '' 
                            ?
                                (
                                    this.props.orOrderPay.length>0
                                ?
                                    (
                                        this.props.orOrderPay.length>1
                                        ?
                                        <li style={{borderBottom:'0'}}>
                                            <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                            <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}<span>{this.props.orOrderPay[1].typeStr}</span>{this.props.orOrderPay[1].amount}」</div></p>
                                        </li>
                                        :
                                        <li style={{borderBottom:'0'}}>
                                            <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                            <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}」</div></p>
                                        </li>
                                    )
                                :
                                    <li style={{borderBottom:'0'}}>
                                            <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                            <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}</div></p>
                                    </li>
                                )
                            :
                            (
                                this.props.orOrderPay.length>0
                            ?
                                (
                                    this.props.orOrderPay.length>1
                                    ?
                                        <li style={{borderBottom:'0'}}>
                                            <p><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></p>
                                            <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                            <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}<span>{this.props.orOrderPay[1].typeStr}</span>{this.props.orOrderPay[1].amount}」</div></p>
                                        </li>
                                    :
                                        <li style={{borderBottom:'0'}}>
                                            <p><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></p>
                                            <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                            <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}」</div></p>
                                        </li>
                                )
                            :
                                <li style={{borderBottom:'0'}}>
                                        <p><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></p>
                                        <p><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></p>
                                        <p><div><span>结算收银</span>：{this.props.odOrder.payAmount}</div></p>
                                </li>
                                )

                        }
                    </ul>
                </div>
            )
    }
    
}
//tap count 退货
class Slidecountback extends React.Component {
    render(){
        console.log(this)
        return(
            <div>
                <ul className='sellinfolist'>
                    <li>
                        <p><div><span>退货订单</span>：{this.props.odReturn.returnNo} </div><div> <span>销售订单</span>：{this.props.odReturn.orderNo}</div></p>
                        <p><div><span>退货时间</span>：{this.props.odReturn.createTime}</div><div> <span>退货员</span>：{this.props.odReturn.nickname}</div></p>
                    </li>
                    {
                        this.props.returnOrderDetails.map((item,index)=>{
                            return (
                                    <li key={index}>
                                        <p><div><span>商品名称</span>：{item.name}</div> </p>
                                        <p><div><span>商品条码</span>： {item.code}</div><div><span>规格</span>：{item.displayName}</div></p>
                                        <p><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price} </div><div><span>折后价</span>：{item.refundPrice}</div><div><span>实退价</span>：{item.payPrice}</div></p>
                                    </li>
                                )
                        })
                    }
                    {
                        this.props.mbCard3==null || undefined || '' 
                        ?
                        <li style={{borderBottom:'0'}}>
                            <p><div><span>结算退款</span>：{this.props.odReturn.refundAmount}「<span>{this.props.odReturn.typeStr}</span>」</div></p>
                        </li>
                        :
                        <li style={{borderBottom:'0'}}>
                            <p><div><span>会员姓名</span>：{this.props.mbCard3.name} </div><div><span>会员电话</span>：{this.props.mbCard3.mobile} </div><div><span>扣除积分</span>：{this.props.odReturn.returnPoint}</div></p>
                            <p><div><span>结算退款</span>：{this.props.odReturn.refundAmount}「<span>{this.props.odReturn.typeStr}</span>」</div></p>
                        </li>

                    }
                    
                </ul>
            </div>
        )
    }
    
}
//tap count 充值
class Slidecountcz extends React.Component {
    render(){
        return(
                <div>
                    <div className='slidecountcztop'>
                        <p><div><span>充值订单</span>：{this.props.cardMoneyChargeInfo.chargeNo}</div></p>
                        <p><div><span>充值时间</span>：{this.props.cardMoneyChargeInfo.createTime}</div> <div><span>销售员</span>：{this.props.cardMoneyChargeInfo.nickname}</div></p>
                    </div>
                    <div className='slidecountczbo'>
                        <p><span>会员姓名</span>：{this.props.mbCard2.name}</p>
                        <p><span>会员卡号</span>：{this.props.mbCard2.cardNo}</p>
                        <p><span>会员手机</span>：{this.props.mbCard2.mobile}</p>
                        <p><span>会员级别</span>：{this.props.mbCard2.levelStr}</p>
                        <p><span>充值金额</span>：{this.props.cardMoneyChargeInfo.amount}元「<span>{this.props.cardMoneyChargeInfo.typeStr}</span>」</p>
                        <p><span>充值前的余额</span>：{this.props.cardMoneyChargeInfo.beforeAmount}元</p>
                        <p><span>充值后的余额</span>：{this.props.cardMoneyChargeInfo.afterAmount}元</p>
                    </div>
                </div>
            )
    }
    

}
//count tap切换
class Ordertap extends React.Component {
    state = {
        tabPosition: 'left',
        clickkey:0,
        clickid:null,
        clicktype:1,
        keys:0,
        qposStSaleOrders:[],
        outId:null,
        //销售
        orderDetails:[], //详情
        odOrder:{}, //订单信息
        orOrderPay:{},//支付信息，
        mbCard1:{},
        //退货
        mbCard3:{},
        odReturn:{},
        returnOrderDetails:[],
        //充值
        cardMoneyChargeInfo:{},
        mbCard2:{}
    }
    pagechange=(page)=>{
        this.setState({
            clickkey:0
        },function(){
            this.props.revisemessages(page)
        })
        
    }


    //退货数据请求
    setdatact=(keyid)=>{
        const outId=this.state.outId
        const type=3
        let values={
            outId:keyid,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                    return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        this.setState({
                            mbCard3:json.mbCard,
                            odReturn:json.odReturn,
                            returnOrderDetails:json.returnOrderDetails
                       })
                    }else{  
                         message.waring(json.message)
                    }
                })
    }

    //销售数据请求
    setdataxs=(keyid)=>{
         console.log(keyid)
        const type=1
        let values={
            outId:keyid,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                    return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       this.setState({
                        orderDetails:json.orderDetails, //详情
                        odOrder:json.odOrder, //订单信息
                        orOrderPay:json.orOrderPay,//支付信息，
                        mbCard1:json.mbCard
                       })
                    }else{  
                        message.waring(json.message) 
                    }
                })
    }
    //充值数据请求
    setdatacz=(keyid)=>{
         const outId=this.state.outId
        const type=2
        let values={
            outId:keyid,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       this.setState({
                            cardMoneyChargeInfo:json.cardMoneyChargeInfo,
                            mbCard2:json.mbCard
                       })
                    }else{  
                         message.waring(json.message)
                    }
                })
    }








    onTabClick=(key)=>{
        console.log(this)
        console.log(key)
        const keyindex=key.substring(0,1)
        const keyid=key.substring(2,key.length)
        const clicktype=key.substring(1,2)
        this.setState({
            clickkey:Number(keyindex),
            clickid:keyid,
            clicktype:clicktype,
            keys:key
        },function(){
            //根据id和type进行数据请求，并绑定
            console.log(this.state.clicktype)
            if(this.state.clicktype=='1'){
               this.setdataxs(this.state.clickid)
            }
            if(this.state.clicktype=='2'){
               this.setdatacz(this.state.clickid) 

            }
            if(this.state.clicktype=='3'){
               this.setdatact(this.state.clickid)
                
            }

        })
    }
  render() {
    const qposStSaleOrders=this.state.qposStSaleOrders
    console.log(qposStSaleOrders)
    return (
        <div className="content-sell-info">

           <div>
                <Tabs tabPosition={this.state.tabPosition} TabStyle={widthFlag?tabStyle:tabStyleTwo} onTabClick={this.onTabClick.bind(this)} activeKey={String(this.state.keys)}>
                {
                    qposStSaleOrders.map((item,index)=>{
                        return (
                            <TabPane tab={<Slidetitle item={item}/>} key={index+item.type+item.outId}>
                                {
                                    item.type=='1'?<Slidecountsell orderDetails={this.state.orderDetails} odOrder={this.state.odOrder} orOrderPay={this.state.orOrderPay} mbCard1={this.state.mbCard1}/>:(item.type=='2'?<Slidecountcz cardMoneyChargeInfo={this.state.cardMoneyChargeInfo} mbCard2={this.state.mbCard2}/>:<Slidecountback odReturn={this.state.odReturn} returnOrderDetails={this.state.returnOrderDetails} mbCard3={this.state.mbCard3}/>)
                                }
                            </TabPane>)
                    })
                }
              </Tabs>
           </div>
            <div className='Paginationsell'><Pagination total={Number(this.props.total)} simple onChange={this.pagechange.bind(this)} className='Paginationsells' defaultPageSize={6}/></div>
        </div>
    )
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    console.log(this)
    console.log(nextProps.qposStSaleOrders.length)
    if(nextProps.qposStSaleOrders.length>0){
        this.setState({
            qposStSaleOrders:nextProps.qposStSaleOrders,
            keys:0+nextProps.qposStSaleOrders[0].type+nextProps.qposStSaleOrders[0].outId
            },function(){
            this.onTabClick(this.state.keys)
        })
    }else{
        this.setState({
           qposStSaleOrders:[] 
        })
    }

  }

  componentWillMount(){
      console.log(document.body.clientWidth);
         if( document.body.clientWidth > 800 ) {
                /* 这里是要执行的代码 */
              widthFlag = true;
            }else{
               widthFlag = false;
            }
            console.log(widthFlag);
    }

}
//店员销售-时间
class Perdontime extends React.Component {
    state={
        totalUserSale:'',
        userSales:[]
    }
    onChange=(dates,dateStrings)=>{
        let values={
            dateStart:dateStrings[0],
            dateEnd:dateStrings[1]
        }
        this.props.initdataspuce(values)
    }
    render() {
        let d= new Date()
         d.setDate(d.getDate()-1)
         let dy=d.getFullYear() //年
         let dm=d.getMonth()+1//月
         let dd=d.getDate()//日
         let a=dy+'-'+dm+'-'+dd
        return(
            <div className='fr mr30 mt20 clearfix'>
                <div className='mr10 fl h40 '>选择时间</div>
                    <RangePicker 
                        defaultValue={[moment(a, dateFormat), moment(a, dateFormat)]}
                        format={dateFormat} 
                        className='fl selltime'
                        onChange={this.onChange.bind(this)}
                        format="YYYY-MM-DD"
                        showTime
                        allowClear={false}
                    />

                    
            </div>
            )
    }
}

//销售详细数据table
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '姓名',
            dataIndex: 'nickname'
        }, {
            title: sale,
            dataIndex: 'amount'
        }, {
            title: netreceipts,
            dataIndex: 'icAmount'
        },{
            title: '订单数',
            dataIndex: 'orderQty'
        },{
            title: '微信',
            dataIndex: 'wechatAmount'
        },{
            title: '支付宝',
            dataIndex: 'alipayAmount'
        },{
            title: '银联',
            dataIndex: 'unionpayAmount'
        },{
            title: '现金',
            dataIndex: 'cashAmount'
        },{
            title: '会员充值',
            dataIndex: 'cardChargeAmount'
        },{
            title: '会员消费',
            dataIndex: 'cardConsumeAmount'
        },{
            title: '积分抵扣',
            dataIndex: 'pointAmount'
        },{
            title: '退款',
            dataIndex: 'refundAmount'
        }];
        this.state = {
            dataSource: [],
            count: 2
        }
    }
    
    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }

    isInArray=(arr,value)=>{
        for(var i = 0; i < arr.length; i++){
        if(value == arr[i].nickname){
            return true;
        }
    }
    return false;
    }



    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        const userSalese=this.props.userSales
        const totalUserSale=this.props.totalUserSale
    return (
        <div>
            <Table bordered dataSource={this.props.setsouce} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
        </div>
        )
    }



}


//销售订单count
class Sellorder extends React.Component {
    revisemessages=(page)=>{
        const setpage=this.refs.search.setpage
        setpage(page)
    }
    render(){
        return (
            <div>
               <Searchcompon dispatch={this.props.dispatch} ref='search'/>
               <Ordertap qposStSaleOrders={this.props.qposStSaleOrders} total={this.props.total} revisemessages={this.revisemessages.bind(this)} ref='Ordertap'/>
            </div>
        )
    }

}

//店员销售count
class Sellclerk extends React.Component {
    state={
        userSales:[],
        totalUserSale:{
        nickname:'',
        amount:null,
             icAmount:null,
             orderQty:null,
             wechatAmount:null,
             alipayAmount:null,
             unionpayAmount:null,
             cashAmount:null,
             cardChargeAmount:null,
             cardConsumeAmount:null,
             pointAmount:null,
             refundAmount:null,
             key:-2
        },
        setsouce:[]
    }
    initdataspuce=(values)=>{
         const result=GetServerData('qerp.web.qpos.st.user.sale.query',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                            const userSales=json.userSales
                            const totalUserSale=json.totalUserSale
                            totalUserSale.nickname='合计'
                            console.log(totalUserSale)
                            const setsouce=[]
                            for(var i=0;i<userSales.length;i++){
                                setsouce.push(userSales[i])
                            }
                            setsouce.push(totalUserSale)
                        this.setState({
                            userSales:json.userSales,
                            totalUserSale:totalUserSale,
                            setsouce:setsouce
                        })
                    }else{  
                        message.error(json.message) 
                    }
                })

    }
    render(){
        return(
            <div>
                <div className='persontime time-banner-style'><Perdontime dispatch={this.props.dispatch} initdataspuce={this.initdataspuce.bind(this)}/></div>
                <div className="chart-container-style" style={{padding:'0 30px'}}>
                    <p style={tit}>销售数据</p>
                    <div className='clearfix'style={{width:'100%'}}>
                        <div className='fl'><Echartsaxis userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/></div>
                        <div className='fl' style={{width:'2px',height:'200px',background:'#E7E8EC',margin:'40px 25px'}}></div>
                        <div className='fl'><EchartsPie userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/></div>
                    </div>
                    <p style={tit}>详细数据</p>
                    <EditableTable userSales={this.state.userSales} totalUserSale={this.state.totalUserSale} setsouce={this.state.setsouce}/>
                </div>
            </div>
        )
    }
    componentDidMount(){
         let d= new Date()
         d.setDate(d.getDate()-1)
         let dy=d.getFullYear() //年
         var dm=("0" + (d.getMonth() + 1)).slice(-2);
         var dd=("0"+d.getDate()).slice(-2);
         let a=dy+'-'+dm+'-'+dd
        let values={
            dateStart:a,
            dateEnd:a
        }
        this.initdataspuce(values)
    }

}

function Sell({qposStSaleOrders,dispatch,total}) {
  return (
    <div>
    	<Header type={false} color={true}/>
    	<div className='counters'><Tags qposStSaleOrders={qposStSaleOrders} dispatch={dispatch} total={total}/></div>
    </div>
  );
}

function mapStateToProps(state) {
    console.log(state)
    const {qposStSaleOrders,total} = state.sell;
    console.log(qposStSaleOrders)
    console.log(total)
    return {qposStSaleOrders,total};
}

export default connect(mapStateToProps)(Sell);
