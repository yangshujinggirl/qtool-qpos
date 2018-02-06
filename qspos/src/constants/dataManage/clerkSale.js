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

//店员销售
class ClerkSaleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userSales:[],
            totalUserSale:{
                // nickname:'',
                // amount:null,
                // icAmount:null,
                // orderQty:null,
                // wechatAmount:null,
                // alipayAmount:null,
                // unionpayAmount:null,
                // cashAmount:null,
                // cardChargeAmount:null,
                // cardConsumeAmount:null,
                // pointAmount:null,
                // refundAmount:null,
                // key:-2
            },
            setsouce:[],
            startDate:'',
            endDate:''
        };
        this.amount = <Tooltip placement="top" title='销售订单金额-退款订单金额'>
                        销售额&nbsp;<Icon type="exclamation-circle-o" />
                      </Tooltip>;
        this.icAmount = <Tooltip placement="top" title='微信+支付宝+现金+银联'>
                            净收款&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.wechatAmount = <Tooltip placement="top" title='微信消费+微信充值-微信退款'>
                            微信转帐&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.wechatAmounts = <Tooltip placement="top" title='微信消费+微信充值'>
        微信扫码&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;

        this.alipayAmount = <Tooltip placement="top" title='支付宝消费+支付宝充值-支付宝退款'>
                            支付宝转账&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.alipayAmounts = <Tooltip placement="top" title='支付宝消费+支付宝充值'>
        支付宝扫码&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;                   

        this.cashAmount = <Tooltip placement="top" title='现金消费+现金充值-现金退款'>
                            现金&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.unionpayAmount = <Tooltip placement="top" title='银联消费+银联充值-银联退款'>
                            银联&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.refundAmount = <Tooltip placement="top" title='所有订单总退款'>
                            退款&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
        this.columns = [{
            title: '姓名',
            dataIndex: 'name'
        }, {
            title:this.amount,
            dataIndex: 'saleAmount'
        }, {
            title:this.icAmount,
            dataIndex: 'cleanAmount'
        },{
            title: '订单数',
            dataIndex: 'orderSum'
        },{
            title: this.wechatAmount,
            dataIndex: 'wechatAmount'
        },{
            title: this.wechatAmounts,
            dataIndex: 'scanWechatAmount'
        },{
            title: this.alipayAmount,
            dataIndex: 'alipayAmount'
        },{
            title: this.alipayAmounts,
            dataIndex: 'scanAlipayAmount'
        },{
            title: this.unionpayAmount,
            dataIndex: 'unionpayAmount'
        },{
            title: this.cashAmount,
            dataIndex: 'cashAmount'
        },{
            title: '会员消费',
            dataIndex: 'cardConsumeAmount'
        },{
            title: '积分抵扣',
            dataIndex: 'pointAmount'
        },{
            title: this.refundAmount,
            dataIndex: 'returnAmount'
        }];
    }

    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }


    searchTable = () =>{
        let values={
            startDate:this.state.startDate,
            endDate:this.state.endDate
        };
        this.initdataspuce(values);
    }

    initdataspuce=(values)=>{
        const result=GetServerData('qerp.pos.rp.day.users.list',values)
        result.then((res) => {
                return res;
        }).then((json) => {
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
        })
    }

   dataChange = (dates,dateStrings) =>{
        this.setState({
            startDate:dateStrings[0],
            endDate:dateStrings[1]
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let d= new Date()
        d.setDate(d.getDate()-1)
        let dy=d.getFullYear() //年
        let dm=d.getMonth()+1//月
        let dd=d.getDate()//日
        let a=dy+'-'+dm+'-'+dd
        return (
            <div className="clerk-sale">
                <div className="clerk-sale-wrapper">
                    {/*搜索部分 */}
                    <Form className="search-form">
                        <FormItem
                        label="选择时间"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                            <RangePicker 
                                defaultValue={[moment(a,dateFormat),moment(a, dateFormat)]}
                                format="YYYY-MM-DD"
                                allowClear={false}
                                onChange={this.dataChange.bind(this)} />
                        </FormItem>
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
                            <CommonTable columns={this.columns} dataSource={this.state.setsouce}  pagination={false}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount(){
        let d= new Date()
        d.setDate(d.getDate()-1);
        let dy=d.getFullYear(); //年
        var dm=("0" + (d.getMonth() + 1)).slice(-2);
        var dd=("0"+d.getDate()).slice(-2);
        let a=dy+'-'+dm+'-'+dd;
        let values={
            startDate:a,
            endDate:a
        };
        this.initdataspuce(values)
    }
}

function mapStateToProps(state){
   return {};
}
const ClerkSale = Form.create()(ClerkSaleForm);

export default connect(mapStateToProps)(ClerkSale);