import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

//进销存报表
class InOutReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            windowHeight:''
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'name',
        },{
            title: '商品条码',
            dataIndex: 'age',
        },{
            title: '商品名称',
            dataIndex: 'account',
        },{
            title: '商品分类',
            dataIndex: 'weixin',
        },{
            title: '规格',
            dataIndex: 'alipay',
        },{
            title: '期初库存数量',
            dataIndex: 'cash',
        },{
            title: '期初库存成本',
            dataIndex: 'yinlian',
        },{
            title: '收货数量',
            dataIndex: 'card',
        },{
            title: '收货成本',
            dataIndex: 'counr12',
        },{
            title: '销售数量',
            dataIndex: 'counr0',
        },{
            title: '销售成本',
            dataIndex: 'counr6',
        },{
            title: '损益数量',
            dataIndex: 'counr5',
        },{
            title: '损益成本',
            dataIndex: 'counr4',
        },{
            title: '盘点损益数',
            dataIndex: 'counr2',
        },{
            title: '盘点损益成本',
            dataIndex: 'counr17',
        },{
            title: '期末库存数量',
            dataIndex: 'counr18',
        },{
            title: '期末库存成本',
            dataIndex: 'counr19',
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
            <div className="daily-bill">
                {/* 数据展示部分 */}
                <div className="top-data inout-data">
                    <ul>
                        <li>
                            <div>
                                <p style={{color:"#806EC6"}}><i>¥</i>250062<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="期末库存总成本描述">
                                        期末库存总成本&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F4A314"}}><i>¥</i>690235<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="期初库存总成本描述">
                                        期末库存总成本&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#0D89C8"}}><i>¥</i>599321<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="收货总成本描述">
                                        收货总成本&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#51C193"}}><i>¥</i>199321<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="销售总成本描述">
                                        销售总成本&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F24343"}}><i>¥</i>899321<span>.00</span></p>
                                <span className="explain-span">
                                <Tooltip title="损益成本描述">
                                    损益成本&nbsp;<Icon type="exclamation-circle-o"/>
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
                    {getFieldDecorator('time')(
                        <RangePicker onChange={this.dateChange.bind(this)} />
                    )}
                    </FormItem>
                    <FormItem
                    label="订单分类"
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
                    <FormItem>
                        <Button type="primary" icon="search">搜索</Button>
                    </FormItem>
                    <div className="export-div">
                        <Button className="export-btn">导出数据</Button>
                    </div>
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

const InOutReport = Form.create()(InOutReportForm);

export default connect(mapStateToProps)(InOutReport);