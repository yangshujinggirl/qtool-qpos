import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'inventory',
    state: {
  	    pdCheckDetails:[],
  	    pdCheckId:null
    },
    reducers: {
  	    pdCheckId(state, { payload: {pdCheckDetails,pdCheckId}}) {
           return {...state,pdCheckDetails,pdCheckId}
        }
    },
    effects: {
    },
    subscriptions: {
    }
};

