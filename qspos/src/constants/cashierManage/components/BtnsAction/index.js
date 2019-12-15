import React, { Component } from 'react';
import { Button, Select, message } from 'antd';
import { connect } from 'dva';
import {GetServerData} from '../../../../services/services';
import PutOrderModal from '../PutOrderModal';
import PullOrderModal from '../PullOrderModal';
import AllDiscountModal from '../AllDiscountModal';
import './index.less';

class BtnsAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disVisible:false,//整单折扣
      visiblePut:false,
      visiblePull:false,
      allPutOrderList:[],
      fixedNum:['1','2','3','4','5'],
    }
  }
  componentDidMount() {
    this.getAllOrderListApi();
  }
  //切换活动
  handleSelect=(value,options)=> {
    const { activityOptions, goodsList, currentRowIndex } =this.props;
    goodsList[currentRowIndex].discount = goodsList[currentRowIndex].activityDiscount;
    goodsList[currentRowIndex].activityId = options.props.value;
    if(value == '0') {
      goodsList[currentRowIndex].discount = '10';
      goodsList[currentRowIndex].activityId = '0';
    }
    this.props.dispatch({
      type:'cashierManage/getActivityOptions',
      payload:{
        activityOptions,
        selectedActivityId: value
      }
    })
    this.props.dispatch({
      type:'cashierManage/getGoodsList',
      payload:goodsList
    })
  }
  //获取所有挂单
  getAllOrderListApi() {
    GetServerData('qerp.web.qpos.od.order.takeall')
    .then((res) => {
      const { code, putOrders, message } =res;
      if(code == '0') {
        this.setState({ allPutOrderList: putOrders||[] });
      } else {
        message.error(message);
      }
    },(err) => {
      message.error(err.message);
    })
  }
  //挂单
  goPutOrder=()=> {
    let { fixedNum, allPutOrderList } = this.state;
    let currentNum=[];
    if(allPutOrderList.length==5) {
      message.error('挂单位已满，无法挂单');
      return;
    }
    fixedNum.forEach((value,index) => {
      let count = 0;
      allPutOrderList.forEach((el,idx) => {
        if(el.putNo==value) {
          count++
        }
      })
      if(count == 0) {
        currentNum.push(value)
      }
    })
    this.setState({ visiblePut:true, currentOrderNo:currentNum[0] })
  }
  onOkPut=(value)=> {
    const { currentOrderNo } = this.state;
    const { goodsList, payTotalData, memberInfo } =this.props;
    const params = {
            putNo:currentOrderNo,
            putAmount:payTotalData.totolNumber,
            putPrice:payTotalData.totolAmount,
            putMessage:value,
            mbCardInfo:memberInfo,
            putProducts:goodsList
          }
          this.setState({ loading: true });
    GetServerData('qerp.web.qpos.od.order.put',{ putOrder: params })
    .then((res) => {
      const { code, putOrders } =res;
      if(code == '0') {
        message.success(`挂单成功，挂单号：0${currentOrderNo}`);
        this.props.dispatch({type:'cashierManage/resetData',payload:{} });
        this.getAllOrderListApi();//更新挂单列表
        this.props.form.resetFields()
      }
      this.setState({ loading: false, visiblePut:false });
    })
  }
  onCancelPut=()=> {
    this.setState({ visiblePut:false })
  }
  //取单
  goPullOrder=()=> {
    const { allPutOrderList } =this.state;
    if(allPutOrderList.length==1) {
      let putNo = allPutOrderList[0].putNo;
      this.getOrderApi(putNo);
      return;
    }
    this.setState({ visiblePull:true })
  }
  onCancelPull=()=> {
    this.setState({ visiblePull:false })
  }
  //取单
  getOrderApi(putNo) {
    GetServerData('qerp.web.qpos.od.order.take',{ putNo })
    .then((res) => {
      const { code, message, putOrder } =res;
      if(code !== '0') {
        message.error(message);
        return;
      }
      let { mbCardInfo, putAmount, putPrice, putProducts } =putOrder;
      //处理第一条订单参加活动的显示。---yangjing
      let activityOptions=[], selectedActivityId='0';
      putProducts.map((el,index) => {
        if(el.isShowActivity=='1') {
          activityOptions = el.spActivities;
          selectedActivityId = el.activityId;
        }
      })
      this.getAllOrderListApi();//更新挂单列表
      this.props.dispatch({//更新会员信息
        type:'cashierManage/getMemberInfo',
        payload:mbCardInfo
      })
      this.props.dispatch({//更新订单信息
        type:'cashierManage/getGoodsList',
        payload:putProducts
      });
      this.props.dispatch({
        type:'cashierManage/getActivityOptions',
        payload:{activityOptions,selectedActivityId}
      });
      this.setState({ visiblePull: false });
    })
  }
  //移除
  goDeleteOrder=()=> {
    let { goodsList,currentRowIndex,selectedActivityId } =this.props;
    let activityOptions=[];
    goodsList.splice(currentRowIndex,1);
    this.props.dispatch({
      type:'cashierManage/getGoodsList',
      payload:goodsList
    })
    let currentItem = goodsList[currentRowIndex];
    if(currentRowIndex == goodsList.length) {
      currentRowIndex = 0;
      currentItem = goodsList[0];
    }
    if(currentItem.isShowActivity=='1') {
      activityOptions = currentItem.spActivities,
      selectedActivityId = currentItem.activityId
    }
    this.props.dispatch({
      type:'cashierManage/getCurrentRowIndex',
      payload:currentRowIndex
    })
    this.props.dispatch({
      type:'cashierManage/getActivityOptions',
      payload:{ activityOptions, selectedActivityId }
    })
  }
  //整单折扣
  goDiscount=(value)=> {
    this.setState({ disVisible:value })
  }
  render() {
    const { activityOptions, selectedActivityId, goodsList } =this.props;
    const { visiblePut, currentOrderNo, allPutOrderList, visiblePull, disVisible } =this.state;
    return(
      <div className="handle-actions">
        {
          activityOptions.length>0&&
          <div className="handle-lt">
            该商品正在参与促销活动，点击右侧选框可切换活动：
            <Select
              className="activity-list-select"
              value={selectedActivityId}
              onSelect={(value,options)=>this.handleSelect(value,options)}>
              <Select.Option value="0" key="0">不参与活动</Select.Option>
              {
                activityOptions.map((el,index) => (
                  <Select.Option
                    value={el.activityId}
                    key={el.activityId}>{el.name}</Select.Option>
                ))
              }
            </Select>
          </div>
        }
        <div className="handle-rt">
          <Button onClick={this.goPutOrder} disabled={goodsList.length>0?false:true}>挂单F2</Button>
          <Button onClick={this.goPullOrder} disabled={ allPutOrderList.length>0?false:true}>取单F3</Button>
          <Button onClick={this.goDeleteOrder} disabled={goodsList.length>0?false:true}>移除商品F4</Button>
          <Button onClick={()=>this.goDiscount(true)} disabled={goodsList.length>0?false:true}>整单折扣</Button>
        </div>
        <PutOrderModal
          onOk={this.onOkPut}
          onCancel={this.onCancelPut}
          currentOrderNo={currentOrderNo}
          visible={visiblePut}/>
        <PullOrderModal
          data={allPutOrderList}
          getOrder={this.getOrderApi.bind(this)}
          onCancel={this.onCancelPull}
          visible={visiblePull}/>
        <AllDiscountModal
          onCancel={()=>this.goDiscount(false)}
          visible={disVisible} {...this.props}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(BtnsAction);
