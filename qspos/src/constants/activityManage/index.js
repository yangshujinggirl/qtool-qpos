import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin} from 'antd';
import Header from '../../components/Qheader';
import FilterForm from './components/FilterForm';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import {columns} from './columns';
import './index.less';

class ActivityManageIndex extends Component {
  constructor(props) {
    super(props);
    this.state={
      fields: {
        activityType:'',
        activityStatus:0,
        searchCondition:''
      },
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type:'activityManage/fetchList',
      payload: {}
    });
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  changePage = (currentPage) => {
    currentPage--;
    const { fields } = this.state;
    const paramsObj ={...{currentPage},...fields}
    this.props.dispatch({
      type:'activityManage/fetchList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    this.props.dispatch({
      type:'activityManage/fetchList',
      payload: values
    });
  }
  searchData =(values)=> {
    this.props.dispatch({
      type:'activityManage/fetchList',
      payload: values
    });
  }
  render() {
    const { fields } =this.state;
    const { dataSource, data } =this.props.activityManage;
    return(
      <div className="ordere-manage-pages common-pages-wrap">
        <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
          <Header type={false} color={true} title="1234"/>
          <div className="common-main-contents-wrap">
            <FilterForm
              {...fields}
              onValuesChange={this.handleFormChange}
              submit={this.searchData}/>
              <Qtable
                columns={columns}
                dataSource={dataSource}/>
              {
                dataSource.length>0&&
                <Qpagination
                  sizeOptions="2"
                  onShowSizeChange={this.changePageSize.bind(this)}
                  onChange={this.changePage.bind(this)}
                  data={data}/>
              }
          </div>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { activityManage, spinLoad } = state;
  return { activityManage, spinLoad };
}

export default connect(mapStateToProps)(ActivityManageIndex);
