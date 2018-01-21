import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
namespace: 'memberinfo',
state: {
	cardInfolist:[],
	details:[],
	limit:10,
	total:0,
	currentPage:0,
	mbCardId:null
  },
  reducers: {
	infolist(state, { payload: {details,limit,total,currentPage}}) {
		return {...state,details,limit,total,currentPage}
	},
	titleInfo(state, { payload: {cardInfolist,mbCardId}}) {
		return {...state,cardInfolist,mbCardId}
	}
},
effects: {
	*fetch({ payload: {code,values} }, { call, put }) {
		const result=yield call(GetServerData,code,values);
		if(result.code=='0'){
			const cardInfo=result.cardInfo
			const mbCardId=cardInfo.mbCardId
			const cardInfo1=[
				{
					lable:'会员姓名',
					text:cardInfo.name
				},{
					lable:'会员卡号',
					text:cardInfo.cardNo
				},{
					lable:'会员级别',
					text:cardInfo.levelStr
				},{
					lable:'账户余额',
					text:cardInfo.amount
				},{
					lable:'消费总额',
					text:cardInfo.amountSum
				},{
					lable:'手机号码',
					text:cardInfo.mobile
				},{
					lable:'开卡时间',
					text:cardInfo.createTime
				},{
					lable:'会员积分',
					text:cardInfo.point
				},{
					lable:'消费次数',
					text:cardInfo.timeSum
				}
			]

			const cardInfo2=[]
			for(var i=0;i<cardInfo.birthday.length;i++){
				if(i==0){
						cardInfo2.push({
							lable:'宝宝生日',
							text:cardInfo.birthday[i].date+'['+cardInfo.birthday[i].typeStr+']'
						})
					
				}else{
					cardInfo2.push({
						lable:'宝宝生日'+(i+1),
						text:cardInfo.birthday[i].date+'['+cardInfo.birthday[i].typeStr+']'
					})
				}
			}
			const cardInfolist=cardInfo1.concat(cardInfo2);
			yield put({type: 'titleInfo',payload:{cardInfolist,mbCardId}});
		}
	},
	*fetchList({ payload: {code,values} }, { call, put }) {
		const result=yield call(GetServerData,code,values);
		if(result.code=='0'){
			const details=result.details;
			const limit=result.limit;
			const total=result.total;
			const currentPage=result.currentPage
			yield put({type: 'infolist',payload:{details,limit,total,currentPage}});

		}
	}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
          if (pathname == '/member/info') {
				dispatch({ type: 'fetch', payload: {code:'qerp.qpos.mb.card.detail',values:{mbCardId:query.id} }})
				dispatch({ type: 'fetchList', payload: {code:'qerp.qpos.mb.card.detail.page',values:{mbCardId:query.id,limit:10,currentPage:0} }})
		}
	});
	},
},


};
