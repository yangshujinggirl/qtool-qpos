import {GetServerData} from '../services/services';
import {message} from 'antd';
import { fomatNumTofixedTwo,fomatNumAddFloat } from '../utils/CommonUtils';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'cashierManage',
  state: {
    currentRowIndex:0,
    goodsList:[], //收银数据表
    payTotalData:{
      totolNumber:0,
      totolAmount:0,
      thisPoint:0,
      paytotolAmount:0
    },
    memberInfo:{
      amount:0,
      point:0,
    },
    selectedActivityId:'0',
    activityOptions:[],
    payMentTypeOptionsOne:[
      {name:'微信',checked:false,disabled:false,type:'1'},
      {name:'支付宝',checked:false,disabled:false,type:'2'},
      {name:'银联',checked:false,disabled:false,type:'3'},
      {name:'现金',checked:false,disabled:false,type:'4'},
      {name:'会员卡',checked:false,disabled:false,type:'5'},
      {name:'积分',checked:false,disabled:false,type:'6'}
    ],
    payMentTypeOptionsTwo:[
      {name:'微信',checked:false,disabled:false,type:'1'},
      {name:'支付宝',checked:false,disabled:false,type:'2'},
      {name:'银联',checked:false,disabled:false,type:'3'},
      {name:'现金',checked:false,disabled:false,type:'4'},
    ],
    checkedPayTypeOne:'1',
    checkedPayTypeTwo:null
  },
  reducers: {
      resetData(state,payload:{}) {
        const currentRowIndex=0,goodsList=[], //收银数据表
        payTotalData = {
          totolNumber:0,
          totolAmount:0,
          thisPoint:0,
          paytotolAmount:0
        },
        memberInfo = {
          amount:0,
          point:0,
        },
        selectedActivityId='0',activityOptions = []
        return {...state, currentRowIndex, goodsList, payTotalData, memberInfo, selectedActivityId, activityOptions }
      },
	    getGoodsList(state, { payload: goodsList}) {
          let totolNumber=0,totolAmount=0,thisPoint=0,zeropayPrice;
          goodsList = goodsList.map((el,index) => {
            let currentPrice = el.toCPrice;
            if(el.isShowActivity=='1'&&el.activityId!='0') {
              el.discount = el.activityDiscount;
              currentPrice = el.specialPrice;
              zeropayPrice=NP.divide(NP.times(currentPrice, el.qty),10); //计算值
            } else {
              zeropayPrice=NP.divide(NP.times(currentPrice, el.qty,el.discount),10); //计算值
            }
            zeropayPrice = fomatNumTofixedTwo(zeropayPrice);//两位小安数，当不满足时候补零
            el.payPrice = fomatNumAddFloat(zeropayPrice)
            el.key=++index;
            totolNumber=NP.plus(totolNumber,el.qty);
            totolAmount=NP.plus(totolAmount,el.payPrice);
            totolAmount=fomatNumTofixedTwo(totolAmount);
            thisPoint=Math.round(totolAmount);
            el.price=el.toCPrice;
            return el;
          })
          let payTotalData={ totolNumber,totolAmount,thisPoint,paytotolAmount:totolAmount }
         return {...state,goodsList,payTotalData }

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
      getCheckedPayType(state, { payload: { checkedPayTypeOne, checkedPayTypeTwo } }) {
        return {...state, checkedPayTypeOne, checkedPayTypeTwo }
      }
  },
  effects: {
    *fetchbarCode({ payload:values }, { call, put ,select}) {
        const initDatasouce = yield select(state => state.cashierManage.goodsList);
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.pos.pd.spu.find',values);
        yield put({type: 'spinLoad/setLoading',payload:false});
        if(result.code!='0'){
          message.error(result.message);
          return;
        }
        let { pdSpu } =result, goodsList=initDatasouce.slice(0);
        const idx = goodsList.findIndex((value)=> value.barcode == pdSpu.barcode);
        if(Number(pdSpu.inventory)<=0) {//判断库存
          message.error('商品库存不足');
          return;
        }
        let activityOptions=[],selectedActivityId='0',
            newGoodsInfo=pdSpu;
            // currentPrice = newGoodsInfo.toCPrice;
        if(idx=='-1'){
          newGoodsInfo.qty='1'
          newGoodsInfo.discount='10';
        }else{
          newGoodsInfo = goodsList[idx];
          newGoodsInfo.qty++;
          goodsList.splice(idx,1); //删除当前
        }
        // if(newGoodsInfo.isShowActivity=='1') {
        //   newGoodsInfo.discount = newGoodsInfo.activityDiscount;
        //   currentPrice = newGoodsInfo.specialPrice;
        //   activityOptions = newGoodsInfo.spActivities;
        //   selectedActivityId = newGoodsInfo.activityId;
        // }
        // var zeropayPrice=NP.divide(NP.times(currentPrice, newGoodsInfo.qty,newGoodsInfo.discount),10); //计算值
        // zeropayPrice = fomatNumTofixedTwo(zeropayPrice);//两位小安数，当不满足时候补零
        // const editpayPrice =zeropayPrice.substring(0,zeropayPrice.indexOf(".")+3);
        // if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){//3位小数，直接进0.01
        //   newGoodsInfo.payPrice=NP.plus(editpayPrice, 0.01);
        // }else{
        //   newGoodsInfo.payPrice=editpayPrice
        // }
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
          message.error(result.message);
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
