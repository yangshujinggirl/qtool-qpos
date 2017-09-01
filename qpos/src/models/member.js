import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';


export default {
    namespace: 'member',
    state: {
        mbCards:[],
        dataSource:[]
    },
    reducers: {
        memberlist(state, { payload: mbCards}) {
            return {...state,mbCards}
        },
        dataSourcedata(state, { payload: dataSource}) {
            return {...state,dataSource}
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
        *save({ payload: {code,valuesdata,type,meth} }, { call, put }) {
            console.log(valuesdata)
            console.log(meth)
            console.log(type)
            const hidemodel=meth
            const result=yield call(GetServerData,code,valuesdata);
            console.log(result)
            if(result.code=='0'){
                if(type){
                    hidemodel()
                    Messagesuccess('新建会员成功',4,yield put({   
                        type: 'fetch',
                        payload: {code:'qerp.pos.mb.card.query',values:{keywords:''}}
                    }))
                }else{
                    hidemodel()
                    Messagesuccess('账号修改成功',4,yield put({   
                        type: 'fetch',
                        payload: {code:'qerp.pos.mb.card.query',values:{keywords:''}}
                    }))
                }
            }else{
                message.error(result.message);
            }   
        },  
        *dataSource({ payload: {dataSource:values} }, { call, put }) {
            console.log(values)
            yield put({   
                    type: 'dataSourcedata',
                    payload:values
                })


             // sessionStorage.setItem('batrhdata',batrhdata);
            // const result=yield call(GetServerData,code,values);
            // console.log(result)
            // if(result.code=='0'){
            //     let {mbCards}=result
            //     for(var i=0;i<mbCards.length;i++){
            //      mbCards[i].key=i
            //     }
            //     yield put({   
            //         type: 'memberlist',
            //         payload:mbCards
            //     })
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
