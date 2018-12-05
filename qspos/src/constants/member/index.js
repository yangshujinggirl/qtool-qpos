import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router'
import Searchinput from '../../components/Searchinput/Searchinput';
import { GetServerData } from '../../services/services';
import { Gettime } from '../../services/data';
import Header from '../../components/header/Header';
import AddEditModal from './components/AddEditModal';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import '../../style/member.css';
import './index.less';

const RadioGroup = Radio.Group;
const columns = [{
      title: '会员姓名',
      dataIndex: 'name',
      width:'9%'
  }, {
      title: '会员电话',
      width:'13%',
      dataIndex: 'mobile'
  }, {
      title: '会员卡号',
      width:'13%',
      dataIndex: 'cardNo'
  },{
      title: '会员级别',
      width:'13%',
      dataIndex: 'levelStr'
  },{
      title: '账户余额',
      width:'13%',
      dataIndex: 'amount'
  },{
      title: '会员积分',
      width:'13%',
      dataIndex: 'point'
  },{
      title: '操作',
      width:'13%',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return <span onClick={record.onOperateClick} className="handle-edit-btn">修改</span>
      },
  },{
      title: '会员信息明细',
      width:'13%',
      dataIndex: 'mbmerinfo',
      render: (text, record, index) => {
          return (
            <Link to={{pathname:'/member/info',query:{id:record.mbCardId}}}>查看</Link>
          )
      }
  }];
//主页面
class Member extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      keywords:'',
      visible:false,
      mbCardId:null,
      mbCardInfo:{
        checked:true,
        mbCardBirths:[{key:-1,type:1}]
      },
      visibleSure:false,
      cardNo:'',
      loading:false
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type:'member/fetch',
      payload:{}
    })
  }
  upDateDetail(value) {
    let { mbCardInfo } =this.state;
    mbCardInfo = {...mbCardInfo,...value};
    this.setState({ mbCardInfo });
  }
  //修改
  onOperateClick(record) {
    if(!record) {
      this.setState({ visible:true });
      return;
    }
    this.setState({ mbCardId:record.mbCardId })
    let values={mbCardId:record.mbCardId}
    GetServerData('qerp.pos.mb.card.info',values)
    .then((json) => {
        if(json.code=='0'){
            let { mbCardInfo } =json;
            if(mbCardInfo&&mbCardInfo.mbCardBirths.length>0){
              const barthType=mbCardInfo.mbCardBirths[0].type;
              mbCardInfo.mbCardBirths.map((el,index) => el.key = index);
              mbCardInfo.checked = barthType == 1?true:false;
            }else{
              mbCardInfo.checked = true;
              mbCardInfo.mbCardBirths=[{key:-1,type:1}]
            }
            this.setState({ mbCardInfo, visible:true })
        }
    })
  }
  revisemessage=(messages)=>{
      this.setState({
          keywords:messages
      })
  }
  //分页
  changePage(currentPage) {
    currentPage--;
    this.props.dispatch({
      type:'member/fetch',
      payload: {
        keywords:this.state.keywords,
        currentPage:currentPage
      }
    })
  };
  //修改pageSize
  changePageSize =(values)=> {
    this.props.dispatch({
      type:'member/fetch',
      payload: values
    });
  }
  //搜索
  hindsearch=()=>{
    let limitSize = localStorage.getItem('pageSize');
    this.props.dispatch({
      type: 'member/fetch',
      payload: {
        limit:10,
        keywords:this.state.keywords,
      }
    });
  }
  //提交保存
  handleOk(value,func) {
    if(this.state.mbCardId) {
      value.mbCardId=this.state.mbCardId;
    }
    this.setState({ loading:true })
    GetServerData('qerp.pos.mb.card.save',{ mbCardInfo: value })
    .then((json) => {
      if(json.code=='0'){
        if(!this.state.mbCardId){
          this.setState({
            visibleSure:true,
            cardNo:json.cardNo
          })
        }else{
          message.success('会员信息修改成功',1)
        }
        typeof func == 'function' && func();//回调
        this.props.dispatch({
           type:'member/fetch',
           payload: {limit:10}
         });
      }else{
        message.error(json.message);
      }
      this.setState({ loading:false })
    })
  }
  //关闭弹框
  handleCancel = () => {
    this.setState({
      visible: false,
      mbCardInfo:{
        checked:true,
        mbCardBirths:[{key:-1,type:1}]
      },
      mbCardId:null
    });
  }
  //新建成功确认
  surehandleOk=()=>{
    this.setState({ visibleSure: false });
  }
  //新建成功取消
  surehandleCancel=()=>{
    this.setState({ visibleSure: false });
  }
  render(){
    const { visible, mbCardInfo, mbCardId, visibleSure, cardNo, loading } =this.state;
    const { mbCards, data } =this.props;
    let texts = mbCardId?'修改会员':'新增会员';
    return (
      <div className="member-list-pages">
        <Header type={false} color={true}/>
        <div className='search-component'>
         <div className='clearfix mb10'>
           <div className='fl'>
               <span className="handle-add-btn" onClick={()=>this.onOperateClick()}>新增会员</span>
               <Link to='/memberBirth' className="handle-add-btn look-btn">查看会员生日</Link>
           </div>
           <div className='fr'>
             <Searchinput
               text='请输入会员姓名、手机、会员卡号'
               revisemessage={this.revisemessage.bind(this)}
               hindsearch={this.hindsearch.bind(this)}/>
           </div>
         </div>
        </div>
        <div className='counters goods-counters'>
          <Qtable
            columns={columns}
            dataSource={mbCards}
            onOperateClick={this.onOperateClick.bind(this)}/>
          <Qpagination
            sizeOptions="2"
            onShowSizeChange={this.changePageSize.bind(this)}
            onChange={this.changePage.bind(this)}
            data={data}/>
        </div>
        <AddEditModal
          loading={loading}
          visible={visible}
          data={mbCardInfo}
          texts={texts}
          upDateDetail={this.upDateDetail.bind(this)}
          mbCardId={mbCardId}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
          dispatch={this.props.dispatch}
          type={true}/>
        <Modal
          closable={false}
          className='member-nextmodel'
          title=""
          visible={visibleSure}
          onOk={this.surehandleOk}
          onCancel={this.surehandleCancel}
          footer={[<div key="submit" ><span onClick={this.surehandleOk}>确定</span></div>]}>
            <p>会员新增成功</p>
            <p>会员卡号:<span>{cardNo}</span></p>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    const { mbCards, loding, data } = state.member;
    return { mbCards, loding, data };
}

export default connect(mapStateToProps)(Member);
