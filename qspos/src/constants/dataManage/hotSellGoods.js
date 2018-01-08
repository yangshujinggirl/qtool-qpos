import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

//热销商品
class HotSellGoodsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
        };
        this.columns = [{
            title: '排序',
            dataIndex: 'name',
        },{
            title: '商品条码',
            dataIndex: 'age',
        },{
            title: '商品名称',
            dataIndex: 'account',
        },{
            title: '规格',
            dataIndex: 'weixin',
        },{
            title: '销售数量',
            dataIndex: 'alipay',
        },{
            title: '销售金额',
            dataIndex: 'cash',
        },{
            title: '商品剩余库存',
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
                <div className="hotSell-wrapper">
                    <div className="first-flag"></div>
                    <div className="second-flag"></div>
                    <div className="third-flag"></div>
                    <CommonTable 
                        columns={this.columns} 
                        dataSource={this.state.dataSource}
                        total={20}
                        current={1}
                        pageSize={10}
                        onShowSizeChange={this.onShowSizeChange}
                        pageChange={this.pageChange}
                        />
                </div>
                
            </div>
        );
    }
}

function mapStateToProps(state){
   return {};
}

const HotSellGoods = Form.create()(HotSellGoodsForm);

export default connect(mapStateToProps)(HotSellGoods);