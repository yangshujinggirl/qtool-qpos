
import {GetServerData} from '../services/services';
import {message} from 'antd';

export default {
	namespace: 'receivegoods',
	state: {
		datasouce:[],
		pbarcode:null,
		themeindex:0,
		datasoucelen:0,
		totolsamount:0,
		pdOrderId:null,
		meth:{},
		isfetchover:true
	},
	reducers: {
		pbarcode(state, { payload: pbarcode}) {
			return {...state,pbarcode}
		},
		datasouce(state, { payload: {datasouce,pdOrderId}}) {
			const datasoucelen=datasouce.length
			var totolsamount=0
			for(var i=0;i<datasouce.length;i++){
				totolsamount=totolsamount+Number(datasouce[i].receiveQty)
			}
			return {...state,datasouce,datasoucelen,totolsamount,pdOrderId}
		},
		//change使用
		datasoucechange(state, { payload: datasouce}) {
			return {...state,datasouce}
		},
		themeindex(state, { payload: themeindex}) {
			return {...state,themeindex}
		},
		meth(state, { payload: meth}) {
			return {...state,meth}
		},
		isfetchover(state, { payload: isfetchover}) {
			return {...state,isfetchover}
		},

		initstate(state, { payload: {}}) {
			const datasouce=[]
			const pbarcode=null
			const themeindex=0
			const datasoucelen=0
			const totolsamount=0
			const pdOrderId=null
			return {...state,datasouce,pbarcode,themeindex,datasoucelen,totolsamount,pdOrderId}
		},

	},
	effects: {
		*orderfetch({ payload: {code,values} }, { call, put ,select}) {
			const result=yield call(GetServerData,code,values);
			if(result.code=='0'){
				const datasouce=result.pdOrderDetails
				const pdOrderId=result.pdOrderId
				for(var i=0;i<datasouce.length;i++){
					datasouce[i].receiveQty=0
					datasouce[i].key=datasouce[i].barcode
					datasouce[i].index=i+1
				}
				yield put({type: 'datasouce',payload:{datasouce,pdOrderId}});
			}else{
				message.error(result.message);
			}   
		},
		*payok({ payload: {code,values} }, { call, put ,select}) {
			const result=yield call(GetServerData,code,values);
			if(result.code=='0'){
				message.success('收货成功');
				const isfetchover=true
				yield put({type: 'initstate',payload:{}});
				yield put({type: 'isfetchover',payload:isfetchover});
			}else{
				const isfetchover=true
				yield put({type: 'isfetchover',payload:isfetchover});
				message.error(result.message);

			}   
		},
	},
	subscriptions: {},
};
