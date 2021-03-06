import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
  namespace:'memberBirth',
  state: {
    dataSource:[],
    data:{
      total:0,
      currentPage:0,
      limit:10
    },
    mbinfo:{}
  },
  reducers: {
    getDataSource(state, { payload: { dataSource, data, mbinfo}}) {
      return { ...state, dataSource, data, mbinfo }
    }
  },
  effects:{
    *fetchList({ payload: values }, { call, put, select }) {
      yield put({type: 'spinLoad/setLoading',payload:true});
      const fixedLimit = yield select(state => state.memberBirth.data.limit);
      if(!values.limit) {
        values.limit = fixedLimit;
      }
      const result=yield call(GetServerData,'qerp.qpos.mb.card.birth.page',values);
      if(result.code == '0') {
        const { mbCardBirthInfo, limit, total, currentPage } =result;
        const { cardBirthInfos, cuCalDate, currentDate } = mbCardBirthInfo;
        cardBirthInfos.length>0&&cardBirthInfos.map((el)=>el.key = el.mbCardBirthId);
        yield put({
          type:'getDataSource',
          payload:{
            dataSource:cardBirthInfos,
            data:{
              limit,
              total,
              currentPage
            },
            mbinfo:{ cuCalDate, currentDate }
          }
        })
      } else {
        message.error(result.message);
      }
      yield put({type: 'spinLoad/setLoading',payload:false});
    }
  }
}
