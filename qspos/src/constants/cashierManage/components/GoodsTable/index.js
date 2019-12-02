import React, { Component } from 'react';
import { Table, Input } from 'antd';
import { connect } from 'dva';
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
  render() {
    const { goodsList } = this.props;
    let columns= columnsIndx(this.props.form);
    console.log(this.props.currentRowIndex)
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
