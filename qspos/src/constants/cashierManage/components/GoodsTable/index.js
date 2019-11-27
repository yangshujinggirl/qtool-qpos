import React, { Component } from 'react';
import { Table, Input } from 'antd';
import './index.less';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key:'name',
    width:'20%'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width:'20%'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width:'20%'
  },
];
// const columns = [{
//     title: '序号',
//     dataIndex: 'key',
//     width:'8%',
//     render: (text, record, index) => {
//       return <div className="td-wrap">123</div>
//     }
//   }, {
//     title: '商品条码',
//     width:'10%',
//     dataIndex: 'barcode',
//     render: (text, record, index) => {
//       return <div className="td-wrap">商品条码</div>
//     }
//   }, {
//     title: '商品名称',
//     width:'15%',
//     dataIndex: 'name',
//     render: (text, record, index) => {
//       return <div className="td-wrap">商品名称</div>
//     }
//   },{
//     title: '规格',
//     width:'10%',
//     dataIndex: 'displayName',
//     render: (text, record, index) => {
//       return <div className="td-wrap">规格</div>
//     }
//   },{
//     title: '零售价',
//     width:'10%',
//     dataIndex: 'toCPrice',
//     render: (text, record, index) => {
//       return <div className="td-wrap">零售价</div>
//     }
//   },{
//     title: '数量',
//     width:'10%',
//     dataIndex: 'qty',
//     render: (text, record, index) => {
//       return (
//         <Input
//           autoComplete="off"/>
//       )
//     }
//   },{
//     title: '折扣',
//     width:'10%',
//     dataIndex: 'discount',
//     render: (text, record, index) => {
//       let value;
//       if(record.isJoin=="1") {
//         value = record.activityDiscount
//       }else {
//         value = record.discount
//       }
//       return (
//         <Input
//           disabled={record.isJoin=="1"}
//           autoComplete="off"/>
//       )
//     }
//   },{
//     title: '折后总价',
//     width:'10%',
//     dataIndex: 'payPrice',
//     render: (text, record, index) => {
//       return (
//         <Input
//           disabled={record.isJoin=="1"}
//           autoComplete="off"/>
//       )
//     }
// }];

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
  render() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    return(
      <div ref="tableWrapper"  className="goods-table-action">
        <Table
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: this.state.windowHeight }} />
      </div>
    )
  }
}

export default GoodsTable;
