import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import { Link } from 'dva/router'


const Option = Select.Option;
class Searchcomponent extends React.Component {
    state={
        inputvalue:'',
        selectvalue:null
    }
    handleChange=(value)=>{
        this.setState({
            selectvalue:value
        },function(){
            this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:100000,currentPage:0} }
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
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:100000,currentPage:0} }
        })
    }

    pagefresh=(currentPage)=>{
        this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:100000,currentPage:currentPage} }
        })
    }
    render(){
        return(
            <div className='clearfix mb10'>
	      		<div className='fl clearfix'>
	      			<div className='fl btn'><Link to='/adjust'><Buttonico text='商品损益'/></Link></div>
	      			<div className='fl btn ml20'><Link to='/inventory'><Buttonico text='店铺盘点'/></Link></div>
	      		</div>
      			<div className='fr clearfix'>
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
          			<div className='fl'><Searchinput text='请输入商品条码、名称' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindsearch.bind(this)}/></div>
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
             width:'8%',
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
            dataIndex: 'inventory',
            width:'8%',
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
      		<div className='bgf bgf-goods-style'>
        		<Table bordered dataSource={this.props.pdSpus} columns={columns} 
                rowClassName={this.rowClassName.bind(this)}
                pagination={{'showQuickJumper':true,'total':Number(this.props.total)}}
                />
      		</div>
    	);
  	}
}


class Goods extends React.Component {
    pagefresh=(currentPage)=>{
        const pagefreshs=this.refs.search.pagefresh
        pagefreshs(currentPage)
    }


    render() {
        return (
            <div>
                <Header type={false} color={true}/>
                <div className='counters'>
                    <Searchcomponent pdCategories={this.props.pdCategories} dispatch={this.props.dispatch} ref='search'/>
                    <EditableTable pdSpus={this.props.pdSpus} total={this.props.total} dispatch={this.props.dispatch} pagefresh={this.pagefresh.bind(this)}/>
                </div>
            </div>
        );
    }


}




function mapStateToProps(state) {
     console.log(state)
    const {pdSpus,pdCategories,total} = state.goods;
    return {pdSpus,pdCategories,total};
}

export default connect(mapStateToProps)(Goods);
