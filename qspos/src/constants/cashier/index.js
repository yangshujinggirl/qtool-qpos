
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Table, Row, Col, Select, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';
import NP from 'number-precision';
import {GetServerData} from '../../services/services';
import { dataedit } from '../../utils/commonFc';
import Header from '../../components/Qheader';
import EntryOrdersModal from './components/EntryOrdersModal';
import PutedOrderListModal from './components/PutedOrderListModal';
import OperationlLeft from './components/OperationlLeft';

import EditableTable from './components/EditableTable';
import PayModal from './components/PayModal';
import './index.less';

const FormItem = Form.Item;
const Option =  Select.Option;

const CollectionCreateForm = Form.create()((props) => {
	const { visible, onCancel, form ,hindPress} = props;
	const { getFieldDecorator } = form;
	return (
		<Modal
			title="整单折扣"
			visible={visible}
			okText="Create"
			onCancel={onCancel}
			onOk={onCancel}
			footer={null}
			closable={false}
			width={430}
			className='popmodel cashier-discount-modal'>
				<Form layout="inline">
					<Row><Col span={24}>整单折扣仅对非活动商品生效</Col></Row>
					<FormItem label="请输入折扣数:">
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
        fixedNum:['1','2','3','4','5'],
				isPhone:false,
				loading: false,//挂单按钮loading
				isKeySpace:true//是否可以空格结算
      };
			this.barcodeRefs=null;//条码框真实dom
    }
    componentDidMount(){
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
		//获取条码框真实dom;
		setDom(value) {
			this.barcodeRefs = value;
			this.focustap()
		}
		//条码框聚焦
		focustap=()=>{
			if(!this.barcodeRefs) {
				return;
			}
			const ValueorderNoses=ReactDOM.findDOMNode(this.barcodeRefs)
			// const ValueorderNoses=this.refs.barcodeRefs.input
			ValueorderNoses.focus()
			this.props.dispatch({
				type:'cashier/onbule',
				payload:false
			})
		}
    //条码表单聚焦
    inputclick=()=>{
      var x = document.activeElement.tagName;
      if(x=='BODY'&&this.props.location.pathname=='/cashier'){
          // this.props.meths.focustap()
					this.focustap()
      }
    }
    handleokents=(e)=>{
      if(e.keyCode==114){
         e.preventDefault()
      }
    }
    //显示折扣弹框
    showModal = () => {
  		this.setState({ visible: true, isKeySpace:false });
  	}
    //关闭折扣弹框
  	handleCancel = () => {
  		const form = this.form;
  		form.resetFields()
  		this.setState({ visible: false, isKeySpace:true });
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
			//重置活动列表
			this.props.dispatch({
				type:'cashier/getActivityList',
				payload:{
					currentActivityList:[],
					selectActivityId:'all'
				}
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
    takeout=()=>{
      let { fixedNum, allOrderList } = this.state;
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
      this.setState({ visibleOne: true, currentOrderNo:currentNum[0], isKeySpace: false })
    }
    //取单
    takein=()=>{
      const { allOrderList } =this.state;
      if(allOrderList.length==1) {
        let putNo = allOrderList[0].putNo;
        this.getOrderApi(putNo);
      } else {
        this.setState({ visibleTwo: true, isKeySpace: false })
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
				this.setState({ isPhone: JSON.parse(mbCardInfo.isMoreShop)})//查询多会员状态
				this.getAllOrderListApi();//更新挂单列表
				this.props.dispatch({//更新会员手机号到页面
					type:'cashier/cardNoMobile',
					payload:mbCardInfo.mobile
				})
        this.props.dispatch({//更新会员信息
          type:'cashier/memberlist',
          payload:{
            ismember:mbCardInfo.mbCardId?true:false,
            memberinfo:mbCardInfo
          }
        })
        this.props.dispatch({//更新订单信息
          type:'cashier/datasouce',
          payload:putProducts
        });
				//处理第一条订单参加活动的显示。---yangjing
				let currentActivityList=[], selectActivityId='all';
				putProducts.map((el,index) => {
					if(el.spActivities&&el.spActivities.length>0&&index==0) {
						selectActivityId = el.activityId;
						currentActivityList = el.spActivities;
					}
				})
				console.log(currentActivityList)
				this.props.dispatch({
          type:'cashier/getActivityList',
          payload:{currentActivityList,selectActivityId}
        });
        this.setState({ visibleTwo: false, isKeySpace:true });
      },(err) => {
        message.error('message')
      })
    }
    //挂单
    putOrderApi(value,func) {
      const { currentOrderNo } = this.state;
      const { datasouce, totolamount, totolnumber, memberinfo } =this.props;
      const params = {
              putNo:currentOrderNo,
              putAmount:totolnumber,
              putPrice:totolamount,
              putMessage:value,
              mbCardInfo:memberinfo,
              putProducts:datasouce
            }
						this.setState({ loading: true });
      GetServerData('qerp.web.qpos.od.order.put',{ putOrder: params })
      .then((res) => {
        const { code, putOrders } =res;
        if(code == '0') {
					message.success(`挂单成功，挂单号：0${currentOrderNo}`);
          typeof func == 'function' && func();
					this.resetData();
					this.getAllOrderListApi();//更新挂单列表
        }
				this.setState({ loading: false });
      })
    }
    onCancelOne() {
      this.setState({ visibleOne: false, isKeySpace:true })
    }
    onCancelTwo() {
      this.setState({ visibleTwo: false, isKeySpace:true })
    }
    //整单折扣值价格重置
    takezhe=(value)=>{
	    var dis=value
	    let role=sessionStorage.getItem('role');
			switch(role) {
				case '1':
				case '2':
				if(dis<=6) {
					dis = 6;
				}
				break;
			case '3':
				if(dis<=9) {
					dis = 9;
				}
				break;
			}
			let datasouce=this.props.datasouce.splice(0);

			for(var i=0;i<datasouce.length;i++){
				if(datasouce[i].isJoin=='0') {//活动商品不参与整单折扣；
					datasouce[i].discount=dis;
					var zeropayPrice=String(NP.divide(NP.times(datasouce[i].toCPrice, datasouce[i].qty,datasouce[i].discount),10)); //计算值
					const editpayPrice =dataedit(zeropayPrice)
					if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
					  datasouce[i].payPrice=String(NP.plus(editpayPrice, 0.01));
					}else{
					  datasouce[i].payPrice=editpayPrice
					}
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
          //结算事件
          if(this.state.isKeySpace) {
            this.clearingEvent();
						e.preventDefault()//解决space键触发其他弹框事件
          }
          break;
        case 9:
          if(!this.props.onBlur) {
            // this.props.meths.focustap()
            this.focustap()
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
      // this.props.meths.focustap();
      this.focustap();
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
      // this.props.meths.focustap();
      this.focustap();
    }
		//判断是会员手机号还会员卡号
		checkIsPhone(value,type) {
			let regMb = /^[1][3,4,5,7,8][0-9]{9}$/;
			let isPhone;
			//手机号&&表单输入
			if(!regMb.test(value)&&type=='input') {
				isPhone = false;
			} else {
				isPhone = true;
			}
			this.setState({ isPhone })
		}
		//结算按钮事件
		hindclick=()=>{
	    if(Number(this.props.totolnumber)>0 && parseFloat(this.props.totolamount)>0){
		    GetServerData('qerp.pos.sy.config.info')
		    .then((json) => {
			    if(json.code == "0"){
			        if(json.config.submitPrint=='1'){
		            this.props.dispatch({
		              type:'cashier/changeCheckPrint',
		              payload:true
		            })
			        }else{
		            this.props.dispatch({
		              type:'cashier/changeCheckPrint',
		              payload:false
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
		//是否可以空格结算
		setSpace=(value)=> {
			this.setState({ isKeySpace: value })
		}
		//选择活动
		activitySelect =(value, option)=> {
			this.props.dispatch({
				type:'cashier/selectActivity',
				payload:value
			})
		}
    render() {
      const { datasouce, memberinfo, currentActivityList, selectActivityId } =this.props;
      const { visible, visibleOne, visibleTwo, currentOrderNo, allOrderList, isPhone, loading } =this.state;

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
							{
								currentActivityList&&currentActivityList.length>0&&
								<div className='fl activity-part'>
									<label className="label-name">该商品正在参与促销活动，点击右侧选框可切换活动：</label>
									<Select
										className="activity-list-select"
										value={selectActivityId}
										onSelect={this.activitySelect}>
										<Option value='all' key='all'>不参与活动</Option>
										{
											currentActivityList.map((el,index) => (
												<Option value={el.activityId} key={el.activityId}>{el.name}</Option>
											))
										}
									</Select>
	      				</div>
							}
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
      			</div>
						{/*扫码,结算区*/}
            <div className='mt20'>
							<div className='count clearfix'>
								<div className='opera'>
				  				<div className='operationl fl'>
								     <OperationlLeft
											 setDom={(value)=>this.setDom(value)}
											 setSpace={this.setSpace}
											 checkIsPhone={this.checkIsPhone.bind(this)}
											 isPhone={isPhone}/>
				  				</div>
									<div className='operationr fr'>
										<div className='operationcon'>
							        <div className='fl list1' onClick={this.hindclick.bind(this)}>
							          <div className='con1'>结算</div>
							          <div className='con2'>「空格键」</div>
							        </div>
							        <div className='fl list2'>
							          <div className='con1'>数量</div>
							          <div className='con2'>{this.props.totolnumber}</div>
							        </div>
							        <div className='fl list3'>
							          <div className='con1'>金额</div>
							          <div className='con2'>{this.props.totolamount}</div>
							        </div>
							      </div>
									</div>
								</div>
				  		</div>
            </div>
          </div>
          <PayModal
						ref='pay'
						setSpace={this.setSpace}
						initdata={this.resetData.bind(this)}/>
          <EntryOrdersModal
						remark={memberinfo.name}
						loading={loading}
            currentOrderNo={currentOrderNo}
            onOk={this.putOrderApi.bind(this)}
            onCancel={()=>this.onCancelOne()}
            visible={visibleOne}/>
          <PutedOrderListModal
            data={allOrderList}
            getOrder={this.getOrderApi.bind(this)}
            onCancel={()=>this.onCancelTwo()}
            visible={visibleTwo}/>
					<CollectionCreateForm
						ref={(form) => this.form = form}
						visible={visible}
						onCancel={this.handleCancel}
						hindPress={this.hindPress}/>
        </div>
      )
    }
}

function mapStateToProps(state) {
    const {
			selectActivityId,
						currentActivityList,
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
			selectActivityId,
			currentActivityList,
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
