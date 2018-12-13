import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Qtable from '../../../../../components/Qtable';
import Qpagination from '../../../../../components/Qpagination';
import ReceDetailFilterForm from '../ReceDetailFilterForm';
import { ReceiveDetailColumns } from '../../columns'
import './index.less';


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
    const chargeBackDetail = JSON.parse(sessionStorage.getItem('chargeBackDetail'));
    this.setState({ totalData: chargeBackDetail });
    this.props.dispatch({
      type:'chargeBackList/fetchDetail',
      payload:{pdOrderId:this.props.params.id}
    })
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  searchData=(values)=> {
    values = { ...values, pdOrderId:this.props.params.id };
    this.props.dispatch({
      type:'chargeBackList/fetchDetail',
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
    paramsObj ={...paramsObj,...fields, pdOrderId:this.props.params.id}
    this.props.dispatch({
      type:'chargeBackList/fetchDetail',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...values,...fields, pdOrderId:this.props.params.id}
    this.props.dispatch({
      type:'chargeBackList/fetchDetail',
      payload: values
    });
  }
  render() {
    const { detailInfo, data } =this.props.chargeBackList;
    const { fields, totalData } =this.state;
    return(
      <div className="charg-back-detial-pages">
        <div className="row">
          <p className="row-title"> 订单信息</p>
          <Row wrap>
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
              订单状态：{totalData.statusStr}
            </Col>
          </Row>
        </div>
        <div className="row">
          <p className="row-title"> 商品收货明细</p>
          <ReceDetailFilterForm
          {...fields}
          onValuesChange={this.handleFormChange}
          submit={this.searchData}/>
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
    )
  }
}

function mapStateToProps(state) {
    const { chargeBackList } = state;
    return { chargeBackList };
}
export default connect(mapStateToProps)(GoodsDetail);
