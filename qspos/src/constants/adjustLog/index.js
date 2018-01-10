import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import CommonTable from '../../constants/dataManage/commonTable';
import {GetServerData} from '../../services/services';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class AdjustLogIndexForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            adjustTimeStart:"",
            adjustTimeEnd:"",
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
                    type:1
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
            <div className="adjust-index">
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
                <div className="table-wrapper">
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
        
        

        const result=GetServerData('qerp.pos.pd.adjust.detail',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                console.log('每日对账单数据请求成功');
                let dataList = json.adjustSpus;
                for(let i=0;i<dataList.length;i++){
                    dataList[i].key = i+1;
                };
                this.setState({
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
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        this.setState({
            adjustTimeStart:currentdate,
            adjustTimeEnd:currentdate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                adjustTimeStart:this.state.adjustTimeStart,
                adjustTimeEnd:this.state.adjustTimeEnd,
                type:1
            }
            self.getServerData(values);
        })
    }

    componentDidMount(){
        //获取当前时间
        this.getNowFormatDate();
    }
}

function mapStateToProps(state){
   return {};
}

const AdjustLogIndex = Form.create()(AdjustLogIndexForm);

export default connect(mapStateToProps)(AdjustLogIndex);