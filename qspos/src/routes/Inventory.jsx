import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico,Buttonicos} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload,Radio} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../services/services';
import Editmodel from '../constants/inventory/model'
import '../constants/inventorydiffLog/inventorydiff.css'


const RadioGroup = Radio.Group;
const disnone={display:'none'}
const disblock={display:'block'}

//导入
class MyUpload extends React.Component {
    state = {
        fileList: []
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.filter((file) => {
            if (file.response) {
                if(file.response.code=='0'){
                    const pdCheckId=file.response.pdCheckId
                    let values={pdCheckId:pdCheckId,limit:100000,currentPage:0}
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
        dataSourcemessage:[],
        radiovalue:'1'
    }
    revisedaramessages=(messages)=>{
        this.setState({
            dataSourcemessage:messages,
            inventorygoods:true
        })
    }
    Setdate=(message,total,id)=>{
        for(var i=0;i<message.length;i++){
            message[i].key=i+1
        }
        this.props.setdayasouce(message,total,id)
    }
    Setdates=(messages)=>{
        const Setdates=this.refs.up.setdatas
        Setdates(messages)
    }
    download=()=>{
        window.open('../static/inventory.xlsx')
    }

    //radioChange
    radioChange=(e)=>{
        this.setState({
            radiovalue: e.target.value,
        },function(){
            //根据值进行排序
            if(this.state.radiovalue=='1'){
                this.improveDataType()
            }
            if(this.state.radiovalue=='2'){
                this.DiffDataType()
            }
        });
    }

    //按照导入顺序排序
    improveDataType=()=>{
        const source = this.state.dataSourcemessage
        const result = source.sort(this.byOrder("checkDetailId"))
        this.props.getDataSource(result)
    }
    //按照差异倒序排序
    DiffDataType=()=>{
      const source = this.state.dataSourcemessage
      const result = source.sort(this.byDiffQty("difQty"))
      this.props.getDataSource(result)
    }
    byOrder=(index)=>{
      return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[index];
          b = p[index];
          if (a === b) {
            return 0;
          }
          if (typeof a === typeof b) {
            return a < b ? -1 : 1;
          }
          return typeof a < typeof b ? -1 : 1;
        }
      }
    }
    byDiffQty=(diffQty)=>{
      return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[diffQty];
          b = p[diffQty];
          if (Math.abs(a) === Math.abs(b)) {
            return 0;
          }
          if (typeof a === typeof b) {
            return Math.abs(a) > Math.abs(b) ? -1 : 1;
          }
          return typeof Math.abs(a) > typeof Math.abs(b) ? -1 : 1;
        }
      }
    }
    render(){
        return(
            <div className='clearfix mb10 inventory-index-title'>
	      		<div className='fl clearfix'>
	      			<div className='fl btn' onClick={this.download.bind(this)}><Buttonico text='下载盘点模板'/></div>
	      			<div className='fl btn ml20'><MyUpload Setdate={this.Setdate.bind(this)} dispatch={this.props.dispatch} ref='up'/></div>
                    <div className='fl btn ml20'><Link to='/inventorydiffLog'><Buttonicos text='店铺盘点日志'/></Link></div>
	      		</div>
      			<div className='fr' style={this.state.inventorygoods?disblock:disnone}>
          			<div className='searchselect clearfix'>
                        <div className='fl ml20 radiogr'>
                            <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.radiovalue}>
                                <Radio value='1'>按照导入顺序排序</Radio>
                                <Radio value='2'>按照差异倒序排序</Radio>
                            </RadioGroup>
                        </div>
	                    <div className='fl btn ml20'><Link to='/goods'><Buttonico text='取消盘点'/></Link></div>
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
            title: '商品条码',
            dataIndex: 'barcode',
            width:"10%"
        },{
            title: '商品名称',
            dataIndex: 'name',
            width:"12%"
        }, {
      		title: '规格',
            dataIndex: 'displayName',
            width:"12%"
    	}, {
            title: '系统数量',
            dataIndex: 'inventory',
            width:"8%"
        },{
      		title: '盘点数',
            dataIndex: 'checkQty',
            width:"8%"
        },{
            title: '操作',
            dataIndex: 'opera',
            width:"8%",
            render: (text, record, index) => {
                return (
                    <Editmodel recorddata={record}  getNewcheckData={this.getNewcheckData.bind(this,record.checkQty,index)} index={index}/>
                )
            }
        }];
        this._isMounted = false;
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

    //改变盘点数
    getNewcheckData=(olddata,index,data)=>{
      //调用修改盘点数量接口
      const currentItem = this.state.dataSource[index]
      let state = 'nothing'
      let diffQty = 0
      if(currentItem.inventory == '0'){
        if(olddata == 0 && data > 0){
          state = 'add'
        }
        if(olddata > 0 && data == 0){
          state = 'sub'
        }
      }
      diffQty = Number(data) - Number(olddata)
      let payload = {
        pdCheckId:this.state.pdCheckId,
        checkDetailId:currentItem.checkDetailId,
        qty:data,
        state:state,
        diffQty:diffQty
      }
      let inv = currentItem.inventory
      const result=GetServerData('qerp.pos.pd.check.updateQty',payload)
      result.then((res) => {
        return res;
      }).then((json) => {
        if(json.code =='0'){
          this.changeDiffQty(index,inv,data)
        }else{
          message.warning(json.message);
        }
      })
    }

    setdatasouce=(messages,total,id)=>{
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
        var pages=Number(page.current)-1
        let values={pdCheckId:this.state.pdCheckId,limit:10,currentPage:pages}
        const setdatas=this.props.setdatas
        setdatas(values)
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

    changeDiffQty = (index,inv,qty) =>{
      const oldDataSource = this.state.dataSource
      oldDataSource[index].checkQty=qty
      oldDataSource[index].difQty = String(Number(qty)-Number(inv))
      this.setState({
        dataSouce:oldDataSource
      },function(){
        const seracedatasouce=this.props.seracedatasouce
        seracedatasouce(oldDataSource)
      })
    }

  	render() {
    	const columns = this.columns;
    	return (
      		<div className='bgf bgf-goods-style' ref="tableWrapper">
                <Table
                bordered
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
            window.addEventListener('resize', this.windowResize);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }
}

class Inventory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          datasouce:[]
        };
      }

    setdayasouce=(messages,total,id)=>{
        const setdatasouce=this.refs.inventory.setdatasouce
        setdatasouce(messages,total,id)
    }

    seracedatasouce=(messages)=>{
        const revisedaramessages=this.refs.search.revisedaramessages
        revisedaramessages(messages)
    }

    setdatas=(messages)=>{
        const setdatas=this.refs.search.Setdates
        setdatas(messages)
    }

    getDataSource=(dataSource)=>{
      this.setState({
        dataSource:dataSource
      })
    }

    render() {
        return (
            <div>
                <Header type={false} color={true} linkRoute="goods"/>
                <div className='counters'>
                    <Searchcomponent setdayasouce={this.setdayasouce.bind(this)} ref='search' dispatch={this.props.dispatch} getDataSource={this.getDataSource.bind(this)}/>
                    <EditableTable ref='inventory' seracedatasouce={this.seracedatasouce.bind(this)} setdatas={this.setdatas.bind(this)} />
                </div>
            </div>
        );
    }
}


export default connect()(Inventory);
