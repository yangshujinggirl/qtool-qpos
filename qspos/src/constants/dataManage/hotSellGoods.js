import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

//热销商品
class HotSellGoodsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            startDate:"",
            endDate:"",
        };
        this.columns = [{
            title: '排序',
            dataIndex: 'sortIndex',
            render: (text, record, index) => {
                return (
                    <span>{index+1}</span>
                )
            }
        },{
            title: '商品条码',
            dataIndex: 'barcode',
        },{
            title: '商品名称',
            dataIndex: 'name',
        },{
            title: '规格',
            dataIndex: 'displayName',
        },{
            title: '销售数量',
            dataIndex: 'posQty',
        },{
            title: '销售金额',
            dataIndex: 'posAmount',
        },{
            title: '商品剩余库存',
            dataIndex: 'invQty',
        }];
    }

    //时间改变
    dateChange = (date, dateString) =>{
        console.log(date, dateString);
        this.setState({
            startDate:dateString[0],
            endDate:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page-1
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:current-1
        })
    }

    //获取数据
    getServerData = (values) =>{
        let dataList = [
            {
                barcode:"3456789",
                name:"我是商品1",
                displayName:"200ml",
                posQty:"5",
                posAmount:"345.90",
                invQty:"30"
            },
            {
                barcode:"3456789",
                name:"我是商品2",
                displayName:"200ml",
                posQty:"5",
                posAmount:"345.90",
                invQty:"30"
            },
            {
                barcode:"3456789",
                name:"我是商品3",
                displayName:"200ml",
                posQty:"5",
                posAmount:"345.90",
                invQty:"30"
            },
            {
                barcode:"3456789",
                name:"我是商品4",
                displayName:"200ml",
                posQty:"5",
                posAmount:"345.90",
                invQty:"30"
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
        });

        // const result=GetServerData('qerp.pos.rp.pd.sell.list',values)
        // result.then((res) => {
        //     return res;
        // }).then((json) => {
        //     if(json.code=='0'){
        //         console.log('热销商品数据请求成功');
        //     }else{  
        //         message.error(json.message); 
        //     }
        // })
    }

    //获取当前时间
    getNowFormatDate = () =>{
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        this.setState({
            startDate:currentdate,
            endDate:currentdate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }
            this.getServerData(values);
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let data = {
                currentPage:0,
                limit:10,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }
            this.getServerData(data);
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
                        <RangePicker 
                            value={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]}
                            format={dateFormat}
                            onChange={this.dateChange.bind(this)} />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                    </FormItem>
                </Form>
                <div className="hotSell-wrapper">
                    {
                        this.state.dataSource.length?
                        (
                            this.state.dataSource.length == 1? 
                            <div className="first-flag"></div>:
                            (
                                this.state.dataSource.length == 2?
                                <div>
                                    <div className="first-flag"></div>
                                    <div className="second-flag"></div>
                                </div>
                                :(
                                    <div>
                                        <div className="first-flag"></div>
                                        <div className="second-flag"></div>
                                        <div className="third-flag"></div>
                                    </div>
                                )
                            )
                        )
                        :null
                    }
                    {/* <div className="first-flag"></div>
                    <div className="second-flag"></div>
                    <div className="third-flag"></div> */}
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
            </div>
        );
    }

    componentDidMount(){
        //获取当前时间
        this.getNowFormatDate();
    }
}

function mapStateToProps(state){
   return {};
}

const HotSellGoods = Form.create()(HotSellGoodsForm);

export default connect(mapStateToProps)(HotSellGoods);