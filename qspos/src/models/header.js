import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';




export default {
    namespace: 'header',
    state: {  
        urUser:{
            shop:{
                name:''
            }
        },
        userSales:{},
        allData:{}
    },
    reducers: {
        save(state, { payload: urUser}) {
            return {...state,urUser}
        },
        usershift(state, { payload: {allData,userSales}}) {
            return {...state,allData,userSales}
        },
    },
    effects: {
        *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                const {urUser}=result
                yield put({   
                    type: 'save',
                    payload:urUser
                });
            }else{
                message.error(result.message);
            }   
        },
        
        *shift({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                const allData = result;
                const {userSales}=result;
                yield put({   
                    type: 'usershift',
                    payload:{allData,userSales}
                });
            }else{
                 message.error(result.message);
            }   
        },
        *logout({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                yield put(routerRedux.push('/'));
            }else{
                message.error(result.message);
            }   
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/cashier') {
                    // dispatch({ type: 'fetch', payload: {code:'qerp.pos.ur.user.info',values:{urUserId:null}} });
                }
            });
        },
    }
};