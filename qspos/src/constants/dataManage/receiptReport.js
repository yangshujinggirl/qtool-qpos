import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Pagination } from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

//收货报表
class ReceiptReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            operateST:'',
            operateET:'',
            status:'',
            orderNo:''
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
            title: '配货单号',
            dataIndex: 'orderNo',
            render: (text, record, index) => {
                return (
                    <Link to={{pathname:'/dataManage/receiptDetail',query:{id:record.orderId}}}>{text}</Link>
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

    //获取数据
    getServerData = (values) =>{
        let dataList = [
            {
                "orderId":'89',
                "orderNo": "PH17072900003",
                "qtySum": "100",//商品总数
                "receiveQty": "20", //已收数量
                "statusStr": "收货中",
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00"
            },
            {
                "orderId":'90',
                "orderNo": "PH17072900003",
                "qtySum": "100",//商品总数
                "receiveQty": "20", //已收数量
                "statusStr": "收货中",
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00"
            },
            {
                "orderId":'92',
                "orderNo": "PH17072900003",
                "qtySum": "100",//商品总数
                "receiveQty": "20", //已收数量
                "statusStr": "收货中",
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00"
            },
            {
                "orderId":'94',
                "orderNo": "PH17072900003",
                "qtySum": "100",//商品总数
                "receiveQty": "20", //已收数量
                "statusStr": "收货中",
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00"
            }
        ];

        for(let i=0;i<dataList.length;i++){
            dataList[i].key = i+1;
        }
        this.setState({
            dataSource:dataList,
            total:Number('3'),
            currentPage:Number('0'),
            limit:Number("10")
        })

        // const result=GetServerData('qerp.pos.order.receiveRep',values)
        // result.then((res) => {
        //     return res;
        // }).then((json) => {
        //     if(json.code=='0'){
        //         console.log('收货报表数据请求成功');
        //     }else{  
        //         message.error(json.message); 
        //     }
        // })
    }
   

    dateChange = (date, dateString) =>{
        console.log(date, dateString);
        this.setState({
            operateST:dateString[0],
            operateET:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            current:current,
            currentPage:1
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.setState({
                status:values.status,
                orderNo:values.orderNo
            },function(){
                let data = {
                    currentPage:0,
                    limit:10,
                    operateST:this.state.operateST,
                    operateET:this.state.operateET,
                    status:this.state.status,
                    orderNo:this.state.orderNo
                };
                this.getServerData(data);
            })
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
                        label="最近操作时间"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('time')(
                            <RangePicker onChange={this.dateChange.bind(this)} />
                        )}
                        </FormItem>
                        <FormItem
                        label="订单状态"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('status')(
                            <Select>
                                <Option value="10">收货中</Option>
                                <Option value="20">待收货</Option>
                                <Option value="30">已收货</Option>
                            </Select>
                        )}
                        </FormItem>
                        <FormItem
                        label="配货单号"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('orderNo')(
                        <Input/>
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
        this.getServerData();
    }
}

function mapStateToProps(state){
   return {};
}

const ReceiptReport = Form.create()(ReceiptReportForm);

export default connect(mapStateToProps)(ReceiptReport);
