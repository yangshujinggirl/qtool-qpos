import React from 'react';
import { connect } from 'dva';
import Header from '../../components/Qheader';
import Searchinput from '../../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload,Spin} from 'antd';
import {GetServerData} from '../../services/services';
import { Link } from 'dva/router';
import AdjustTextModal from './components/AdjustTextModal/index.js';
import "../../style/adjustLog.css";
import AntIcon from '../../components/loding/payloding';

//导入--在Searchcomponent组件中
class MyUpload extends React.Component {
  state = {
    fileList: []
  }
  beforeUpload(file) {
    const isSize = file.size / 1024 / 1024 < 1;
    let fileName = file.name;
    let fileType = fileName.split('.')[1];
    if(fileType!='xls'&&fileType!='xlsx') {
      message.error('请选择Excel文件');
      return false;
    }else {
      if (!isSize) {
        message.error('导入文件不得大于1M');
        return false;
      }
    }
  }
  handleChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-2);
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    fileList = fileList.filter((file) => {
        if (file.response) {
          if(file.response.code=='0'){
            let pdAdjustDetails = file.response.pdAdjustDetails;
            let patternTest=/^-?[1-9]\d*$/;
            for(let i=0;i<pdAdjustDetails.length;i++){
              if(pdAdjustDetails[i].adjustQty && patternTest.test(pdAdjustDetails[i].adjustQty) &&  pdAdjustDetails[i].adjustQty>0){
                pdAdjustDetails[i].key=i+1;
                pdAdjustDetails[i].adjustAmount = (Number(pdAdjustDetails[i].adjustQty)*parseFloat(pdAdjustDetails[i].averageRecPrice)).toFixed(2);
              }else{
                pdAdjustDetails[i].key=i+1;
                pdAdjustDetails[i].adjustAmount = (Number(pdAdjustDetails[i].adjustQty)*parseFloat(pdAdjustDetails[i].averageRecPrice)).toFixed(2);
              }
            }
            this.props.Setdate(pdAdjustDetails,file.response.total)
          }else{
              message.error(file.response.message);
          }
          this.props.dispatch({
            type:'spinLoad/setLoading',
            payload:false
          })
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
        name:'mfile',
        beforeUpload:this.beforeUpload
    };
    return (
        <Upload {...props} fileList={this.state.fileList} >
          <Buttonico text='导入损益商品'/>
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

//search组件 在adjust组件中
class Searchcomponent extends React.Component {
  state={
      inputvalue:'',
      dataSourcemessage:[],
      visible: false,
      loading:false
  }
  //设置dataSourcemessage
  revisedaramessages=(messages)=>{
      this.setState({
          dataSourcemessage:messages
      })
  }
  Hindok=()=>{
      const values={adjusts:this.state.dataSourcemessage};
      const result=GetServerData('qerp.pos.pd.adjust.save',values)
      result.then((res) => {
          return res;
      }).then((json) => {
          if(json.code=='0'){
              message.success('损益成功',3,this.callback());
          }else{
              message.error(json.message);
          }
      })
  }

  callback=()=>{
  	this.context.router.push('/goods');
  }
  revisemessage=(messages)=>{
      this.setState({
          inputvalue:messages
      })
  }
  hindsearch=(currentPage)=>{
    this.props.dispatch({
      type:'spinLoad/setLoading',
      payload:true
    })
    const values={
      keywords:this.state.inputvalue,
      limit:100000,currentPage:currentPage
    }
    GetServerData('qerp.pos.pd.spu.query',values)
    .then((json) => {
        if(json.code=='0'){
          let pdSpus=json.pdSpus
          let total=json.total
          this.setState({
            pdSpus:pdSpus,
            total:total
          },()=>{
            for(var i=0;i<pdSpus.length;i++){
              pdSpus[i].key=i
              pdSpus[i].adjustQty=''
            };
            this.props.setdayasouce(pdSpus,this.state.total)
          })
        }else{
          message.error(json.message);
        }
        this.props.dispatch({
          type:'spinLoad/setLoading',
          payload:false
        })
    })
  }
  download=()=>{
      window.open('../static/adjust.xlsx')
  }
  Setdate=(message,total)=>{
      this.props.setdayasouce(message,total)
  }
  //modal
  showModal = () => {
      if(!this.state.dataSourcemessage.length){
          message.error('请先添加损益商品信息');
      }else{
          this.setState({ visible: true });
      }

      // this.setState({ visible: true });
  }
  hideModal = () => {
      const form = this.form;
      this.setState({ visible: false },function(){
          form.resetFields();
      });
  }
  //确定损益
  submitListInfo = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
          return;
      }
      this.setState({ loading:true })
      let data = {};
      data.type=values.type
      data.remark = values.remark;
      data.adjusts = this.state.dataSourcemessage;
      GetServerData('qerp.pos.pd.adjust.save',data)
      .then((json) => {
          if(json.code=='0'){
            this.setState({ loading:false, visible: false })
            message.success('损益成功',3,this.callback());
            form.resetFields();
          }else{
            this.setState({ loading:false })
            message.error(json.message);
          }
      })
    });
  }
  saveFormRef = (form) => {
      this.form = form;
  }
  render(){
    const { loading } =this.state;
    return(
      <div className='clearfix mb10 adjust-v15-style'>
    		<div className='fl clearfix'>
    			<div className='fl btn' onClick={this.download.bind(this)}><Buttonico text='下载损益模板'/></div>
    			<div className='fl btn ml20'>
            <MyUpload
              dispatch={this.props.dispatch}
              Setdate={this.Setdate.bind(this)}
              setLoding={this.props.setLoding}/></div>
          <div className='fl btn ml20'><Link to='/adjustLog'><Buttonico text='查看损益日志'/></Link></div>
    		</div>
  			<div className='fr clearfix'>
    			<div className='fl'>
            <Searchinput
              text='请输入商品条码、商品名称'
              revisemessage={this.revisemessage.bind(this)}
              hindsearch={this.hindsearch.bind(this,0)}/>
          </div>
    			<div className='searchselect clearfix fl'>
            <div className='fl btn ml20 cancel-btn-style'>
              <Link to='/goods'><Buttonico text='取消损益'/></Link>
            </div>
  				  <div className='fl btn ml20 cancel-btn-style' onClick={this.showModal.bind(this)}>
              <Buttonico text='确定损益'/></div>
            <AdjustTextModal
              loading={loading}
              ref={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.hideModal}
              onCreate={this.submitListInfo}/>
          </div>
		    </div>
	    </div>
    )
  }
}

Searchcomponent.contextTypes= {
    router: React.PropTypes.object
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
    		title: '数量',
            dataIndex: 'inventory',
            width:"8%"
  	}, {
    		title: '损益数',
            dataIndex: 'adjustQty',
            width:"8%",
    		render: (text, record, index) => {
      	return (
                  <Input className="adjust-inputwidth" onChange={this.hindchange.bind(this,index)}
                          onBlur={this.hindBlur.bind(this,index)}
                          value={this.state.dataSource[((Number(this.state.page)-1)*10)+index].adjustQty}
                          autoComplete="off"
                         />
      		)
    		}
  	},{
          title: '成本价',
          dataIndex: 'newaverageRecPrice',
          width:"8%"
      },{
          title: '损益金额',
          dataIndex: 'adjustAmount',
          width:"8%"
      }
  	];
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
  setdatasouce=(messages,total)=>{
      for(var i=0;i<messages.length;i++){
          messages[i].newaverageRecPrice=(messages[i].inventory && Number(messages[i].inventory))>0?messages[i].averageRecPrice:messages[i].toBPrice
      }
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
          dataSourc[indexs].adjustAmount =(Number(e.target.value)*parseFloat(dataSourc[indexs].newaverageRecPrice)).toFixed(2);
      }else{
          dataSourc[indexs].adjustQty=e.target.value;
          dataSourc[indexs].adjustAmount =(0*dataSourc[indexs].newaverageRecPrice).toFixed(2);
      }
      this.setState({
          dataSource:dataSourc
      },function(){
          const seracedatasouce=this.props.seracedatasouce
          seracedatasouce(this.state.dataSource)
      })
  }
  hindBlur = (index,e) =>{
      let indexs=((Number(this.state.page)-1)*10)+index;
      let dataSourc=this.state.dataSource;
      let patternTest=/^-?[1-9]\d*$/;
      if(patternTest.test(parseFloat(e.target.value))){
          dataSourc[indexs].adjustQty=parseFloat(e.target.value);
          dataSourc[indexs].adjustAmount =(Number(e.target.value)*parseFloat(dataSourc[indexs].newaverageRecPrice)).toFixed(2);
      }else{
          dataSourc[indexs].adjustQty=parseFloat(e.target.value);
          if(isNaN(parseFloat(e.target.value))){
              dataSourc[indexs].adjustQty=0;
          }
          dataSourc[indexs].adjustAmount =(0*dataSourc[indexs].newaverageRecPrice).toFixed(2);
      }
      this.setState({
          dataSource:dataSourc
      },function(){
          const seracedatasouce=this.props.seracedatasouce
          seracedatasouce(this.state.dataSource)
      })




      // let patternTest=/^-?[1-9]\d*$/;
      // if(!patternTest.test(e.target.value)){
      //     message.error('请输入正确的损益数');
      // }



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
    		<Table
          bordered
          dataSource={this.state.dataSource}
          columns={columns}
          rowClassName={this.rowClassName.bind(this)}
          pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
          onChange={this.pagechange.bind(this)}
          scroll={{y:this.state.windowHeight}}/>
  		</div>
  	);
  }
}

class Adjust extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            loding:false
        }
    }
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
    render(){
      return(
          // <div className='spin-con-box'>
          //     <Spin tip='导入中，请稍后...' spinning={this.state.loding} indicator={<AntIcon/>}>
          //         <Header type={false} color={true} linkRoute="goods"/>
          //         <div className='counters'>
          //             <Searchcomponent dispatch={this.props.dispatch} setdayasouce={this.setdayasouce.bind(this)} ref='search' setLoding={this.setLoding.bind(this)}/>
          //             <EditableTable dispatch={this.props.dispatch} ref='adjust' seracedatasouce={this.seracedatasouce.bind(this)}/>
          //         </div>
          //     </Spin>
          // </div>
          <div className='spin-con-box'>
            <Header type={false} color={true} linkRoute="goods"/>
            <div className='counters'>
              <Searchcomponent
                dispatch={this.props.dispatch}
                setdayasouce={this.setdayasouce.bind(this)}
                ref='search'
                setLoding={this.setLoding.bind(this)}/>
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

export default connect(mapStateToProps)(Adjust);
