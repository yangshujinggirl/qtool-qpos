import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import EchartsPie from '../charts/EchartsPie';
import Echartsaxis from '../charts/Echartsaxis';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import {GetServerData} from '../services/services';
// css
const slideinfo={width:'300px',height:'80px',marginLeft:'30px',borderBottom: '1px solid #E7E8EC',overflow:'hidden'}
const slideinfos={fontSize: '12px',color: ' #74777F',marginTop:'10px'}
const infocount={display: 'flex',justifyContent:'space-between'}
const tit={fontSize: '14px',color: '#384162',margin:'10px'}


const TabPane = Tabs.TabPane;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const { MonthPicker, RangePicker } = DatePicker;
const saletext='123'
const sale=<Tooltip placement="top" title={saletext}>销售额</Tooltip>
const netreceiptstext='456'
const netreceipts=<Tooltip placement="top" title={netreceiptstext}>净收款</Tooltip>   

//切换tag
class Tags extends React.Component {
    render() {
        return (
            <div className='h100'>
                <Tabs type="card">
		    	     <TabPane tab="销售订单" key="1"><Sellorder qposStSaleOrders={this.props.qposStSaleOrders} dispatch={this.props.dispatch}/></TabPane>
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
        endTime:null
    }
    timechange=(date, dateString)=>{
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        },function(){
            this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime} }})
        })
    }
    handleChange=(value)=>{
        this.setState({
            selectvalue:value
        },function(){
            this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime} }})
        })
    }
    revisemessage=(messages)=>{
        this.setState({
            inpurvalue:messages
        })
    }
    hindsearch=()=>{
        this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime} }})
    }

    render(){
        return(
            <div className='clearfix searchqery'>
                <div className='fl clearfix'>
                    <p style={{lineHeight:'40px',height:'40px',float:'left',fontSize: '14px',color: '#74777F',marginRight:'10px',marginLeft:'30px'}}>订单时间</p>
                    <RangePicker format={dateFormat} onChange={this.timechange.bind(this)}/>
                </div>
                <div className='fr clearfix'>
                    <div className='searchselect clearfix fl'>
                        <label style={{fontSize: '14px',color: '#74777F',marginRight:'10px'}}>订单分类</label>
                        <Select defaultValue="0" style={{ width: 100,height:40,marginRight:'20px' }} onChange={this.handleChange.bind(this)}>
                            <Option value="0">全部分类</Option>
                            <Option value="1">销售订单</Option>
                            <Option value="2">充值订单</Option>
                            <Option value="3">退货订单</Option>
                        </Select>
                    </div>
                    <div className='fl' style={{marginRight:'30px'}}>
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
        <div style={slideinfo} className='slidetitle'>
            <p className='clearfix p1'><div className='fl p2'>{item.outNo}</div><div className='fr p3'>{item.createTime}</div></p>
            <p className='clearfix' style={slideinfos}><div className='fl'><span>客户：{item.levelStr}</span><span style={{marginLeft:'60px'}}>{item.isdiscount=='0'?null:'折'}</span></div><div className='fr' style={{marginRight:'30px'}}>收银：{item.amount}元</div></p>
        </div>
  );
}

//tap count 销售
class Slidecountsell extends React.Component {
    state={
        orderDetails:[], //详情
        odOrder:{}, //订单信息
        orOrderPay:[],//支付信息，
        mbCard:{}
    }
    render(){
        return(
                <div>
                    <ul className='sellinfolist'>
                        <li>
                            <p><div><span>销售订单</span>：{this.state.odOrder.orderNo}</div></p>
                            <p><div><span>销售时间</span>：{this.state.odOrder.createTime}</div><div><span>销售员</span>：{this.state.odOrder.nickname}</div></p>
                        </li>
                        <li>
                            {

                                this.state.orderDetails.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            <p><div><span>商品名称</span>：{item.name} </div></p>
                                            <p><div><span>商品条码</span>：{item.orderNo}</div> <div><span>规格</span>：{item.displayName}</div></p>
                                            <p><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price}</div><div><span>折后价</span>：{item.payPrice}</div><div><span>折扣</span>：{item.discount}</div></p>
                                        </div>
                                        )
                                })

                            }
                        </li>
                        {
                            this.state.orOrderPay.length>0
                            ?
                            (
                                this.state.orOrderPay.length>1
                                ?
                                <li style={{borderBottom:'0'}}>
                                    <p><div><span>会员姓名</span>：{this.state.mbCard.name} </div><div><span>会员电话</span>：{this.state.mbCard.mobile} </div><div><span>本次积分</span>：{this.state.odOrder.orderPoint}</div></p>
                                    <p><div><span>折扣优惠</span>：{this.state.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.state.odOrder.cutAmount}</div></p>
                                    <p><div><span>结算收银</span>：{this.state.odOrder.amount}「<span>{this.state.orOrderPay[0].typeStr}</span>：{this.state.orOrderPay[0].amount}<span>{this.state.orOrderPay[1].typeStr}</span>{this.state.orOrderPay[1].amount}」</div></p>
                                </li>
                                :
                                <li style={{borderBottom:'0'}}>
                                    <p><div><span>会员姓名</span>：{this.state.mbCard.name} </div><div><span>会员电话</span>：{this.state.mbCard.mobile} </div><div><span>本次积分</span>：{this.state.odOrder.orderPoint}</div></p>
                                    <p><div><span>折扣优惠</span>：{this.state.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.state.odOrder.cutAmount}</div></p>
                                    <p><div><span>结算收银</span>：{this.state.odOrder.amount}「<span>{this.state.orOrderPay[0].typeStr}</span>：{this.state.orOrderPay[0].amount}」</div></p>
                                </li>
                            )
                            :
                            <li style={{borderBottom:'0'}}>
                                    <p><div><span>会员姓名</span>：{this.state.mbCard.name} </div><div><span>会员电话</span>：{this.state.mbCard.mobile} </div><div><span>本次积分</span>：{this.state.odOrder.orderPoint}</div></p>
                                    <p><div><span>折扣优惠</span>：{this.state.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.state.odOrder.cutAmount}</div></p>
                                    <p><div><span>结算收银</span>：{this.state.odOrder.amount}</div></p>
                            </li>

                        }
                    </ul>
                </div>
            )
    }
    componentDidMount(){
        const outId=this.props.outId
        const type=this.props.type
        let values={
            outId:outId,
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
                        mbCard:json.mbCard
                       })
                    }else{  
                        
                    }
                })

    }
}
//tap count 退货
class Slidecountback extends React.Component {
    state={
        mbCard:{},
        odReturn:{},
        returnOrderDetails:[]
    }
    render(){
        return(
            <div>
                <ul className='sellinfolist'>
                    <li>
                        <p><div><span>退货订单</span>：{this.state.odReturn.returnNo} </div><div> <span>销售订单</span>：{this.state.odReturn.orderNo}</div></p>
                        <p><div><span>退货时间</span>：{this.state.odReturn.createTime}</div><div> <span>退货员</span>：{this.state.odReturn.nickname}</div></p>
                    </li>
                    {
                        this.state.returnOrderDetails.map((item,index)=>{
                            return (
                                    <li key={index}>
                                        <p><div><span>商品名称</span>：{item.name}</div> </p>
                                        <p><div><span>商品条码</span>： {item.name}</div><div><span>规格</span>：{item.displayName}</div></p>
                                        <p><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price} </div><div><span>折后价</span>：{item.refundPrice}</div><div><span>折扣</span>：{item.discount}</div></p>
                                    </li>
                                )
                        })
                    }
                    <li style={{borderBottom:'0'}}>
                        <p><div><span>会员姓名</span>：{this.state.mbCard.name} </div><div><span>会员电话</span>：{this.state.mbCard.mobile} </div><div><span>扣除积分</span>：{this.state.mbCard.point}</div></p>
                        <p><div><span>结算收银</span>：2345.00「<span>会员卡支付</span>：321.00、<span>微信支付</span>：2000.00、<span>支付宝</span>：199.00」</div></p>
                    </li>
                </ul>
            </div>
        )
    }
    componentDidMount(){
        const outId=this.props.outId
        const type=this.props.type
        let values={
            outId:outId,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                    return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        this.setState({
                            mbCard:json.mbCard,
                            odReturn:json.odReturn,
                            returnOrderDetails:json.returnOrderDetails
                       })
                    }else{  
                        
                    }
                })

    }
}
//tap count 充值
class Slidecountcz extends React.Component {
    state={
        cardMoneyChargeInfo:{},
        mbCard:{}
    }
    render(){
        return(
                <div>
                    <div className='slidecountcztop'>
                        <p><div><span>充值订单</span>：{this.state.cardMoneyChargeInfo.chargeNo}</div></p>
                        <p><div><span>充值时间</span>：{this.state.cardMoneyChargeInfo.createTime}</div> <div><span>销售员</span>：{this.state.cardMoneyChargeInfo.nickname}</div></p>
                    </div>
                    <div className='slidecountczbo'>
                        <p><span>会员姓名</span>：{this.state.mbCard.name}</p>
                        <p><span>会员卡号</span>：{this.state.mbCard.cardNo}</p>
                        <p><span>会员手机</span>：{this.state.mbCard.mobile}</p>
                        <p><span>会员级别</span>：{this.state.mbCard.levelStr}</p>
                        <p><span>充值余额</span>：{this.state.cardMoneyChargeInfo.amount}元「<span>{this.state.cardMoneyChargeInfo.typeStr}</span>」</p>
                        <p><span>充值前的余额</span>：{this.state.cardMoneyChargeInfo.beforeAmount}元</p>
                        <p><span>充值后的余额</span>：{this.state.cardMoneyChargeInfo.afterAmount}元</p>
                    </div>
                </div>
            )
    }
    componentDidMount(){
        const outId=this.props.outId
        const type=this.props.type
        let values={
            outId:outId ,
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
                            mbCard:json.mbCard
                       })
                    }else{  
                        
                    }
                })

    }

}
//count tap切换
class Ordertap extends React.Component {
    state = {
        tabPosition: 'left'
    }
  render() {
    const qposStSaleOrders=this.props.qposStSaleOrders
    return (
        <div>
            <Tabs tabPosition={this.state.tabPosition} tabBarStyle={{width:'330px',height:'400px'}}>
                {
                    qposStSaleOrders.map((item,index)=>{
                        return (
                            <TabPane tab={<Slidetitle item={item}/>} key={index}>
                                {
                                    item.type=='1'?<Slidecountsell outId={item.outId} type={item.type}/>:(item.type=='2'?<Slidecountcz outId={item.outId} type={item.type}/>:<Slidecountback outId={item.outId} type={item.type}/>)
                                }
                        </TabPane>)
                    })
                }
            </Tabs>
        </div>
    )
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
        let d=new Date();
        let year=d.getFullYear();
        let month=d.getMonth()+1
        let data=d.getDate()
        let datas=data-1
        let today=year+'-'+ month + '-'+data
        let yesterday=year+'-'+ month + '-'+datas
        return(
            <div className='fr mr30 mt20 clearfix'>
                <div className='mr10 fl h40'>选择时间</div>
                    <RangePicker 
                        defaultValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]} 
                        format={dateFormat} 
                        style={{width:'200px',height:'40px'}} 
                        className='fl'
                        onChange={this.onChange.bind(this)}
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
            title: '刷卡',
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
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
        <div>
            <Table bordered dataSource={this.props.totlo} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
        </div>
        )
    }
}


//销售订单count
function Sellorder({qposStSaleOrders,dispatch}) {
    return (
        <div>
   		   <Searchcompon dispatch={dispatch}/>
           <Ordertap qposStSaleOrders={qposStSaleOrders}/>
        </div>
  )
}



//店员销售count
class Sellclerk extends React.Component {
    state={
        totlo:[],
        userSales:[]
    }
    initdataspuce=(values)=>{
         const result=GetServerData('qerp.web.qpos.st.user.sale.query',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       let totalUserSaledatas=json.totalUserSale
                       let userSalesdatas=json.userSales
                       console.log(userSalesdatas)
                       var totlo=userSalesdatas
                       console.log(totlo)
                       totlo.push(totalUserSaledatas)
                        console.log(totlo)
                        this.setState({
                            totlo:totlo,
                            userSales:json.userSales,
                            totalUserSale:json.totalUserSale
                        })
                    }else{  
                        message.error(json.message) 
                    }
                })

    }
    render(){
        return(
            <div>
                <div style={{height:'80px',borderBottom: '1px solid #E7E8EC'}} className='persontime'><Perdontime dispatch={this.props.dispatch} initdataspuce={this.initdataspuce.bind(this)}/></div>
                <div style={{padding:'0 30px'}}>
                    <p style={tit}>销售数据</p>
                    <div className='clearfix'style={{width:'100%'}}>
                        <div className='fl'><Echartsaxis userSales={this.state.userSales}/></div>
                        <div className='fl' style={{width:'2px',height:'200px',background:'#E7E8EC',margin:'40px 25px'}}></div>
                        <div className='fl'><EchartsPie userSales={this.state.userSales}/></div>
                    </div>
                    <p style={tit}>详细数据</p>
                    <EditableTable totlo={this.state.totlo}/>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let values={
            dateStart:'2017-09-04',
            dateEnd:'2017-09-05'
        }
        this.initdataspuce(values)
    }

}

function Sell({qposStSaleOrders,dispatch}) {
  return (
    <div>
    	<Header type={false} color={true}/>
    	<div className='counters'><Tags qposStSaleOrders={qposStSaleOrders} dispatch={dispatch}/></div>
    </div>
  );
}

function mapStateToProps(state) {
    console.log(state)
    const {qposStSaleOrders} = state.sell;
    return {qposStSaleOrders};
}

export default connect(mapStateToProps)(Sell);