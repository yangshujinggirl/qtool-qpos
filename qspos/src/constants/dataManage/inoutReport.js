import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import { Link } from 'dva/router';
import NP from 'number-precision';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import moment from 'moment';
import {GetServerData} from '../../services/services';
import './inoutReport.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker,MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM';

const OtherCost = ({visible, onCancel, data}) => (
  <Modal
    className="other-cost-modal"
    title="其他成本明细"
    visible={visible}
    onCancel={()=>onCancel()}
    footer={null}>
    <div className="main-content">
      <Table
        className="other-table"
        bordered
        dataSource={data}
        pagination={false}>
        <Table.Column dataIndex="returnSum" title="退货总成本"></Table.Column>
        <Table.Column dataIndex="adjustSum" title="损益总成本"></Table.Column>
        <Table.Column dataIndex="pdExchangeSum" title="调出总成本"></Table.Column>
        <Table.Column dataIndex="otherSum" title="总计"></Table.Column>
      </Table>
      <div className="tips-list">
        <p className="label total-label">字段说明：</p>
        <p className="label">退货总成本：所有商品退货成本总和</p>
        <p className="label">损益总成本：所有商品损益成本总和</p>
        <p className="label">调出总成本：所有商品调出成本总和</p>
        <p className="label total-label">总计：退货总成本+损益总成本-调出总成本</p>
      </div>
    </div>
  </Modal>
)

//进销存报表
class InOutReportForm extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          dataSource:[],
          finalInvAmountSum:"",//#String 期末库存总成本
          invAmountSum:"",//#String 期初库存总成本
          receiptAmountSum:"",//#String 收货总成本
          saleAmountSum:"",//#String 销售总成本
          adjustPdCheckAmountSum:"",//#String 损益总成本
          total:0,
          currentPage:0,
          limit:10,
          rpDate:'',
          name:'',
          windowHeight:'',
          loading:false,
          visible:false,
          rpInventoryHeaderVo:[],//其他成本
          others:{}
      };
      this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
        },{
            title: '商品名称',
            dataIndex: 'pdSpuName',
        },{
            title: '商品分类',
            dataIndex: 'pdCategory1',
        },{
            title: '规格',
            dataIndex: 'displayName',
        },{
            title: '期初库存数量',
            dataIndex: 'qty',
        },{
            title: '期初库存成本',
            dataIndex: 'invAmount',
        },{
            title: '收货数量',
            dataIndex: 'recQty',
        },{
            title: '收货成本',
            dataIndex: 'recAmount',
        },{
            title: '销售数量',
            dataIndex: 'posQty',
        },{
            title: '销售成本',
            dataIndex: 'sumCostAmount',
        },{
            title: '退货数量',
            dataIndex: 'returnQty',
        },{
            title: '退货成本',
            dataIndex: 'returnSumAmount',
        },{
            title: '损益数量',
            dataIndex: 'adjustQty',
        },{
            title: '损益成本',
            dataIndex: 'adjustCostAmount',
        },/*{
            title: '盘点损益数',
            dataIndex: 'checkQty',
        },{
            title: '盘点损益成本',
            dataIndex: 'checkAmount',
        },*/{
            title: '调出数量',
            dataIndex: 'pdExchangeQty',
        },{
            title: '调出成本',
            dataIndex: 'pdExchangeAmount',
        },{
            title: '期末库存数量',
            dataIndex: 'finalQty',
        },{
            title: '期末库存成本',
            dataIndex: 'finalInvAmount',
        }];
  }
  componentDidMount(){
    this.getNowFormatDate();
  }
  dateChange = (date, dateString) =>{
      this.setState({
          rpDate:dateString
      });
  }
  //表格的方法
  pageChange=(page,pageSize)=>{
      const self = this;
      this.setState({
          currentPage:page-1
      },function(){
          let data = {
              currentPage:this.state.currentPage,
              limit:this.state.limit,
              time:this.state.rpDate,
              name:this.state.name
          }
          self.getServerData(data);
      });
  }
  onShowSizeChange=(current, pageSize)=>{
      const self = this;
      this.setState({
          limit:pageSize,
          currentPage:0
      },function(){
          let data = {
              currentPage:this.state.currentPage,
              limit:this.state.limit,
              time:this.state.rpDate,
              name:this.state.name
          };
          self.getServerData(data);
      })
  }
  formatData(value) {
    value = String(value);
    // others.otherSum.split('.')[0]
    if(value.indexOf('.')!=-1) {
      value = value.split('.');
      return value;
    } else {
      value = [value,'00'];
      return value;
    }
  }
  //获取数据
  getServerData = (values) =>{
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    GetServerData('qerp.qpos.rp.inventory.page',values)
    .then((json) => {
      if(json.code=='0'){
        let dataList = [];
        dataList = json.inventorys;
        let finalInvAmountSum = json.finalInvAmountSum;
        let invAmountSum = json.invAmountSum;
        let receiptAmountSum = json.receiptAmountSum;
        let saleAmountSum = json.saleAmountSum;
        let adjustPdCheckAmountSum = json.adjustPdCheckAmountSum;
        for(let i=0;i<dataList.length;i++){
            dataList[i].key = i+1;
        };
        let others = json.rpInventoryHeaderVo;
        for(let key in others) {
          others[key]= NP.round(others[key], 2)
        };
        others.key = 0;
        this.setState({
          finalInvAmountSum:finalInvAmountSum,//#String 期末库存总成本
          invAmountSum:invAmountSum,//#String 期初库存总成本
          receiptAmountSum:receiptAmountSum,//#String 收货总成本
          saleAmountSum:saleAmountSum,//#String 销售总成本
          adjustPdCheckAmountSum:adjustPdCheckAmountSum,//#String 损益总成本

          dataSource:dataList,
          total:Number(json.total),
          currentPage:Number(json.currentPage),
          limit:Number(json.limit),
          loading:false,
          others,
          rpInventoryHeaderVo:[others]
        });
      }else{
        message.error(json.message);
      }
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:false
      })
    })
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    const self = this;
    this.props.form.validateFields((err, values) => {
      this.setState({
          name:values.name
      },function(){
          let data = {
              currentPage:0,
              limit:this.state.limit,
              time:this.state.rpDate,
              name:this.state.name
          }
          self.getServerData(data);
      })
    })
  }
  //导出数据
  exportList = () =>{
    let data = {
        rpDate:this.state.rpDate,
        name:this.state.name
    }
    GetServerData('qerp.qpos.rp.inventory.export',data)
    .then((json) => {
      if(json.code=='0'){

      }else{
          message.error(json.message);
      }
    })
  }
  //获取当前时间
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
        month = "12";
        year = year-1;
    }
    var currentdate = year + seperator1 + month;
    this.setState({
        rpDate:currentdate
    },()=>{
        let values = {
            currentPage:0,
            limit:10,
            time:this.state.rpDate,
            name:this.state.name
        };
        self.getServerData(values);
    })
  }
  //显示Modal
  showModal() {
    this.setState({ visible:true })
  }
  onCancel() {
    this.setState({ visible:false })
  }
  render() {
    const { visible, others, rpInventoryHeaderVo } =this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="daily-bill border-top-style InOutReport-contents-pages">
        <div className="scroll-wrapper">
          {/* 数据展示部分 */}
          <div className="top-data inout-data">
              <ul>
                  <li>
                      <div>
                          <p style={{color:"#806EC6",marginBottom:'0'}}><i>¥</i>
                          {this.state.finalInvAmountSum&&this.state.finalInvAmountSum!="0"?this.state.finalInvAmountSum.split('.')[0]:"0"}
                          <span>.{this.state.finalInvAmountSum&&this.state.finalInvAmountSum!="0"?this.state.finalInvAmountSum.split('.')[1]:"00"}</span>
                          </p>
                          <span className="explain-span">
                              <Tooltip title="期初库存总成本 + 收货总成本 - 销售总成本 + 其他成本">
                                  期末库存总成本&nbsp;<Icon type="exclamation-circle-o"/>
                              </Tooltip>
                          </span>
                      </div>
                  </li>
                  <li>
                      <div>
                          <p style={{color:"#F4A314",marginBottom:'0'}}><i>¥</i>
                          {this.state.invAmountSum&&this.state.invAmountSum!="0"?this.state.invAmountSum.split('.')[0]:"0"}
                          <span>.{this.state.invAmountSum&&this.state.invAmountSum!="0"?this.state.invAmountSum.split('.')[1]:"00"}</span>
                          </p>
                          <span className="explain-span">
                              <Tooltip title="查询时间范围内，该门店上期期末成本">
                                  期初库存总成本&nbsp;<Icon type="exclamation-circle-o"/>
                              </Tooltip>
                          </span>
                      </div>
                  </li>
                  <li>
                      <div>
                          <p style={{color:"#0D89C8",marginBottom:'0'}}><i>¥</i>
                          {this.state.receiptAmountSum&&this.state.receiptAmountSum!="0"?this.state.receiptAmountSum.split('.')[0]:"0"}
                          <span>. {this.state.receiptAmountSum&&this.state.receiptAmountSum!="0"?this.state.receiptAmountSum.split('.')[1]:"00"}</span>
                          </p>
                          <span className="explain-span">
                              <Tooltip title="查询时间范围内，该门店各商品收货成本总和">
                                  收货总成本&nbsp;<Icon type="exclamation-circle-o"/>
                              </Tooltip>
                          </span>
                      </div>
                  </li>
                  <li>
                      <div>
                          <p style={{color:"#FB6349",marginBottom:'0'}}><i>¥</i>
                          {this.state.saleAmountSum&&this.state.saleAmountSum!="0"?this.state.saleAmountSum.split('.')[0]:"0"}
                          <span>.{this.state.saleAmountSum&&this.state.saleAmountSum!="0"?this.state.saleAmountSum.split('.')[1]:"00"}</span>
                          </p>
                          <span className="explain-span">
                              <Tooltip title="查询时间范围内，该门店各商品销售成本总和">
                                  销售总成本&nbsp;<Icon type="exclamation-circle-o"/>
                              </Tooltip>
                          </span>
                      </div>
                  </li>
                  <li>
                    <div onClick={this.showModal.bind(this)} style={{cursor:'pointer'}}>
                      <p style={{color:"#51C193",marginBottom:'0',cursor:'pointer'}} >
                        <i>¥</i>
                        {
                          others.otherSum&&this.formatData(others.otherSum)[0]
                        }
                        <span>.
                          {
                            others.otherSum&&this.formatData(others.otherSum)[1]
                          }
                        </span>
                      </p>
                      <span className="explain-span">
                      <Tooltip>
                        <span style={{color:"#51C193"}}>其他成本>></span>
                      </Tooltip>
                      </span>
                    </div>
                  </li>
              </ul>
          </div>
          {/*搜索部分 */}
          <Form className="search-form inout-form">
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
              {getFieldDecorator('name')(
                  <Input  autoComplete="off" placeholder="请输入商品名称"/>
              )}
              </FormItem>
              <FormItem>
                  <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
              </FormItem>
              {/* <div className="export-div">
                  <Button className="export-btn" onClick={this.exportList.bind(this)}>导出数据</Button>
              </div> */}
          </Form>
          <CommonTable
              scroll={'130%'}
              columns={this.columns}
              dataSource={this.state.dataSource}
              pagination={false}
              total={20}
              current={1}
              pageSize={10}
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
            pageSizeOptions={['10','12','15','17','20','50','100','200']}/>
        </div>
        <OtherCost
          data={rpInventoryHeaderVo}
          visible={visible}
          onCancel={this.onCancel.bind(this)}/>
      </div>
    );
  }
}

function mapStateToProps(state){
   return {};
}

const InOutReport = Form.create()(InOutReportForm);

export default connect(mapStateToProps)(InOutReport);
