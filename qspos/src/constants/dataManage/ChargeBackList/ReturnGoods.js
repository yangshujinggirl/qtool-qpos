import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Qpagination from '../../../components/Qpagination';
import Qtable from '../../../components/Qtable';
import ReturnFilterForm from './components/ReturnFilterForm';
import {　ReturnColumns　} from './columns';
import './ReceiveGoods.less';

class ReturnGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{
        createrTime:'',
        returnType:0,
        asnNo:''
      },
      createTimeST:'',
      createTimeET:''
    }
  }
  componentDidMount() {
    this.initPage()
  }
  initPage() {
    const now = moment();
    // console.log(now)
    const createTimeET = now.format("YYYY-MM-DD");
    const createTimeST = now.subtract(1, "months").format("YYYY-MM-DD");
    this.setState({ createTimeST, createTimeET });
    this.props.dispatch({
      type:'chargeBackList/fetchReturnList',
      payload:{ createTimeST, createTimeET ,...this.state.fields}
    })
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  handleEvent=(value)=> {
    this.props.dispatch({
        type:'dataManage/initKey',
        payload: "4"
    })
    sessionStorage.setItem('chargeBackDetail',JSON.stringify(value))
    this.context.router.push(`/chargeBack/return/${value.pdOrderId}`);
  }
  searchData=(values)=> {
    this.props.dispatch({
      type:'chargeBackList/fetchReturnList',
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
      type:'chargeBackList/fetchReturnList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields}
    this.props.dispatch({
      type:'chargeBackList/fetchReturnList',
      payload: values
    });
  }
  render() {
    const { returnList, data } =this.props.chargeBackList;
    const { fields, createTimeST, createTimeET } =this.state;
    return(
      <div className="receive-goods-components-wrap">
        <div className="middle-action">
          <ReturnFilterForm
            {...fields}
            startDate={createTimeST}
            endDate={createTimeET}
            onValuesChange={this.handleFormChange}
            submit={this.searchData}/>
        </div>
        <div className="bottom-action">
          <Qtable
            onOperateClick={this.handleEvent}
            columns={ReturnColumns}
            dataSource={returnList}/>
          {
            returnList.length>0&&
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
    const { chargeBackList } = state;
    return { chargeBackList };
}
export default connect(mapStateToProps)(ReturnGoods);
