import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio} from 'antd';
import Header from '../components/header/Header';


// tag组件
const TabPane = Tabs.TabPane;
class Tags extends React.Component {
	callback=(key)=>{
		 console.log(key);
	}

  render() {
      return (
        <div>
          	<Tabs onChange={this.callback.bind(this)} type="card">
		    	<TabPane tab="账号管理" key="1"><EditableTable/></TabPane>
		    	<TabPane tab="基础设置" key="2"><Infrastructure/></TabPane>
 			</Tabs>
        </div>
    )
  }
}
//弹窗组件：新增账号和修改账号


//table组件：账号设置

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <span>{text}</span>
      ),
    }, {
      title: '账号手机',
      dataIndex: 'age',
    }, {
      title: '账号权限',
      dataIndex: 'address',
    },{
      title: '账号状态',
      dataIndex: 'address2s',
    },{
      title: '更新时间',
      dataIndex: 'addresss12',
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
              修改
            </Popconfirm>
          ) : null
        );
      },
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
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>新增账号</Button>
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}


//基础设置组件


const RadioGroup = Radio.Group;
const Option = Select.Option;
class Infrastructure extends React.Component {
	 state = {
    	value: 1
  	}
	handleChange=(value)=>{
	console.log(`selected ${value}`);
	}
	RadioonChange=(e)=>{
		console.log('radio checked', e.target.value);
	    this.setState({
	      value: e.target.value,
	    });
	}
  render() {
      return (
        <div>
         	 <Select style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
			      <Option value="jack">Jack</Option>
			      <Option value="lucy">Lucy</Option>
			      <Option value="disabled" disabled>Disabled</Option>
			      <Option value="Yiminghe">yiminghe</Option>
    		</Select>
    		<span>下载控件</span>
    		<p>纸张大小</p>
			<RadioGroup onChange={this.RadioonChange.bind(this)} value={this.state.value}>
		        <Radio value={1}>A</Radio>
		        <Radio value={2}>B</Radio>
		        <Radio value={3}>C</Radio>
		        <Radio value={4}>D</Radio>
      		</RadioGroup>
			<p>结算后打印</p>
			<RadioGroup onChange={this.RadioonChange.bind(this)} value={this.state.value}>
		        <Radio value={1}>A</Radio>
		        <Radio value={2}>B</Radio>
		        <Radio value={3}>C</Radio>
		        <Radio value={4}>D</Radio>
      		</RadioGroup>
      		<p>充值后打印</p>
      		<RadioGroup onChange={this.RadioonChange.bind(this)} value={this.state.value}>
		        <Radio value={1}>A</Radio>
		        <Radio value={2}>B</Radio>
		        <Radio value={3}>C</Radio>
		        <Radio value={4}>D</Radio>
      		</RadioGroup>	
		  <Button>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
    )
  }
}






//主页面
function Account({data}) {
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

export default connect(mapStateToProps)(Account);
