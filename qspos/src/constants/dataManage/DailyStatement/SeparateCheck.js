import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Qpagination from '../../../components/Qpagination';
import Qtable from '../../../components/Qtable';
import FilterForm from './components/FilterForm';
import './SaleCheck.less';

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

class SaleCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{
        createrTime:'',
        type:'',
        source:0
      },
      startDate:'',
      endDate:''
    }
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.initPage()
  }
  initPage() {
    const now = moment();
    // console.log(now)
    const endDate = now.format("YYYY-MM-DD");
    const startDate = now.subtract(1, "months").format("YYYY-MM-DD");
    this.setState({ startDate, endDate });
    this.props.dispatch({
      type:'dailyCheck/fetchSaleList',
      payload:{ startDate, endDate ,...this.state.fields}
    })
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  searchData=(values)=> {
    this.props.dispatch({
      type:'dailyCheck/fetchSaleList',
      payload: values
    });
  }
  //分页
  changePage = (currentPage) => {
    currentPage--;
    let paramsObj = {
      currentPage,
    }
    let { fields } = this.state;
    paramsObj ={...paramsObj,...fields}
    this.props.dispatch({
      type:'dailyCheck/fetchSaleList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields}
    this.props.dispatch({
      type:'dailyCheck/fetchSaleList',
      payload: values
    });
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
  render() {
    const { saleDataList, data } =this.props.dailyCheck;
    const { fields, startDate, endDate } =this.state;
    return(
      <div className="sale-check-components-wrap">
        <div className="middle-action">
          <FilterForm
            {...fields}
            startDate={startDate}
            endDate={endDate}
            onValuesChange={this.handleFormChange}
            submit={this.searchData}/>
        </div>
        <div className="bottom-action">
          <Qtable
            columns={columns}
            dataSource={saleDataList}/>
          {
            saleDataList.length>0&&
            <Qpagination
              sizeOptions="2"
              onShowSizeChange={this.changePageSize}
              onChange={this.changePage}
              data={data}/>
          }
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { dailyCheck } = state;
    return { dailyCheck };
}
export default connect(mapStateToProps)(SaleCheck);
