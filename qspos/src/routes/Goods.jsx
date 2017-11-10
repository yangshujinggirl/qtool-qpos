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
        let limitSize = localStorage.getItem('pageSize');
        this.setState({
            selectvalue:value
        },function(){
            this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:limitSize,currentPage:0} }
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
        let limitSize = localStorage.getItem('pageSize');
        this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:limitSize,currentPage:0} }
        })
    }

    pagefresh=(currentPage,pagesize)=>{
        console.log(currentPage)
        console.log(pagesize)
        this.props.dispatch({
                type:'goods/fetch',
                payload: {code:'qerp.pos.pd.spu.query',values:{keywords:this.state.inputvalue,pdCategoryId:this.state.selectvalue,limit:pagesize,currentPage:currentPage} }
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
            width:'15%',
      		dataIndex: 'barcode'
    	}, {
            title: '商品名称',
            dataIndex: 'name'
        }, {
            title: '规格',
            width:'15%',
            dataIndex: 'displayName'
        },{
            title: '数量',
            width:'10%',
            dataIndex: 'inventory',
        },{
      		title: '零售价',
            width:'12%',
      		dataIndex: 'toCPrice',
      		}
    	];

	    this.state = {
	      	dataSource: [],
	      	count: 2,
            pageSize:localStorage.getItem("pageSize")==null?10:Number(localStorage.getItem("pageSize")),
            windowHeight:'',
            currentPage:1
	    };
  	}
  	
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        },function(){
            const current=Number(page)-1;
            this.props.pagefresh(current,this.state.pageSize)
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            current:current,
            currentPage:1
        },function(){
             localStorage.setItem("pageSize", pageSize); 
            this.props.pagefresh(0,pageSize)
        })
        
    }

    windowResize = () =>{
       this.setState({
        windowHeight:document.body.offsetHeight-300
       });
    }


  	render() {
        console.log(this)
        console.log(localStorage)
    	const { dataSource } = this.state;
    	const columns = this.columns;
        console.log(this.props.pdSpus)
    	return (
      		<div className='bgf-goods-style good-contrl-table'>
        		<Table bordered dataSource={this.props.pdSpus} columns={columns} 
                rowClassName={this.rowClassName.bind(this)}
                pagination={
                             // Number(this.props.total)>Number(this.state.pageSize)?
                             {'total':Number(this.props.total),current:this.state.currentPage,pageSize:this.state.pageSize,showSizeChanger:true,onShowSizeChange:this.onShowSizeChange,onChange:this.pageChange,pageSizeOptions:['10','11','12','13','16','20']}
                             // :false
                         }
                // onChange={this.pageChange.bind(this)} 
                className='goods'
                scroll={{y:this.state.windowHeight}}
                />
      		</div>
    	);
  	}

    componentDidMount(){
        this.setState({
           windowHeight:document.body.offsetHeight-300
         });
        window.addEventListener('resize', this.windowResize);    
    }
    componentWillUnmount(){   
        window.removeEventListener('resize', this.windowResize);
    }
}


class Goods extends React.Component {
    pagefresh=(currentPage,pagesize)=>{
        const pagefreshs=this.refs.search.pagefresh
        pagefreshs(currentPage,pagesize)
    }

    render() {
        return (
            <div>
                <Header type={false} color={true}/>
                <div className='search-component'>
                    <Searchcomponent pdCategories={this.props.pdCategories} dispatch={this.props.dispatch} ref='search'/>
                </div>
                <div className='counters goods-counters'>
                    <EditableTable pdSpus={this.props.pdSpus} total={this.props.total} dispatch={this.props.dispatch} pagefresh={this.pagefresh.bind(this)}/>
                </div>
            </div>
        );
    }
    componentDidMount(){
        // window.addEventListener('click', this.inputclick,true);
        // window.addEventListener('keydown', this.handleokents,true);  
        // window.addEventListener('keyup', this.handleokent,true); 
    }
    componentWillUnmount(){
        // window.removeEventListener('click', this.inputclick,true);
        // window.removeEventListener('keydown', this.handleokents,true);
        // window.addEventListener('keyup', this.handleokent,true);
    }


}




function mapStateToProps(state){
     console.log(state)
    const {pdSpus,pdCategories,total} = state.goods;
    return {pdSpus,pdCategories,total};
}

export default connect(mapStateToProps)(Goods);
