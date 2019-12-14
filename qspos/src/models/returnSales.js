import {GetServerData} from '../services/services';
import {message} from 'antd';
import { fomatNumTofixedTwo,fomatNumAddFloat } from '../utils/CommonUtils';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'returnSales',
  state: {
    currentRowIndex:0,//当前选中行
    goodsList:[], //收银数据表
    payTotalData:{
      totolNumber:0,
      totolAmount:0,
      payAmount:0,
      returnPoint:0,
      cutAmount:'0'
    },
    orderTotalData:{},
    memberInfo:{
      amount:0,
      point:0,
    },
    baseOptions:[
      {name:'微信',checked:false,disabled:false,type:'1'},
      {name:'支付宝',checked:false,disabled:false,type:'2'},
      {name:'银联',checked:false,disabled:false,type:'3'},
      {name:'现金',checked:false,disabled:false,type:'4'},
      {name:'会员卡',checked:false,disabled:false,type:'5'},
    ],
    checkedPayTypeOne:{//支付金额1
      type:'1',
      amount:0
    },
  },
  reducers: {
      resetData(state,payload:{}) {
        const currentRowIndex=0,goodsList=[], //收银数据表
        payTotalData = { cutAmount:'0',totolNumber:0, totolAmount:0, returnPoint:0, payAmount:0 },
        memberInfo = { amount:0, point:0, },
        baseOptions = [
          {name:'微信',checked:false,disabled:false,type:'1'},
          {name:'支付宝',checked:false,disabled:false,type:'2'},
          {name:'银联',checked:false,disabled:false,type:'3'},
          {name:'现金',checked:false,disabled:false,type:'4'},
          {name:'会员卡',checked:false,disabled:false,type:'5'},
        ],
        checkedPayTypeOne = { type:'1', amount:0 };
        return {...state, currentRowIndex, goodsList, payTotalData,checkedPayTypeOne,
          memberInfo,baseOptions,
        }
      },
      resetPayModalData(state,payload:{}) {
        const  checkedPayTypeOne = { type:'1', amount:0 };
        return {...state, checkedPayTypeOne }
      },
	    getGoodsList(state, { payload: goodsList}) {
        let totolNumber=0,totolAmount=0,returnPoint=0;
        goodsList.map((el)=> {
          if(el.checked) {
            totolNumber=NP.plus(totolNumber,el.qty);
            totolAmount=NP.plus(totolAmount,el.canReturnPayPrice);
            totolAmount=fomatNumTofixedTwo(totolAmount);
            returnPoint=Math.round(totolAmount);
          }
        })
        let payTotalData={ totolNumber,totolAmount,returnPoint, payAmount:totolAmount,}
         return {...state,goodsList,payTotalData }
      },
      getTotalData(state,{ payload: payTotalData }) {
        return {...state, payTotalData }
      },
      getOrderTotalData(state,{ payload: orderTotalData }) {
        return {...state, orderTotalData }
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
      getCheckedPayType(state, { payload: checkedPayTypeOne }) {
        checkedPayTypeOne ={...checkedPayTypeOne};
        return {...state, checkedPayTypeOne }
      },
      getPayMentTypeOptions(state, {payload: baseOptions }) {
        return {...state, baseOptions }
      },
  },
  effects: {
    *fetchbarCode({ payload:values }, { call, put ,select}) {
        const initDatasouce = yield select(state => state.cashierManage.goodsList);
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.web.qpos.od.return.query',values);
        yield put({type: 'spinLoad/setLoading',payload:false});
        if(result.code!='0'){
          message.error(result.message);
          return;
        }
        let { odOrderDetails, order, mbCard } =result;
        odOrderDetails.map((el) => {
          el.qty = el.canReturnQty;
          el.key = el.odOrderDetailId;
          el.canReturnPayPrice = el.canReturnAmount;
          el.checked=false;
        })
        if(mbCard&&mbCard.mbCardId) {
          yield put({type: 'fetchMemberInfo',payload:{ cardNoMobile:mbCard.cardNo } });
        }
        yield put({type: 'getGoodsList',payload:odOrderDetails});
        yield put({type: 'getOrderTotalData',payload:order});
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
