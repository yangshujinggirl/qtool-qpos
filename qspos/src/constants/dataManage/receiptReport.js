import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Pagination } from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../services/services';
import {timeForMats} from '../../utils/commonFc';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

//收货报表
class ReceiptReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            operateStart:'',
            operateEnd:'',
            status:'',
            orderNo:''
        };
        this.columns = [{
            title: '配货单号',
            dataIndex: 'orderNo',
            render: (text, record, index) => {
                return (
                    <div onClick={this.toRoute.bind(this,record)} style={{color:"#35BAB0",cursor:"pointer"}}>{text}</div>
                    // <Link to={{pathname:'/dataManage/receiptDetail',query:{id:record.pdOrderId,orderNo:record.orderNo,qtySum:record.qtySum,receiveQty:record.receiveQty,statusStr:record.statusStr}}}>{text}</Link>
                )
            }
        },{
            title: '商品总数',
            dataIndex: 'qtySum',
        },{
            title: '已收商品数量',
            dataIndex: 'receiveQty',
        },{
            title: '订单状态',
            dataIndex: 'statusStr',
        },{
            title: '收货人',
            dataIndex: 'consignee',
        },{
            title: '最后操作时间',
            dataIndex: 'operateTime',
        }];
    }

    toRoute = (record) =>{
        this.props.dispatch({
            type:'dataManage/getDetailId',
            payload: record.pdOrderId
        })
        this.props.dispatch({
            type:'dataManage/syncHeaderInfo',
            payload: record
        })
        this.context.router.push('/dataManage/receiptDetail');
    }

    //获取数据
    getServerData = (values) =>{
        const result=GetServerData('qerp.qpos.order.receiveRep',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.pdOrderVos;
                for(let i=0;i<dataList.length;i++){
                    dataList[i].key = i+1;
                }
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
   

    dateChange = (date, dateString) =>{
        this.setState({
            operateStart:dateString[0],
            operateEnd:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        const self = this;
        this.setState({
            currentPage:page-1
        },function(){
            let data = {
                currentPage:this.state.currentPage,
                limit:this.state.limit,
                operateStart:this.state.operateStart,
                operateEnd:this.state.operateEnd,
                status:this.state.status!="-1"?this.state.status:"",
                orderNo:this.state.orderNo
            }
            self.getServerData(data);
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        const self = this;
        this.setState({
            limit:pageSize,
            currentPage:0
        },function(){
            let data = {
                currentPage:this.state.currentPage,
                limit:this.state.limit,
                operateStart:this.state.operateStart,
                operateEnd:this.state.operateEnd,
                status:this.state.status!="-1"?this.state.status:"",
                orderNo:this.state.orderNo
            };
            self.getServerData(data);
        })
    }

    handleSubmit = (e) =>{
        const self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                status:values.status,
                orderNo:values.orderNo
            },function(){
                let data = {
                    currentPage:0,
                    limit:10,
                    operateStart:this.state.operateStart,
                    operateEnd:this.state.operateEnd,
                    status:this.state.status!="-1"?this.state.status:"",
                    orderNo:this.state.orderNo
                };
                self.getServerData(data);
            })
        })
    }

    getNowFormatDate = () =>{
        const self = this;
        // let date = new Date();
        // let seperator1 = "-";
        // let month = date.getMonth() + 1;
        // let strDate = date.getDate();
        // if (month >= 1 && month <= 9) {
        //     month = "0" + month;
        // }
        // if (strDate >= 0 && strDate <= 9) {
        //     strDate = "0" + strDate;
        // }
        // let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;

        // let date2 = new Date(date);
        // date2.setDate(date.getDate() - 30);
        // let month1 = date2.getMonth() + 1;
        // let strDate1 = date2.getDate();
        // if (month1 >= 1 && month1 <= 9) {
        //     month1 = "0" + month;
        // }
        // if (strDate1 >= 0 && strDate1 <= 9) {
        //     strDate1 = "0" + strDate1;
        // }
        // var currentdate1 = date2.getFullYear() + seperator1 + month1 + seperator1 + strDate1;
        let startRpDate=timeForMats(30).t2;
        let endRpDate=timeForMats(30).t1;
        this.setState({
            operateStart:startRpDate,
            operateEnd:endRpDate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                operateStart:this.state.operateStart,
                operateEnd:this.state.operateEnd
            }
            self.getServerData(values);
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="receipt-report">
                <div className="scroll-wrapper">
                    {/*搜索部分 */}
                    <Form className="search-form">
                        <FormItem
                        className="operate-time"
                        label="最近操作时间"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                            <RangePicker 
                                value={this.state.operateStart?[moment(this.state.operateStart, dateFormat), moment(this.state.operateEnd, dateFormat)]:null}
                                format={dateFormat}
                                onChange={this.dateChange.bind(this)} />
                        </FormItem>
                        <FormItem
                        label="订单状态"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('status', {
                            initialValue:"-1"
                         })(
                            <Select>
                                <Option value="-1">全部</Option>
                                <Option value="10">待收货</Option>
                                <Option value="20">收货中</Option>
                                <Option value="30">已收货</Option>
                            </Select>
                        )}
                        </FormItem>
                        <FormItem
                         className="operate-time"
                        label="配货单号"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('orderNo')(
                        <Input autoComplete="off" placeholder="请输入配货单号"/>
                        )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                        </FormItem>
                    </Form>
                    <CommonTable 
                        columns={this.columns} 
                        dataSource={this.state.dataSource}
                        pagination={false}
                        total={20}
                        current={1}
                        pageSize={10}
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

    componentDidMount(){
        this.getNowFormatDate();
        // this.getServerData();
    }
}

function mapStateToProps(state){
   return {};
}
ReceiptReportForm.contextTypes= {
    router: React.PropTypes.object
}
const ReceiptReport = Form.create()(ReceiptReportForm);

export default connect(mapStateToProps)(ReceiptReport);

