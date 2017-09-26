import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';


export default {
    namespace: 'member',
    state: {
        mbCards:[],
        loding:true
    },
    reducers: {
        memberlist(state, { payload: mbCards}) {
            return {...state,mbCards}
        },
        loding(state, { payload: loding}) {
            return {...state,loding}
        },
    },
    effects: {
        *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            if(result.code=='0'){
                const loding=false
                let {mbCards}=result
                for(var i=0;i<mbCards.length;i++){
                    mbCards[i].key=i
                }
                yield put({   
                    type: 'memberlist',
                    payload:mbCards
                });
                yield put({   
                    type: 'loding',
                    payload:loding
                });
            }else{
                message.error(data.message);
            }   
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/member') {
                     dispatch({ type: 'fetch', payload: {code:'qerp.pos.mb.card.query',values:{keywords:''}} });
                }
            });
        },
    },
};
