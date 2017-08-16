import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import EchartsPie from '../charts/EchartsPie';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip } from 'antd';


//切换tag
const TabPane = Tabs.TabPane;
class Tags extends React.Component {
	callback=(key)=>{
		 console.log(key);
	}
  render() {
      return (
        <div>
          	<Tabs onChange={this.callback.bind(this)} type="card">
		    	<TabPane tab="Tab 1" key="1"><Sellorder/></TabPane>
		    	<TabPane tab="Tab 2" key="2"><Sellclerk/></TabPane>
 			</Tabs>
        </div>
    )
  }
}

//店员销售-详细数据table
//文字提示
const saletext='123'
const sale=<Tooltip placement="top" title={saletext}>销售额</Tooltip>
const netreceiptstext='456'
const netreceipts=<Tooltip placement="top" title={netreceiptstext}>净收款</Tooltip>        
      
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <span>{text}</span>
      ),
    }, {
      title: sale,
      dataIndex: 'age',
    }, {
      title: netreceipts,
      dataIndex: 'address',
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      }],
      count: 2,
    };
  }
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}




//销售订单count
function Sellorder() {
  return (
    <div>
   		<p>订单</p>
    </div>
  );
}

//店员销售count
function Sellclerk() {
  return (
    <div>
   		<EchartsPie/>
   		<p>详细数据</p>
   		<EditableTable/>
    </div>
  );
}










function Sell({data}) {
  return (
    <div>
    	<Header type={false} data={data} color={true}/>
    	<Tags/>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state)
  const {data}=state.header
  return {data};
}

export default connect(mapStateToProps)(Sell);
