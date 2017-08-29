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
        }
    },
    reducers: {
        save(state, { payload: urUser}) {
            console.log(urUser)
            return {...state,urUser}
        },
    },
    effects: {
        *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                const {urUser}=result
                console.log(urUser)
                sessionStorage.setItem('nickname',urUser.nickname);
                sessionStorage.setItem('urUserId',urUser.urUserId);
                sessionStorage.setItem('username',urUser.username);
                sessionStorage.setItem('spShop',urUser.shop.name);
                sessionStorage.setItem('spShopId',urUser.shop.spShopId);
                sessionStorage.setItem('role',urUser.role);
                sessionStorage.setItem('status',urUser.status);


                yield put({   
                    type: 'save',
                    payload:urUser
                });
            }else{
                message.error(data.message);
            }   
        },
        *shift({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                // const {urUser}=result
                // console.log(urUser)
                // yield put({   
                //     type: 'save',
                //     payload:urUser
                // });
            }else{
                message.error(data.message);
            }   
        },
        *logout({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                yield put(routerRedux.push('/'));
            }else{
                message.error(data.message);
            }   
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/cashier') {
                    dispatch({ type: 'fetch', payload: {code:'qerp.pos.ur.user.info',values:{urUserId:null}} });
                }
            });
        },
    }
};