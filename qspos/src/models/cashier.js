import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace: 'cashier',
    state: {
  	    datasouce:[]
    },
    reducers: {
  	    datasouce(state, { payload: datasouce}) {
           return {...state,datasouce}
          
        },
        // pdCategories(state, { payload: pdCategories}) {
        //    return {...state,pdCategories}
          
        // },
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
        // *pdCategorieslist({ payload: {code,values} }, { call, put }) {
        //     const result=yield call(GetServerData,code,values);
        //     console.log(result)
        //     if(result.code=='0'){
        //         let {pdCategories}=result
        //         for(var i=0;i<pdCategories.length;i++){
        //         	pdCategories[i].key=i
        //         }
        //         yield put({   
        //             type: 'pdCategories',
        //             payload:pdCategories
        //         });
        //     }else{
        //          message.error(result.message);
        //     }   
        // }, 
    },
    subscriptions: {},
};

