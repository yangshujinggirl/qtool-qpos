import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../services/services';

const disnone={display:'none'}
const disblock={display:'block'}

//导入
class MyUpload extends React.Component {
    state = {
        fileList: []
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-2);
        fileList = fileList.filter((file) => {
            if (file.response) {
                if(file.response.code=='0'){
                    console.log(file.response)
                    const pdCheckId=file.response.pdCheckId
                    let values={pdCheckId:pdCheckId,limit:10,currentPage:0}
                    this.setdatas(values)
                    
                }else{
                    message.warning(file.response.message);
                }
                return file.response.status === 'success';
            }
            return true;
        });
        this.setState({ fileList });
    }

    //根据id请求数据
    setdatas=(messages)=>{
        const result=GetServerData('qerp.pos.pd.check.info',messages)
                    result.then((res) => {
                      return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                            this.props.dispatch({
                                type:'inventory/pdCheckId',
                                payload: {pdCheckDetails:json.pdCheckDetails,pdCheckId:messages.pdCheckId}
                            })
                            const Setdate=this.props.Setdate
                            Setdate(json.pdCheckDetails,json.total,messages.pdCheckId)
                        }else{  
                            message.warning(json.message);
                        }
                    })
    }

    render() {
        const props = {
            action: '/erpQposRest/qposrest.htm?code=qerp.pos.pd.check.import',
            onChange: this.handleChange,
            name:'mfile'
        };
    return (
        <Upload {...props} fileList={this.state.fileList}>
            <Buttonico text='导入盘点结果'/>
        </Upload>
    );
  }
}


class Searchcomponent extends React.Component {
    state={
        inventorygoods:true,
        dataSourcemessage:[]
    }
    revisedaramessages=(messages)=>{
        this.setState({
            dataSourcemessage:messages,
            inventorygoods:true
        })
    }
    Setdate=(message,total,id)=>{
        console.log(message)
        for(var i=0;i<message.length;i++){
            message[i].key=i+1
        }
        this.props.setdayasouce(message,total,id)
    }
    Setdates=(messages)=>{
        console.log(this)
        const Setdates=this.refs.up.setdatas
        Setdates(messages)
    }


    download=()=>{
        window.open('../static/inventory.xlsx')
    }
    render(){
        return(
            <div className='clearfix mb10'>
	      		<div className='fl clearfix'>
	      			<div className='fl btn' onClick={this.download.bind(this)}><Buttonico text='下载盘点模板'/></div>
	      			<div className='fl btn ml20'><MyUpload Setdate={this.Setdate.bind(this)} dispatch={this.props.dispatch} ref='up'/></div>
	      		</div>
      			<div className='fr' style={this.state.inventorygoods?disblock:disnone}>
          			<div className='searchselect clearfix'>
	                    <div className='fl btn ml20'><Link to='/cashier'><Buttonico text='取消盘点'/></Link></div>
	      				<div className='fl btn ml20'><Link to='/inventorydiff'><Buttonico text='生成盘点差异'/></Link></div>
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
	      	count: 2,
            pdCheckId:null,
            total:0
	    };
  	}
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}
    setdatasouce=(messages,total,id)=>{
        console.log(messages)
        const messagedata=messages
        for(var i=0;i<messagedata.length;i++){
            messagedata[i].index=i+1
        }
        this.setState({
            dataSource:messagedata,
            total:total,
            pdCheckId:id
        },function(){
            const seracedatasouce=this.props.seracedatasouce
            seracedatasouce(this.state.dataSource)
            
        })
    }
    pagechange=(page)=>{
        console.log(page)
        var pages=Number(page.current)-1
        let values={pdCheckId:this.state.pdCheckId,limit:10,currentPage:pages}
        console.log(this)
        const setdatas=this.props.setdatas
        setdatas(values)
  
    }
  	render() {
    	const { dataSource } = this.state;
    	const columns = this.columns;
    	return (
      		<div className='bgf'>
        		<Table bordered dataSource={this.state.dataSource} columns={columns} 
                rowClassName={this.rowClassName.bind(this)}
                pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
                onChange={this.pagechange.bind(this)}
                />
      		</div>
    	);
  	}
}

class Inventory extends React.Component{
     setdayasouce=(messages,total,id)=>{
        const setdatasouce=this.refs.inventory.setdatasouce
        setdatasouce(messages,total,id)
    }
    seracedatasouce=(messages)=>{
        const revisedaramessages=this.refs.search.revisedaramessages
        revisedaramessages(messages)
    }
    setdatas=(messages)=>{
        console.log(this)
        const setdatas=this.refs.search.Setdates
        setdatas(messages)
    }


    render() {
        return (
            <div>
                <Header type={false} color={true}/>
                <div className='counters'>
                    <Searchcomponent setdayasouce={this.setdayasouce.bind(this)} ref='search' dispatch={this.props.dispatch}/>
                    <EditableTable ref='inventory' seracedatasouce={this.seracedatasouce.bind(this)} setdatas={this.setdatas.bind(this)}/>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Inventory);
