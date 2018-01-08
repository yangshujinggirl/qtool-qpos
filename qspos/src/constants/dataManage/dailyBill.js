import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class DailyBillForm extends React.Component {
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
            title: '订单编号',
            dataIndex: 'age',
        },{
            title: '结算金额',
            dataIndex: 'account',
        },{
            title: '微信',
            dataIndex: 'weixin',
        },{
            title: '支付宝',
            dataIndex: 'alipay',
        },{
            title: '现金',
            dataIndex: 'cash',
        },{
            title: '银联',
            dataIndex: 'yinlian',
        },{
            title: '会员卡消费',
            dataIndex: 'card',
        },{
            title: '积分抵扣',
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
                                <span className="explain-span">
                                    <Tooltip title="净收款描述">
                                        净收款&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#F7A303"}}><i>¥</i>4890235<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="销售额描述">
                                        销售额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#51C193"}}><i>¥</i>9599321<span>.00</span></p>
                                <span className="explain-span">
                                    <Tooltip title="充值金额描述">
                                        充值金额&nbsp;<Icon type="exclamation-circle-o"/>
                                    </Tooltip>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p style={{color:"#806EC6"}}>100</p>
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

    // componentDidMount(){
    //     if(document.body.offsetWidth>800){
    //         this.setState({
    //            windowHeight:document.body.offsetHeight-300,
    //          });
    //     }else{
    //         this.setState({
    //             windowHeight:document.body.offsetHeight-270,
    //         });
    //     }
    //     window.addEventListener('resize', this.windowResize.bind(this));    
    // }
    // componentWillUnmount(){   
    //     window.removeEventListener('resize', this.windowResize.bind(this));
    // }
}

function mapStateToProps(state){
   return {};
}

const DailyBill = Form.create()(DailyBillForm);

export default connect(mapStateToProps)(DailyBill);