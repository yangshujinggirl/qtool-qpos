import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message} from 'antd';
import { Link } from 'dva/router'

class Searchcomponent extends React.Component {
    handleChange=(value)=>{
       	console.log(`selected ${value}`);
    }
    Hindok=()=>{
    }
    Hindcancel=()=>{
    	console.log(2)
    }
    callback=()=>{
    	
    }
    lendin=()=>{
        console.log(23)
        



    }
    render(){
        return(
            <div className='clearfix'>
	      		<div className='m30 fl clearfix'>
	      			<div className='fl btn'><Buttonico text='下载盘点模板'/></div>
	      			<div className='fl btn ml20' onClick={this.lendin.bind(this)}><Buttonico text='导入盘点结果'/></div>
	      		</div>
      			<div className='fr' style={{marginRight:'30px'}}>
          			<div className='searchselect clearfix'>
	                    <div className='fl btn ml20' onClick={this.Hindcancel.bind(this)}><Buttonico text='取消盘点'/></div>
	      				<div className='fl btn ml20' onClick={this.Hindok.bind(this)}><Link to='/inventorydiff'><Buttonico text='生成盘点差异'/></Link></div>
	                </div>
     			</div>
    		</div>
        )
    }
}





class EditableTable extends React.Component {
  	constructor(props) {
    	super(props);
    	this.columns = [{
      		title: '序号',
      		dataIndex: 'index'
    	},{
            title: '商品条码',
            dataIndex: 'barcode'
        },{
            title: '商品名称',
            dataIndex: 'name'
        }, {
      		title: '规格',
      		dataIndex: 'displayName'
    	}, {
            title: '系统数量',
            dataIndex: 'inventory'
        },{
      		title: '盘点数',
      		dataIndex: 'checkQty',
      		
    		}
    	];

	    this.state = {
	      	dataSource: [],
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
        		<Table bordered dataSource={this.props.pdSpus} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
      		</div>
    	);
  	}
}










function Inventory() {
  return (
    <div>
    	<Header type={false} color={true}/>
    	<Searchcomponent/>
    	<div className='count' style={{marginTop:'10px'}}><EditableTable/></div>
    </div>
  );
}

function mapStateToProps(state) {
    // console.log(state)
    // const {pdSpus} = state.inventory;
    return {};
}

export default connect(mapStateToProps)(Inventory);
