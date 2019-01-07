import React , { Component } from 'react';
import { Pagination } from 'antd';
import Qpagination from '../Qpagination';
import { connect } from 'dva';
import {
  BusinessTypeMap,
  OrderStatusMap
} from '../MapData';
import './index.less';

class ListMod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey:0,
    }
  }
  changeEvent(e,index) {
    this.setState({ currentKey: index });
    this.props.dispatch({
      type:'orderManage/fetchDetail',
      payload:{
        outId:e.outId,
        type:e.type,
        businessType:e.businessType,
        orderType:e.orderType
      }
    })
  }
  render() {
    const { dataList,data } = this.props.orderManage;
    const { changePageSize, changePage } =this.props;
    const { currentKey }=this.state;
    return(
      <div className="order-part-l-action">
        <div className="list-wrap">
          {
            dataList.map((ele,index) => (
              <div className={`item-order ${ currentKey == index?'isChecked':''}`} key={index} onClick={()=>this.changeEvent(ele,index)}>
                <div className="item-wrap">
                  <div className="flex-wrap">
                    <p className="order-no">{ele.outNo}</p>
                    <p>{ele.createTime}</p>
                  </div>
                  <div className="flex-wrap">
                    <p>{BusinessTypeMap[ele.businessType]} / {ele.levelStr} / {OrderStatusMap[ele.orderStatus]}</p>
                    <p className="money-num">{ele.amount}元</p>
                  </div>
                </div>
                <span className="arrow-icon"></span>
              </div>
            ))
          }
        </div>
        {
          dataList.length>0&&
          <Qpagination
            sizeOptions="2"
            onShowSizeChange={changePageSize}
            onChange={changePage}
            data={data}/>
          // <Pagination current={Number(data.currentPage)} defaultPageSize={10} total={Number(data.total)} onChange={changePage}/>
        }
      </div>
    )
  }
}
function mapStateToProps(state){
  const { orderManage } = state;
  return { orderManage };
}
export default connect(mapStateToProps)(ListMod);
