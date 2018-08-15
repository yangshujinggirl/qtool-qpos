import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico,Buttonicos} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload,Radio,Spin} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../services/services';
import Editmodel from '../constants/inventory/model'
import '../constants/inventorydiffLog/inventorydiff.css'
import AntIcon from '../components/loding/payloding';
import Qpagination from '../components/Qpagination/index.js';
import './Inventory0.less';

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
                  this.props.onChange('upload',{pdCheckId})

              }else{
                  message.warning(file.response.message);
              }
              return file.response.status === 'success';
          }
          return true;
        });
        this.setState({ fileList });
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
    //radioChange
    radioChange=(e)=>{
      let value = e.target.value;
      this.props.handleEvent('sort',{sortType:value});
    }

    render(){
        return(
            <div className='clearfix mb10 inventory-index-title'>
  	      		<div className='fl clearfix'>
  	      			<div
                  className='fl btn'
                  onClick={()=>this.props.handleEvent('download')}>
                  <Buttonico text='下载盘点模板'/>
                </div>
  	      			<div className='fl btn ml20'>
                  <MyUpload
                    onChange={this.props.handleEvent}/>
                </div>
                <div className='fl btn ml20'>
                  <Link to='/inventorydiffLog'>
                    <Buttonicos text='店铺盘点日志'/>
                  </Link>
                </div>
  	      		</div>
        			<div className='fr' style={disblock}>
          			<div className='searchselect clearfix'>
                  <div className='fl ml20 radiogr'>
                    <RadioGroup onChange={this.radioChange.bind(this)} defaultValue='1'>
                      <Radio value='1' className='listmodel'>按照导入顺序排序</Radio>
                      <Radio value='2' className='listmodel'>按照差异倒序排序</Radio>
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
                    <Editmodel
                      recorddata={record}
                      getNewcheckData={this.props.onChange}
                      index={index}/>
                )
            }
        }];
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
    	return (
            <Table
              bordered
              dataSource={this.props.dataSource}
              columns={columns}
              rowClassName={this.rowClassName.bind(this)}
              pagination={false}/>
    	);
    }
}

class Inventory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          dataSource:[],
          loding:false,
          pdCheckId:'',
          limit:16,
          current:0,
          total:null,
          sort:1
        };
      }
    handleEvent(type,values) {
      switch(type) {
        case 'download':
          this.goDownLoad()
          break;
        case 'upload':
          this.getList(values)
          break;
        case 'sort':
          this.goSort(values)
          break;
      }
    }
    //下载
    goDownLoad() {
      window.open('../static/inventory.xlsx')
    }
    //上传
    getList=({
      pdCheckId=this.state.pdCheckId,
      limit=this.state.limit,
      currentPage=this.state.currentPage,
      sortType=this.state.sort
      })=>{
      this.setState({
        loding:true
      })
      let values = {
        pdCheckId,
        limit,
        currentPage,
        sortType
      }
      GetServerData('qerp.pos.pd.check.info',values)
      .then((res) => {
        const { code, pdCheckDetails, currentPage, limit, total } =res;
        if(code=='0'){
          this.setState({
            pdCheckId:values.pdCheckId,
            dataSource:pdCheckDetails,
            currentPage,
            limit,
            total
          })
        }else{
          message.warning(res.message);
        }
        this.setState({
          loding:false
        })
      })
    }
    //排序
    goSort(values) {
      this.setState({
        sort:values.sort
      })
      this.getList(values)
    }
    //修改盘点数量
    handleChange =(qty,record)=> {
      let state = 'nothing'
      let diffQty = 0;
      let inv = record.inventory;
      let oldQty = record.checkQty;
      if(inv == '0'){
        if(oldQty == 0 && qty > 0){
          state = 'add'
        }
        if(oldQty > 0 && qty == 0){
          state = 'sub'
        }
      }
      diffQty = Number(qty) - Number(oldQty)
      let payload = {
        pdCheckId:this.state.pdCheckId,
        checkDetailId:record.checkDetailId,
        qty:qty,
        state:state,
        diffQty:diffQty
      }
      GetServerData('qerp.pos.pd.check.updateQty',payload)
      .then((res) => {
        if(res.code == '0') {
          let { dataSource } = this.state;
          //前端更新数据，不进行后台交互
          dataSource.map((el) => {
            if(el.barcode == record.barcode) {
              el.checkQty =qty
            }
            return el;
          })
          this.setState({
            dataSource
          })
        }
      })
    }
    changePage = (currentPage) => {
      currentPage--;
      this.setState({currentPage});
      this.getList({currentPage})
    }
    //修改pageSize
    changePageSize =(values)=> {
      this.getList(values)
    }
    render() {
      const dataList = {
        currentPage:this.state.currentPage,
        limit:this.state.limit,
        total:this.state.total
      }
      const { dataSource } =this.state;
      return (
        <div className='inventory-content-pages'>
          <Spin tip='加载中，请稍后...' spinning={this.state.loding} indicator={<AntIcon/>}>
            <Header type={false} color={true} linkRoute="goods"/>
            <div className='main-content-action-wrap'>
              <Searchcomponent
                handleEvent={this.handleEvent.bind(this)}/>
              <div className="data-list-wrap">
                <EditableTable
                  onChange={this.handleChange.bind(this)}
                  dataSource={dataSource}/>
                {
                  dataSource.length>0&&
                  <Qpagination
                    sizeOptions="2"
                    onShowSizeChange={this.changePageSize}
                    data={dataList}
                    onChange={this.changePage}/>
                }
              </div>
            </div>
          </Spin>
        </div>
      );
    }
}


export default connect()(Inventory);
