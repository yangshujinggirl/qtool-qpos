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
  changeField=(e,index,keyName)=> {
    let value = e.target.value;
    let regexp;
    let { goodsList } =this.props;
    switch(keyName) {
      case 'qty':
        regexp=/^[1-9]+$/
      break;
      case 'discount':
        regexp=/^\d+(\.\d{1})?$/
      break;
      case 'payPrice':
        regexp=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
        // regexp=/^\d+((\.)|(\.\d{1,2}))?$/
      break;
    }
    if(regexp.test(value)) {
      goodsList[index][keyName] =value;
      // debugger
      this.props.dispatch({
        type:'cashierManage/getChangGoodsList',
        payload:goodsList
      })
    }
  }
  onBlurField=(e,index,keyName)=> {
    let value = e.target.value;
    let role=sessionStorage.getItem('role');
    let { goodsList } =this.props;
    switch(keyName) {
      case 'qty':
        if(value>goodsList[index].inventory) {
          goodsList[index].qty=goodsList[index].inventory;
          message.warning('商品库存不足')
        }
      break;
      case 'discount':
        if((role=='2'||role=='1') && values<6){
          goodsList[index].discount=6
        }
        if((role=='3') && values<9){
          goodsList[index].discount=9
        }
      break;
      case 'payPrice':
        let zeropayPrice=value,discount;
        discount=NP.times(NP.divide(value,goodsList[index].toCPrice,goodsList[index].qty),10)
        if((role=='2'||role=='1') && goodsList[index].discount<8){
          discount=8;
          zeropayPrice=NP.divide(NP.times(value, goodsList[index].qty,discount),10); //计算值
        }else if((role=='3') && goodsList[index].discount<9){
          discount=9
          zeropayPrice=NP.divide(NP.times(value, goodsList[index].qty,discount),10); //计算值
        }
        zeropayPrice =fomatNumTofixedTwo(zeropayPrice)
        goodsList[index].payPrice =fomatNumAddFloat(zeropayPrice);
        goodsList[index].discount = discount;
      break;
    }
    this.props.dispatch({
      type:'cashierManage/getChangGoodsList',
      payload:goodsList
    })
  }
  render() {
    const { goodsList } = this.props;
    let columns= columnsIndx(this.props.form,this.changeField,this.onBlurField);
    console.log(goodsList)
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
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(GoodsTable);
