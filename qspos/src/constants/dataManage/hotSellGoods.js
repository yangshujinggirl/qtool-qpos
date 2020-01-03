import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Pagination} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import moment from 'moment';
import {GetServerData} from '../../services/services';
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
        onSale:1,
        pdCategoryId1:0,
        pdCategoryList:[]
    };
    this.columns = [
      {
        title: '排名',
        dataIndex: 'index',
        render:(text, record, index) =>{
            return <span>{index+1}</span>
        }
      },{
          title: '商品条码',
          dataIndex: 'barcode',
      },{
          title: '商品名称',
          dataIndex: 'name',
      },{
          title: '商品分类',
          dataIndex: 'pdCategory1Name',
      },{
          title: '规格',
          dataIndex: 'displayName',
      },{
          title: '门店在售',
          dataIndex: 'onSale',
          render:(text,record,index)=> {
            return <span>
              {
                record.onSale=='1'?'是':'否'
              }
            </span>
          }
      },{
          title: '销售数量',
          dataIndex: 'qty',
      },{
          title: '销售金额',
          dataIndex: 'amount',
      },{
          title: '商品剩余库存',
          dataIndex: 'invQty',
      }];
  }
  componentDidMount(){
    this.getNowFormatDate();
    this.getPdCategoriList()
  }
  //获取数据
  getPdCategoriList = () =>{
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    GetServerData('qerp.pos.pd.category.list',{})
    .then((res) => {
      const { code, pdCategories } =res;
      if(code=='0'){
        this.setState({ pdCategoryList: pdCategories })
      }else{
          message.error(message);
      }
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:false
      })
    })
  }
  getNowFormatDate = () =>{
    const self =this;
    var curDate = new Date();
    var date = new Date(curDate.getTime() - 24*60*60*1000); //前一天;
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
    },()=>{
      self.getServerData();
    })
  }
  //获取数据
  getServerData = () =>{
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    const { currentPage, limit, startDate, endDate, onSale, pdCategoryId1 } =this.state;
    let params = { currentPage, limit, startDate, endDate, onSale, pdCategoryId1 };
    GetServerData('qerp.pos.rp.pd.sell.list',params)
    .then((json) => {
      if(json.code=='0'){
        let dataList = json.analysis;
        if(dataList.length>0){
          for(let i=0;i<dataList.length;i++){
              dataList[i].key = i+1;
          }
        }
        this.setState({
            dataSource:dataList,
            total:Number(json.total),
            currentPage:Number(json.currentPage),
            limit:Number(json.limit)
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
  onSelectPdCategory=(value)=> {
    this.setState({ pdCategoryId1:value })
  }
  onSelectYs=(value)=> {
    this.setState({ onSale:value })
  }
  //时间改变
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
      self.getServerData();
    });
  }
  onShowSizeChange=({currentPage, limit})=>{
    const self = this;
    this.setState({
      limit:limit,
      currentPage:0
    },()=>{
      self.getServerData();
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { onSale, pdCategoryId1, pdCategoryList, dataSource, total, currentPage, limit } =this.state;

    return (
        <div className="hot-sell">
            <div className="scroll-wrapper">
                {/*搜索部分 */}
                <Form className="search-form hot-goods">
                    <FormItem
                      label="选择时间"
                      labelCol={{ span: 5 }}
                      wrapperCol={{span: 10}}>
                        <RangePicker
                            allowClear={false}
                            value={this.state.startDate?[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]:null}
                            format={dateFormat}
                            onChange={this.dateChange.bind(this)} />
                    </FormItem>
                    <FormItem
                      label="商品分类"
                      labelCol={{ span: 5 }}
                      wrapperCol={{span: 10}}>
                      <Select onSelect={this.onSelectPdCategory} value={pdCategoryId1}>
                        <Option value={0}>全部</Option>
                          {
                            pdCategoryList.map((el,index)=> (
                              <Option value={el.pdCategoryId} key={el.pdCategoryId}>{el.name}</Option>
                            ))
                          }
                      </Select>
                    </FormItem>
                    <FormItem
                      label="是否在售"
                      labelCol={{ span: 5 }}
                      wrapperCol={{span: 10}}>
                      <Select onSelect={this.onSelectYs} value={onSale}>
                        <Option value={1} key={1}>是</Option>
                        <Option value={0} key={0}>否</Option>
                      </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.getServerData.bind(this)}>搜索</Button>
                    </FormItem>
                </Form>
                <div className="hotSell-wrapper add-norecord-img">
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
                    <Qtable
                      columns={this.columns}
                      dataSource={dataSource}/>
                    {
                      dataSource.length>0&&
                      <Qpagination
                        sizeOptions="2"
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.pageChange}
                        data={{ total, currentPage, limit }}/>
                    }
                </div>
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
