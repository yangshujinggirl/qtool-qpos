import React from 'react';
import { connect } from 'dva';
import Header from '../../components/header/Header';
import Searchinput from './search';
import {LocalizedModal,Buttonico} from '../../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload} from 'antd';
import {GetServerData} from '../../services/services';
import { Link } from 'dva/router';
import AdjustTextModal from '../../components/modal/confirmModal';
import "../../style/adjustLog.css";

import Searchcomponent from './search'

const Option = Select.Option;
const inputwidth={
    width:'90px',
    height:'30px',
    border:'1px solid #E7E8EC',
    background: '#FFF'
}

//在adjust组件中
class EditableTable extends React.Component {
  	constructor(props) {
    	super(props);
    	this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
            width:"12%"
        },{
            title: '商品名称',
            dataIndex: 'name',
            width:"12%"
        },{
            title: '规格',
            dataIndex: 'displayName',
            width:"12%"
        }, {
      		title: '库存数量',
              dataIndex: 'inventory',
              width:"8%"
    	}, {
      		title: '调拨数量',
            dataIndex: 'adjustQty',
            width:"8%",
      		render: (text, record, index) => {
        	return (
                    <Input className="adjust-inputwidth" onChange={this.hindchange.bind(this,index)} 
                            onBlur={this.hindBlur.bind(this)}
                            value={this.state.dataSource[((Number(this.state.page)-1)*10)+index].adjustQty} 
                            autoComplete="off"
                           />
        		)
      		}
    	},{
            title: '进货单价',
            dataIndex: 'averageRecPrice',
            width:"8%"
        },{
            title: '零售单价',
            dataIndex: 'adjustAmount',
            width:"8%"
        },{
            title: '调拨总价',
            dataIndex: 'adjustAmount12',
            width:"8%",
            render: (text, record, index) => {
                return (
                    <Input className="adjust-inputwidth" onChange={this.hindchange.bind(this,index)} 
                            onBlur={this.hindBlur.bind(this)}
                            value={this.state.dataSource[((Number(this.state.page)-1)*10)+index].adjustQty} 
                            autoComplete="off"
                            />
                    )
            }
        }];
	    this.state = {
	      	dataSource: [],
	      	count: 2,
            inputvalue:'',
            total:0,
            page:1,
            windowHeight:''
        };
        this._isMounted = false;
    }
    setdatasouce=(messages,total)=>{
        //设置dataSource和total
        this.setState({
            dataSource:messages,
            total:total,
            page:1
        },function(){
            const seracedatasouce=this.props.seracedatasouce;
            //调用父元素seracedatasouce方法
            seracedatasouce(this.state.dataSource)
        })
    }

    //在改变损益数量时
    hindchange=(index,e)=>{
        let indexs=((Number(this.state.page)-1)*10)+index;
        let dataSourc=this.state.dataSource;
        let patternTest=/^-?[1-9]\d*$/;
        if(patternTest.test(e.target.value)){
            dataSourc[indexs].adjustQty=e.target.value;
            dataSourc[indexs].adjustAmount =(Number(e.target.value)*parseFloat(dataSourc[indexs].averageRecPrice)).toFixed(2);
        }else{
            dataSourc[indexs].adjustQty=e.target.value;
            dataSourc[indexs].adjustAmount =(0*dataSourc[indexs].averageRecPrice).toFixed(2);
        }
        this.setState({
            dataSource:dataSourc
        },function(){
            const seracedatasouce=this.props.seracedatasouce
            seracedatasouce(this.state.dataSource)
        })
    }

    hindBlur = (e) =>{
        let patternTest=/^-?[1-9]\d*$/;
        if(!patternTest.test(e.target.value)){
            message.error('请输入正确的损益数');
        }
    }
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}

    pagechange=(page)=>{
        this.setState({
            page:page.current
        })
    }

    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            if(document.body.offsetWidth>800){
                this.setState({
                     windowHeight:document.body.offsetHeight-300,
                });
            }else{
               this.setState({
                    windowHeight:document.body.offsetHeight-270,
                });
            }
        } 
    }

  	render() {
    	const columns = this.columns;
        const pdSpus=this.props.pdSpus
    	return (
      		<div className='bgf' ref="tableWrapper">
        		<Table bordered 
                    dataSource={this.state.dataSource} 
                    columns={columns} 
                    rowClassName={this.rowClassName.bind(this)} 
                    pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
                    onChange={this.pagechange.bind(this)}
                    scroll={{y:this.state.windowHeight}}
                />
      		</div>
    	);
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            if(document.body.offsetWidth>800){
                this.setState({
                   windowHeight:document.body.offsetHeight-300,
                 });
            }else{
               this.setState({
                 windowHeight:document.body.offsetHeight-270,
                });
            }
        }
        window.addEventListener('resize', this.windowResize);    
    }
    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }
      
}


class Gooddb extends React.Component {
    //
    setdayasouce=(messages,total)=>{
        const setdatasouce=this.refs.adjust.setdatasouce
        setdatasouce(messages,total)
    }
    //调用search的方法
    seracedatasouce=(messages)=>{
        const revisedaramessages=this.refs.search.revisedaramessages
        revisedaramessages(messages)
    }
    render(){
        return(
            <div>
                <Header type={false} color={true} linkRoute="goods"/>
                <div className='counters'>
                    <Searchcomponent dispatch={this.props.dispatch} setdayasouce={this.setdayasouce.bind(this)} ref='search'/>
                    <EditableTable dispatch={this.props.dispatch} ref='adjust' seracedatasouce={this.seracedatasouce.bind(this)}/>
                </div>
            </div>
            )
        
    }
    
}

function mapStateToProps(state) {
    const {pdSpus} = state.adjust;
    return {pdSpus};
}

export default connect(mapStateToProps)(Gooddb);
