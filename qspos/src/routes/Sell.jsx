import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import EchartsPie from '../charts/EchartsPie';
import Echartsaxis from '../charts/Echartsaxis';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,Pagination,message} from 'antd';
import {GetServerData} from '../services/services';
import {GetLodop} from '../components/Method/Print';
//引入打印
import {getSaleOrderInfo, getCDSaleOrderInfo} from '../components/Method/Print';
import {getReturnOrderInfo} from '../components/Method/Print';
import {getRechargeOrderInfo} from '../components/Method/Print';
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
import './Sell.less'
//切换tag
class Tags extends React.Component {
    render() {
        return (
            <div className='h100'>
                <Tabs type="card">
		    	     <TabPane tab="销售订单" key="1"><Sellorder qposStSaleOrders={this.props.qposStSaleOrders} dispatch={this.props.dispatch} total={this.props.total}/></TabPane>
		    	     {/* <TabPane tab="店员销售" key="2"><Sellclerk dispatch={this.props.dispatch}/></TabPane> */}
 			    </Tabs>
            </div>
        )
    }
}
//搜索组件
class Searchcompon extends React.Component {
    state={
        selectvalue:'0',
        source:'0',
        inpurvalue:'',
        startTime:null,
        endTime:null,
        page:0
    }
    timechange=(date, dateString)=>{
        if(dateString[0]==''){
            dateString[0]=null
        }
        if(dateString[1]==''){
            dateString[1]=null
        }

        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        });
        // function(){
        //     this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:limitSize,currentPage:this.state.page} }})
        // }
    }
    handleChange=(value)=>{
        this.setState({
            selectvalue:value
        });
        // ,function(){
        //     this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:limitSize,currentPage:this.state.page} }})
        // }
    }
    handleChangeSource=(value)=>{
        this.setState({
            source:value
        });
        // ,function(){
        //     this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:limitSize,currentPage:this.state.page} }})
        // }
    }
    revisemessage=(messages)=>{
        this.setState({
            inpurvalue:messages
        })
    }
    hindsearch=()=>{
        let limitSize = this.props.pageSizeShow;
        this.props.dispatch({
          type: 'sell/fetch',
          payload: {
            code:'qerp.web.qpos.st.sale.order.query',
            values:{
              keywords:this.state.inpurvalue,
              source:this.state.source,
              type:this.state.selectvalue,
              startTime:this.state.startTime,
              endTime:this.state.endTime,
              limit:limitSize,currentPage:this.state.page
            }
          }
        })
    }


    pagechange=()=>{
        let limitSize = this.props.pageSizeShow;
        this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:limitSize,currentPage:this.state.page} }})
    }
    setpage=(page)=>{
        this.setState({
            page:page-1
        },function(){
            this.pagechange()
        })
    }

    pagefresh = (currentPage,pagesize) =>{
        this.props.dispatch({
                type:'sell/fetch',
                payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime,limit:pagesize,currentPage:currentPage} }
        })
    }



    render(){
        return(
            <div className='clearfix searchqery'>
                <div className='fr clearfix w100'>
                    <div className='fl clearfix timechoose ml10'>
                        <div style={{lineHeight:'40px',height:'40px',float:'left',fontSize: '14px',color: '#74777F',marginRight:'5px',marginBottom:"0"}}>订单时间</div>
                            <RangePicker format={dateFormat} onChange={this.timechange.bind(this)} className='selltime'/>
                    </div>
                    <div style={{float:"right",marginRight:"10px"}}>
                        <div className='searchselect clearfix fl'>
                            <label style={{fontSize: '14px',color: '#74777F',marginRight:'5px'}}>订单来源</label>
                            <Select
                              defaultValue="0"
                              style={{ width: 100,height:40,marginRight:'10px' }}
                              onChange={this.handleChangeSource.bind(this)}>
                                <Option value="0">全部分类</Option>
                                <Option value="1">POS</Option>
                                <Option value="2">APP</Option>
                            </Select>
                        </div>
                        <div className='searchselect clearfix fl'>
                            <label style={{fontSize: '14px',color: '#74777F',marginRight:'5px'}}>订单分类</label>
                            <Select defaultValue="0" style={{ width: 100,height:40,marginRight:'10px' }} onChange={this.handleChange.bind(this)}>
                                <Option value="0">全部分类</Option>
                                <Option value="1">销售订单</Option>
                                <Option value="2">充值订单</Option>
                                <Option value="3">退货订单</Option>
                            </Select>
                        </div>
                        <div className='fl sell-search-input' style={{marginRight:'5px'}}>
                            <Searchinput text='请输入商品条码、名称、订单号' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindsearch.bind(this)}/>
                        </div>
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
            <div className='clearfix p1'><div className='fl p2'>{item.outNo}</div><div className='fr p3'>{item.createTime}</div></div>
            <div className='clearfix' style={widthFlag?slideinfos:slideinfosTwo}><div className='fl'><span>客户：{item.levelStr}</span><span style={{marginLeft:'60px'}}>{item.isdiscount=='0'?null:'折'}</span></div><div className='fr' style={{marginRight:'30px'}}>收银：{item.amount}元</div></div>
        </div>
  );
}

//tap count C端销售
class SlidecountCD extends React.Component {

    rePrint = () =>{
        //判断是否打印
        const result=GetServerData('qerp.pos.sy.config.info');
        result.then((res) => {
           return res;
         }).then((json) => {
            if(json.code == "0"){
               if(json.config.paperSize=='80'){
                  getCDSaleOrderInfo(this.props.saleCdAll,"80","1");
               }else{
                  getCDSaleOrderInfo(this.props.saleCdAll,"58","1");
               }
            }else{
                message.warning('打印失败')
            }
         })
    }

    render(){
      const { mbCardCd, odOrderCd, orderDetailsCd } =this.props;
        return(
                <div className="sellinfolist-wrapper">
                  {
                    odOrderCd&&
                    <ul className='sellinfolist'>
                      {
                        odOrderCd&&<li>
                                    <div className="sellinfo-row">
                                      <div>
                                        <span>销售订单</span>：{odOrderCd.orderNo}
                                      </div>
                                      <div>
                                        <span>订单来源</span>：APP
                                      </div>
                                    </div>
                                    <div className="sellinfo-row">
                                      <div>
                                        <span>销售时间</span>：{odOrderCd.createTime}
                                      </div>
                                      <div>
                                        <span>销售员</span>：{odOrderCd.nickname}
                                      </div>
                                    </div>
                                </li>
                      }
                        <li>
                          {

                            orderDetailsCd&&orderDetailsCd.length>0&&orderDetailsCd.map((item,index)=>{
                                return(
                                    <div key={index}>
                                        <div className="sellinfo-row"><div><span>商品名称</span>：{item.name} </div></div>
                                        <div className="sellinfo-row"><div><span>商品条码</span>：{item.code}</div> <div><span>规格</span>：{item.displayName}</div></div>
                                        <div className="sellinfo-row"><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price}</div><div><span>折后价</span>：{item.payPrice}</div><div><span>折扣</span>：{item.discount}</div></div>
                                    </div>
                                    )
                            })
                          }
                        </li>
                        <li style={{borderBottom:'0'}}>
                            <div className="sellinfo-row">
                              <div><span>会员姓名</span>：{mbCardCd&&mbCardCd.name} </div>
                              <div><span>会员电话</span>：{mbCardCd&&mbCardCd.mobile} </div>
                              <div><span>本次积分</span>：{odOrderCd.orderPoint}</div>
                            </div>
                            <div className="sellinfo-row">
                              <div><span>折扣优惠</span>：0.00</div>
                              <div><span>抹零优惠</span>：0.00</div>
                            </div>
                            <div className="sellinfo-row">
                              <div>
                                <span>结算收银</span>：
                                {odOrderCd.amount}
                                「用户APP支付：<span>{odOrderCd.payAmount}，</span>Qtools补贴：{odOrderCd.discountAmount}」
                              </div>
                            </div>
                        </li>
                    </ul>
                  }

                    <div className="re-print" onClick={this.rePrint.bind(this)}>
                        <img src={require("../images/icon_rePrint@2x.png")} alt=""/>
                    </div>
                </div>
            )
    }

}
//tap count 销售
class Slidecountsell extends React.Component {

    rePrint = () =>{
        //判断是否打印
        const result=GetServerData('qerp.pos.sy.config.info');
        result.then((res) => {
           return res;
         }).then((json) => {
                if(json.code == "0"){
                //   if(json.config.submitPrint=='1'){
                     //判断是打印大的还是小的
                     if(json.config.paperSize=='80'){
                        // GetLodop(this.props.orderId,'odOrder',this.props.odOrder.orderNo,true)
                        getSaleOrderInfo(this.props.saleOrderAll,"80","1");
                     }else{
                        getSaleOrderInfo(this.props.saleOrderAll,"58","1");
                        // GetLodop(this.props.orderId,'odOrder',this.props.odOrder.orderNo,false)
                     }
                //   }
                }else{
                    message.warning('打印失败')
                }
         })
    }

    render(){
        return(
                <div className="sellinfolist-wrapper">
                    <ul className='sellinfolist'>
                        <li className="sellinfo-item">
                            <div className="sellinfo-row">
                              <div>
                                <span>销售订单</span>：{this.props.odOrder.orderNo}
                              </div>
                            </div>
                            <div className="sellinfo-row">
                              <div><span>销售时间</span>：{this.props.odOrder.saleTime}</div>
                              <div><span>销售员</span>：{this.props.odOrder.nickname}</div>
                            </div>
                        </li>
                        <li>
                            {

                                this.props.orderDetails.map((item,index)=>{
                                  return(
                                    <div key={index}>
                                        <div className="sellinfo-row"><div><span>商品名称</span>：{item.name} </div></div>
                                        <div className="sellinfo-row"><div><span>商品条码</span>：{item.code}</div> <div><span>规格</span>：{item.displayName}</div></div>
                                        <div className="sellinfo-row"><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price}</div><div><span>折后价</span>：{item.payPrice}</div><div><span>折扣</span>：{item.discount}</div></div>
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
                                            <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                            <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}<span>{this.props.orOrderPay[1].typeStr}</span>{this.props.orOrderPay[1].amount}」</div></div>
                                        </li>
                                        :
                                        <li style={{borderBottom:'0'}}>
                                            <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                            <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}」</div></div>
                                        </li>
                                    )
                                :
                                    <li style={{borderBottom:'0'}}>
                                      <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                      <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}</div></div>
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
                                            <div className="sellinfo-row"><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></div>
                                            <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                            <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}<span>{this.props.orOrderPay[1].typeStr}</span>{this.props.orOrderPay[1].amount}」</div></div>
                                        </li>
                                    :
                                        <li style={{borderBottom:'0'}}>
                                            <div className="sellinfo-row"><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></div>
                                            <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                            <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}「<span>{this.props.orOrderPay[0].typeStr}</span>：{this.props.orOrderPay[0].amount}」</div></div>
                                        </li>
                                )
                            :
                                <li style={{borderBottom:'0'}}>
                                  <div className="sellinfo-row"><div><span>会员姓名</span>：{this.props.mbCard1.name} </div><div><span>会员电话</span>：{this.props.mbCard1.mobile} </div><div><span>本次积分</span>：{this.props.odOrder.orderPoint}</div></div>
                                  <div className="sellinfo-row"><div><span>折扣优惠</span>：{this.props.odOrder.discountAmount} </div><div><span>抹零优惠</span>：{this.props.odOrder.cutAmount}</div></div>
                                  <div className="sellinfo-row"><div><span>结算收银</span>：{this.props.odOrder.payAmount}</div></div>
                                </li>
                                )

                        }
                    </ul>
                    <div className="re-print" onClick={this.rePrint.bind(this)}>
                        <img src={require("../images/icon_rePrint@2x.png")} alt=""/>
                    </div>
                </div>
            )
    }

}
//tap count 退货
class Slidecountback extends React.Component {

    rePrint = () =>{
        //判断是否打印
        const result=GetServerData('qerp.pos.sy.config.info');
        result.then((res) => {
           return res;
         }).then((json) => {
                if(json.code == "0"){
                //   if(json.config.submitPrint=='1'){
                     //判断是打印大的还是小的
                     if(json.config.paperSize=='80'){
                        getReturnOrderInfo(this.props.returnOrderAll,"80","1");
                        // GetLodop(this.props.orderId,'odReturn',this.props.odReturn.returnNo,true)
                     }else{
                        getReturnOrderInfo(this.props.returnOrderAll,"58","1");
                        // GetLodop(this.props.orderId,'odReturn',this.props.odReturn.returnNo,false)
                     }
                //   }
                }else{
                    message.warning('打印失败')
                }
         })
    }

    render(){
        return(
            <div className="sellinfolist-wrapper">
                <ul className='sellinfolist tuihuo-infolist'>
                    <li>
                        <div className="sellinfo-row"><div><span className='one-tuihuo'>退货订单：</span>{this.props.odReturn.returnNo} </div><div><span className='one-tuihuo'>销售订单：</span>{this.props.odReturn.orderNo}</div></div>
                        <div className="sellinfo-row"><div><span>退货时间：</span>{this.props.odReturn.createTime}</div><div> <span>退货员：</span>{this.props.odReturn.nickname}</div></div>
                    </li>
                    {
                        this.props.returnOrderDetails.map((item,index)=>{
                            return (
                                    <li key={index} className='info-tuihuo'>
                                        <div className="sellinfo-row"><div><span>商品名称</span>：{item.name}</div> </div>
                                        <div className="sellinfo-row"><div><span>商品条码</span>： {item.code}</div><div><span>规格</span>：{item.displayName}</div></div>
                                        <div className="sellinfo-row"><div><span>数量</span>：{item.qty} </div><div><span>零售价</span>：{item.price} </div><div><span>折后价</span>：{item.refundPrice}</div><div><span>实退价</span>：{item.payPrice}</div></div>
                                    </li>
                                )
                        })
                    }
                    {
                        this.props.mbCard3==null || undefined || ''
                        ?
                        <li style={{borderBottom:'0'}}>
                            <div className="sellinfo-row"><div><span>结算退款</span>：{this.props.odReturn.refundAmount}「<span>{this.props.odReturn.typeStr}</span>」</div></div>
                        </li>
                        :
                        <li style={{borderBottom:'0'}}>
                            <div className="sellinfo-row"><div><span>会员姓名</span>：{this.props.mbCard3.name} </div><div><span>会员电话</span>：{this.props.mbCard3.mobile} </div><div><span>扣除积分</span>：{this.props.odReturn.returnPoint}</div></div>
                            <div className="sellinfo-row"><div><span>结算退款</span>：{this.props.odReturn.refundAmount}「<span>{this.props.odReturn.typeStr}</span>」</div></div>
                        </li>

                    }

                </ul>
                <div className="re-print" onClick={this.rePrint.bind(this)}>
                    <img src={require("../images/icon_rePrint@2x.png")} alt=""/>
                </div>
            </div>
        )
    }

}
//tap count 充值
class Slidecountcz extends React.Component {

    rePrint = () =>{
        const result=GetServerData('qerp.pos.sy.config.info')
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code == "0"){
                // if(json.config.rechargePrint=='1'){
                    //判断是打印大的还是小的
                    if(json.config.paperSize=='80'){
                        getRechargeOrderInfo(this.props.rechargeOrderAll,"80","1");
                        // GetLodop(this.props.orderId,'mbCardMoneyCharge',this.props.cardMoneyChargeInfo.chargeNo,true)
                    }else{
                        getRechargeOrderInfo(this.props.rechargeOrderAll,"58","1");
                        // GetLodop(this.props.orderId,'mbCardMoneyCharge',this.props.cardMoneyChargeInfo.chargeNo,false)
                    }
                // }
            }else{
                message.warning('打印失败')
            }
        })
    }

    render(){
        return(
                <div className="sellinfolist-wrapper">
                    <div className='slidecountcztop'>
                        <div className="sellinfo-row"><div><span>充值订单</span>：{this.props.cardMoneyChargeInfo.chargeNo}</div></div>
                        <div className="sellinfo-row"><div><span>充值时间</span>：{this.props.cardMoneyChargeInfo.createTime}</div> <div><span>销售员</span>：{this.props.cardMoneyChargeInfo.nickname}</div></div>
                    </div>
                    <div className='slidecountczbo'>
                        <div className="sellinfo-row"><span>会员姓名</span>：{this.props.mbCard2.name}</div>
                        <div className="sellinfo-row"><span>会员卡号</span>：{this.props.mbCard2.cardNo}</div>
                        <div className="sellinfo-row"><span>会员手机</span>：{this.props.mbCard2.mobile}</div>
                        <div className="sellinfo-row"><span>会员级别</span>：{this.props.mbCard2.levelStr}</div>
                        <div className="sellinfo-row"><span>充值金额</span>：{this.props.cardMoneyChargeInfo.amount}元「<span>{this.props.cardMoneyChargeInfo.typeStr}</span>」</div>
                        <div className="sellinfo-row"><span>充值前的余额</span>：{this.props.cardMoneyChargeInfo.beforeAmount}元</div>
                        <div className="sellinfo-row"><span>充值后的余额</span>：{this.props.cardMoneyChargeInfo.afterAmount}元</div>
                    </div>
                    <div className="re-print" onClick={this.rePrint.bind(this)}>
                        <img src={require("../images/icon_rePrint@2x.png")} alt=""/>
                    </div>
                </div>
            )
    }


}
//count tap切换
class Ordertap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabPosition: 'left',
            clickkey:0,
            clickid:null,
            clicktype:1,
            keys:0,
            qposStSaleOrders:[],
            outId:null,
            //c端销售
            saleCdAll:{},
            mbCardCd:{},
            odOrderCd:{},
            orderDetailsCd:[],
            //销售
            saleOrderAll:{},
            orderDetails:[], //详情
            odOrder:{}, //订单信息
            orOrderPay:{},//支付信息，
            mbCard1:{},
            //退货
            returnOrderAll:{},
            mbCard3:{},
            odReturn:{},
            returnOrderDetails:[],
            //充值
            rechargeOrderAll:{},
            cardMoneyChargeInfo:{},
            mbCard2:{},
            windowHeight:'',
            //页脚相关
            currentPage:1,
            pageSize:10,
            valueNum:'10'
        };
        this._isMounted = false;
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
                    if(json.code=='0'){
                        this.setState({
                            returnOrderAll:json,
                            mbCard3:json.mbCard,
                            odReturn:json.odReturn,
                            returnOrderDetails:json.returnOrderDetails
                       })
                    }else{
                         message.waring(json.message)
                    }
                })
    }

    //cd销售数据请求
    setdatacd=(keyid)=>{
        const type=4
        let values={
            outId:keyid,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                    return res;
                }).then((json) => {
                  const { mbCard, odOrder, orderDetails } =json;
                    if(json.code=='0'){
                       this.setState({
                        saleCdAll:json,
                        mbCardCd:mbCard,
                        odOrderCd:odOrder,
                        orderDetailsCd:orderDetails,
                       })
                    }else{
                        message.warning(json.message);
                    }
                })
    }
    //销售数据请求
    setdataxs=(keyid)=>{
        const type=1
        let values={
            outId:keyid,
            type:type
        }
        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',values)
                result.then((res) => {
                    return res;
                }).then((json) => {
                    if(json.code=='0'){
                       this.setState({
                        saleOrderAll:json,
                        orderDetails:json.orderDetails, //详情
                        odOrder:json.odOrder, //订单信息
                        orOrderPay:json.orOrderPay,//支付信息，
                        mbCard1:json.mbCard
                       })
                    }else{
                        message.warning(json.message);
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
                    if(json.code=='0'){
                       this.setState({
                            rechargeOrderAll:json,
                            cardMoneyChargeInfo:json.cardMoneyChargeInfo,
                            mbCard2:json.mbCard
                       })
                    }else{
                         message.warning(json.message)
                    }
                })
    }

    onTabClick=(key)=>{
        const str=key.split('_')
        const keyindex=str[0]
        const keyid=str[2]
        const clicktype=str[1]
        this.setState({
            clickkey:Number(keyindex),
            clickid:keyid,
            clicktype:clicktype,
            keys:key
        },function(){
            //根据id和type进行数据请求，并绑定
            if(this.state.clicktype=='1'){
               this.setdataxs(this.state.clickid)
            }
            if(this.state.clicktype=='2'){
               this.setdatacz(this.state.clickid)

            }
            if(this.state.clicktype=='3'){
               this.setdatact(this.state.clickid)

            } else if(this.state.clicktype=='4') {
              this.setdatacd(this.state.clickid)
            }

        })
    }

    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            this.setState({
                windowHeight:document.body.offsetHeight-300
            });
        }
    }

    // pagechange=(page)=>{
    //     this.setState({
    //         clickkey:0
    //     },function(){
    //         this.props.revisemessages(page)
    //     })

    // }

    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        },function(){
            const current=Number(page)-1;
            this.props.pagefresh(current,this.state.pageSize)
        });
    }

    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            current:current,
            currentPage:1
        },function(){
            this.props.pagefresh(0,pageSize)
        })

    }

    onPrevClick  = (e) =>{
        e.preventDefault();
    }

    onNextClick = (e) =>{
        e.preventDefault();
    }

    clickBtn=() =>{
        this.setState({
            pageSize:5
        })
    }

    pageSelect = (value) =>{
        this.setState({
            pageSize:Number(value),
            currentPage:1,
            valueNum:value
        },function(){
            this.props.pagefresh(0,Number(value))
        })
    }

  render() {
    const qposStSaleOrders=this.state.qposStSaleOrders;
    const detailModal =(item)=> {
      switch(item.type) {
        case '1':
          return <Slidecountsell
                  saleOrderAll={this.state.saleOrderAll}
                  orderDetails={this.state.orderDetails}
                  orderId={item.outId}
                  odOrder={this.state.odOrder}
                  orOrderPay={this.state.orOrderPay}
                  mbCard1={this.state.mbCard1}/>
          break;
        case '2':
          return <Slidecountcz
                  rechargeOrderAll={this.state.rechargeOrderAll}
                  cardMoneyChargeInfo={this.state.cardMoneyChargeInfo}
                  orderId={item.outId} mbCard2={this.state.mbCard2}/>
          break;
        case '3':
          return <Slidecountback
                  returnOrderAll={this.state.returnOrderAll}
                  odReturn={this.state.odReturn}
                  orderId={item.outId}
                  returnOrderDetails={this.state.returnOrderDetails}
                  mbCard3={this.state.mbCard3}/>
          break;
        case '4':
          return <SlidecountCD
                    saleCdAll={this.state.saleCdAll}
                    mbCardCd={this.state.mbCardCd}
                    odOrderCd={this.state.odOrderCd}
                    orderDetailsCd={this.state.orderDetailsCd}/>
          break;
      }
    }
    return (
        <div className="content-sell-info" ref="tableWrapper">

           <div>
                <Tabs animated={false}
                tabPosition={this.state.tabPosition}
                    TabStyle={widthFlag?tabStyle:tabStyleTwo}
                    onTabClick={this.onTabClick.bind(this)}
                    activeKey={String(this.state.keys)}
                    onNextClick = {this.onNextClick.bind(this)}
                    onPrevClick = {this.onPrevClick.bind(this)}>
                {
                    qposStSaleOrders.map((item,index)=>{
                        return (
                            <TabPane tab={<Slidetitle item={item}/>} key={index+'_'+item.type+'_'+item.outId}>
                                {
                                    // item.type=='1'?
                                    // <Slidecountsell
                                    //   saleOrderAll={this.state.saleOrderAll}
                                    //   orderDetails={this.state.orderDetails}
                                    //   orderId={item.outId}
                                    //   odOrder={this.state.odOrder}
                                    //   orOrderPay={this.state.orOrderPay}
                                    //   mbCard1={this.state.mbCard1}/>
                                    // :
                                    // (
                                    //     item.type=='2'?
                                    //     <Slidecountcz
                                    //       rechargeOrderAll={this.state.rechargeOrderAll}
                                    //       cardMoneyChargeInfo={this.state.cardMoneyChargeInfo}
                                    //       orderId={item.outId} mbCard2={this.state.mbCard2}/>
                                    //     :
                                    //     <Slidecountback
                                    //       returnOrderAll={this.state.returnOrderAll}
                                    //       odReturn={this.state.odReturn}
                                    //       orderId={item.outId}
                                    //       returnOrderDetails={this.state.returnOrderDetails}
                                    //       mbCard3={this.state.mbCard3}/>
                                    // )
                                    detailModal(item)
                                }
                            </TabPane>)
                    })
                }
              </Tabs>
           </div>
            <div className='Paginationsell'>
                <Pagination total={Number(this.props.total)}
                            size="small"
                            current={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            showSizeChanger={true}
                            onShowSizeChange = {this.onShowSizeChange.bind(this)}
                            onChange={this.pageChange.bind(this)}
                            pageSizeOptions={['6','10','12','15','17','20']}
                            simple
                            />
                <Select defaultValue="lucy" style={{ width: 100 }} value={this.state.valueNum} onChange={this.pageSelect.bind(this)}>
                  <Option value="10">10条/页</Option>
                  <Option value="12">12条/页</Option>
                  <Option value="15">15条/页</Option>
                  <Option value="17">17条/页</Option>
                  <Option value="20">20条/页</Option>
                  <Option value="50">50条/页</Option>
                  <Option value="100">100条/页</Option>
                  <Option value="200">200条/页</Option>
                </Select>
            </div>
        </div>
    )
  }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            this.setState({
                windowHeight:document.body.offsetHeight-300
            });
            window.addEventListener('resize', this.windowResize);
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }

  componentWillReceiveProps(nextProps){
    if(nextProps.qposStSaleOrders.length>0){
        this.setState({
            qposStSaleOrders:nextProps.qposStSaleOrders,
            keys:0+'_'+nextProps.qposStSaleOrders[0].type+'_'+nextProps.qposStSaleOrders[0].outId
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
        if( document.body.clientWidth > 800 ) {
            /* 这里是要执行的代码 */
            widthFlag = true;
        }else{
            widthFlag = false;
        }
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
            <Table bordered
            dataSource={this.props.setsouce}
            columns={columns}
            rowClassName={this.rowClassName.bind(this)}
            pagination={false}
            />
        </div>
        )
    }



}


//销售订单count
class Sellorder extends React.Component {
    state = {
        pagesize:10
    }
    revisemessages=(page)=>{
        const setpage=this.refs.search.setpage
        setpage(page)
    }

    pagefresh=(currentPage,pagesize)=>{
        const pagefreshs=this.refs.search.pagefresh;
        this.setState({
            pageSize:pagesize
        });
        pagefreshs(currentPage,pagesize);
    }

    render(){
        return (
            <div className="salePage-style">
               <Searchcompon dispatch={this.props.dispatch} pageSizeShow={this.state.pagesize} ref='search'/>
               <Ordertap qposStSaleOrders={this.props.qposStSaleOrders}
                         total={this.props.total}
                         revisemessages={this.revisemessages.bind(this)}
                         pagefresh={this.pagefresh.bind(this)}
                         ref='Ordertap'/>
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
                    if(json.code=='0'){
                            const userSales=json.userSales
                            const totalUserSale=json.totalUserSale
                            totalUserSale.nickname='合计'
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
                        message.error(json.message);
                    }
                })

    }
    render(){
        return(
            <div className='chartandtable-wrapper'>
                <div className='persontime time-banner-style'><Perdontime dispatch={this.props.dispatch} initdataspuce={this.initdataspuce.bind(this)}/></div>
                <div className="chart-container-style" style={{padding:'0 30px'}}>
                    <div style={tit}>销售数据</div>
                    <div className='clearfix'style={{width:'100%'}}>
                        <div className='fl'><Echartsaxis userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/></div>
                        <div className='fl' style={{width:'2px',height:'200px',background:'#E7E8EC',margin:'40px 25px'}}></div>
                        <div className='fl'><EchartsPie userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/></div>
                    </div>
                    <div style={tit}>详细数据</div>
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
// class Sell extends React.Component {
//   constructor(props) {
//
//   }
//   render() {
//     return (
//       <div>
//       	<Header type={false} color={true}/>
//       	<div className='counters'><Tags qposStSaleOrders={qposStSaleOrders} dispatch={dispatch} total={total}/></div>
//       </div>
//     );
//   }
// }

function mapStateToProps(state) {
    const {qposStSaleOrders,total} = state.sell;
    return {qposStSaleOrders,total};
}

export default connect(mapStateToProps)(Sell);
