import {GetServerData} from '../services/services';
import {message} from 'antd';
import { fomatNumTofixedTwo } from '../utils/CommonUtils';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'cashierManage',
  state: {
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
    activityOptions:[]
  },
  reducers: {
	    getGoodsList(state, { payload: goodsList}) {
          var totolNumber=0
          var totolAmount=0
          var thisPoint=0
          for(var i=0;i<goodsList.length;i++){
              goodsList[i].key=String((Number(i)+1));
              totolNumber=NP.plus(totolNumber,goodsList[i].qty)
              totolAmount=NP.plus(totolAmount,goodsList[i].payPrice)
              thisPoint=Math.round(totolAmount)
              goodsList[i].price=goodsList[i].toCPrice
          }
          totolAmount=fomatNumTofixedTwo(totolAmount)
          const paytotolAmount=totolAmount
          let payTotalData={ totolNumber,totolAmount,thisPoint,paytotolAmount }
         return {...state,goodsList,payTotalData }

      },
      getMemberInfo(state, { payload: memberInfo }) {
        return {...state, memberInfo }
      },
      getActivityOptions(state, { payload: { activityOptions, selectedActivityId } }) {
        return {...state, activityOptions, selectedActivityId }
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
            newGoodsInfo=pdSpu,
            currentPrice = newGoodsInfo.toCPrice;
        if(idx=='-1'){
          newGoodsInfo.qty='1'
          newGoodsInfo.discount='10';
        }else{
          newGoodsInfo = goodsList[idx];
          newGoodsInfo.qty++;
          goodsList.splice(idx,1); //删除当前
        }
        if(newGoodsInfo.isShowActivity=='1') {
          newGoodsInfo.discount = newGoodsInfo.activityDiscount;
          currentPrice = newGoodsInfo.specialPrice;
          activityOptions = newGoodsInfo.spActivities;
          selectedActivityId = newGoodsInfo.activityId;
        }
        var zeropayPrice=NP.divide(NP.times(currentPrice, newGoodsInfo.qty,newGoodsInfo.discount),10); //计算值
        zeropayPrice = fomatNumTofixedTwo(zeropayPrice);//两位小安数，当不满足时候补零
        const editpayPrice =zeropayPrice.substring(0,zeropayPrice.indexOf(".")+3);
        if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){//3位小数，直接进0.01
          newGoodsInfo.payPrice=NP.plus(editpayPrice, 0.01);
        }else{
          newGoodsInfo.payPrice=editpayPrice
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
    *fetch2({ payload: {code,values} }, { call, put }) {
        const result=yield call(GetServerData,code,values);
    },
  },
};
