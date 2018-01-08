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
            windowHeight:''
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'name',
        },{
            title: '商品名称',
            dataIndex: 'age',
        },{
            title: '商品规格',
            dataIndex: 'account',
        },{
            title: '成本价',
            dataIndex: 'weixin',
        },{
            title: '预收数量',
            dataIndex: 'alipay',
        },{
            title: '已收数量',
            dataIndex: 'cash',
        },{
            title: '差异',
            dataIndex: 'yinlian',
        },{
            title: '最后收货人',
            dataIndex: 'card',
        },{
            title: '最后操作时间',
            dataIndex: 'counr',
        }];
    }

    dateChange = (date, dateString) =>{
        console.log(date, dateString);
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ph-info">
                <div className="info-title">
                    配货单信息
                </div>
                <div className="info-content">
                    <label>配货单号：</label><span>PH20179088901</span>
                    <label>商品总数：</label><span>10000</span>
                    <label>已收商品数量：</label><span>500</span>
                    <label>订单状态：</label><span>收货中</span>
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
                    {getFieldDecorator('type')(
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
                        <Button type="primary" icon="search">搜索</Button>
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
}

function mapStateToProps(state){
   return {};
}

const ReceiptDetails = Form.create()(ReceiptDetailsForm);

export default connect(mapStateToProps)(ReceiptDetails);