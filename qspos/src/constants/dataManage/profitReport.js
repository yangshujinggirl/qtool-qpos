import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

//利润报表
class ProfitReportForm extends React.Component {
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
            title: '销售单均价',
            dataIndex: 'cash',
        },{
            title: '销售数量',
            dataIndex: 'yinlian',
        },{
            title: '销售额',
            dataIndex: 'card',
        },{
            title: '商品成本',
            dataIndex: 'counr12',
        },{
            title: '销售成本',
            dataIndex: 'counr0',
        },{
            title: '销售毛利额',
            dataIndex: 'counr6',
        },{
            title: '销售毛利率',
            dataIndex: 'counr5',
        },{
            title: '损益数量',
            dataIndex: 'counr4',
        },{
            title: '损益成本',
            dataIndex: 'counr2',
        },{
            title: '商品毛利额',
            dataIndex: 'counr1',
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
                <div className="top-data">
                    <ul>
                        <li>
                            <div>
                                <p style={{color:"#FB6349"}}><i>¥</i>1599628<span>.00</span></p>
                                <span className="explain-span">销售额</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F7A303"}}><i>¥</i>4890235<span>.00</span></p>
                                <span className="explain-span">销售成本</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#51C193"}}><i>¥</i>9599321<span>.00</span></p>
                                <span className="explain-span">销售毛利</span>
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

const ProfitReport = Form.create()(ProfitReportForm);

export default connect(mapStateToProps)(ProfitReport);