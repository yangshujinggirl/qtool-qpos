import {GetServerData} from '../services/services';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {Messagesuccess} from '../components/Method/Method';

export default {
    namespace: 'dataManage',
    state: {
        
    },
    reducers: {
        initDailyBill(state, { payload: dailyBill}) {
            return {...state,dailyBill}
        },
    },
    effects: {
        
    },
    subscriptions: {},
};