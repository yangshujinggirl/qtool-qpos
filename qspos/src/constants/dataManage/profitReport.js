import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import moment from 'moment';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker,MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM';

const columns = [{
      title: '商品条码',
      dataIndex: 'barcode',
  },{
      title: '商品名称',
      dataIndex: 'name',
  },{
      title: '商品分类',
      dataIndex: 'pdCategory1',
  },{
      title: '规格',
      dataIndex: 'displayName',
  },{
      title: '销售单均价',
      dataIndex: 'saleSinglePrice',
  },{
      title: '净销售数量',
      dataIndex: 'qty',
  },{
      title: '净销售额',
      dataIndex: 'amount',
  },{
      title: '商品成本',
      dataIndex: 'pdCostAmount',
  },{
      title: '净销售成本',
      dataIndex: 'sumCostAmount',
  },{
      title: '净销售毛利额',
      dataIndex: 'saleProfitAmount',
  },{
      title: '净销售毛利率',
      dataIndex: 'saleProfitRate',
  },{
      title: '调拨数量',
      dataIndex: 'pdExchangeQty',
  },{
      title: '调拨总额',
      dataIndex: 'pdExchangeAmount',
  },{
      title: '调拨成本',
      dataIndex: 'pdExchangeCostAmount',
  },{
      title: '商品毛利额',
      dataIndex: 'pdProfit',
  }];

//利润报表
class ProfitReportForm extends React.Component {
    constructor(props) {
      super(props);
      this.state={
          dataSource:[],
          rpProfit:{
              amount:"",
              saleCostAmount:"",
              profitAmount:""
          },
          total:0,
          currentPage:0,
          limit:10,
          rpDate:'',
          name:'',
          windowHeight:'',
          source:0
      };
    }
    componentDidMount(){
        this.getNowFormatDate();
    }
    getNowFormatDate = () =>{
        const self = this;
        var date = new Date(); //前一天;
        var seperator1 = "-";
        var month = date.getMonth();
        let year = date.getFullYear();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if(month == 0){
            month = "12"
            year = year-1;
        }
        var currentdate = year + seperator1 + month;
        this.setState({
            rpDate:currentdate?(currentdate+"-01"):''
        },()=>{
            self.getServerData();
        })
    }
    //获取数据
    getServerData = (values) =>{
      let params = {
        currentPage:0,
        limit:10,
        rpDate:this.state.rpDate,
        source:this.state.source,
        name:this.state.name
      }
      if(values) {
        params={ ...params, ...values}
      }
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:true
      })
      GetServerData('qerp.pos.rp.profit.page',params)
      .then((json) => {
        if(json.code=='0'){
            let dataList = [];
            dataList = json.rpProfits;
            for(let i=0;i<dataList.length;i++){
                dataList[i].key = i+1;
            };
            let  rpProfit = json.rpProfit;
            this.setState({
                rpProfit:rpProfit,
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
    dateChange = (date, dateString) =>{
      dateString=`${dateString}-01`
      this.setState({
          rpDate:dateString
      });
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
      const self = this;
      this.props.form.validateFields((err, values) => {
          self.getServerData();
      })
    }
    //导出数据
    exportList = () =>{
        let data = {
            // rpDate:this.state.rpDate?(this.state.rpDate+"-01"):"",
            rpDate:this.state.rpDate?this.state.rpDate:"",
            name:this.state.name
        }
        const result=GetExportData('qerp.pos.rp.profit.export',data);
    }
    //获取当前时间
    changeSource=(value)=> {
      this.setState({ source: value })
    }
    changeName=(e)=> {
      let value = e.nativeEvent.target.value;
      this.setState({ name: value })
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div className="daily-bill border-top-style lirun-data-con">
          <div className="scroll-wrapper">
            {/* 数据展示部分 */}
            <div className="top-data">
              <ul>
                <li>
                  <div>
                    <p style={{color:"#FB6349",marginBottom:'0'}}>
                      <i>¥</i>
                      {this.state.rpProfit.amount&&this.state.rpProfit.amount!="0"?this.state.rpProfit.amount.split('.')[0]:"0"}
                      <span>.{this.state.rpProfit.amount&&this.state.rpProfit.amount!="0"?this.state.rpProfit.amount.split('.')[1]:"00"}</span>
                    </p>
                    <span className="explain-span">
                        <Tooltip title="查询时间范围内，该门店各商品净销售额总和">
                            净销售额&nbsp;<Icon type="exclamation-circle-o"/>
                        </Tooltip>
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <p style={{color:"#F7A303",marginBottom:'0'}}><i>¥</i>
                      {this.state.rpProfit.saleCostAmount&&this.state.rpProfit.saleCostAmount!="0"?this.state.rpProfit.saleCostAmount.split('.')[0]:"0"}
                      <span>.{this.state.rpProfit.saleCostAmount&&this.state.rpProfit.saleCostAmount!="0"?this.state.rpProfit.saleCostAmount.split('.')[1]:"00"}</span>
                    </p>
                    <span className="explain-span">
                        <Tooltip title="查询时间范围内，该门店各商品净销售成本总和">
                            净销售成本&nbsp;<Icon type="exclamation-circle-o"/>
                        </Tooltip>
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <p style={{color:"#F7A303",marginBottom:'0'}}><i>¥</i>
                      {this.state.rpProfit.cutAmount&&this.state.rpProfit.cutAmount!="0"?this.state.rpProfit.cutAmount.split('.')[0]:"0"}
                      <span>.{this.state.rpProfit.cutAmount&&this.state.rpProfit.cutAmount!="0"?this.state.rpProfit.cutAmount.split('.')[1]:"00"}</span>
                    </p>
                    <span className="explain-span">
                      <Tooltip title="查询时间范围内，该门店各销售订单抹零金额总和 - 各退货订单抹零总和">
                          抹零金额&nbsp;<Icon type="exclamation-circle-o"/>
                      </Tooltip>
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <p style={{color:"#51C193",marginBottom:'0'}}><i>¥</i>
                      {this.state.rpProfit.profitAmount&&this.state.rpProfit.profitAmount!="0"?this.state.rpProfit.profitAmount.split('.')[0]:"0"}
                      <span>. {this.state.rpProfit.profitAmount&&this.state.rpProfit.profitAmount!="0"?this.state.rpProfit.profitAmount.split('.')[1]:"00"}</span>
                    </p>
                    <span className="explain-span">
                      <Tooltip title="净销售额 - 净销售成本 - 抹零金额">
                          净销售毛利&nbsp;<Icon type="exclamation-circle-o"/>
                      </Tooltip>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            {/*搜索部分 */}
            <Form className="search-form lirun-data">
              <FormItem
                label="订单时间"
                labelCol={{ span: 5 }}
                wrapperCol={{span: 10}}>
                  <MonthPicker
                  allowClear={false}
                  value={this.state.rpDate?moment(this.state.rpDate, dateFormat):null}
                  format={dateFormat}
                  onChange={this.dateChange.bind(this)}/>
              </FormItem>
              <FormItem
                label="商品名称"
                labelCol={{ span: 5 }}
                wrapperCol={{span: 10}}>
                  {getFieldDecorator('name',{
                    onChange:this.changeName
                  })(
                      <Input autoComplete="off" placeholder="请输入商品名称"/>
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
              total={20}
              current={1}
              pageSize={10}
              onShowSizeChange={this.onShowSizeChange}
              pageChange={this.pageChange}/>
          </div>
          {
            this.state.dataSource.length>0&&
            <div className="footer-pagefixed">
              <Pagination
                total={this.state.total}
                current={this.state.currentPage+1}
                pageSize={this.state.limit}
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.pageChange}
                pageSizeOptions={['10','12','15','17','20','50','100','200']}/>
            </div>
          }
        </div>
      );
    }
}

function mapStateToProps(state){
   return {};
}

const ProfitReport = Form.create()(ProfitReportForm);

export default connect(mapStateToProps)(ProfitReport);
