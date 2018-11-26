import React from 'react';
import {
  Table,
  Input, Icon,Row, Col,
  Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import moment from 'moment';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';

import {timeForMats} from '../../utils/commonFc';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
import './FreightDetail.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker  } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const columns = [{
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
  }, {
    title: '配送费用',
    dataIndex: 'actualExpressAmount',
    key: 'actualExpressAmount',
  }, {
    title: '订单时间',
    dataIndex: 'orderCreateTime',
    key: 'orderCreateTime',
  }];

class SearchForm extends React.Component {
  search() {
    this.props.form.validateFields((er,values) => {
      this.props.handleSearch('0','15')
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startDate, endDate, upDatePointType, upDateDateTime } = this.props;
    return(
      <Form className="freight-detail-forms">
        <div className="form-wrap">
          <FormItem label="订单时间" labelCol={{ span: 5 }} wrapperCol={{span: 12}}>
            {
              getFieldDecorator('orderTime',{
                initialValue:[moment(startDate, dateFormat), moment(endDate, dateFormat)],
                onChange:(date,dateString)=>upDateDateTime(date,dateString)
              })(
                <RangePicker />
              )
            }
          </FormItem>
          <FormItem>
              <Button type="primary" icon="search" onClick={this.search.bind(this)}>搜索</Button>
          </FormItem>
          <div className="export-div">
              <Button className="export-btn" onClick={this.props.exportList}>导出数据</Button>
          </div>
        </div>
      </Form>
    )
  }
}
const SearchFilter = Form.create()(SearchForm);

class FreightDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalData:{},
      list:[],
      total:0,
      currentPage:0,
      limit:10,
      startDate:'',
      endDate:'',
    }
  }
  componentDidMount() {
    this.getNowFormatDate()
  }
  //获取当前时间
  getNowFormatDate = () =>{
      let startRpDate=timeForMats(30).t2;
      let endRpDate=timeForMats(30).t1;
      this.setState({
          startDate:startRpDate,
          endDate:endRpDate
      },()=> {
        this.getList()
      })
  }
  //更新时间
  upDateDateTime(date,dateString) {
    this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
    })
  }

  exportList() {
    const { startDate, endDate, currentPage,limit} =this.state;
    let params = {
      startDate,
      endDate,
      currentPage,
      limit
    }
    GetExportData('qerp.pos.app.deliveryfee.export',params)
  }
  getList() {
    let { startDate, endDate, currentPage, limit } = this.state;
    let params = {
          startDate,
          endDate,
          currentPage,
          limit
        }
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:true
        })
    GetServerData('qerp.pos.app.deliveryFee.query',params)
    .then((res) => {
      if(res.code != '0') {
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:false
        })
        message.error(res.message);
        return;
      }
      let { limit, total, currentPage, listDeliveryFeeVos,  rpDeliveryFeeHead } =res;
      listDeliveryFeeVos = listDeliveryFeeVos?listDeliveryFeeVos:[];
      listDeliveryFeeVos.length>0&&listDeliveryFeeVos.map((el,index) =>el.key= index);
      this.setState({
        total:Number(total),
        currentPage:Number(currentPage),
        limit:Number(limit),
        totalData:rpDeliveryFeeHead,
        list:listDeliveryFeeVos
      })
      this.props.dispatch({
        type:'spinLoad/setLoading',
        payload:false
      })
    },(err) => {
      console.log(err)
    })
  }
  onShowSizeChange(values) {
    this.setState({
      limit:values.limit,
      currentPage:values.currentPage
     },()=> {
      this.getList();
    });
  }
  changePage(page, pageSize) {
    page--;
    this.setState({
      currentPage:page
     },()=> {
      this.getList();
    });
  }
  rowClassName=(record, index)=>{
    if (index % 2) {
        return 'table_gray'
    }else{
        return 'table_white'
    }
  }
  render() {
    let { totalData, list, currentPage, total, limit, startDate, endDate } = this.state;
    const data = { total, limit, currentPage };
    return(
      <div className="freight-detail-pages">
        <SearchFilter
          startDate={startDate}
          endDate={endDate}
          exportList={this.exportList.bind(this)}
          upDateDateTime={this.upDateDateTime.bind(this)}
          handleSearch={this.getList.bind(this)}/>
        <div className="total-datas">
          共<span className="num">{totalData.totalOrders}</span>单，
          配送费用<span className="num">{totalData.totalExpressAmount}</span>元
        </div>
          <Qtable
            columns={columns}
            dataSource={list}/>
          {
            list.length>0&&
              <Qpagination
                sizeOptions="2"
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                onChange={this.changePage.bind(this)}
                data={data}/>
          }
      </div>
    )
  }
}

export default FreightDetail;
