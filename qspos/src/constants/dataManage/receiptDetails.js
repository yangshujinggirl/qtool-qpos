import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class ReceiptDetailsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            operateST:'',
            operateET:'',
            keywords:'',
            windowHeight:'',
            posOrder:{
                "orderNo": "",
                "qtySum": "",
                "receiveQty": "",
                "statusStr": "",
            }
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'pdBarcode',
        },{
            title: '商品名称',
            dataIndex: 'pdSpuName',
        },{
            title: '商品规格',
            dataIndex: 'pdSkuType',
        },{
            title: '成本价',
            dataIndex: 'price',
        },{
            title: '预收数量',
            dataIndex: 'qty',
        },{
            title: '已收数量',
            dataIndex: 'receiveQty',
        },{
            title: '差异',
            dataIndex: 'differenceQty',
        },{
            title: '最后收货人',
            dataIndex: 'consignee',
        },{
            title: '最后操作时间',
            dataIndex: 'operateTime',
        }];
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

    //获取数据
    getServerData = (values) =>{
        let dataList = [
            {
                "pdBarcode": "1010",//商品条码
                "pdSpuName": "非预+批+到",//商品名称"
                "pdSkuType": "规格属性1/规格属性1",
                "qty": "100",  // 商品数量
                "receiveQty": "20", //已收数量
                "differenceQty": "20", //差异数量
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00",
                "price":'2343'
            },
            {
                "pdBarcode": "1010",//商品条码
                "pdSpuName": "非预+批+到",//商品名称"
                "pdSkuType": "规格属性1/规格属性1",
                "qty": "100",  // 商品数量
                "receiveQty": "20", //已收数量
                "differenceQty": "20", //差异数量
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00",
                "price":'2343'
            },
            {
                "pdBarcode": "1010",//商品条码
                "pdSpuName": "非预+批+到",//商品名称"
                "pdSkuType": "规格属性1/规格属性1",
                "qty": "100",  // 商品数量
                "receiveQty": "20", //已收数量
                "differenceQty": "20", //差异数量
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00",
                "price":'2343'
            },
            {
                "pdBarcode": "1010",//商品条码
                "pdSpuName": "非预+批+到",//商品名称"
                "pdSkuType": "规格属性1/规格属性1",
                "qty": "100",  // 商品数量
                "receiveQty": "20", //已收数量
                "differenceQty": "20", //差异数量
                "consignee": "收货人",
                "operateTime": "2017-12-27 12:00:00",
                "price":'2343'
            }
        ];

        for(let i=0;i<dataList.length;i++){
            dataList[i].key = i+1;
        }

        let  posOrder={
            "orderNo": "PH17072900003",
            "qtySum": "100",
            "receiveQty": "20",
            "statusStr": "收货中",
        };
        this.setState({
            dataSource:dataList,
            posOrder:posOrder,
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

    handleSubmit = (e) =>{
        const self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.setState({
                keywords:values.keywords
            },function(){
                let values = {
                    currentPage:0,
                    limit:10,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    keywords:this.state.keywords
                }
                self.getServerData(values);
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ph-info">
                <div className="info-title">
                    配货单信息
                </div>
                <div className="info-content">
                    <label>配货单号：</label><span>{this.state.posOrder.orderNo}</span>
                    <label>商品总数：</label><span>{this.state.posOrder.qtySum}</span>
                    <label>已收商品数量：</label><span>{this.state.posOrder.receiveQty}</span>
                    <label>订单状态：</label><span>{this.state.posOrder.statusStr}</span>
                </div>
                <div className="info-title">
                    商品收货明细
                </div>
                {/*搜索部分 */}
                <Form className="search-form">
                    <FormItem
                        label="商品名称／条形码"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                    {getFieldDecorator('keywords')(
                        <Input/>
                    )}
                    </FormItem>
                    <FormItem
                        label="订单时间"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                    {getFieldDecorator('time')(
                        <RangePicker onChange={this.dateChange.bind(this)} />
                    )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                    </FormItem>
                </Form>
                <CommonTable 
                    columns={this.columns} 
                    dataSource={this.state.dataSource}
                    pagination={true}
                    total={20}
                    current={1}
                    pageSize={10}
                    onShowSizeChange={this.onShowSizeChange}
                    pageChange={this.pageChange}
                    />
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

const ReceiptDetails = Form.create()(ReceiptDetailsForm);

export default connect(mapStateToProps)(ReceiptDetails);