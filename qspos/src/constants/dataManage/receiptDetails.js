import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import {GetServerData} from '../../services/services';
import CommonTable from './commonTable';
import {deepcCloneObj} from '../../utils/commonFc';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD hh:mm:ss';
class ReceiptDetailsForm extends React.Component {
    constructor(props,context) {
        super(props,context);
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
            dataIndex: 'updateTime',
        }];
    }

    dateChange = (date, dateString) =>{
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
        const result=GetServerData('qerp.pos.order.receiveRepDetail.query',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.details;
                for(let i=0;i<dataList.length;i++){
                    dataList[i].key = i+1;
                }
                this.setState({
                    dataSource:dataList,
                    total:Number(json.total),
                    currentPage:Number(json.currentPage),
                    limit:Number(json.limit)
                });
            }else{  
                message.error(json.message); 
            }
        })
    }

    handleSubmit = (e) =>{
        const self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                keywords:values.keywords
            },function(){
                let values = {
                    pdOrderId:this.props.detailId,
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
                <div className="scroll-wrapper">
                    <div className="info-title">
                        配货单信息
                    </div>
                    <div className="info-content">
                        <label>配货单号：</label><span>{this.props.headerInfo.orderNo}</span>
                        <label>商品总数：</label><span>{this.props.headerInfo.qtySum}</span>
                        <label>已收商品数量：</label><span>{this.props.headerInfo.receiveQty}</span>
                        <label>订单状态：</label><span>{this.props.headerInfo.statusStr}</span>
                    </div>
                    <div className="info-title">
                        商品收货明细
                    </div>
                    {/*搜索部分 */}
                    <Form className="search-form time-select">
                        <FormItem
                            label="商品名称／条形码"
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                        {getFieldDecorator('keywords')(
                            <Input/>
                        )}
                        </FormItem>
                        <FormItem
                            label="操作时间"
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                        {getFieldDecorator('time')(
                            <RangePicker onChange={this.dateChange.bind(this)} 
                            format={dateFormat}/>
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
        if(this.props.detailId){
            let values = {
                pdOrderId:this.props.detailId
            }
            this.getServerData(values);
        }
        //添加
        this.props.dispatch({
            type:'dataManage/initKey',
            payload: "4"
        })
    }
}

function mapStateToProps(state){
    const {detailInfo,headerInfo,detailId} = state.dataManage;
    return {detailInfo,headerInfo,detailId};
}

const ReceiptDetails = Form.create()(ReceiptDetailsForm);

export default connect(mapStateToProps)(ReceiptDetails);