import {GetServerData} from '../../services/services';
import {message} from 'antd';
import moment from 'moment'

export default {
  namespace:'dailyCheck',
  state: {
    saleList:[],
    separateList:[],
    saleTotalData:{},
    separateData:{},
    data:{
      total:0,
      currentPage:0,
      limit:10
    },
    detailInfo:{}
  },
  reducers:{
    getSaleList(state, { payload: {saleList, data, saleTotalData } }) {
      return { ...state, saleList, data, saleTotalData }
    },
    getSepareateList(state, { payload: {separateList, separateData, data } }) {
      return { ...state, separateList, separateData, data }
    },
    resetData(state) {
      const data = {
              total:0,
              currentPage:0,
              limit:10
            }
      return { ...state, data }
    },
  },
  effects:{
    *fetchSaleList( { payload: values }, { call, put, select }) {
      const code = 'qerp.pos.rp.day.account.page';
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      let { createrTime, ...params } =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      if(params.type == 0) {//订单分类，全部传空，呵呵无语
        params.type =''
      }
      if(createrTime&&createrTime.length>0) {
        params.startDate = moment(createrTime[0]).format('YYYY-MM-DD');
        params.endDate = moment(createrTime[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const { rpDayAccount, rpDayAccounts, limit, total, currentPage } =result;
        const list = rpDayAccounts?rpDayAccounts:[];
        list.map((ele,index) => ele.key = ele.rpDayAccountId)
        yield put({
          type:'getSaleList',
          payload:{
            saleList:list,
            saleTotalData:rpDayAccount,
            data:{
              limit,
              total,
              currentPage
            }
          }
        })
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetchSeparateList( { payload: values }, { call, put, select }) {
      yield put({type: 'resetData',payload:{} });
      const code = 'qerp.pos.rp.share.profit.query';
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      let { createrTime, ...params } =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      if(params.type == 0) {//订单分类，全部传空，呵呵无语
        params.type =''
      }
      if(createrTime&&createrTime.length>0) {
        params.createtimeST = moment(createrTime[0]).format('YYYY-MM-DD');
        params.createtimeET = moment(createrTime[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const { rpShareProfitOrderVo, orderNum, shareProfitSumAmount, limit, total, currentPage } =result;
        const list = rpShareProfitOrderVo?rpShareProfitOrderVo:[];
        list.map((ele,index) => ele.key = ele.rpDayAccountId)
        yield put({
          type:'getSepareateList',
          payload:{
            separateList:list,
            separateData:{ shareProfitSumAmount, orderNum },
            data:{
              limit,
              total,
              currentPage
            }
          }
        })
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetchDetail( { payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const code = 'qerp.web.qpos.st.sale.order.detail';
      const result=yield call(GetServerData,code,values);
      if(result.code == '0') {
        console.log(result);
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
  }
}
