import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message} from 'antd';
import {GetServerData} from '../services/services';
import { Link } from 'dva/router'


class Searchcomponent extends React.Component {
    Hindok=()=>{
    	const values={adjusts:this.props.pdCheckDetails}
        const result=GetServerData('qerp.pos.pd.adjust.save',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                console.log(json)
                if(json.code=='0'){
                    message.success('损益成功',3,this.callback());
                    this.context.router.push('/cashier')
                }else{  
                    message.error(json.message);
                }
            })
    }
    
    callback=()=>{
    }
    download=()=>{
        window.open('../../static/盘点.xlsx')
    }
    render(){
        return(
            <div className='clearfix'>
	      		<div className='fl clearfix mb10'>
	      			<div className='btn' onClick={this.download.bind(this)}><Buttonico text='下载盘点差异'/></div>
	      		</div>
      			<div className='fr'>
          			<div className='searchselect clearfix'>
	                    <div className='fl btn ml20'><Link to='/cashier'><Buttonico text='暂不损益'/></Link></div>
	      				<div className='fl btn ml20' onClick={this.Hindok.bind(this)}><Buttonico text='确定损益'/></div>
	                </div>
     			</div>
    		</div>
        )
    }
}
Searchcomponent.contextTypes= {
    router: React.PropTypes.object
}

class EditableTable extends React.Component {
  	constructor(props) {
    	super(props);
    	this.columns = [{
      		title: '序号',
      		dataIndex: 'index'
    	}, {
      		title: '商品条码',
      		dataIndex: 'barcode'
    	},{
            title: '商品名称',
            dataIndex: 'name'
        },{
            title: '商品规格',
            dataIndex: 'displayName'
        },{
            title: '差异数量',
            dataIndex: 'difQty'
        } 
    	];

	    this.state = {
	      	dataSource: [],
	      	count: 2
	    };
  	}
  
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}
  	
  	render() {
    	const { dataSource } = this.state;
    	const columns = this.columns;
    	return (
      		<div className='bgf'>
        		<Table bordered dataSource={this.props.pdCheckDetails} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
      		</div>
    	);
  	}
}

function Inventorydiff({pdCheckDetails}) {
  	return (
	    <div>
	     	<Header type={false} color={true}/>
            <div className='counters'>
	     	    <Searchcomponent pdCheckDetails={pdCheckDetails}/>
	      	    <EditableTable pdCheckDetails={pdCheckDetails}/>
            </div>
	    </div>
  );
}

function mapStateToProps(state) {
    const {pdCheckDetails} = state.inventory;
  	return {pdCheckDetails};
}

export default connect(mapStateToProps)(Inventorydiff);
