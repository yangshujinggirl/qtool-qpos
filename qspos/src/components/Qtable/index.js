import React ,{ Component } from 'react';
import { Table } from 'antd';


class QTable extends Component {
  constructor(props) {
    super(props);
     this.rowSelection = {
      type:'radio',
      onChange:(selectedRowKeys, selectedRows) =>{
        console.log(selectedRowKeys)
      },
    }
  }
  //绑定方法
  processData(data) {
    if(!this.props.onOperateClick) {
      return data;
    }
    data && data.map((item, i) => {
        item.onOperateClick = (type) => { this.props.onOperateClick(item, type) };
    })
    return data;
  }
  //表格样式
  rowClassName=(record, index)=>{
      if (index % 2) {
          return 'table_gray'
      }else{
          return 'table_white'
      }
  }
  render() {
    const dataSource = this.processData(this.props.dataSource);
    const { select, columns, } = this.props;
    return(
      <Table
        loading={this.props.loading}
        pagination={false}
        bordered={true}
        dataSource={dataSource}
        columns = {this.props.columns}
        rowClassName={this.rowClassName}
        rowSelection={select?this.props.rowSelection:null}/>
    )
  }
}
export default QTable;
