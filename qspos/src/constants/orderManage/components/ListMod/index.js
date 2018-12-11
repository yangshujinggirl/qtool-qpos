import React , { Component } from 'react';
import Qpagination from '../../../../components/Qpagination';
import { connect } from 'dva';

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
                    <p className="order-no">XS001177883001</p>
                    <p>08/07 11:53</p>
                  </div>
                  <div className="flex-wrap">
                    <p>门店APP / 来宾 / 已接单</p>
                    <p className="money-num">120000.00元</p>
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
