import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
  namespace:'activityManage',
  state: {
    dataSource:[],
    dataSourceInfo:[],
    totalInfo:{},
    data:{
      total:0,
      currentPage:0,
      limit:10
    },
  },
  reducers: {
    getDataSource(state, { payload: { dataSource, data}}) {
      return { ...state, dataSource, data }
    },
    getInfo(state, { payload: { dataSourceInfo, totalInfo, data}}) {
      return { ...state, dataSourceInfo, totalInfo, data }
    }
  },
  effects:{
    *fetchList({ payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const fixedLimit = yield select(state => state.activityManage.data.limit);
      if(!values.limit) {
        values.limit = fixedLimit;
      }
      const result=yield call(GetServerData,'qerp.web.qpos.at.query.list',values);
      if(result.code == '0') {
        const { qPosActivitys, limit, total, currentPage } =result;
        qPosActivitys.length>0&&qPosActivitys.map((el)=>el.key = el.activityId);
        yield put({
          type:'getDataSource',
          payload:{
            dataSource:qPosActivitys,
            data:{
              limit,
              total,
              currentPage
            },
          }
        })
      } else {
        message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetchInfo({ payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const fixedLimit = yield select(state => state.activityManage.data.limit);
      if(!values.limit) {
        values.limit = fixedLimit;
      }
      const result=yield call(GetServerData,'qerp.web.qpos.at.query.detail',values);
      if(result.code == '0') {
        const { pdInfos, limit, total, currentPage, posActivityDetail } =result;
        pdInfos.length>0&&pdInfos.map((el)=>el.key = el.activityDetailId);
        yield put({
          type:'getInfo',
          payload:{
            dataSourceInfo:pdInfos,
            totalInfo:posActivityDetail,
            data:{
              limit,
              total,
              currentPage
            },
          }
        })
      } else {
        message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    }
  }
}
