import moment from 'moment'
import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
  namespace:'orderManage',
  state: {
    dataList:[],
    data:{
      total:0,
      currentPage:0,
      limit:10
    },
    detailInfo:{}
  },
  reducers:{
    getList(state, { payload: {dataList, data } }) {
      return { ...state, dataList, data }
    },
    getDetail(state, { payload: { detailInfo } }) {
      return { ...state, detailInfo }
    },
    resetData(state) {
      const detailInfo={};
      const dataList = [];
      const data={
        total:0,
        currentPage:0,
        limit:10
      };
      return { ...state, dataList, detailInfo, data }
    }
  },
  effects:{
    *fetchList( { payload: values }, { call, put, select }) {
      yield put({ type:'resetData',payload:{} });
      const code = 'qerp.web.qpos.st.sale.order.query';
      const fixedLimit = yield select(state => state.orderManage.data.limit);
      const { time, ...params } =values;
      if(!params.limit) {
        params.limit = fixedLimit;
      }
      if(time&&time.length>0) {
        params.startTime = moment(time[0]).format('YYYY-MM-DD');
        params.endTime = moment(time[1]).format('YYYY-MM-DD');
      }
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        const { qposStSaleOrders, limit, total, currentPage } =result;
        const list = qposStSaleOrders?qposStSaleOrders:[];
        if(list.length>0) {
          list.map((el,index) => el.key = el.outId);
          yield put({
            type:'fetchDetail',
            payload:{
              outId:list[0].outId,
              type:list[0].type,
              businessType:list[0].businessType
            }
          })
        }
        yield put({
          type:'getList',
          payload:{
            dataList:list,
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
      let { businessType, ...params } =values;
      yield put({type: 'spinLoad/setLoading',payload:true});
      const code = 'qerp.web.qpos.st.sale.order.detail';
      let result=yield call(GetServerData,code,params);
      if(result.code == '0') {
        result = {...result,type:values.type, businessType}//type:销售订单，退货订单，充值订单
        yield put({
          type:'getDetail',
          payload:{
            detailInfo:result
          }
        })
      } else {
         message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
  }
}
