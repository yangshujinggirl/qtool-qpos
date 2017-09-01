import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import { Link } from 'dva/router'








const Option = Select.Option;
class Searchcomponent extends React.Component {
    state={
        inputvalue:'',
        selectvalue:null
    }
    handleChange=(value)=>{
       	console.log(`selected ${value}`);
        this.setState({
            selectvalue:value
        },function(){
            this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue} }
        })
        })
        
    }
    revisemessage=(messages)=>{
            console.log(messages)
            this.setState({
                inputvalue:messages
            })
    }
    hindsearch=()=>{
        this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue} }
        })


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
	                    <Select  style={{ width: 100,height:40,marginRight:'20px' }} onChange={this.handleChange.bind(this)} defaultValue={null}>
                            <Option value={null} key='-1'>全部</Option>
                            {
                                this.props.pdCategories.map((item,index)=>{
                                    return <Option value={item.pdCategoryId} key={index}>{item.name}</Option>
                                })
                            }
	                        
	                    </Select>
	                </div>
          			<div className='fl'><Searchinput text='请输入会员姓名、手机、会员卡号、级别' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindsearch.bind(this)}/></div>
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
      		dataIndex: 'index',
            render: (text, record, index) => {
                return (
                    <div>{index+1}</div>
                 )
                }
            
    	}, {
      		title: '商品条码',
      		dataIndex: 'barcode'
    	}, {
            title: '商品名称',
            dataIndex: 'name'
        }, {
            title: '规格',
            dataIndex: 'displayName'
        },{
            title: '数量',
            dataIndex: 'inventory'
        },{
      		title: '零售价',
      		dataIndex: 'toCPrice',
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
      		<div style={{background:'#fff'}}>
        		<Table bordered dataSource={this.props.pdSpus} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
      		</div>
    	);
  	}
}

function Goods({pdSpus,pdCategories,dispatch}) {
  return (
    <div>
       <Header type={false} color={true}/>
       <Searchcomponent pdCategories={pdCategories} dispatch={dispatch}/>
       <div className='count' style={{marginTop:'10px'}}><EditableTable pdSpus={pdSpus}/></div>
    </div>
  );
}

function mapStateToProps(state) {
     console.log(state)
    const {pdSpus,pdCategories} = state.goods;
    return {pdSpus,pdCategories};
}

export default connect(mapStateToProps)(Goods);
