import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'dataManage',
    state: {
        initKey:1,
        detailInfo:{},
        headerInfo:{},
        detailId:null
    },
    reducers: {
        initKey(state, { payload: initKey}) {
            return {...state,initKey}
        },
        syncDetailInfo(state, { payload: detailInfo}) {
            return {...state,detailInfo}
        },
        syncHeaderInfo(state, { payload: headerInfo}) {
            return {...state,headerInfo}
        },
        getDetailId(state, { payload: detailId}) {
            return {...state,detailId}
        },
    },
    effects: {
        *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                yield put({type:'syncDetailInfo',payload:result});
            }
        }
    },
    subscriptions: {
        // setup({ dispatch, history }) {
        //     return history.listen(({ pathname, query }) => {
        //         if (pathname === '/dataManage/receiptDetail') {
        //             dispatch({ type: 'fetch', payload: {code:'qerp.pos.order.receiveRepDetail.query',values:{pdOrderId:query.id} }})
        //             // yield put({type:'syncHeaderInfo',payload:query});
        //             dispatch({ type: 'syncHeaderInfo',payload:query});
        //         }
        //     });
        // },
    },
};