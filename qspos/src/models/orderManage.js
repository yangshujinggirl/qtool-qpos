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
    }
  },
  effects:{
    *fetchList( { payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const code = 'qerp.web.qpos.st.sale.order.query';
      const result=yield call(GetServerData,code,values);
      if(result.code == '0') {
        const { qposStSaleOrders, limit, total, currentPage } =result;
        const list = qposStSaleOrders?qposStSaleOrders:[];
        if(list.length>0) {
          list.map((el,index) => el.key = el.outId);
          yield put({
            type:'fetchDetail',
            payload:{
              outId:list[0].outId,
              type:list[0].type
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
