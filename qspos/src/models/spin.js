export default {
  namespace:'spinLoad',
  state: {
    loading:false,
  },
  reducers: {
    setLoading(state, { payload: loading }) {
      return { ...state, loading}
    }
  }
}
