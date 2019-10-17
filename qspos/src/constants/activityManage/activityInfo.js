import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import Header from '../../components/Qheader';

import QcardTable from '../../components/QcardTable';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import { columnsInfo, columnsSingleInfo, columnsAreaSubtractInfo } from './columns';
import  { activityStatusOption, activityTypeOption } from './optionMap';
import GiftModal from './components/GiftModal';
import './activityInfo.less';

class ActivityManageIndex extends Component {
  constructor(props) {
    super(props);
    this.state={
      giftVisible:false
    }
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
  promotionContent=()=>{
    let { totalInfo }=this.props.activityManage;
    let content;
    switch(totalInfo.activityType){
      case "10":
        content=<span>见商品活动价</span>;
        break;
      case "11":
        content=<span>见商品活动描述</span>;
        break;
      case "20":
      case "21":
        content=<span>
          消费满指定门槛，可得专属赠品，
          <span className="linkStyle" onClick={this.handleVisible}>查看赠品明细>></span>
        </span>;
        break;
      case "22":
      case "23":
        content=<span>{totalInfo.activityContent}</span>;
        break;
    }
    return content;
  }
  getColumns=()=>{
    let { totalInfo }=this.props.activityManage;
    let columns;
    switch(totalInfo.activityType){
      case "10":
        columns=columnsInfo;
        break;
      case "11":
        columns=columnsSingleInfo;
        break;
      case "20":
      case "21":
      case "22":
      case "23":
        columns=columnsAreaSubtractInfo;
        break;
    }
    return columns;
  }
  handleVisible=()=> {
    this.setState({ giftVisible:!this.state.giftVisible })
  }
  render() {
    const { dataSourceInfo, data, totalInfo, giftList } =this.props.activityManage;

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
                    <label>活动时间：</label>
                    <span>{totalInfo.activityStartT}〜{totalInfo.activityEndT}</span>
                  </div>
                  <div className='label-item'>
                    <label>活动类型：</label>
                      <span>{
                        activityTypeOption.map((el,index)=>(
                          <span key={index}>{el.key==totalInfo.activityType&&el.value}</span>
                        ))
                      }</span>
                  </div>
                  <div className='label-item'>
                    <label>活动状态：</label>
                      <span>{
                        activityStatusOption.map((el,index)=>(
                          <span key={index}>{el.key==totalInfo.activityStatus&&el.value}</span>
                        ))
                      }</span>
                  </div>
                  <div className='label-item'>
                    <label>参与平台：</label>
                    <span>{totalInfo.activtyPlatform}</span>
                  </div>
                  <div className='label-item'>
                    <label>促销内容：</label>
                    <span>{this.promotionContent()}</span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="card-action-wrap">
              <QcardTable
                title={()=> "活动商品信息"}
                columns={this.getColumns()}
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
          <GiftModal
            dataSource={giftList}
            visible={this.state.giftVisible}
            onOk={this.handleVisible}
            onCancel={this.handleVisible}/>
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
