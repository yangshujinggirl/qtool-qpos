import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload} from 'antd';
import {GetServerData} from '../services/services';

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
                const Setdate=this.props.Setdate
                Setdate(file.response.wsInvSearchs)
          }else{
            message.error(file.response.message);
          }
        return file.response.status === 'success';
      }
      return true;
    });
    this.setState({ fileList });
  }
  render() {
    const props = {
      action: '/erpQposRest/qposrest.htm?code=qerp.pos.pd.adjust.import',
      onChange: this.handleChange,
      name:'mfile'
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button type="primary">
           导入移库商品
        </Button>
      </Upload>
    );
  }
}


const Option = Select.Option;
const inputwidth={
    width:'90px',
    height:'30px',
    border:'1px solid #E7E8EC',
    background: '#FFF'
}
class Searchcomponent extends React.Component {
    state={
        inputvalue:'',
        dataSourcemessage:[]
    }
    handleChange=(value)=>{
       	console.log(`selected ${value}`);
    }
    revisedaramessages=(messages)=>{
        this.setState({
            dataSourcemessage:messages
        })
    }


    Hindok=()=>{
        const values={adjusts:this.state.dataSourcemessage}
        const result=GetServerData('qerp.pos.pd.adjust.save',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        message.success('损益成功',3,this.callback());
                    }else{  
                        
                    }
                })
    
    }
    Hindcancel=()=>{
    	console.log(2)
    }
    callback=()=>{
    	
    }

    revisemessage=(messages)=>{
        console.log(messages)
            this.setState({
                inputvalue:messages
            })
    }
    hindsearch=()=>{
        const values={keywords:this.state.inputvalue}
         const result=GetServerData('qerp.pos.pd.spu.query',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        let pdSpus=json.pdSpus
                       for(var i=0;i<pdSpus.length;i++){
                            pdSpus[i].key=i
                            pdSpus[i].adjustQty=''
                        }
                        this.props.setdayasouce(pdSpus)

                    }else{  
                        
                    }
                })


        
    }
    download=()=>{``
        window.open('../static/adjust.xlsx')
    }
    Setdate=(message)=>{
        console.log(2)
    // for(var i=0;i<message.length;i++){
    //     message[i].key=i+1
    //     message[i].qtyCanMove = message[i].qty - message[i].qtyAllocated - message[i].qtyOnhold;
    // }
    // this.setState({
    //   dataSource:message
    //})
  }

    render(){
        return(
            <div className='clearfix'>
	      		<div className='m30 fl clearfix'>
	      			<div className='fl btn' onClick={this.download.bind(this)}><Buttonico text='下载损益模板'/></div>
	      			<div className='fl btn ml20'><Buttonico text='导入损益商品'/></div>
                     <MyUpload Setdate={this.Setdate.bind(this)}/>

	      		</div>
      			<div className='fr clearfix' style={{marginRight:'30px'}}>
          			<div className='fl'><Searchinput text='请输入商品条码、商品名称' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindsearch.bind(this)}/></div>
          			<div className='searchselect clearfix fl'>
	                    <div className='fl btn ml20' onClick={this.Hindcancel.bind(this)}><Buttonico text='取消损益'/></div>
	      				<div className='fl btn ml20' onClick={this.Hindok.bind(this)}><Buttonico text='确定损益'/></div>
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
      		dataIndex: 'index',
            render: (text, record, index) => {
                return (
                    <div>{index+1}</div>
                 )
                }
    	},{
            title: '商品条码',
            dataIndex: 'barcode'
        },{
            title: '商品名称',
            dataIndex: 'name'
        },{
            title: '规格',
            dataIndex: 'displayName'
        }, {
      		title: '数量',
      		dataIndex: 'inventory'
    	}, {
      		title: '损益数',
      		dataIndex: 'adjustQty',
      		render: (text, record, index) => {
        	return (
	            	 <Input style={inputwidth} onChange={this.hindchange.bind(this,index)} value={text}/>
        		)
      			}
    		}
    	];

	    this.state = {
	      	dataSource: [],
	      	count: 2,
            inputvalue:''

	    };
  	}

    setdatasouce=(messages)=>{
        console.log(messages)
        this.setState({
            dataSource:messages
        },function(){
            const seracedatasouce=this.props.seracedatasouce
            seracedatasouce(this.state.dataSource)
        })
    }

    hindchange=(index,e)=>{
        let dataSourc=this.state.dataSource
        dataSourc[index].adjustQty=e.target.value
        this.setState({
            dataSource:dataSourc
        },function(){
            const seracedatasouce=this.props.seracedatasouce
            seracedatasouce(this.state.dataSource)
        })
    }
  	
  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}
  	
  	render() {
    	const columns = this.columns;
        const pdSpus=this.props.pdSpus
    	return (
      		<div style={{background:'#fff'}}>
        		<Table bordered dataSource={this.state.dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
      		</div>
    	);
  	}
}





class Adjust extends React.Component {
    setdayasouce=(messages)=>{
        const setdatasouce=this.refs.adjust.setdatasouce
        setdatasouce(messages)
    }
    seracedatasouce=(messages)=>{
        const revisedaramessages=this.refs.search.revisedaramessages
        revisedaramessages(messages)
    }
    render(){
        return(
            <div>
                <Header type={false} color={true}/>
                <Searchcomponent dispatch={this.props.dispatch} setdayasouce={this.setdayasouce.bind(this)} ref='search'/>
                <div className='count' style={{marginTop:'10px'}}><EditableTable dispatch={this.props.dispatch} ref='adjust' seracedatasouce={this.seracedatasouce.bind(this)}/></div>
            </div>
            )
        
    }
    componentDidMount(){


    }


}

function mapStateToProps(state) {
  	console.log(state)
    const {pdSpus} = state.adjust;
    console.log(pdSpus)
    return {pdSpus};
}

export default connect(mapStateToProps)(Adjust);
