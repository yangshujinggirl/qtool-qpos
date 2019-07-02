import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import {GetServerData} from '../../services/services';
import moment from 'moment';
import CommonTable from './commonTable';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
//引入图表
import Echartsaxis from './echartsaxis';
import EchartsPie from './echartsPie';
//
import TestCharts from './testCharts';
import BarChart from './BarchartTest';
import PieChart from './PiechartTest';

const amount = <Tooltip placement="top" title='销售订单金额-退款订单金额'>
                净销售额&nbsp;<Icon type="exclamation-circle-o" />
              </Tooltip>;
const icAmount = <Tooltip placement="top" title='微信转账+微信扫码+支付宝转账+支付宝扫码+APP支付+现金+银联'>
                    净收款&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const wechatAmount = <Tooltip placement="top" title='微信消费+微信充值-微信退款'>
                    微信转帐&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const wechatAmounts = <Tooltip placement="top" title='微信消费+微信充值'>
微信扫码&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;

const alipayAmount = <Tooltip placement="top" title='支付宝消费+支付宝充值-支付宝退款'>
                    支付宝转账&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const alipayAmounts = <Tooltip placement="top" title='支付宝消费+支付宝充值'>
支付宝扫码&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;

const apppayAmounts = <Tooltip placement="top" title='App支付'>
App支付&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;

const cashAmount = <Tooltip placement="top" title='现金消费+现金充值-现金退款'>
                    现金&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const unionpayAmount = <Tooltip placement="top" title='银联消费+银联充值-银联退款'>
                    银联&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const refundAmount = <Tooltip placement="top" title='所有订单总退款'>
                    退款&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const columns = [{
      title: '姓名',
      dataIndex: 'name'
  }, {
      title:amount,
      dataIndex: 'saleAmount'
  }, {
      title:icAmount,
      dataIndex: 'cleanAmount'
  },{
      title: '订单数',
      dataIndex: 'orderSum'
  },{
      title: wechatAmount,
      dataIndex: 'wechatAmount'
  },{
      title: wechatAmounts,
      dataIndex: 'scanWechatAmount'
  },{
      title: alipayAmount,
      dataIndex: 'alipayAmount'
  },{
      title: alipayAmounts,
      dataIndex: 'scanAlipayAmount'
  },{
      title: apppayAmounts,
      dataIndex: 'appSumPayTotal',
      render:(text,record,index)=> {
        return <div>
          {
            record.name == '合计'?record.appSumPayTotal:record.appPay
          }
        </div>
      }
  },{
      title: unionpayAmount,
      dataIndex: 'unionpayAmount'
  },{
      title: cashAmount,
      dataIndex: 'cashAmount'
  },{
      title: '会员消费',
      dataIndex: 'cardConsumeAmount'
  },{
      title: '积分抵扣',
      dataIndex: 'pointAmount'
  },{
      title: refundAmount,
      dataIndex: 'returnAmount'
  }];
// const roleColumns = [{
//       title: '姓名',
//       dataIndex: 'name'
//   }, {
//       title:amount,
//       dataIndex: 'saleAmount'
//   }, {
//       title:icAmount,
//       dataIndex: 'cleanAmount'
//   },{
//       title: '订单数',
//       dataIndex: 'orderSum'
//   },{
//       title: wechatAmount,
//       dataIndex: 'wechatAmount'
//   },{
//       title: wechatAmounts,
//       dataIndex: 'scanWechatAmount'
//   },{
//       title: alipayAmount,
//       dataIndex: 'alipayAmount'
//   },{
//       title: alipayAmounts,
//       dataIndex: 'scanAlipayAmount'
//   },{
//       title: unionpayAmount,
//       dataIndex: 'unionpayAmount'
//   },{
//       title: cashAmount,
//       dataIndex: 'cashAmount'
//   },{
//       title: '会员消费',
//       dataIndex: 'cardConsumeAmount'
//   },{
//       title: '积分抵扣',
//       dataIndex: 'pointAmount'
//   },{
//       title: refundAmount,
//       dataIndex: 'returnAmount'
//   }];

//店员销售
class ClerkSaleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userSales:[],
      totalUserSale:{},
      setsouce:[],
      startDate:'',
      endDate:'',
      orderType:7
    };
  }
  componentDidMount(){
      let d= new Date()
      d.setDate(d.getDate()-1);
      let dy=d.getFullYear(); //年
      var dm=("0" + (d.getMonth() + 1)).slice(-2);
      var dd=("0"+d.getDate()).slice(-2);
      let a=dy+'-'+dm+'-'+dd;
      this.setState({
          startDate:a,
          endDate:a
      },()=>{
          this.initdataspuce()
      })
  }
  rowClassName=(record, index)=>{
      if (index % 2) {
          return 'table_gray'
      }else{
          return 'table_white'
      }
  }
  searchTable = () =>{
    this.initdataspuce();
  }
  initdataspuce=()=>{
    const { orderType, startDate, endDate } =this.state;
    let values = {
          orderType,
          startDate,
          endDate
        }
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:true
        })
    GetServerData('qerp.pos.rp.day.users.list',values)
    .then((json) => {
        if(json.code=='0'){
            //总销售数据列表
            const userSales=json.accounts;
            //总销售数据
            const totalUserSale=json.accountTotal;
            totalUserSale.key = 0;
            totalUserSale.saleAmount = totalUserSale.saleAmountTotal;
            totalUserSale.cleanAmount = totalUserSale.cleanAmountTotal;
            totalUserSale.orderSum = totalUserSale.orderSumTotal;
            totalUserSale.wechatAmount = totalUserSale.wechatAmountTotal;
            totalUserSale.alipayAmount = totalUserSale.alipayAmountTotal;
            totalUserSale.unionpayAmount = totalUserSale.unionpayAmountTotal;
            totalUserSale.cashAmount = totalUserSale.cashAmountTotal;
            totalUserSale.cardConsumeAmount = totalUserSale.cardConsumeAmountTotal;
            totalUserSale.pointAmount = totalUserSale.pointAmountTotal;
            totalUserSale.returnAmount = totalUserSale.returnAmountTotal;
            //微信和支付宝扫码
            totalUserSale.scanWechatAmount = totalUserSale.scanSumWechatAmountTotal;
            totalUserSale.scanAlipayAmount = totalUserSale.scanSumAlipayAmountTotal;
            const setsouce=[];
            for(var i=0;i<userSales.length;i++){
                userSales[i].key = i+1;
                setsouce.push(userSales[i]);
            }
            setsouce.push(totalUserSale);
            this.setState({
                userSales:json.accounts,
                totalUserSale:totalUserSale,
                setsouce:setsouce
            })
        }else{
            message.error(json.message);
        }
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:false
        })
    })
  }
  dataChange = (dates,dateStrings) =>{
      this.setState({
          startDate:dateStrings[0],
          endDate:dateStrings[1]
      })
  }
  changeSource=(value)=> {
    this.setState({ orderType: value })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let d= new Date()
    d.setDate(d.getDate()-1)
    let dy=d.getFullYear() //年
    let dm=d.getMonth()+1//月
    let dd=d.getDate()//日
    let a=dy+'-'+dm+'-'+dd;
    let role = sessionStorage.getItem('role');
    // let columnsThis = role==3?roleColumns:columns
    let columnsThis = columns;
    return (
      <div className="clerk-sale">
        <div className="clerk-sale-wrapper">
          {/*搜索部分 */}
          <Form className="search-form">
            <FormItem
              label="选择时间"
              labelCol={{ span: 5 }}
              wrapperCol={{span: 10}}>
                {getFieldDecorator('time', {
                      initialValue:[moment(a,dateFormat),moment(a, dateFormat)],
                      onChange:this.dataChange
                  })(
                    <RangePicker
                      format="YYYY-MM-DD"
                      allowClear={false}/>
                )}
            </FormItem>
            {
              role!=3&&
              <FormItem
                label="业务类型"
                labelCol={{ span: 5 }}
                wrapperCol={{span: 10}}>
                  {getFieldDecorator('orderType', {
                        initialValue:7,
                        onChange:this.changeSource
                    })(
                        <Select>
                          <Option key={7} value={7}>全部</Option>
                          <Option key={0} value={0}>门店POS订单</Option>
                          <Option key={6} value={6}>门店APP订单</Option>
                        </Select>
                  )}
              </FormItem>
            }
            <FormItem>
              <Button type="primary" icon="search" onClick={this.searchTable.bind(this)}>搜索</Button>
            </FormItem>
          </Form>
          <div className="charts-table-wrapper">
            <div className="charts-wrapper">
              <p style={{paddingBottom:"20px",fontSize:"14px",color:" #384162"}}>销售数据</p>
              {/* <TestCharts/> */}
              <div className='fl' style={{width:"49%"}}>
                  <BarChart userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/>
                  {/* <Echartsaxis userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/> */}
              </div>
              <div style={{width:"2%",textAlign:"center"}} className='fl'>
                  <div style={{width:'2px',height:'300px',background:'#E7E8EC',margin:"0 auto"}}></div>
              </div>
              <div className='fl' style={{width:"49%"}}>
                  <PieChart userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/>
                  {/* <EchartsPie userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/> */}
              </div>
            </div>
            <div className="table-wrapper">
              <p style={{padding:"20px 0px",fontSize:"14px",color:" #384162"}}>详细数据</p>
              <CommonTable columns={columnsThis} dataSource={this.state.setsouce}  pagination={false}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
   return {};
}
const ClerkSale = Form.create()(ClerkSaleForm);

export default connect(mapStateToProps)(ClerkSale);
