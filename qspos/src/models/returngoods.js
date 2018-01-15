
export default {
  namespace: 'returngoods',
  state: {
    checkPrint:false
  },
  reducers: {
    changeCheckPrint(state, { payload: checkPrint}) {
        return {...state,checkPrint}
    },
  },
  effects: {},
  subscriptions: {},
};
