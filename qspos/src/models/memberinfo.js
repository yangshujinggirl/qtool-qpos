import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
  namespace: 'memberinfo',
  state: {
	cardInfolist:[
		// {
		// 	lable:'会员姓名',
		// 	text:'23'
		// },{
		// 	lable:'会员卡号',
		// 	text:'23'
		// },{
		// 	lable:'会员级别',
		// 	text:'23'
		// },{
		// 	lable:'账户余额',
		// 	text:'23'
		// },{
		// 	lable:'消费总额',
		// 	text:'23'
		// },{
		// 	lable:'手机号码',
		// 	text:'23'
		// },{
		// 	lable:'开卡时间',
		// 	text:'23'
		// },{
		// 	lable:'会员积分',
		// 	text:'23'
		// },{
		// 	lable:'消费次数',
		// 	text:'23'
		// },{
		// 	lable:'宝宝生日',
		// 	text:'23'
		// }
	],
	details:[
	// 	{
	// 	orderNo:'122',
	// 	amount:'12',
	// 	point:'123',
	// 	discountPoint:'23',
	// 	cardCharge:'23',
	// 	cardConsume:'12',
	// 	discountMoney:'12',
	// 	reducAmount:'12',
	// 	createTime:'1223'
	// }
	]
  },
  reducers: {
	infolist(state, { payload: {details}}) {
		return {...state,details}
	},
	titleInfo(state, { payload: {cardInfolist}}) {
		return {...state,cardInfolist}
	}
  },
  effects: {
	*fetch({ payload: {code,values} }, { call, put }) {
		const result=yield call(GetServerData,code,values);
		if(result.code=='0'){
			const cardInfo=result.cardInfo
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
					if(cardInfo.birthday[i].data){
						cardInfo2.push({
							lable:'宝宝生日',
							text:cardInfo.birthday[i].data+cardInfo.birthday[i].type
						})
					}
				}else{
					cardInfo2.push({
						lable:'宝宝生日'+i,
						text:cardInfo.birthday[i].data+cardInfo.birthday[i].type
					})
				}
			}
			const cardInfolist=cardInfo1.concat(cardInfo2);
			yield put({type: 'titleInfo',payload:{cardInfolist}});
		}
	},
	*fetchList({ payload: {code,values} }, { call, put }) {
		const result=yield call(GetServerData,code,values);
		if(result.code=='0'){
			const details=result.details
			yield put({type: 'infolist',payload:{details}});

		}
	}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
          if (pathname == '/member/info') {
			  console.log(query);
				dispatch({ type: 'fetch', payload: {code:'qerp.qpos.mb.card.detail',values:{mbCardId:query.id} }})
				dispatch({ type: 'fetchList', payload: {code:'qerp.qpos.mb.card.detail.page',values:{mbCardId:query.id} }})
          }
      });
  	},
  },


};
