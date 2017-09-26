import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'inventory',
    state: {
  	    pdCheckDetails:[]
  	    
    },
    reducers: {
  	    pdCheckId(state, { payload: pdCheckDetails}) {
           return {...state,pdCheckDetails}
        }
    },
    effects: {
    },
    subscriptions: {
    }
};

