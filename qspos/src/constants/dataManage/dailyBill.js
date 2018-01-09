import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
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
        console.log(date, dateString);
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="daily-bill">
                {/* 数据展示部分 */}
                <div className="top-data">
                    <ul>
                        <li>
                            <div>
                                <p style={{color:"#FB6349"}}><i>¥</i>{this.state.rpDayAccount.cleanAmount.split('.')[0]}<span>.{this.state.rpDayAccount.cleanAmount.split('.')[1]}</span></p>
                                <span className="explain-span">
                                    <Tooltip title="净收款描述">
                                        净收款&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F7A303"}}><i>¥</i>{this.state.rpDayAccount.amount.split('.')[0]}<span>.{this.state.rpDayAccount.amount.split('.')[1]}</span></p>
                                <span className="explain-span">
                                    <Tooltip title="销售额描述">
                                        销售额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#51C193"}}><i>¥</i>{this.state.rpDayAccount.rechargeAmount.split('.')[0]}<span>.{this.state.rpDayAccount.rechargeAmount.split('.')[1]}</span></p>
                                <span className="explain-span">
                                    <Tooltip title="充值金额描述">
                                        充值金额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#806EC6"}}>{this.state.rpDayAccount.orderSum}</p>
                                <span className="explain-span">
                                    <Tooltip title="订单量描述">
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
                            value={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]}
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
                    pagination={true}
                    total={this.state.total}
                    current={this.state.currentPage+1}
                    pageSize={this.state.limit}
                    onShowSizeChange={this.onShowSizeChange}
                    pageChange={this.pageChange}
                    />
            </div>
        );
    }

    //获取数据
    getServerData = (values) =>{
        let dataList = [
            {
                orderNo:"md3456789",
                amount:"45678.90",
                wechatAmount:"45678.90",
                alipayAmount:"456798.90",
                cashAmount:"4578.90",
                unionpayAmount:"4568.90",
                cardConsumeAmount:"5678.90",
                pointAmount:"678.90",
            },
            {
                orderNo:"md3456789",
                amount:"45678.90",
                wechatAmount:"45678.90",
                alipayAmount:"456798.90",
                cashAmount:"4578.90",
                unionpayAmount:"4568.90",
                cardConsumeAmount:"5678.90",
                pointAmount:"678.90",
            },
            {
                orderNo:"md3456789",
                amount:"45678.90",
                wechatAmount:"45678.90",
                alipayAmount:"456798.90",
                cashAmount:"4578.90",
                unionpayAmount:"4568.90",
                cardConsumeAmount:"5678.90",
                pointAmount:"678.90",
            },
            {
                orderNo:"md3456789",
                amount:"45678.90",
                wechatAmount:"45678.90",
                alipayAmount:"456798.90",
                cashAmount:"4578.90",
                unionpayAmount:"4568.90",
                cardConsumeAmount:"5678.90",
                pointAmount:"678.90",
            }
        ];
        let  rpDayAccount={
            cleanAmount:"543.90",
            amount:"543.90",
            orderSum:"10",
            rechargeAmount:"100.00"
        };
        this.setState({
            rpDayAccount:rpDayAccount
        })
        for(let i=0;i<dataList.length;i++){
            dataList[i].key = i+1;
        }
        this.setState({
            dataSource:dataList,
            total:Number('3'),
            currentPage:Number('0'),
            limit:Number("10")
        })

        // const result=GetServerData('qerp.pos.rp.day.account.page',values)
        // result.then((res) => {
        //     return res;
        // }).then((json) => {
        //     if(json.code=='0'){
        //         console.log('每日对账单数据请求成功');
        //     }else{  
        //         message.error(json.message); 
        //     }
        // })
    }

    //获取当前时间
     getNowFormatDate = () =>{
        const self = this;
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        this.setState({
            startDate:currentdate,
            endDate:currentdate
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
    // componentWillUnmount(){   
    //     window.removeEventListener('resize', this.windowResize.bind(this));
    // }
}

function mapStateToProps(state){
   return {};
}

const DailyBill = Form.create()(DailyBillForm);

export default connect(mapStateToProps)(DailyBill);