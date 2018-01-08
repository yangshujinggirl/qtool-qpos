import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import {GetServerData} from '../../services/services';
import moment from 'moment';
import CommonTable from './commonTable';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
//引入图表
import Echartsaxis from './echartsaxis';
import EchartsPie from './echartsPie';

//店员销售
class ClerkSaleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userSales:[],
            totalUserSale:{
                nickname:'',
                amount:null,
                icAmount:null,
                orderQty:null,
                wechatAmount:null,
                alipayAmount:null,
                unionpayAmount:null,
                cashAmount:null,
                cardChargeAmount:null,
                cardConsumeAmount:null,
                pointAmount:null,
                refundAmount:null,
                key:-2
            },
            setsouce:[]
        };
        this.columns = [{
            title: '姓名',
            dataIndex: 'nickname'
        }, {
            title: "sale",
            dataIndex: 'amount'
        }, {
            title: "netreceipts",
            dataIndex: 'icAmount'
        },{
            title: '订单数',
            dataIndex: 'orderQty'
        },{
            title: '微信',
            dataIndex: 'wechatAmount'
        },{
            title: '支付宝',
            dataIndex: 'alipayAmount'
        },{
            title: '银联',
            dataIndex: 'unionpayAmount'
        },{
            title: '现金',
            dataIndex: 'cashAmount'
        },{
            title: '会员充值',
            dataIndex: 'cardChargeAmount'
        },{
            title: '会员消费',
            dataIndex: 'cardConsumeAmount'
        },{
            title: '积分抵扣',
            dataIndex: 'pointAmount'
        },{
            title: '退款',
            dataIndex: 'refundAmount'
        }];
    }

    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }


    dateChange = (date, dateString) =>{
        console.log(date, dateString);
    }

    initdataspuce=(values)=>{
        const result=GetServerData('qerp.web.qpos.st.user.sale.query',values)
            result.then((res) => {
                    return res;
            }).then((json) => {
                if(json.code=='0'){
                    const userSales=json.userSales
                    const totalUserSale=json.totalUserSale
                    totalUserSale.nickname='合计'
                    const setsouce=[]
                    for(var i=0;i<userSales.length;i++){
                        setsouce.push(userSales[i])
                    }
                    setsouce.push(totalUserSale)
                    this.setState({
                        userSales:json.userSales,
                        totalUserSale:totalUserSale,
                        setsouce:setsouce
                    })
                }else{  
                    message.error(json.message); 
                }
            })

   }

    render() {
        const { getFieldDecorator } = this.props.form;
        let d= new Date()
        d.setDate(d.getDate()-1)
        let dy=d.getFullYear() //年
        let dm=d.getMonth()+1//月
        let dd=d.getDate()//日
        let a=dy+'-'+dm+'-'+dd
        return (
            <div>
                {/*搜索部分 */}
                <Form className="search-form">
                    <FormItem
                     label="选择时间"
                     labelCol={{ span: 5 }}
                     wrapperCol={{span: 10}}>
                        <RangePicker 
                            defaultValue={[moment(a,dateFormat),moment(a, dateFormat)]}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            onChange={this.dateChange.bind(this)} />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search">搜索</Button>
                    </FormItem>
                </Form>
                <div className="charts-wrapper">
                    <p>销售数据</p>
                    <div className='fl'>
                        <Echartsaxis userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/>
                    </div>
                    <div className='fl' style={{width:'2px',height:'200px',background:'#E7E8EC',margin:'40px 25px'}}></div>
                    <div className='fl'><EchartsPie userSales={this.state.userSales} totalUserSale={this.state.totalUserSale}/></div>
                </div>
                <div className="table-wrapper">
                <p>详细数据</p>
                <CommonTable columns={this.columns} dataSource={this.state.setsouce}  pagination={false}/>
                    {/* <Table bordered 
                        dataSource={this.state.setsouce} 
                        columns={this.columns} 
                        rowClassName={this.rowClassName.bind(this)}
                        pagination={false}
                        /> */}
                </div>
            </div>
        );
    }

    componentDidMount(){
        let d= new Date()
        d.setDate(d.getDate()-1);
        let dy=d.getFullYear(); //年
        var dm=("0" + (d.getMonth() + 1)).slice(-2);
        var dd=("0"+d.getDate()).slice(-2);
        let a=dy+'-'+dm+'-'+dd;
        let values={
           dateStart:a,
           dateEnd:a
        };
        this.initdataspuce(values)
    }
}

function mapStateToProps(state){
   return {};
}
const ClerkSale = Form.create()(ClerkSaleForm);

export default connect(mapStateToProps)(ClerkSale);