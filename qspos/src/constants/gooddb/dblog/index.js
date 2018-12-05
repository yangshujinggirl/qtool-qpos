import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,AutoComplete} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../../services/services';
import {GetExportData} from '../../../services/services';
import moment from 'moment';
import {timeForMats} from '../../../utils/commonFc';
import DbTextModal from './model'
import "../gooddb.css";

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class AdjustLogIndexForm extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          dataSource:[],
          dataSources:[],
          shopList:[],
          total:0,
          currentPage:0,
          limit:10,
          exchangeTimeStart:"",
          exchangeTimeEnd:"",
          visible:false,
          windowHeight:'',
          modelRemark:'',
          exchangeId:'',
          shopId:'',
          keywords:''
      };
      this._isMounted = false;
      this.columns = [{
            title: '商品调拨单号',
            dataIndex: 'exchangeNo',
            width:'12%',
            render: (text, record, index) => {
                return (
                    <Link to={{pathname:`/dblog/info`,query:{exchangeNo:record.exchangeNo,exchangeId:record.qposPdExchangeId}}}>{text}</Link>
                )
            }
        },{
          title: '需求门店',
          dataIndex: 'inShopName',
          width:'12%',
        },{
            title: '调拨商品数量',
            dataIndex: 'qtySum',
            width:'8%',
        },{
            title: '调拨总价',
            dataIndex: 'amountSum',
            width:'8%',
        },{
            title: '调拨状态',
            dataIndex: 'statusStr',
            width:'8%',
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            width:'12%',
        },{
          title: '门店收货完成时间',
          dataIndex: 'receiveTime',
          width:'12%',
        },{
          title: '操作',
          dataIndex: 'operate',
          width:'5%',
          render:(text,record)=>{
            if(record.status === '10'){
              return <Link onClick={this.showModal.bind(this,record.qposPdExchangeId)}>撤销</Link>
            }
          }
      }];
  }
  componentDidMount(){
      this._isMounted = true;
      if(this._isMounted){
          if(document.body.offsetWidth>800){
              this.setState({
                 windowHeight:document.body.offsetHeight-300,
               });
          }else{
              this.setState({
                  windowHeight:document.body.offsetHeight-320,
              });
          }
          window.addEventListener('resize',this.windowResize.bind(this));
      }
      //获取当前时间
      this.getNowFormatDate();
  }
  componentWillUnmount(){
      this._isMounted = false;
      window.removeEventListener('resize', this.windowResize.bind(this));
  }
  dateChange = (date, dateString) =>{
      this.setState({
          exchangeTimeStart:dateString[0],
          exchangeTimeEnd:dateString[1]
      })
  }
  //表格的方法
  pageChange=(page,pageSize)=>{
    this.setState({
        limit:pageSize,
        currentPage:Number(page)-1
    },function(){
      this.handleSearch()
    })
  }
  onShowSizeChange=(current, pageSize)=>{
    this.setState({
        limit:pageSize,
        currentPage:Number(current)-1
    },function(){
        this.handleSearch()
    })
  }
  handleSearch = (e) =>{
    this.props.form.validateFields((err, values) => {
      values.exchangeTimeStart=this.state.exchangeTimeStart
      values.exchangeTimeEnd=this.state.exchangeTimeEnd
      values.inShopId = this.state.shopId
      values.limit=this.state.limit;
      values.currentPage=this.state.currentPage;
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:true
      })
      GetServerData('qerp.pos.pd.exchange.query',values)
      .then((json) => {
          if(json.code=='0'){
              const exchangeNos = json.exchangeNos;
              for(let i=0;i<exchangeNos.length;i++){
                exchangeNos[i].key = i+1;
              };
              this.setState({
                  dataSource:exchangeNos,
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
    })
  }
  showModal = (record) =>{
    this.setState({
      visible:true,
      exchangeId:record
    })
  }
  handleOk=(values)=>{
    let payload = {
      qposPdExchangeId:this.state.exchangeId,
      cancelRemark:values.cancelRemark
    }
    this.setState({ loading:true })
    GetServerData('qerp.qpos.pd.exchange.cancel',payload)
    .then((json) => {
      if(json.code=='0'){
        message.success('撤销成功')
        this.setState({
          visible:false
        })
        this.handleSearch()
      }else{
        message.error(json.message);
      }
      this.setState({ loading:false })
    })
  }
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  }
  rowClassName=(record, index)=>{
  	if (index % 2) {
    		return 'table_gray'
  	}else{
    		return 'table_white'
  	}
  }
  //获取当前时间
  getNowFormatDate = () =>{
      let startRpDate=timeForMats(30).t2;
      let endRpDate=timeForMats(30).t1;
      this.setState({
          exchangeTimeStart:startRpDate,
          exchangeTimeEnd:endRpDate
      },function(){
          this.handleSearch();
      })
  }
  windowResize = () =>{
      if(!this.refs.tableWrapper){
          return
      }else{
        if(document.body.offsetWidth>800){
            this.setState({
              windowHeight:document.body.offsetHeight-300,
            })
        }else{
            this.setState({
              windowHeight:document.body.offsetHeight-270,
            });
        }
      }
  }
  onSelect =(value) =>{
    let shopList = this.state.shopList
    let shopId
    for(let i=0;i<shopList.length;i++){
      if(shopList[i].name == value){
        shopId = shopList[i].spShopId
      }
    }
    this.setState({
      shopId:shopId
    })
  }
  handleShopSearch = (value) =>{
    let data={name:value};
    GetServerData('qerp.qpos.pd.exchange.shop.list',data)
    .then((json) => {
      if(json.code=='0'){
        let shopList=json.shops;
        let dataSources=[];
        for(let i=0;i<shopList.length;i++){
          dataSources.push(shopList[i].name)
        }
        this.setState({
          shopList:shopList,
          dataSources:dataSources
        })
      }
    })
  }
  onChangeSelect =(e)=> {
    this.setState({ status: e})
  }
  onChangeWords =(e)=> {
    let target =e.nativeEvent.target;
    this.setState({ keywords: target.value })
  }
  exportList = () =>{
    const { shopId, keywords, status, exchangeTimeStart, exchangeTimeEnd } =this.state;
      let data = {
          exchangeTimeStart,
          exchangeTimeEnd,
          keywords,
          status,
          inShopId:shopId
      }
      const result=GetExportData('qerp.pos.pd.exchange.detail.export',data);
  }
  render() {
    const { loading } =this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="adjust-index  dblog-search">
        <div className="form-wrapper">
          <Form className="search-form">
            <FormItem
              className='search-con-data1'
              label="调拨时间"
              labelCol={{ span: 5 }}
              wrapperCol={{span: 10}}>
                <RangePicker
                  value={this.state.exchangeTimeStart?
                        [moment(this.state.exchangeTimeStart, dateFormat), moment(this.state.exchangeTimeEnd, dateFormat)]
                        :null
                      }
                  format={dateFormat}
                  onChange={this.dateChange.bind(this)} />
            </FormItem>
            <FormItem
                label='需求门店'
                labelCol={{ span: 5 }}
                wrapperCol={{span: 10}}>
                { getFieldDecorator('inShopId')(
                  <AutoComplete
                    dataSource={this.state.dataSources}
                    onSelect={this.onSelect.bind(this)}
                    onSearch={this.handleShopSearch.bind(this)}
                    placeholder='请输入调入门店名称'/>
                )}
            </FormItem>
            <FormItem
              label="调拨状态"
              className='db-sp-auto'
              labelCol={{ span: 5 }}
              wrapperCol={{span: 10}}>
                { getFieldDecorator('status',{
                  onChange:this.onChangeSelect
                  })(
                     <Select size='large' style={{marginRight:"10px"}} allowClear={true}>
                        <Option value="10">待收货</Option>
                        <Option value="20">收货中</Option>
                        <Option value="30">已收货</Option>
                        <Option value="40">已撤销</Option>
                      </Select>
                )}
            </FormItem>
            <FormItem className="fr">
              <Button type="primary" onClick={this.handleSearch.bind(this)} size='large'>搜索</Button>
              <div className="export-div">
                  <Button type="primary" onClick={this.exportList.bind(this)} size='large'>导出数据</Button>
              </div>
            </FormItem>
            <FormItem className='search-con-input fr'>
              {getFieldDecorator('keywords',{
                  onChange:this.onChangeWords
                })(
                    <Input  autoComplete="off" placeholder="请输入商品名称/条码/单号"/>
              )}
            </FormItem>
          </Form>
        </div>
        <div className="table-wrapper add-norecord-img" ref="tableWrapper">
          <Table
            bordered
            columns={this.columns}
            dataSource={this.state.dataSource}
            rowClassName={this.rowClassName.bind(this)}
            scroll={{y:this.state.windowHeight}}
            pagination={{
              total:this.state.total,
              current:this.state.currentPage+1,
              defaultPageSize:10,
              pageSize:this.state.limit,
              showSizeChanger:true,
              onShowSizeChange:this.onShowSizeChange,
              onChange:this.pageChange,
              pageSizeOptions:['10','12','15','17','20','50','100','200']}}/>
        </div>
        {
          this.state.visible ?
          <DbTextModal
            loading={loading}
            onCreate={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            visible={this.state.visible}/>
          :
          ''
        }
      </div>
    );
  }
}

const DbLogIndexs =Form.create()(AdjustLogIndexForm);

export default connect()(DbLogIndexs);
