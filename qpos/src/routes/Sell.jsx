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
const slideinfo={
    width:'300px',
    height:'80px',
    marginLeft:'30px',
    borderBottom: '1px solid #E7E8EC',
    overflow:'hidden'
}
const slideinfos={
    fontSize: '12px',
    color: ' #74777F',
    marginTop:'10px'
}
const infocount={
    display: 'flex',
    justifyContent:'space-between'
}

const tit={
    fontSize: '14px',
    color: '#384162',
    margin:'10px'
}



const TabPane = Tabs.TabPane;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const { MonthPicker, RangePicker } = DatePicker;
const saletext='123'
const sale=<Tooltip placement="top" title={saletext}>销售额</Tooltip>
const netreceiptstext='456'
const netreceipts=<Tooltip placement="top" title={netreceiptstext}>净收款</Tooltip>   

//切换tag
class Tags extends React.Component {
    render() {
        return (
            <div className='count'>
                <Tabs type="card">
		    	     <TabPane tab="销售订单" key="1"><Sellorder qposStSaleOrders={this.props.qposStSaleOrders} dispatch={this.props.dispatch}/></TabPane>
		    	     <TabPane tab="店员销售" key="2"><Sellclerk/></TabPane>
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
      console.log(date, dateString);
      this.setState({
        startTime:dateString[0],
        endTime:dateString[1]
      },function(){
        this.props.dispatch({ type: 'sell/fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:this.state.inpurvalue,type:this.state.selectvalue,startTime:this.state.startTime,endTime:this.state.endTime} }})
      })


    }
    handleChange=(value)=>{
       console.log(`selected ${value}`);
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
                            <Option value="2">退货订单</Option>
                            <Option value="3">充值订单</Option>
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

    }
    render(){
        return(
                <div>
        <ul className='sellinfolist'>
            <li>
                <p><div><span>销售订单</span>：XS001177883001</div></p>
                <p><div><span>销售时间</span>：08/07 11:53  </div><div><span>销售员</span>：大湿湿</div></p>
            </li>
            <li>
                <p><div><span>商品名称</span>：德国贝生超级薄男女婴儿纸尿片S40 </div></p>
                <p><div><span>商品条码</span>：12345678901122</div> <div><span>规格</span>：PRE段/1岁</div></p>
                <p><div><span>数量</span>：2 </div><div><span>零售价</span>：120.00</div><div><span>折后价</span>：120.00</div><div><span>折扣</span>：120.00</div></p>
            </li>
            <li style={{borderBottom:'0'}}>
                <p><div><span>会员姓名</span>：大湿湿 </div><div><span>会员电话</span>：156 2186 4099 </div><div><span>本次积分</span>：23499</div></p>
                <p><div><span>折扣优惠</span>：-11.00 </div><div><span>抹零优惠</span>：-0.01</div></p>
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

    }
    render(){
        return(
                <div>
                    <div className='slidecountcztop'>
                        <p><div><span>充值订单</span>：CZ001177883001</div></p>
                    <p><div><span>充值时间</span>：08/07 11:53</div> <div><span>销售员</span>：大湿湿</div></p>
                </div>
                <div className='slidecountczbo'>
                <p><span>会员姓名</span>：大湿湿</p>
                <p><span>会员卡号</span>：12345678901122</p>
                <p><span>会员手机</span>：158 2139 4843</p>
                <p><span>会员级别</span>：金卡会员</p>
                <p><span>充值余额</span>：123456789.00元「<span>微信支付</span>」</p>
                <p><span>充值前的余额</span>：123456789.00元</p>
                <p><span>充值后的余额</span>：123456789.00元</p>
                </div>
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
            <Tabs tabPosition={this.state.tabPosition} tabBarStyle={{width:'330px',height:'600px'}}>
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

//店员销售-详细数据table

//店员销售-时间
class Perdontime extends React.Component {
    render() {
        return(
            <div className='fr mr30 mt20 clearfix'>
                <div className='mr10 fl h40'>选择时间</div><RangePicker defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]} format={dateFormat} style={{width:'200px',height:'40px'}} className='fl'/>
            </div>
            )
    }
}

//文字提示 
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            render: (text, record, index) => (
                <span>{text}</span>
            )
        }, {
            title: sale,
            dataIndex: 'age'
        }, {
            title: netreceipts,
            dataIndex: 'address'
        }];
        this.state = {
            dataSource: [{
                key: '0',
                name: 'Edward King 0',
                age: '32',
                address: 'London, Park Lane no. 0'
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 2
        }
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({ dataSource });
        }
    }
    rowClassName=(record, index)=>{
    if (index % 2) {
      return 'table_gray'
    }else{
      return 'table_white'
    }
  }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
        <div>
            <Table bordered dataSource={dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
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
function Sellclerk() {
    return (
        <div>
            <div style={{height:'80px',borderBottom: '1px solid #E7E8EC'}} className='persontime'><Perdontime/></div>
            <div style={{padding:'0 30px'}}>
                <p style={tit}>销售数据</p>
       		    <div className='clearfix'style={{width:'100%'}}>
                    <div className='fl'><Echartsaxis/></div>
                    <div className='fl' style={{width:'2px',height:'200px',background:'#E7E8EC',margin:'40px 25px'}}></div>
                    <div className='fl'><EchartsPie/></div>
                </div>
       		    <p style={tit}>详细数据</p>
       		    <EditableTable/>
            </div>
        </div>
  )
}

function Sell({qposStSaleOrders,dispatch}) {
  return (
    <div>
    	<Header type={false} color={true}/>
    	<Tags qposStSaleOrders={qposStSaleOrders} dispatch={dispatch}/>
    </div>
  );
}

function mapStateToProps(state) {
    console.log(state)
    const {qposStSaleOrders} = state.sell;
    return {qposStSaleOrders};
}

export default connect(mapStateToProps)(Sell);
