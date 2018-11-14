import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';


export default {
    namespace: 'member',
    state: {
        mbCards:[],
        loding:true,
        data:{
          total:0,
          currentPage:0,
          limit:10
        }
    },
    reducers: {
        memberlist(state, { payload: { mbCards, data}}) {
            return {...state, mbCards, data}
        },
        loding(state, { payload: loding}) {
            return {...state,loding}
        },
    },
    effects: {
        *fetch({ payload: values }, { call, put, select }) {
            const limit = yield select(state => state.member.data.limit);
            if(!values.limit) {
              values.limit = limit;
            }
            const result=yield call(GetServerData,'qerp.pos.mb.card.query',values);
            if(result.code=='0'){
                const loding=false
                let { mbCards, total, currentPage, limit }=result
                for(var i=0;i<mbCards.length;i++){
                    mbCards[i].key=i
                }
                yield put({
                    type: 'memberlist',
                    payload:{
                      mbCards,
                      data:{
                        total,
                        currentPage,
                        limit
                      }
                    }
                });
                yield put({
                    type: 'loding',
                    payload:loding
                });
            }else{
                message.error(result.message);
            }
        }
    },
};
