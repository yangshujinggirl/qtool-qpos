import React, { Component } from 'react';
import { Table, Input, message } from 'antd';
import { connect } from 'dva';
import NP from 'number-precision'
import { fomatNumTofixedTwo,fomatNumAddFloat } from '../../../../utils/CommonUtils';
import { columnsIndx } from './columns';
import './index.less';


class GoodsTable extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			windowHeight:'',
		};
	}
	componentDidMount(){
		this.windowResize();
		window.addEventListener('resize', this.windowResize);
	}
  componentWillUnmount(){
		window.removeEventListener('resize', this.windowResize);
	}
  //适配屏幕
	windowResize = () =>{
		if(!this.refs.tableWrapper){
      return
    }
    let height=Number(document.body.offsetHeight);
    this.setState({
      windowHeight:0.4*height
    });
	}
  //切换行
  onRowClick=(record,index)=> {
    this.props.dispatch({
      type:'cashierManage/getCurrentRowIndex',
      payload:index
    })
    let { spActivities, activityId } = record;
    spActivities = spActivities?spActivities:[];
    this.props.dispatch({
      type:'cashierManage/getActivityOptions',
      payload:{
        activityOptions:spActivities,
        selectedActivityId:activityId
      }
    })
  }
  renderRowStyle=(record,index)=> {
    const { currentRowIndex }=this.props;
    if(index == currentRowIndex ) {
      return 'highLightcolor'
    } else {
      if (index % 2) {
				return 'table_white'
			}else{
				return 'table_gray'
			}
    }
  }
  //表单change事件
  changeField=(e,index,keyName)=> {
    let value = e.target.value;
    let regexp;
    let { goodsList } =this.props;
    debugger
    switch(keyName) {
      case 'qty':
        regexp=/^[1-9]*(\d)*$/
        break;
      case 'canReturnPayPrice':
        regexp=/^\d*((\.)|(\.\d{1,2}))?$/
        break;
    }
    if(regexp.test(value)) {
      goodsList[index][keyName] =value;
      this.props.dispatch({
        type:'returnSales/getChangGoodsList',
        payload:goodsList
      })
    }
  }
  //表单blur事件
  onBlurField=(e,index,keyName)=> {
    let value = e.target.value;
    let role=sessionStorage.getItem('role');
    let { goodsList } =this.props;
    switch(keyName) {
      case 'qty':
        value = value==''?1:value;
        if(Number(value)>=Number(goodsList[index].canReturnQty)) {
          goodsList[index].qty=goodsList[index].canReturnQty;
          let returnedAmount = NP.times(goodsList[index].returnQty,goodsList[index].canReturnPrice);
          goodsList[index].canReturnPayPrice=NP.minus(goodsList[index].payPrice,returnedAmount);
          if(Number(value)>Number(goodsList[index].canReturnQty)) {
            message.warning(`最多可退${goodsList[index].canReturnQty}个`)
          }
        } else {
          goodsList[index].qty = value;
          goodsList[index].canReturnPayPrice=NP.times(value,goodsList[index].canReturnPrice);
        }
        break;
      case 'canReturnPayPrice':
        value = value==''?0:value;
        if(Number(value)>Number(goodsList[index].canReturnAmount)) {
          if(Number(goodsList[index].qty)==Number(goodsList[index].canReturnQty)) {
            let returnedAmount = NP.times(goodsList[index].returnQty,goodsList[index].canReturnPrice);
            goodsList[index].canReturnPayPrice=NP.minus(goodsList[index].payPrice,returnedAmount);
          } else {
            goodsList[index].canReturnPayPrice=NP.times(goodsList[index].qty,goodsList[index].canReturnPrice);
          }
          message.warning(`最多可退${goodsList[index].canReturnAmount}元`)
        } else {
          goodsList[index].canReturnPayPrice=value;
        }
        break;
    }
    this.props.dispatch({
      type:'returnSales/getGoodsList',
      payload:goodsList
    })
  }
  onChangeRowKey=(e,record,index)=>{
    let { goodsList } =this.props;
    let checked = e.target.checked;
    goodsList[index].checked = checked;
    this.props.dispatch({
      type:'returnSales/getGoodsList',
      payload:goodsList
    })
  }
  render() {
    const { goodsList } = this.props;
    let columns= columnsIndx(this.onChangeRowKey,this.changeField,this.onBlurField);
    return(
      <div ref="tableWrapper"  className="goods-table-action">
        <Table
          bordered
          columns={columns}
          dataSource={goodsList}
          pagination={false}
          rowClassName={this.renderRowStyle}
          onRow={(record,index) => {
            return {
              onClick:()=>this.onRowClick(record,index), // 点击行
            }
          }}
          scroll={{ y: this.state.windowHeight }} />
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { returnSales } = state;
    return returnSales;
}
export default connect(mapStateToProps)(GoodsTable);
