import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';


export default {
    namespace: 'adjust',
    state: {
  	    pdSpus:[]
  	    
    },
    reducers: {
  	    spulist(state, { payload: pdSpus}) {
           return {...state,pdSpus}
          
        },
        changevalue(state, { payload: {index,inputvalue}}) {
        	let {pdSpus}=state
            console.log(index)
            console.log(inputvalue)
            console.log(pdSpus)
        
        	pdSpus[index].adjustQty=inputvalue

           return {...state,pdSpus}
          
        },
     
    },
    effects: {
  	    *fetch({ payload: {code,values,meth} }, { call, put }) {
  	    	console.log(meth)
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                let {pdSpus}=result
                for(var i=0;i<pdSpus.length;i++){
                	pdSpus[i].key=i
                	pdSpus[i].adjustQty=''
                }
                meth(pdSpus)
                yield put({   
                    type: 'spulist',
                    payload:pdSpus
                });
            }else{
                 message.error(result.message);
            }   
        },
    
    },
    subscriptions: {
  	    setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/adjust') {
                      // dispatch({ type: 'spulist', payload:[]})
                }
            });
        },
    },
};

