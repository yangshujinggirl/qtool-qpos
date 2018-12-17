import {GetServerData} from '../../services/services';
import {message} from 'antd';
import moment from 'moment'

export default {
  namespace:'chargeBackList',
  state: {
    receiveList:[],
    returnList:[],
    saleTotalData:{},
    data:{
      total:0,
      currentPage:0,
      limit:10
    },
    detailInfo:{
      list:[],
    }
  },
  reducers:{
    getReceiveList(state, { payload: {receiveList, data } }) {
      return { ...state, receiveList, data }
    },
    getReturnList(state, { payload: {returnList, data } }) {
      return { ...state, returnList, data }
    },
    getDetailInfo(state, { payload: {detailInfo, data } }) {
      return { ...state, detailInfo,data }
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
    *fetchReceiveList( { payload: values }, { call, put, select }) {
      yield put({type: 'resetData',payload:{} });
      const code = 'qerp.qpos.order.receiveRep';
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      let { createrTime, ...params } =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      if(params.type == 0) {//订单分类，全部传空，呵呵无语
        params.type =''
      }
      if(createrTime&&createrTime.length>0) {
        params.operateStart = moment(createrTime[0]).format('YYYY-MM-DD');
        params.operateEnd = moment(createrTime[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const { pdOrderVos, limit, total, currentPage } =result;
        const list = pdOrderVos?pdOrderVos:[];
        list.map((ele,index) => ele.key = ele.pdOrderId)
        yield put({
          type:'getReceiveList',
          payload:{
            receiveList:list,
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
    *fetchReturnList( { payload: values }, { call, put, select }) {
      yield put({type: 'resetData',payload:{} });
      const code = 'qerp.qpos.order.returnRep';
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      let { createrTime, ...params } =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      if(params.type == 0) {//订单分类，全部传空，呵呵无语
        params.type =''
      }
      if(createrTime&&createrTime.length>0) {
        params.createTimeST = moment(createrTime[0]).format('YYYY-MM-DD');
        params.createTimeET = moment(createrTime[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const { asns, limit, total, currentPage } =result;
        const list = asns?asns:[];
        list.map((ele,index) => ele.key = ele.pdOrderId)
        yield put({
          type:'getReturnList',
          payload:{
            returnList:list,
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
      yield put({ type:'resetData',payload:{}})
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      const code = 'qerp.qpos.order.receiveRepDetail';
      let { createrTime, ...params } =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      if(createrTime&&createrTime.length>0) {
        params.operateST = moment(createrTime[0]).format('YYYY-MM-DD');
        params.operateET = moment(createrTime[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const {　details, limit, currentPage, total } = result;
        let list = details?details:[];
        list.length>0&&list.map((el,index) =>el.key = el.pdOrderDetailId)
        yield put({
          type:"getDetailInfo",
          payload:{
            detailInfo:{list},
            data:{
              limit,
              currentPage,
              total
            }
          }
        })
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetchReturnDetail( { payload: values }, { call, put, select }) {
      yield put({ type:'resetData',payload:{}})
      const fixedLimit = yield select(state => state.dailyCheck.data.limit);
      const code = 'qerp.qpos.order.returnRepDetail';
      let params =values;
      if(!params.limit) {
        params = {...params,...{ limit: fixedLimit}}
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const {　details, limit, currentPage, total } = result;
        let list = details?details:[];
        list.length>0&&list.map((el,index) =>el.key = el.pdOrderDetailId)
        yield put({
          type:"getDetailInfo",
          payload:{
            detailInfo:{list},
            data:{
              limit,
              currentPage,
              total
            }
          }
        })
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
  }
}
