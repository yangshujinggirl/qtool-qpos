
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';
import NP from 'number-precision'
import Operationcaster from './components/Operationcaster.jsx';
import Header from '../../components/header/Header';
import EditableTable from './components/table';
import PayModal from './components/PayModal';
import {GetServerData} from '../../services/services';
import { dataedit } from '../../utils/commonFc';
import EntryOrdersModal from './components/EntryOrdersModal';
import PutedOrderListModal from './components/PutedOrderListModal';

import './index.less';
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()((props) => {
	const { visible, onCancel, form ,hindPress} = props;
	const { getFieldDecorator } = form;
	return (
		<Modal
			visible={visible}
			okText="Create"
			onCancel={onCancel}
			onOk={onCancel}
			footer={null}
			closable={false}
			width={430}
			className='popmodel discount-modal'>
			<Form layout="inline">
			<FormItem label="请输入折扣数">
				{
					getFieldDecorator('title', {
						rules: [{
							required: true,
							message: '请输入最多一位小数的折扣数',
							pattern:/^([1-9][0-9]*)+(.[0-9]{1,1})?$/ }]
					})(
						<Input  autoComplete="off" style={{width:'200px'}} onKeyUp={hindPress}/>
					)
				}
			</FormItem>
			</Form>
		</Modal>
	);
});

class Cashierindex extends React.Component {
    constructor(props,context) {
      super(props,context);
      this.state = {
        checkPrint:false,
        visible: false,
        visibleOne:false,
        visibleTwo:false,
        allOrderList:[],
        fixedNum:['1','2','3','4','5']
      };
    }
    componentDidMount(){
			console.log('12222222222')
      this.getAllOrderListApi()//获取挂单列表数据
      this.props.dispatch({
          type:'dataManage/initKey',
          payload: "1"
      })
      window.addEventListener('click', this.inputclick,true);
      window.addEventListener('keydown', this.handleokents,true);
      window.addEventListener('keyup', this.handleokent,true);
    }
    componentWillUnmount(){
      window.removeEventListener('click', this.inputclick,true);
      window.removeEventListener('keydown', this.handleokents,true);
      window.addEventListener('keyup', this.handleokent,true);
    }
    //条码表单聚焦
    inputclick=()=>{
      var x = document.activeElement.tagName;
      if(x=='BODY'){
          this.props.meths.focustap()
      }
    }
    handleokents=(e)=>{
      if(e.keyCode==114){
         e.preventDefault()
      }
    }
    //显示折扣弹框
    showModal = () => {
  		this.setState({ visible: true });
  	}
    //关闭折扣弹框
  	handleCancel = () => {
  		const form = this.form;
  		form.resetFields()
  		this.setState({ visible: false });
  	}
    //输入折扣enter键
  	hindPress=(e)=>{
  		if(e.keyCode==13){
  			const form = this.form;
  			form.validateFields((err, values) => {
  				if (!err) {
  					const values=e.target.value
  					this.takezhe(values)
  					this.handleCancel()
  				}
  			});
  		}
  	}
    //移除商品
    rowonDelete=()=>{
      const themeindex=this.props.themeindex
      const datasouce=this.props.datasouce.splice(0)
      datasouce.splice(themeindex, 1);
      this.props.dispatch({
          type:'cashier/datasouce',
          payload:datasouce
      })
    }
    //获取所有挂单
    getAllOrderListApi() {
      GetServerData('qerp.web.qpos.od.order.takeall')
      .then((res) => {
        const { code, putOrders, message } =res;
				if(code == '0') {
					this.setState({ allOrderList: putOrders||[] });
				} else {
					message.error(message);
				}
      },(err) => {
        message.error(err.message);
      })
    }
    //挂单
    // takeout=()=>{
    //   const datasouce=this.props.datasouce
    //   sessionStorage.setItem('olddatasouce',JSON.stringify(datasouce));
    //   this.resetData()
    // }
    //挂单
    takeout=()=>{
      let { fixedNum, allOrderList } = this.state;
      // let allOrderList = [{putNo:'1'},{putNo:'2'},{putNo:'3'},{putNo:'4'}];
      // let allOrderList = [{putNo:1},{putNo:2},{putNo:3},{putNo:4},{putNo:5}];
      let currentNum=[];
      if(allOrderList.length==5) {
        message.error('挂单位已满，无法挂单');
        return;
      }
      fixedNum.forEach((value,index) => {
        let count = 0;
        allOrderList.forEach((el,idx) => {
          if(el.putNo==value) {
            count++
          }
        })
        if(count == 0) {
          currentNum.push(value)
        }
      })
      this.setState({ visibleOne: true, currentOrderNo:currentNum[0] })
    }
    //取单
    takein=()=>{
      const { allOrderList } =this.state;
      if(allOrderList.length==1) {
        let putNo = allOrderList[0].putNo;
        this.getOrderApi(putNo);
      } else {
        this.setState({ visibleTwo: true })
      }
    }
    //取单
    getOrderApi(orderNo) {
      GetServerData('qerp.web.qpos.od.order.take',{ putNo: orderNo })
      .then((res) => {
        const { code, message, putOrder } =res;
        if(code !== '0') {
          message.error(message);
          return;
        }
        let { mbCardInfo, putAmount, putPrice, putProducts } =putOrder;
        this.props.dispatch({
          type:'cashier/memberlist',
          payload:{
            ismember:true,
            memberinfo:mbCardInfo
          }
        })
        this.props.dispatch({
          type:'cashier/datasouce',
          payload:putProducts
        })
        this.setState({ visibleTwo: false });
      },(err) => {
        message.error('message')
      })
    }
    //挂单
    putOrderApi(value,func) {
      const { currentOrderNo } = this.state;
      const { datasouce, totolamount, totolnumber, memberinfo } =this.props;
      const { isLocalShop, ...mbCardInfo } = memberinfo;
      const params = {
              putNo:currentOrderNo,
              putAmount:totolnumber,
              putPrice:totolamount,
              putMessage:value,
              mbCardInfo,
              putProducts:datasouce
            }
      GetServerData('qerp.web.qpos.od.order.put',{ putOrder: params })
      .then((res) => {
        const { code, putOrders } =res;
        if(code == '0') {
          typeof func == 'function' && func();
					// console.log()
          // this.context.router.push('/cashier')
					// this.props.history.push('/cashier')
					location.reload()
        }
      })
    }
    onCancelOne() {
      this.setState({ visibleOne: false })
    }
    onCancelTwo() {
      this.setState({ visibleTwo: false })
    }
    // //取单
    // takein=()=>{
    //   if(sessionStorage.olddatasouce){
    //     let datasouce=eval('('+sessionStorage.olddatasouce+')')
    //     this.props.dispatch({
    //         type:'cashier/datasouce',
    //         payload:datasouce
    //     })
    //   }
    // }

    //整单折扣值价格重置
    takezhe=(value)=>{
      var dis=value
      let role=sessionStorage.getItem('role');
      if(dis<8) {
        switch(role) {
          case '1':
          case '2':
          dis = 8;
          break;
        case '3':
          dis = 9;
          break;
        }
      }
     const datasouce=this.props.datasouce.splice(0)
     for(var i=0;i<datasouce.length;i++){
        datasouce[i].discount=dis
        var zeropayPrice=String(NP.divide(NP.times(datasouce[i].toCPrice, datasouce[i].qty,datasouce[i].discount),10)); //计算值
        const editpayPrice =dataedit(zeropayPrice)
        if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
          datasouce[i].payPrice=String(NP.plus(editpayPrice, 0.01));
        }else{
          datasouce[i].payPrice=editpayPrice
        }
     }
     this.props.dispatch({
          type:'cashier/datasouce',
          payload:datasouce
      })
    }
    //键盘code事件
    handleokent=(e)=>{
      let code = e.keyCode;
      switch(code) {
        case 32:
          //输入挂单备注时禁止结算事件
          if(e.target.id != 'forbid-space') {
            this.clearingEvent();
          }
          break;
        case 9:
          if(!this.props.onBlur) {
            this.props.meths.focustap()
          }
          break;
        case 113:
          this.takeout();
          break;
        case 114:
          this.takein();
          break;
        case 115:
          this.rowonDelete();
          break;
        case 38:
          this.upArrowEvent();
          break;
        case 40:
          this.downArrowEvent();
          break;
      }
    }
    //上箭头事件
    upArrowEvent() {
      let { themeindex, datasouce } = this.props;
      themeindex = Number(themeindex);
      if(themeindex) {
        themeindex--;
      } else {
        themeindex = Number(datasouce.length)-1;
      }
      this.props.dispatch({
          type:'cashier/themeindex',
          payload:themeindex
      });
    }
    //下箭头事件
    downArrowEvent() {
      let { themeindex, datasouce } = this.props;
      themeindex = Number(themeindex);
      if( themeindex == (datasouce.length-1)) {
        themeindex = 0;
      } else {
        themeindex++;
      }
      this.props.dispatch({
          type:'cashier/themeindex',
          payload:themeindex
      });
    }
    //结算事件
    clearingEvent() {
      this.props.meths.focustap();
      const visible=this.props.payvisible;
      if(visible){//结算按钮
        this.props.meth1.hindpayclick()
      }else{
        this.showModalEvent()
      }
    }
    //显示结算弹框//出弹窗
    showModalEvent() {
      const { totolnumber, totolamount } = this.props;
      //判断系统默认选择是否打印
      if(Number(totolnumber)>0 && parseFloat(totolamount)>0){
          GetServerData('qerp.pos.sy.config.info')
          .then((json) => {
              if(json.code == "0"){
                  if(json.config.submitPrint=='1'){
                      const checkPrint=true
                      this.props.dispatch({
                          type:'cashier/changeCheckPrint',
                          payload:checkPrint
                      })
                  }else{
                      const checkPrint=false
                      this.props.dispatch({
                          type:'cashier/changeCheckPrint',
                          payload:checkPrint
                      })
                  }
              }
          })
          this.props.meth1.initModel()
      }else{
          message.error('数量为0，不能结算')
          return
      }
    }
    //初始化清空数据
    resetData=()=>{
      this.props.dispatch({
        type:'cashier/initstate',
        payload:{}
      })
      this.props.meths.focustap()
    }

    render() {
			console.log(this.props)
      const { datasouce } =this.props;
      const { visibleOne, visibleTwo, currentOrderNo, allOrderList } =this.state;
      return(
        <div className="cashier-wrap-pages">
          <Header type={true} color={true}/>
          <div className='counter cashier-counter-style'>
            <EditableTable/>
          </div>
          <div className='mt30 footer'>
            <div className='clearfix' style={{padding:'0 30px'}}>
      				<div className='btn fr ml20'>
      					<Button  onClick={()=>this.showModal()} className='handle-btn'>整单折扣</Button>
      				</div>
      				<div className='btn fr ml20' onClick={this.rowonDelete.bind(this)}>
                <Button className='handle-btn'>移除商品F4</Button>
              </div>
      				<div className='btn fr ml20' onClick={this.takein.bind(this)}>
                <Button
                  className='handle-btn'
                  disabled={ allOrderList.length>0?false:true}>
                  取单F3
                </Button>
              </div>
      				<div className='btn fr' onClick={this.takeout.bind(this)}>
                <Button className='handle-btn' disabled={datasouce.length>0?false:true}>挂单F2</Button>
              </div>
      				<CollectionCreateForm
      					ref={(form) => this.form = form}
      					visible={this.state.visible}
      					onCancel={this.handleCancel}
      					hindPress={this.hindPress}/>
      			</div>
            <div className='mt20'>
              <Operationcaster
                color={true}
                type={false}
                index={true}
                userplace='1'/>
            </div>
          </div>
          <PayModal ref='pay' initdata={this.resetData.bind(this)}/>
          <EntryOrdersModal
            currentOrderNo={currentOrderNo}
            onOk={this.putOrderApi.bind(this)}
            onCancel={()=>this.onCancelOne()}
            visible={visibleOne}/>
          <PutedOrderListModal
            data={allOrderList}
            getOrder={this.getOrderApi.bind(this)}
            onCancel={()=>this.onCancelTwo()}
            visible={visibleTwo}/>
        </div>
      )
    }
}

function mapStateToProps(state) {
    const {
            datasouce,
            meths,
            onBlur,
            payvisible,
            totolnumber,
            totolamount,
            meth1,
            themeindex,
            checkPrint,
            memberinfo}=state.cashier
    return {
            datasouce,
            meths,
            onBlur,
            payvisible,
            totolnumber,
            totolamount,
            meth1,
            themeindex,
            checkPrint,
            memberinfo
          };
}

Cashierindex.contextTypes= {
    router: React.PropTypes.object
}
export default connect(mapStateToProps)(Cashierindex);
