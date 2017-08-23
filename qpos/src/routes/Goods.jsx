import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import { Link } from 'dva/router'

const Option = Select.Option;
class Searchcomponent extends React.Component {
    handleChange=(value)=>{
       	console.log(`selected ${value}`);
    }
    render(){
        return(
            <div className='clearfix'>
	      		<div className='m30 fl clearfix'>
	      			<div className='fl btn'><Link to='/adjust'><Buttonico text='商品损益'/></Link></div>
	      			<div className='fl btn ml20'><Link to='/inventory'><Buttonico text='店铺盘点'/></Link></div>
	      		</div>
      			<div className='fr clearfix' style={{marginRight:'30px'}}>
	      			<div className='searchselect clearfix fl'>
	                    <label style={{fontSize: '14px',color: '#74777F',marginRight:'10px'}}>商品分类</label>
	                    <Select defaultValue="all" style={{ width: 100,height:40,marginRight:'20px' }}>
	                        <Option value="all">全部分类</Option>
	                        <Option value="lucy">两点上课</Option>
	                        <Option value="disabled">两点上课</Option>
	                        <Option value="Yiminghe">两点上课</Option>
	                    </Select>
	                </div>
          			<div className='fl'><Searchinput text='请输入会员姓名、手机、会员卡号、级别'/></div>
     			</div>
    		</div>
        )
    }
}

class EditableTable extends React.Component {
  	constructor(props) {
    	super(props);
    	this.columns = [{
      		title: 'age',
      		dataIndex: 'age'
    	}, {
      		title: 'address',
      		dataIndex: 'address'
    	}, {
      		title: 'operation',
      		dataIndex: 'operation',
      		render: (text, record, index) => {
        	return (
          	this.state.dataSource.length > 1 ?
          		(
	            	<Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
	              		<a href="#">Delete</a>
	            	</Popconfirm>
	          	) : null
        		)
      			}
    		}
    	];

	    this.state = {
	      	dataSource: [{
	        	key: '0',
	        	name: 'Edward King 0',
	        	age: '32',
	        	address: 'London, Park Lane no. 0'
	      	}, {
	        	key: '1',
	        	name: 'Edward King 1',
	        	age: '32',
	        	address: 'London, Park Lane no. 1'
	      	}],
	      	count: 2
	    };
  	}
  	onCellChange = (index, key) => {
    	return (value) => {
      		const dataSource = [...this.state.dataSource];
      		dataSource[index][key] = value;
      		this.setState({ dataSource });
    	}
  	}
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
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
      		<div style={{background:'#fff'}}>
        		<Table bordered dataSource={dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
      		</div>
    	);
  	}
}

function Goods({data}) {
  return (
    <div>
       <Header type={false} data={data} color={true}/>
       <Searchcomponent/>
       <div className='count' style={{marginTop:'10px'}}><EditableTable/></div>
    </div>
  );
}

function mapStateToProps(state) {
 	const {data}=state.header
  	return {data};
}

export default connect(mapStateToProps)(Goods);
