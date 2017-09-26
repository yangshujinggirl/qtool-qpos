import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'sell',
    state: {
  	    qposStSaleOrders:[],
  	   
    },
    reducers: {
  	    orderlist(state, { payload: qposStSaleOrders}) {
           return {...state,qposStSaleOrders}
        },
    },
    effects: {
  	    *fetch({ payload: {code,values} }, { call, put }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                let {qposStSaleOrders}=result
                for(var i=0;i<qposStSaleOrders.length;i++){
                	qposStSaleOrders[i].key=i
                }
                yield put({   
                    type: 'orderlist',
                    payload:qposStSaleOrders
                });
            }else{
                 message.error(result.message);
            }   
        }, 
    },
    subscriptions: {
  	    setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/sell') {
                     dispatch({ type: 'fetch', payload: {code:'qerp.web.qpos.st.sale.order.query',values:{keywords:null,type:null,startTime:null,endTime:null} }})
                    
                }
            });
        },
    },
};

