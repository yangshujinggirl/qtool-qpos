import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Spin} from 'antd';
import {GetServerData} from '../services/services';
import { Link } from 'dva/router'
import AntIcon from '../components/loding/payloding';


class Searchcomponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settablesouce: [],
            loding:false
        };
    }

    Hindok=()=>{
        const pdCheckDetails=this.state.settablesouce;
        for(var i=0;i<pdCheckDetails.length;i++){
            pdCheckDetails[i].adjustQty=pdCheckDetails[i].difQty
        }
        if(this.props.pdCheckId){
            // const values={adjusts:pdCheckDetails}
            const values={pdCheckId:this.props.pdCheckId};
            const result=GetServerData('qerp.pos.pd.check.adjust',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code =='0'){
                    this.props.initpdCheckId();
                    message.success('损益成功',3,this.callback());
                }else{
                    message.error(json.message);
                }
            })
        }else{
            message.error("暂无盘点损益信息");
        }
    }

    callback=()=>{
        this.context.router.push('/inventory');
    }
    download=()=>{
        let values={pdCheckId:this.props.pdCheckId}
        let Strdatanume=JSON.stringify(values)
        Strdatanume=encodeURI(Strdatanume)
        let url='/erpQposRest/qposrestExport.htm?data='+Strdatanume+'&code=qerp.qpos.pd.check.export'
        window.open(url)
    }
    settablesouce=(messages)=>{
        this.setState({
            settablesouce:messages
        })
    }
    writelog=()=>{
      const payload = {checkId:this.props.pdCheckId}
      GetServerData('qerp.pos.pd.check.log',payload)
    }
    render(){
        return(
            <div className='clearfix'>
	      		<div className='fl clearfix mb10'>
	      			<div className='btn' onClick={this.download.bind(this)}><Buttonico text='下载盘点差异'/></div>
	      		</div>
      			<div className='fr'>
          			<div className='searchselect clearfix'>
	                    <div className='fl btn ml20' onClick={this.writelog.bind(this)}><Link to='/inventory'><Buttonico text='暂不损益'/></Link></div>
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
      		title: '商品条码',
              dataIndex: 'barcode',
              width:"12%"
    	},{
            title: '商品名称',
            dataIndex: 'name',
            width:"12%"
        },{
            title: '商品规格',
            dataIndex: 'displayName',
            width:"12%"
        },{
            title: '差异数量',
            dataIndex: 'difQty',
            width:"8%"
        }
    	];

	    this.state = {
	      	dataSource: [],
	      	count: 2,
            pdCheckId:null,
            total:0,
            windowHeight:""
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
        this.props.setLoding(1)
        const result=GetServerData('qerp.pos.pd.check.info',messages)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                this.props.setLoding(0)
                const messagedata=json.pdCheckDetails;
                for(var i=0;i<messagedata.length;i++){
                    messagedata[i].index=i+1
                }
                this.setState({
                    dataSource:messagedata,
                    total:json.total
                },function(){
                    this.props.dataSources(this.state.dataSource)
                })
            }else{
                this.props.setLoding(0)
                message.warning(json.message);
            }
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
    	const { dataSource } = this.state;
    	const columns = this.columns;
    	return (
      		<div className='bgf' ref="tableWrapper">
        		<Table bordered
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowClassName={this.rowClassName.bind(this)}
                    pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
                    scroll={{y:this.state.windowHeight}}
                    />
      		</div>
    	);
  	}
    componentDidMount(){
        if(this.props.pdCheckId){
            this.setState({
                pdCheckId:this.props.pdCheckId
            },function(){
                let values={pdCheckId:this.state.pdCheckId,limit:100000,currentPage:0}
                this.setdatas(values)
            })
        }
        if(document.body.offsetWidth>800){
            this.setState({
               windowHeight:document.body.offsetHeight-300,
             });
        }else{
           this.setState({
             windowHeight:document.body.offsetHeight-270,
         });
        }
        window.addEventListener('resize', this.windowResize);
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.windowResize);
    }
}



class Inventorydiff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loding:false
        };
    }
    dataSources=(messages)=>{
        const settablesouce=this.refs.user.settablesouce
        settablesouce(messages)
    }

    initpdCheckId = () =>{
        this.props.dispatch({
            type:'inventory/initpdCheckId',
            payload: {pdCheckDetails:[],pdCheckId:null}
        });
    }

    //设置导入loding
    setLoding=(type)=>{
        if(type=='1'){
            this.setState({
                loding:true   
            })
        }
        if(type=='0'){
            this.setState({
                loding:false   
            })
        }
    }

    render() {
        return (
            <div className='spin-con-box'>
                <Spin tip='请稍后...' spinning={this.state.loding} indicator={<AntIcon/>}>
                    <Header type={false} color={true} linkRoute="inventory"/>
                    <div className='counters'>
                        <Searchcomponent  pdCheckId={this.props.pdCheckId} initpdCheckId={this.initpdCheckId} ref='user'/>
                        <EditableTable  pdCheckId={this.props.pdCheckId} dataSources={this.dataSources.bind(this)} setLoding={this.setLoding.bind(this)}/>
                    </div>
                </Spin>
            </div>
        );

    }


}

function mapStateToProps(state) {
    const {pdCheckId} = state.inventory;
  	return {pdCheckId};
}

export default connect(mapStateToProps)(Inventorydiff);
