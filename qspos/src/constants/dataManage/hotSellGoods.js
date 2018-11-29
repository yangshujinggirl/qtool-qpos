import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Pagination} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import CommonTable from './commonTable';
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
      };
      this.columns = [{
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
          title: '规格',
          dataIndex: 'displayName',
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
    //获取当前时间
    this.getNowFormatDate();
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
      const self = this;
      this.setState({
          currentPage:page-1
      },function(){
          let data = {
              currentPage:this.state.currentPage,
              limit:10,
              startDate:this.state.startDate,
              endDate:this.state.endDate
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
          startDate:this.state.startDate,
          endDate:this.state.endDate
      };
      self.getServerData(data);
    })
  }
  //获取数据
  getServerData = (values) =>{
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    GetServerData('qerp.pos.rp.pd.sell.list',values)
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
      let values = {
          currentPage:0,
          limit:10,
          startDate:this.state.startDate,
          endDate:this.state.endDate
      }
      self.getServerData(values);
    })
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let data = {
          currentPage:0,
          limit:this.state.limit,
          startDate:this.state.startDate,
          endDate:this.state.endDate
      }
      this.getServerData(data);
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
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
                    <CommonTable
                        columns={this.columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        total={this.state.total}
                        current={this.state.currentPage}
                        pageSize={10}
                        onShowSizeChange={this.onShowSizeChange}
                        pageChange={this.pageChange}
                        locale={true}
                        />
                </div>
            </div>
            {/* <div className="footer-pagefixed">
                <Pagination
                    total={this.state.total}
                    current={this.state.currentPage+1}
                    pageSize={this.state.limit}
                    // showSizeChanger
                    // onShowSizeChange={this.onShowSizeChange}
                    onChange={this.pageChange}
                    // pageSizeOptions={['10','12','15','17','20','50','100','200']}
                    />
            </div> */}
        </div>
    );
  }
}

function mapStateToProps(state){
   return {};
}

const HotSellGoods = Form.create()(HotSellGoodsForm);

export default connect(mapStateToProps)(HotSellGoods);
