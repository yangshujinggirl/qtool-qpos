import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination } from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import {GetServerData} from '../../services/services';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class DailyBillForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            startDate:"",
            endDate:"",
            windowHeight:'',
            lastMonthDate:'',
            rpDayAccount:{
                cleanAmount:'',
                amount:'',
                orderSum:'',
                rechargeAmount:''
            }
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'sortIndex',
            render: (text, record, index) => {
                return (
                    <span>{index+1}</span>
                )
            }
        },{
            title: '订单编号',
            dataIndex: 'orderNo',
        },{
            title: '结算金额',
            dataIndex: 'amount',
        },{
            title: '微信',
            dataIndex: 'wechatAmount',
        },{
            title: '支付宝',
            dataIndex: 'alipayAmount',
        },{
            title: '现金',
            dataIndex: 'cashAmount',
        },{
            title: '银联',
            dataIndex: 'unionpayAmount',
        },{
            title: '会员卡消费',
            dataIndex: 'cardConsumeAmount',
        },{
            title: '积分抵扣',
            dataIndex: 'pointAmount',
        }];
    }

    dateChange = (date, dateString) =>{
        this.setState({
            startDate:dateString[0],
            endDate:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page-1
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:current-1
        })
    }

    // windowResize = () =>{
    //     if(document.body.offsetWidth>800){
    //          this.setState({
    //             windowHeight:document.body.offsetHeight-300,
    //           })
    //     }else{
    //         this.setState({
    //           windowHeight:document.body.offsetHeight-270,
    //       });
    //     }
    // }

    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.setState({
                type:values.type
            },function(){
                let data = {
                    currentPage:0,
                    limit:10,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    type:this.state.type
                }
                this.getServerData(data);
            })
        })
    }

    //导出数据
    exportList = () =>{
        let data = {
            currentPage:0,
            limit:10,
            startDate:this.state.startDate,
            endDate:this.state.endDate,
            type:this.state.type
        }
        const result=GetServerData('qerp.qpos.rp.day.account.export',data);
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){

            }else{  
                message.error(json.message); 
            }
        })
    }

    // setDisabledDate = (current) =>{
    //     return  current+30*24*60*60*1000 && current+30*24*60*60*1000 < moment().endOf('day');
    // }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="daily-bill">
                <div className="scroll-wrapper">
                {/* 数据展示部分 */}
                <div className="top-data">
                    <ul>
                        <li>
                            <div>
                                <p style={{color:"#FB6349"}}>
                                    <i>¥</i>
                                    {this.state.rpDayAccount.cleanAmount?this.state.rpDayAccount.cleanAmount.split('.')[0]:"0"}
                                    <span>.{this.state.rpDayAccount.cleanAmount?this.state.rpDayAccount.cleanAmount.split('.')[1]:"00"}</span>
                                </p>
                                <span className="explain-span">
                                    <Tooltip title="微信+支付宝+现金+银联">
                                        净收款&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F7A303"}}>
                                    <i>¥</i>
                                    {this.state.rpDayAccount.amount?this.state.rpDayAccount.amount.split('.')[0]:"0"}
                                    <span>.{this.state.rpDayAccount.amount?this.state.rpDayAccount.amount.split('.')[1]:"00"}</span>
                                </p>
                                <span className="explain-span">
                                    <Tooltip title="销售订单金额-退款订单金额">
                                        销售额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#51C193"}}>
                                    <i>¥</i>
                                    {this.state.rpDayAccount.rechargeAmount?this.state.rpDayAccount.rechargeAmount.split('.')[0]:"0"}
                                    <span>
                                    .
                                    {this.state.rpDayAccount.rechargeAmount?this.state.rpDayAccount.rechargeAmount.split('.')[1]:"00"}
                                    </span>
                                </p>
                                <span className="explain-span">
                                    <Tooltip title="充值订单的总金额">
                                        充值金额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#806EC6"}}>
                                {this.state.rpDayAccount.orderSum?this.state.rpDayAccount.orderSum:"0"}
                                </p>
                                <span className="explain-span">
                                    <Tooltip title="销售订单的总数量">
                                        订单量&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                {/*搜索部分 */}
                <Form className="search-form">
                    <FormItem
                     label="订单时间"
                     labelCol={{ span: 5 }}
                     wrapperCol={{span: 10}}>
                        <RangePicker 
                            // disabledDate={this.setDisabledDate.bind(this)}
                            // ranges={{ range: moment["2017-09-01","2017-10-01"] }}     
                            value={this.state.startDate?[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]:null}
                            format={dateFormat}
                            onChange={this.dateChange.bind(this)} />
                    </FormItem>
                    <FormItem
                    label="订单分类"
                    labelCol={{ span: 5 }}
                    wrapperCol={{span: 10}}>
                    {getFieldDecorator('type')(
                        <Select>
                            <Option value="1">销售订单</Option>
                            <Option value="2">充值订单</Option>
                            <Option value="3">退货订单</Option>
                        </Select>
                    )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                    </FormItem>
                    <div className="export-div">
                        <Button className="export-btn" onClick={this.exportList.bind(this)}>导出数据</Button>
                    </div>
                </Form>
                <CommonTable 
                    columns={this.columns} 
                    dataSource={this.state.dataSource}
                    pagination={false}
                    total={this.state.total}
                    current={this.state.currentPage+1}
                    pageSize={this.state.limit}
                    onShowSizeChange={this.onShowSizeChange}
                    pageChange={this.pageChange}
                    />
                </div>
                <div className="footer-pagefixed">
                    <Pagination 
                        total={this.state.total} 
                        current={this.state.currentPage+1}
                        pageSize={this.state.limit}
                        showSizeChanger 
                        onShowSizeChange={this.onShowSizeChange} 
                        onChange={this.pageChange} 
                        pageSizeOptions={['10','12','15','17','20','50','100','200']}
                        />
                </div>
            </div>
        );
    }

    //获取数据
    getServerData = (values) =>{
        const result=GetServerData('qerp.pos.rp.day.account.page',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let rpDayAccount = json.rpDayAccount;
                let dataList = json.rpDayAccounts;
                if(dataList.length){
                    for(let i=0;i<dataList.length;i++){
                        dataList[i].key = i+1;
                    }
                }
                this.setState({
                    rpDayAccount:rpDayAccount,
                    dataSource:dataList,
                    total:Number(json.total),
                    currentPage:Number(json.currentPage),
                    limit:Number(json.limit)
                })
            }else{  
                message.error(json.message); 
            }
        })
    }

    //获取当前时间
     getNowFormatDate = () =>{
        const self = this;
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var beforeMonth = date.getMonth();
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (beforeMonth >= 1 && beforeMonth <= 9) {
            beforeMonth = "0" + beforeMonth;
        }
        if(beforeMonth == 0){
            beforeMonth = "12"
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        var lastMonthDate = date.getFullYear() + seperator1 + beforeMonth + seperator1 + strDate;
        this.setState({
            startDate:currentdate,
            endDate:currentdate,
            lastMonthDate:lastMonthDate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }
            self.getServerData(values);
        })
    }

    componentDidMount(){
        //获取当前时间
        this.getNowFormatDate();
        // if(document.body.offsetWidth>800){
        //     this.setState({
        //        windowHeight:document.body.offsetHeight-300,
        //      });
        // }else{
        //     this.setState({
        //         windowHeight:document.body.offsetHeight-270,
        //     });
        // }
        // window.addEventListener('resize', this.windowResize.bind(this));    
    }
}

function mapStateToProps(state){
   return {};
}

const DailyBill = Form.create()(DailyBillForm);

export default connect(mapStateToProps)(DailyBill);