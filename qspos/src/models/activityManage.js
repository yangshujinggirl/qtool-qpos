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
    giftList:[]
  },
  reducers: {
    getDataSource(state, { payload: { dataSource, data}}) {
      return { ...state, dataSource, data }
    },
    getInfo(state, { payload: { dataSourceInfo, totalInfo, data}}) {
      return { ...state, dataSourceInfo, totalInfo, data }
    },
    getGiftList(state, { payload: { giftList}}) {
      return { ...state, giftList }
    },
    resetpage(state, { payload: {}}) {
      let dataSourceInfo=[];
      let giftList=[];
      let totalInfo ={};
      return { ...state, dataSourceInfo, giftList, totalInfo}
    }
  },
  effects:{
    *fetchGiftList({ payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const result=yield call(GetServerData,'qerp.web.qpos.at.query.gifts',values);
      if(result.code == '0') {
        const { giftList } =result;
        giftList.length>0&&giftList.map((el,index)=>el.key = index);
        yield put({
          type:'getGiftList',
          payload:{giftList}
        })
      } else {
        message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetchList({ payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const fixedLimit = yield select(state => state.activityManage.data.limit);
      if(!values.limit) {
        values.limit = fixedLimit;
      }
      const result=yield call(GetServerData,'qerp.web.qpos.at.query.list',values);
      if(result.code == '0') {
        let { qPosActivitys, limit, total, currentPage } =result;
        qPosActivitys = qPosActivitys?qPosActivitys:[];
        qPosActivitys = qPosActivitys.map((el)=>{
          el.key = el.activityId;
          el.type = values.type;
          return el;
        });
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
      yield put({type: 'resetpage',payload:{}});
      yield put({type: 'spinLoad/setLoading',payload:true});
      const fixedLimit = yield select(state => state.activityManage.data.limit);
      if(!values.limit) {
        values.limit = fixedLimit;
      }
      const result=yield call(GetServerData,'qerp.web.qpos.at.query.detail',values);
      if(result.code == '0') {
        const { pdInfos, limit, total, currentPage, posActivityDetail } =result;
        pdInfos.length>0&&pdInfos.map((el)=>el.key = el.activityDetailId);
        if(posActivityDetail.activityType=="20"||posActivityDetail.activityType=="21") {
          yield put({
            type:'fetchGiftList',
            payload:{
              activityId:posActivityDetail.activityId,
              activityType:posActivityDetail.activityType
            }
          })
        }
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
