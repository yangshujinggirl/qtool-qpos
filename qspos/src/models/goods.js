import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'goods',
    state: {
  	    pdSpus:[],
  	    pdCategories:[]
    },
    reducers: {
  	    spulist(state, { payload: pdSpus}) {
           return {...state,pdSpus}
          
        },
        pdCategories(state, { payload: pdCategories}) {
           return {...state,pdCategories}
          
        },
    },
    effects: {
  	    *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                let {pdSpus}=result
                for(var i=0;i<pdSpus.length;i++){
                	pdSpus[i].key=i
                }
                yield put({   
                    type: 'spulist',
                    payload:pdSpus
                });
            }else{
                 message.error(result.message);
            }   
        },
        *pdCategorieslist({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
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
    subscriptions: {
  	    setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/goods') {
                     dispatch({ type: 'fetch', payload: {code:'qerp.pos.pd.spu.query',values:{keywords:'',pdCategoryId:null} }})
                     dispatch({ type: 'pdCategorieslist', payload: {code:'qerp.pos.pd.category.list',values:{}}})
                }
            });
        },
    },
};

