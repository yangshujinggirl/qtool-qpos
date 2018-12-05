import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'goods',
    state: {
  	    pdSpus:[],
  	    pdCategories:[],
        data:{
          total:0,
          limit:15,
          currentPage:0
        }
    },
    reducers: {
	    spulist(state, { payload: {pdSpus,data}}) {
         return {...state,pdSpus,data}

      },
      pdCategories(state, { payload: pdCategories}) {
         return {...state,pdCategories}

      },
    },
    effects: {
	    *fetch({ payload: values }, { call, put, select }) {
          yield put({type: 'spinLoad/setLoading',payload:true});
          const fixedLimit = yield select(state => state.goods.data.limit);
          let code ='qerp.pos.pd.spu.query';
          if(!values.limit) {
            values.limit = fixedLimit;
          }
          const result=yield call(GetServerData,code,values);
          if(result.code=='0'){
              let { pdSpus, total, limit, currentPage }=result
              for(var i=0;i<pdSpus.length;i++){
              	pdSpus[i].key=i
              }
              yield put({
                  type: 'spulist',
                  payload:{
                    pdSpus:pdSpus,
                    data:{
                      total:Number(total),
                      limit:Number(limit),
                      currentPage:Number(currentPage),
                    }
                  }
              });
          }else{
               message.error(result.message);
          }
          yield put({type: 'spinLoad/setLoading',payload:false});
      },
      *pdCategorieslist({ payload: values }, { call, put }) {
        const code = 'qerp.pos.pd.category.list';
          const result=yield call(GetServerData,code,values);
          if(result.code=='0'){
              let {pdCategories}=result
              for(var i=0;i<pdCategories.length;i++){
              	pdCategories[i].key=i
              }
              yield put({
                  type: 'pdCategories',
                  payload:pdCategories
              });
          }else{
               message.error(result.message);
          }
      },
    },
};
