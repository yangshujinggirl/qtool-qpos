import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'dataManage',
    state: {
        initKey:1
    },
    reducers: {
        initKey(state, { payload: initKey}) {
            return {...state,initKey}
        },
    },
    effects: {
        
    },
    subscriptions: {},
};