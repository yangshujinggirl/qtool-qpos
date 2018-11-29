import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination } from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
import moment from 'moment';


const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const columns = [{
      title: '订单编号',
      dataIndex: 'orderNo',
  },{
      title: '结算金额',
      dataIndex: 'amount',
  },{
      title: '销售额',
      dataIndex: 'saleAmount',
  },{
      title: '微信转账',
      dataIndex: 'wechatAmount',
  },{
      title: '微信扫码',
      dataIndex: 'scanWechatAmount',
  },{
      title: '支付宝转账',
      dataIndex: 'alipayAmount',
  },{
      title: '支付宝扫码',
      dataIndex: 'scanAlipayAmount',
  },{
      title: 'App支付',
      dataIndex: 'appPay',
  },{
      title: '现金',
      dataIndex: 'cashAmount',
  },{
      title: '银联',
      dataIndex: 'unionpayAmount',
  },{
      title: '会员卡消费',
      dataIndex: 'cardConsumeAmount',
  },{
      title: '积分抵扣',
      dataIndex: 'pointAmount',
  }];

class DailyBillForm extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          dataSource:[],
          total:0,
          currentPage:0,
          limit:10,
          startDate:"",
          endDate:"",
          windowHeight:'',
          lastMonthDate:'',
          rpDayAccount:{
              cleanAmount:'',
              amount:'',
              orderSum:'',
              rechargeAmount:''
          },
          type:'',
          source:0
      };

  }
  componentDidMount(){
    this.getNowFormatDate();
  }
  dateChange = (date, dateString) =>{
      this.setState({
          startDate:dateString[0],
          endDate:dateString[1]
      })
  }
  //表格的方法
  pageChange=(page,pageSize)=>{
      const self = this;
      this.setState({
          currentPage:page-1
      },()=>{
          let data = {
              currentPage:this.state.currentPage,
          }
          self.getServerData(data);
      });
  }
  onShowSizeChange=(current, pageSize)=>{
      const self = this;
      this.setState({
          limit:pageSize,
          currentPage:0
      },()=>{
          let data = {
              currentPage:this.state.currentPage,
              limit:this.state.limit,
          };
          self.getServerData(data);
      })
  }
  handleSubmit = (e) =>{
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          this.getServerData();
      })
  }
  changeType=(value)=> {
    this.setState({ type: value == '-1'?'':value })
  }
  changeSource=(value)=> {
    this.setState({ source: value })
  }
  //获取数据
  getServerData = (values) =>{
    const { limit, startDate, endDate, type, source } =this.state;
    let params = {
          currentPage:0,
          limit,
          startDate,
          endDate,
          type,
          source
    }
    if(values) {
      params = { ...params, ...values};
    }
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    GetServerData('qerp.pos.rp.day.account.page',params)
    .then((json) => {
      if(json.code=='0'){
          let rpDayAccount =json.rpDayAccount;
          let dataList = json.rpDayAccounts;
          if(dataList.length){
              for(let i=0;i<dataList.length;i++){
                  dataList[i].key = i+1;
              }
          }
          this.setState({
              rpDayAccount:rpDayAccount,
              dataSource:dataList,
              total:Number(json.total),
              currentPage:Number(json.currentPage),
              limit:Number(json.limit)
          })
      }else{
          message.error(json.message);
      }
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:false
      })
    })
  }
  //获取当前时间
  getNowFormatDate = () =>{
      const self = this;
      var date = new Date();
      var seperator1 = "-";
      var month = date.getMonth() + 1;
      var beforeMonth = date.getMonth();
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (beforeMonth >= 1 && beforeMonth <= 9) {
          beforeMonth = "0" + beforeMonth;
      }
      if(beforeMonth == 0){
          beforeMonth = "12"
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
      var lastMonthDate = date.getFullYear() + seperator1 + beforeMonth + seperator1 + strDate;
      this.setState({
          startDate:currentdate,
          endDate:currentdate,
          lastMonthDate:lastMonthDate
      },function(){
          self.getServerData();
      })
  }
  //导出数据
  exportList = () =>{
      let data = {
          startDate:this.state.startDate,
          endDate:this.state.endDate,
          type:this.state.type,
          source:this.state.source
      }
      const result=GetExportData('qerp.qpos.rp.day.account.export',data);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="daily-bill border-top-style">
        <div className="scroll-wrapper">
        {/* 数据展示部分 */}
        <div className="top-data">
          <ul>
            <li>
              <div>
                <p style={{color:"#FB6349",marginBottom:'0'}}>
                    <i>¥</i>
                    {this.state.rpDayAccount.cleanAmount&&this.state.rpDayAccount.cleanAmount!="0"?this.state.rpDayAccount.cleanAmount.split('.')[0]:"0"}
                    <span>.{this.state.rpDayAccount.cleanAmount&&this.state.rpDayAccount.cleanAmount!="0"?this.state.rpDayAccount.cleanAmount.split('.')[1]:"00"}</span>
                </p>
                <span className="explain-span">
                  <Tooltip title="微信+支付宝+现金+银联+APP支付">
                      净收款&nbsp;<Icon type="exclamation-circle-o"/>
                  </Tooltip>
                </span>
              </div>
            </li>
            <li>
              <div>
                <p style={{color:"#F7A303",marginBottom:'0'}}>
                    <i>¥</i>
                    {this.state.rpDayAccount.saleAmount&&this.state.rpDayAccount.saleAmount!="0"?this.state.rpDayAccount.saleAmount.split('.')[0]:"0"}
                    <span>.{this.state.rpDayAccount.saleAmount&&this.state.rpDayAccount.saleAmount!="0"?this.state.rpDayAccount.saleAmount.split('.')[1]:"00"}</span>
                </p>
                <span className="explain-span">
                  <Tooltip title="销售订单金额-退款订单金额">
                    销售额&nbsp;<Icon type="exclamation-circle-o"/>
                  </Tooltip>
                </span>
              </div>
            </li>
            <li>
              <div>
                <p style={{color:"#806EC6",marginBottom:'0'}}>
                <i style={{visibility:"hidden"}}>¥</i>
                {this.state.rpDayAccount.orderQty?this.state.rpDayAccount.orderQty:"0"}
                <span style={{visibility:"hidden"}}>.</span>
                </p>
                <span className="explain-span">
                  <Tooltip title="订单的总数量">
                      订单量&nbsp;<Icon type="exclamation-circle-o"/>
                  </Tooltip>
                </span>
              </div>
            </li>
            <li>
              <div>
                <p style={{color:"#51C193",marginBottom:'0'}}>
                    <i>¥</i>
                    {this.state.rpDayAccount.rechargeAmount&&this.state.rpDayAccount.rechargeAmount!="0"?this.state.rpDayAccount.rechargeAmount.split('.')[0]:"0"}
                    <span>
                    .
                    {this.state.rpDayAccount.rechargeAmount&&this.state.rpDayAccount.rechargeAmount!="0"?this.state.rpDayAccount.rechargeAmount.split('.')[1]:"00"}
                    </span>
                </p>
                <span className="explain-span">
                    <Tooltip title="充值订单的总金额">
                        充值金额&nbsp;<Icon type="exclamation-circle-o"/>
                    </Tooltip>
                </span>
              </div>
            </li>
          </ul>
        </div>
        {/*搜索部分 */}
        <Form className="search-form day-zhang">
          <FormItem
           className="daily-billTime"
           label="订单时间"
           labelCol={{ span: 5 }}
           wrapperCol={{span: 10}}>
              <RangePicker
                allowClear={false}
                // disabledDate={this.setDisabledDate.bind(this)}
                // ranges={{ range: moment["2017-09-01","2017-10-01"] }}
                value={this.state.startDate?[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]:null}
                format={dateFormat}
                onChange={this.dateChange.bind(this)} />
          </FormItem>
          <FormItem
            label="订单分类"
            labelCol={{ span: 5 }}
            wrapperCol={{span: 10}}>
              {getFieldDecorator('type', {
                  initialValue:"-1",
                  onChange:this.changeType
              })(
                  <Select>
                    <Option value="-1">全部分类</Option>
                    <Option value="1">销售订单</Option>
                    <Option value="2">充值订单</Option>
                    <Option value="3">退货订单</Option>
                  </Select>
              )}
          </FormItem>
          <FormItem
            label="订单来源"
            labelCol={{ span: 5 }}
            wrapperCol={{span: 10}}>
              {getFieldDecorator('source', {
                    initialValue:0,
                    onChange:this.changeSource
                })(
                    <Select>
                      <Option key={0} value={0}>全部</Option>
                      <Option key={1} value={1}>POS</Option>
                      <Option key={2} value={2}>APP</Option>
                    </Select>
              )}
          </FormItem>
          <FormItem>
              <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
          </FormItem>
          <div className="export-div">
              <Button className="export-btn" onClick={this.exportList.bind(this)}>导出数据</Button>
          </div>
        </Form>
        <CommonTable
            columns={columns}
            dataSource={this.state.dataSource}
            pagination={false}
            total={this.state.total}
            current={this.state.currentPage+1}
            pageSize={this.state.limit}
            onShowSizeChange={this.onShowSizeChange}
            pageChange={this.pageChange}/>
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
}

function mapStateToProps(state){
   return {};
}

const DailyBill = Form.create()(DailyBillForm);

export default connect(mapStateToProps)(DailyBill);
