import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';


export default {
    namespace: 'member',
    state: {
  	    mbCards:[]
    },
    reducers: {
  	    memberlist(state, { payload: mbCards}) {
            return {...state,mbCards}
        },
    },
    effects: {
  	    *fetch({ payload: {code,values} }, { call, put }) {
  	    	
  	    	 // sessionStorage.setItem('batrhdata',batrhdata);
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                let {mbCards}=result
                for(var i=0;i<mbCards.length;i++){
                	mbCards[i].key=i
                }
                yield put({   
                    type: 'memberlist',
                    payload:mbCards
                });
            }else{
                message.error(data.message);
            }   
        },
        *save({ payload: {code,values,type,meth} }, { call, put }) {
            console.log(meth)
            console.log(type)
            const hidemodel=meth
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                if(type){
                    hidemodel()
                    Messagesuccess('新建账号成功',4,yield put({   
                        type: 'fetch',
                        payload: {code:'qerp.pos.ur.user.query'}
                    }))
                }else{
                    hidemodel()
                    Messagesuccess('账号修改成功',4,yield put({   
                        type: 'fetch',
                        payload: {code:'qerp.pos.ur.user.query'}
                    }))
                }
            }else{
                message.error(result.message);
            }   
        },  
        *selectdata({ payload: {code,values} }, { call, put }) {
  	    	
  	    	 // sessionStorage.setItem('batrhdata',batrhdata);
            // const result=yield call(GetServerData,code,values);
            // console.log(result)
            // if(result.code=='0'){
            //     let {mbCards}=result
            //     for(var i=0;i<mbCards.length;i++){
            //     	mbCards[i].key=i
            //     }
            //     yield put({   
            //         type: 'memberlist',
            //         payload:mbCards
            //     });
            // }else{
            //     message.error(data.message);
            // }   
        },
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
