import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Qpagination from '../../../components/Qpagination';
import Qtable from '../../../components/Qtable';
import ReceFilterForm from './components/ReceFilterForm';
import {GetExportData} from '../../../services/services';
import {　ReceiveColumns　} from './columns';
import './ReceiveGoods.less';

class ReceiveGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{
        createrTime:'',
        type:0,
        status:'-1'
      },
      operateStart:'',
      operateEnd:''
    }
  }
  componentDidMount() {
    this.initPage()
  }
  initPage() {
    const now = moment();
    const operateEnd = now.format("YYYY-MM-DD");
    const operateStart = now.subtract(1, "months").format("YYYY-MM-DD");
    this.setState({
      operateStart,
      operateEnd,
      fields:{...this.state.fields,createrTime:[operateStart,operateEnd]}
    });
    this.props.dispatch({
      type:'chargeBackList/fetchReceiveList',
      payload:{ operateStart, operateEnd ,...this.state.fields}
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
    this.context.router.push(`/chargeBack/receive/${value.pdOrderId}`);
  }
  searchData=(values)=> {
    this.props.dispatch({
      type:'chargeBackList/fetchReceiveList',
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
      type:'chargeBackList/fetchReceiveList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields}
    this.props.dispatch({
      type:'chargeBackList/fetchReceiveList',
      payload: values
    });
  }
  render() {
    const { receiveList, data } =this.props.chargeBackList;
    const { fields, operateStart, operateEnd } =this.state;
    return(
      <div className="receive-goods-components-wrap">
        <div className="middle-action">
          <ReceFilterForm
            {...fields}
            startDate={operateStart}
            endDate={operateEnd}
            onValuesChange={this.handleFormChange}
            submit={this.searchData}
            exportData={this.exportData}/>
        </div>
        <div className="bottom-action">
          <Qtable
            onOperateClick={this.handleEvent}
            columns={ReceiveColumns}
            dataSource={receiveList}/>
          {
            receiveList.length>0&&
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
ReceiveGoods.contextTypes= {
    router: React.PropTypes.object
}
function mapStateToProps(state) {
    const { chargeBackList } = state;
    return { chargeBackList };
}
export default connect(mapStateToProps)(ReceiveGoods);
