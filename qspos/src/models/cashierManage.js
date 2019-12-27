import {GetServerData} from '../services/services';
import {message} from 'antd';
import { fomatNumTofixedTwo,fomatNumAddFloat } from '../utils/CommonUtils';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'cashierManage',
  state: {
    selectedActivityId:'0',//选中活动id
    currentRowIndex:0,//当前选中行
    goodsList:[], //收银数据表
    payTotalData:{
      totolNumber:0,
      totolAmount:0,
      thisPoint:0,
      payAmount:0,
      cutAmount:'0'
    },
    memberInfo:{
      amount:0,
      point:0,
    },
    activityOptions:[],//活动列表
    baseOptions:[
      {name:'微信',checked:false,disabled:false,type:'1'},
      {name:'支付宝',checked:false,disabled:false,type:'2'},
      {name:'银联',checked:false,disabled:false,type:'3'},
      {name:'现金',checked:false,disabled:false,type:'4'},
      {name:'会员卡',checked:false,disabled:false,type:'5'},
      {name:'积分',checked:false,disabled:false,type:'6'}
    ],
    payMentTypeOptionsOne:[],//支付方式1
    payMentTypeOptionsTwo:[],//支付方式2
    checkedPayTypeOne:{//支付金额1
      type:'1',
      amount:0
    },
    checkedPayTypeTwo:{},//支付金额2
    payPart:{//支付区
      isGroupDisabled:false,
      errorText:null,
    },
    payMentVisible:false,//支付弹框
    couponDetail:{},//优惠券核销内容
    isPrint:false,
  },
  reducers: {
      resetData(state,payload:{}) {//页面数据重置
        const currentRowIndex=0,goodsList=[],payPart = { isGroupDisabled:true, errorText:null }, //收银数据表
        payTotalData = { cutAmount:'0',totolNumber:0, totolAmount:0, thisPoint:0, payAmount:0 },
        memberInfo = { amount:0, point:0, }, couponDetail={}, payMentVisible=false,isPrint=false,
        baseOptions = [
          {name:'微信',checked:false,disabled:false,type:'1'},
          {name:'支付宝',checked:false,disabled:false,type:'2'},
          {name:'银联',checked:false,disabled:false,type:'3'},
          {name:'现金',checked:false,disabled:false,type:'4'},
          {name:'会员卡',checked:false,disabled:false,type:'5'},
          {name:'积分',checked:false,disabled:false,type:'6'}
        ],
        checkedPayTypeOne = { type:'1', amount:0 }, checkedPayTypeTwo = {},selectedActivityId='0',
        payMentTypeOptionsOne = [], payMentTypeOptionsTwo = [],activityOptions = [];

        return {...state, currentRowIndex, goodsList, payTotalData,payPart,isPrint,
          memberInfo, activityOptions,baseOptions,selectedActivityId,couponDetail,
          checkedPayTypeOne,checkedPayTypeTwo,payMentTypeOptionsOne,payMentTypeOptionsTwo,
        }
      },
      resetPayModalData(state,payload:{}) {//弹框数据重置
        let payTotalData = state.payTotalData;
        payTotalData.cutAmount = '0';
        payTotalData.payAmount = payTotalData.totolAmount;
        const payPart = { isGroupDisabled:true, errorText:null },isPrint=false,
        checkedPayTypeOne = { type:'1', amount:0 }, checkedPayTypeTwo = {},couponDetail={},
        payMentTypeOptionsOne = [], payMentTypeOptionsTwo = [];

        return {...state,payPart,checkedPayTypeOne,couponDetail,payTotalData,
          checkedPayTypeTwo,payMentTypeOptionsOne,payMentTypeOptionsTwo,isPrint
        }
      },
	    getGoodsList(state, { payload: goodsList}) {
          let totolNumber=0,totolAmount=0,thisPoint=0,zeropayPrice;
          goodsList = goodsList.map((el,index) => {
            let currentPrice = el.toCPrice;
            if(el.isShowActivity=='1'&&el.activityId!='0') {
              el.discount = el.activityDiscount;
              currentPrice = el.specialPrice;
              zeropayPrice=NP.times(currentPrice, el.qty); //计算值
            } else {
              zeropayPrice=NP.divide(NP.times(currentPrice, el.qty,el.discount),10); //计算值
            }
            zeropayPrice = fomatNumTofixedTwo(zeropayPrice);//两位小数，当不满足时候补零
            el.payPrice = fomatNumAddFloat(zeropayPrice)
            el.key=++index;
            totolNumber=NP.plus(totolNumber,el.qty);
            totolAmount=NP.plus(totolAmount,el.payPrice);
            totolAmount=fomatNumTofixedTwo(totolAmount);
            thisPoint=Math.round(totolAmount);
            el.price=el.toCPrice;
            return el;
          })
          let payTotalData={ totolNumber,totolAmount,thisPoint,payAmount:totolAmount,cutAmount:'0' }
         return {...state,goodsList,payTotalData }

      },
      getTotalData(state,{ payload: payTotalData }) {
        return {...state, payTotalData }
      },
      getChangGoodsList(state, { payload: goodsList}) {
        goodsList =[...goodsList]
        return { ...state, goodsList }
      },
      getCurrentRowIndex(state, { payload: currentRowIndex}) {
        return { ...state, currentRowIndex }
      },
      getMemberInfo(state, { payload: memberInfo }) {
        return {...state, memberInfo }
      },
      getActivityOptions(state, { payload: { activityOptions, selectedActivityId } }) {
        return {...state, activityOptions, selectedActivityId }
      },
      getPayPart(state, { payload: payPart }) {
        return {...state, payPart }
      },
      getCheckedPayType(state, { payload: { checkedPayTypeOne, checkedPayTypeTwo } }) {
        checkedPayTypeOne ={...checkedPayTypeOne};
        checkedPayTypeTwo ={...checkedPayTypeTwo}
        return {...state, checkedPayTypeOne, checkedPayTypeTwo }
      },
      getPayMentTypeOptions(state, {payload:{ payMentTypeOptionsOne, payMentTypeOptionsTwo }}) {
        return {...state, payMentTypeOptionsOne, payMentTypeOptionsTwo}
      },
      getPayMentVisible(state, {payload: payMentVisible }) {
        return {...state, payMentVisible }
      },
      getCouponDetail(state, {payload: couponDetail }) {
        return {...state, couponDetail }
      },
      getIsPrint(state, {payload: isPrint }) {
        return {...state, isPrint }
      }
  },
  effects: {
    *fetchbarCode({ payload:values }, { call, put ,select}) {
        const initDatasouce = yield select(state => state.cashierManage.goodsList);
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.pos.pd.spu.find',values);
        yield put({type: 'spinLoad/setLoading',payload:false});
        if(result.code!='0'){
          message.error(result.message,.5);
          return;
        }
        let { pdSpu } =result, goodsList=initDatasouce.slice(0);
        const idx = goodsList.findIndex((value)=> value.barcode == pdSpu.barcode);
        if(Number(pdSpu.inventory)<=0) {//判断库存
          message.error('商品库存不足',.5);
          return;
        }
        let activityOptions=[],selectedActivityId='0',
            newGoodsInfo=pdSpu;
        if(idx=='-1'){
          newGoodsInfo.qty='1'
          newGoodsInfo.discount='10';
        }else if(newGoodsInfo.qty == newGoodsInfo.inventory){
          message.error('商品库存不足');
          return;
        } else {
          newGoodsInfo = goodsList[idx];
          newGoodsInfo.qty++;
          goodsList.splice(idx,1); //删除当前
        }
        if(newGoodsInfo.isShowActivity=='1') {
          activityOptions = newGoodsInfo.spActivities;
          selectedActivityId = newGoodsInfo.activityId;
        }
        goodsList.unshift(newGoodsInfo); //把这个元素添加到开头
        yield put({type: 'getGoodsList',payload:goodsList});
        yield put({type: 'getActivityOptions',payload:{activityOptions,selectedActivityId}});
    },
    *fetchMemberInfo({ payload: values }, { call, put,select }) {
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.pos.mb.card.find',values);
        yield put({type: 'spinLoad/setLoading',payload:false});
        if(result.code!='0'){
          message.error(result.message,.5);
          return;
        }
        const { mbCardInfo } = result;
        yield put({
            type: 'getMemberInfo',
            payload:mbCardInfo
        });
    },
  },
};
