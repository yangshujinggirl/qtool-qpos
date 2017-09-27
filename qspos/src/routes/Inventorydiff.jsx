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
        const pdCheckDetails=this.props.pdCheckDetails
        for(var i=0;i<pdCheckDetails.length;i++){
            pdCheckDetails[i].adjustQty=pdCheckDetails[i].difQty
        }


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
        let values={pdCheckId:this.props.pdCheckId}
        let Strdatanume=JSON.stringify(values)
        Strdatanume=encodeURI(Strdatanume)
        let url='/erpWebRest/webrestExport.htm?data='+Strdatanume+'&code=qerp.qpos.pd.check.export'
        console.log(url)
        window.open(url)
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

    //数据请求
    //根据id请求数据
    setdatas=(messages)=>{
        const result=GetServerData('qerp.pos.pd.check.info',messages)
                    result.then((res) => {
                      return res;
                    }).then((json) => {
                        console.log(json)
                        const messagedata=json.pdCheckDetails
                        for(var i=0;i<messagedata.length;i++){
                            messagedata[i].index=i+1
                        }


                        if(json.code=='0'){
                           this.setState({
                                dataSource:messagedata,
                                total:json.total
                           })
                            
                        }else{  
                            message.warning(json.message);
                        }
                    })
    }

  	
    pagechange=(page)=>{
        console.log(page)
        var pages=Number(page.current)-1
        let values={pdCheckId:this.state.pdCheckId,limit:10,currentPage:pages}
        this.setdatas(values)
  
    }


  	render() {
    	const { dataSource } = this.state;
    	const columns = this.columns;
    	return (
      		<div className='bgf'>
        		<Table bordered 
                    dataSource={this.state.dataSource} 
                    columns={columns} 
                    rowClassName={this.rowClassName.bind(this)}
                    pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
                    onChange={this.pagechange.bind(this)}
                    />
      		</div>
    	);
  	}
    componentDidMount(){
        this.setState({
            pdCheckId:this.props.pdCheckId
        },function(){
            let values={pdCheckId:this.state.pdCheckId,limit:10,currentPage:0}
            this.setdatas(values)
        })
        

    }
}

function Inventorydiff({pdCheckDetails,pdCheckId}) {
  	return (
	    <div>
	     	<Header type={false} color={true}/>
            <div className='counters'>
	     	    <Searchcomponent pdCheckDetails={pdCheckDetails} pdCheckId={pdCheckId}/>
	      	    <EditableTable pdCheckDetails={pdCheckDetails} pdCheckId={pdCheckId}/>
            </div>
	    </div>
  );
}

function mapStateToProps(state) {
    console.log(state)
    const {pdCheckDetails,pdCheckId} = state.inventory;
  	return {pdCheckDetails,pdCheckId};
}

export default connect(mapStateToProps)(Inventorydiff);
