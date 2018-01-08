import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker} from 'antd';
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
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'name',
        },{
            title: '配货单号',
            dataIndex: 'age',
        },{
            title: '商品总数',
            dataIndex: 'account',
        },{
            title: '已收商品数量',
            dataIndex: 'weixin',
        },{
            title: '订单状态',
            dataIndex: 'alipay',
        },{
            title: '收货人',
            dataIndex: 'cash',
        },{
            title: '最后操作时间',
            dataIndex: 'yinlian',
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
            <div>
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
                    {getFieldDecorator('type')(
                        <Select>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled">Disabled</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    )}
                    </FormItem>
                    <FormItem
                     label="配货单号"
                     labelCol={{ span: 5 }}
                     wrapperCol={{span: 10}}>
                    {getFieldDecorator('order')(
                       <Input/>
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

const ReceiptReport = Form.create()(ReceiptReportForm);

export default connect(mapStateToProps)(ReceiptReport);
