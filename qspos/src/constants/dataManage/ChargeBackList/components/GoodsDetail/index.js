import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Qtable from '../../../../../components/Qtable';
import Qpagination from '../../../../../components/Qpagination';
import ReceDetailFilterForm from '../ReceDetailFilterForm';
import { ReceiveDetailColumns, ReturnDetailColumns } from '../../columns'
import './index.less';

//退货详情
const ReturnGoodsDetail=({...props})=>{
  const { totalData, detailInfo, changePageSize, changePage,data } =props;
  return (
    <div>
      <div className="row">
        <p className="row-title"> 订单信息</p>
        <Row wrap className="row-diy">
          <Col span={6}>
            订单号：{totalData.asnNo}
          </Col>
          <Col span={6}>
            退货商品总数：{totalData.qtySum}
          </Col>
          <Col span={6}>
            订单状态：{totalData.statusStr}
          </Col>
          <Col span={6}>
            退货时间：{totalData.createTime}
          </Col>
          <Col span={6}>
            退货完成时间：{totalData.updateTime}
          </Col>
        </Row>
      </div>
      <div className="row">
        <p className="row-title noline-row">退货商品明细</p>
        <Qtable
          columns={ReturnDetailColumns}
          dataSource={detailInfo.list}/>
        {
          detailInfo.list.length>0&&
          <Qpagination
            sizeOptions="2"
            onShowSizeChange={changePageSize}
            onChange={changePage}
            data={data}/>
        }
      </div>
    </div>
  )
}

class GoodsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{
        keywords:'',
        createrTime:'',
      },
      totalData:{}
    }
  }
  componentDidMount() {
    this.initPage()
  }
  initPage() {
    let chargeBackDetail = JSON.parse(sessionStorage.getItem('chargeBackDetail'));
    chargeBackDetail=chargeBackDetail?chargeBackDetail:{};
    this.setState({ totalData: chargeBackDetail });
    this.changeEvent();
  }
  //接口调用
  changeEvent(values) {
    const { type } =this.props.params;
    let actionType;
    if(type == 'receive') {
      values = {...values, pdOrderId:this.props.params.id };
      actionType = 'chargeBackList/fetchDetail';
    } else {
      values = {...values, wsAsnId:this.props.params.id };
      actionType = 'chargeBackList/fetchReturnDetail';
    }
    this.props.dispatch({
      type:actionType,
      payload: values
    });
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  //分页
  changePage = (currentPage) => {
    currentPage--;
    let paramsObj = {
      currentPage,
    }
    let { fields } = this.state;
    paramsObj ={...paramsObj,...fields}
    this.changeEvent(paramsObj);
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields, pdOrderId:this.props.params.id}
    this.changeEvent(values);
  }

  render() {
    const { detailInfo, data } =this.props.chargeBackList;
    const { fields, totalData } =this.state;
    const { type } =this.props.params;
    return(
      <div className="charg-back-detial-pages">
        {
          type=='receive'?
          <div>
            <div className="row">
              <p className="row-title"> 订单信息</p>
              <Row wrap className="row-diy">
                <Col span={6}>
                  订单号：{totalData.orderNo}
                </Col>
                <Col span={6}>
                  商品总数：{totalData.qtySum}
                </Col>
                <Col span={6}>
                  已收商品数量：{totalData.receiveQty}
                </Col>
                <Col span={6}>
                  订单类型：{totalData.typeStr}
                </Col>
                <Col span={6}>
                  订单状态：{totalData.statusStr}
                </Col>
              </Row>
            </div>
            <div className="row">
              <p className="row-title"> 商品收货明细</p>
              <div className="search-action">
                <ReceDetailFilterForm
                {...fields}
                onValuesChange={this.handleFormChange}
                submit={(values)=>this.changeEvent(values)}/>
              </div>
              <Qtable
                columns={ReceiveDetailColumns}
                dataSource={detailInfo.list}/>
              {
                detailInfo.list.length>0&&
                <Qpagination
                  sizeOptions="2"
                  onShowSizeChange={this.changePageSize}
                  onChange={this.changePage}
                  data={data}/>
              }
            </div>
          </div>
          :
          <ReturnGoodsDetail
            data={data}
            totalData={totalData}
            detailInfo={detailInfo}
            changePage={this.changePage}
            changePageSize={this.changePageSize}/>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
    const { chargeBackList } = state;
    return { chargeBackList };
}
export default connect(mapStateToProps)(GoodsDetail);
