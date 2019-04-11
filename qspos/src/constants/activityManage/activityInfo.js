import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import Header from '../../components/Qheader';

import QcardTable from '../../components/QcardTable';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import { columnsInfo, activityTypeMap } from './columns';
import './activityInfo.less';

class ActivityManageIndex extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.initPage()
  }
  initPage(values) {
    let params = {
      activityId:this.props.params.id
    }
    if(values) {
      params = {...params,...values}
    }
    this.props.dispatch({
      type:'activityManage/fetchInfo',
      payload: params
    });
  }
  changePage = (currentPage) => {
    currentPage--;
    const { fields } = this.state;
    const paramsObj ={...{currentPage},...fields}
    this.initPage(paramsObj)
  }
  //修改pageSize
  changePageSize =(values)=> {
    this.initPage(values)
  }
  render() {
    const { dataSourceInfo, data, totalInfo } =this.props.activityManage;
    return(
      <div className="activity-info-pages common-pages-wrap">
        <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
          <Header type={false} color={true} linkRoute="activityManage"/>
          <div className="common-main-contents-wrap">
            <div className="card-action-wrap">
              <Card title='活动信息'>
                <div className="card-detail-list">
                  <div className='label-item'>
                    <label>活动名称：</label>
                    <span>{totalInfo.activityName}</span>
                  </div>
                  <div className='label-item'>
                    <label>活动类型：</label>
                    <span>{activityTypeMap[totalInfo.activityType]}</span>
                  </div>
                  <div className='label-item'>
                    <label>参与平台：</label>
                    <span>{totalInfo.activtyPlatform}</span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="card-action-wrap">
              <QcardTable
                title={()=> "活动商品信息"}
                columns={columnsInfo}
                data={dataSourceInfo}/>
              {
                dataSourceInfo.length>0&&
                <Qpagination
                  sizeOptions="2"
                  onShowSizeChange={this.changePageSize.bind(this)}
                  onChange={this.changePage.bind(this)}
                  data={data}/>
              }
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { activityManage,spinLoad } = state;
  return { activityManage, spinLoad };
}

export default connect(mapStateToProps)(ActivityManageIndex);
