import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import {GetExportData} from '../../../services/services';
import Qpagination from '../../../components/Qpagination';
import Qtable from '../../../components/Qtable';
import SeparFilterForm from './components/SeparFilterForm';
import './SaleCheck.less';

const columns = [{
      title: '订单号',
      dataIndex: 'orderNo',
  },{
      title: '业务类型',
      dataIndex: 'orderType',
  },{
      title: '订单分类',
      dataIndex: 'shareType',
  },{
      title: '分成金额',
      dataIndex: 'shareProfitAmount',
  },{
      title: '订单完成时间',
      dataIndex: 'createTime',
  }];

class SaleCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{
        createrTime:'',
        orderType:0,
        shareType:0
      },
      createtimeST:'',
      createtimeET:''
    }
  }
  componentDidMount() {
    this.initPage()
  }
  initPage() {
    const now = moment();
    const createtimeET = now.format("YYYY-MM-DD");
    const createtimeST = now.subtract(1, "months").format("YYYY-MM-DD");
    this.setState({
      createtimeST,
      createtimeET,
      fields:{...this.state.fields,createrTime:[createtimeST,createtimeET]}
     });
     this.props.dispatch({
       type:'dailyCheck/resetData',
       payload:{}
     })
    this.props.dispatch({
      type:'dailyCheck/fetchSeparateList',
      payload:{ createtimeST, createtimeET ,...this.state.fields}
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
      type:'dailyCheck/fetchSeparateList',
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
      type:'dailyCheck/fetchSeparateList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields}
    this.props.dispatch({
      type:'dailyCheck/fetchSeparateList',
      payload: values
    });
  }
  //导出数据
  exportData = () =>{
    let { createrTime, ...params} =this.state.fields;
    if(createrTime&&createrTime.length>0) {
      params.createtimeST = moment(createrTime[0]).format('YYYY-MM-DD');
      params.createtimeET = moment(createrTime[1]).format('YYYY-MM-DD');
    }
    const res= GetExportData('qerp.pos.rp.share.profit.export',params)
  }
  render() {
    const { separateList, separateData, data } =this.props.dailyCheck;
    const { fields, createtimeST, createtimeET } =this.state;
    return(
      <div className="sale-check-components-wrap">
        <div className="middle-action">
          <SeparFilterForm
            {...fields}
            startDate={createtimeST}
            endDate={createtimeET}
            onValuesChange={this.handleFormChange}
            submit={this.searchData}
            exportData={this.exportData}/>
          <div className="total-data">
            共<span className="num">{separateData.orderNum}</span>单，合计分成
            <span className="num">{separateData.shareProfitSumAmount}</span>元
          </div>
        </div>
        <div className="bottom-action">
          <Qtable
            columns={columns}
            dataSource={separateList}/>
          {
            separateList.length>0&&
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
