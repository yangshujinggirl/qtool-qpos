import * as usersService from '../services/services';

export default {
  namespace: 'header',
  state: {  
    data:[1,2,3]
  },
  reducers: {
    save(state, { payload: { data } }) {
      console.log(state)
      console.log(data)
      //计算新state
      return { ...state};
    },
  },
  effects: {
    *fetch({ payload: {code,values} }, { call, put }) {
       const { data, headers }=yield call(usersService.GetServerDatas,code,values);
      yield put({   
        type: 'save',
        payload: {data}
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/cashier') {
          dispatch({ type: 'save', payload: {code:'qerp.web.bs.menu',values:''} });
        }
      });
    },
  },
};