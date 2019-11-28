import {GetServerData} from '../services/services';
import {message} from 'antd';
import { fomatNumTofixedTwo } from '../utils/CommonUtils';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'cashierManage',
  state: {
    goodsList:[], //收银数据表
    payTotalData:{
      totolNumber:0,
      totolAmount:0,
      thisPoint:0,
      paytotolAmount:0
    },
    memberinfo:{}
  },
  reducers: {
      initstate(state, { payload: {}}) {
        const datasouce=[]
        const totolnumber='0'
        const totolamount='0'
        const thispoint=null
        const onbule=false
        const ismember=false
        const payvisible=false
        const paytotolamount='0.00'
        const themeindex=0
        const barcode=null
        const cardNoMobile=null
        const amountlist=[{
            name:'微信',
            value:null,
            type:'1'
        }]
        const paytypelisy=[  //右边按钮区展示数组
            {name:'微信',check:false,disabled:false,type:'1'},
            {name:'支付宝',check:false,disabled:false,type:'2'},
            {name:'银联',check:false,disabled:false,type:'3'},
            {name:'现金',check:false,disabled:false,type:'4'},
            {name:'会员卡',check:false,disabled:false,type:'5'},
            {name:'积分',check:false,disabled:false,type:'6'}
        ]
        const group=false
        const cutAmount='0'
        const point=null
        const amount=null
        const rechargevisible=false
        const reamount=null
        const typeclick1=true
        const typeclick2=false
        const typeclick3=false
        const typeclick4=false
        const rechargetype=1;
        const memberinfo = {isLocalShop:true};
        const currentActivityList = [];
        return {...state,
          datasouce,totolnumber,
          totolamount,thispoint,onbule,
          ismember,payvisible,paytotolamount,
          themeindex,barcode,cardNoMobile,
          amountlist,paytypelisy,
          group,cutAmount,
          point,amount,
          rechargevisible,reamount,
          typeclick1,typeclick2,
          typeclick3,typeclick4,
          rechargetype,memberinfo,currentActivityList
        }
       },
	    getGoodsList(state, { payload: goodsList}) {
          var totolNumber=0
          var totolAmount=0
          var thisPoint=0
          for(var i=0;i<goodsList.length;i++){
              goodsList[i].key=String((Number(i)+1));
              totolNumber=NP.plus(totolNumber,goodsList[i].qty)
              totolAmount=NP.plus(totolAmount,goodsList[i].payPrice)
              thisPoint=Math.round(totolAmount)
              goodsList[i].price=goodsList[i].toCPrice
          }
          totolAmount=fomatNumTofixedTwo(totolAmount)
          const paytotolAmount=totolAmount
          let totalData={ totolNumber,totolAmount,thisPoint,paytotolAmount }
         return {...state,goodsList,totalData }

      },
      cardNoMobile(state, { payload: cardNoMobile}) {
         return {...state,cardNoMobile}
      },
      rechargevisible(state, { payload: rechargevisible}) {
          return {...state,rechargevisible}
      },
      barcode(state, { payload: barcode}) {
          return {...state,barcode}
       },
      amountlist(state, { payload: amountlist}) {
          return {...state,amountlist}
      },
      newamountlist(state, { payload: newamountlist}) {
          const amountlist=newamountlist
          return {...state,amountlist}
      },
      //只用于table中onchange数据绑定
      changedatasouce(state, { payload: datasouce}) {
          for(var i=0;i<datasouce.length;i++){
              datasouce[i].key=String((Number(i)+1))
          }
         return {...state,datasouce}
      },
      onbule(state, { payload: onbule}) {
         return {...state,onbule}
      },
      meths(state, { payload: meths}) {
          return {...state,meths}
      },
      meth1(state, { payload: meth1}) {
          return {...state,meth1}
      },
      memberlist(state, { payload: {ismember, memberinfo}}) {
          return {...state,ismember,memberinfo}
      },
      ismember(state, { payload: ismember}) {
          return {...state,ismember}
      },
      payvisible(state, { payload: payvisible}) {
          return {...state,payvisible}
      },
      themeindex(state, { payload: themeindex}) {
          return {...state,themeindex}
      },
      paytotolamount(state, { payload: paytotolamount}) {
          return {...state,paytotolamount}
      },
      changeCheckPrint(state, { payload: checkPrint}) {
          return {...state,checkPrint}
      },
      rechangeCheckPrint(state, { payload: recheckPrint}) {
          return {...state,recheckPrint}
      },
      paytypelisy(state, { payload: paytypelisy}) {
          return {...state,paytypelisy}
      },
      group(state, { payload: group}) {
          return {...state,group}
      },
      groups(state, { payload: groups}) {
          const group=groups
          return {...state,group}
      },
      amountpoint(state, { payload: {amount,point}}) {
          return {...state,amount,point}
      },
      cutAmount(state, { payload: cutAmount}) {
          return {...state,cutAmount}
      },
      reamount(state, { payload: reamount}) {
          return {...state,reamount}
      },
      typeclicks(state, { payload: {typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}}) {
          return {...state,typeclick1,typeclick2,typeclick3,typeclick4,rechargetype}
      },
      //初始化结算弹框
      resetPayModal(state) {
        const amountlist=[{
            name:'微信',
            value:null,
            type:'1'
        }]
        const paytypelisy=[
            {name:'微信',check:false,disabled:false,type:'1'},
            {name:'支付宝',check:false,disabled:false,type:'2'},
            {name:'银联',check:false,disabled:false,type:'3'},
            {name:'现金',check:false,disabled:false,type:'4'},
            {name:'会员卡',check:false,disabled:false,type:'5'},
            {name:'积分',check:false,disabled:false,type:'6'}
        ]
        const group=false;
        const cutAmount='0';
        return {...state, amountlist, paytypelisy, group, cutAmount }
      }
  },
  effects: {
    *fetchbarCode({ payload:values }, { call, put ,select}) {
      const initdatasouce = yield select(state => state.cashierManage.goodsList);
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.pos.pd.spu.find',values);
        if(result.code=='0'){
          const { pdSpu } =result;
          const goodsList=initdatasouce.slice(0)
          const idx = goodsList.findIndex((value)=> value.barcode == pdSpu.barcode);
          // let { activityId, spActivities } = result.pdSpu;
          // let selectActivityId = activityId;//默认活动id
          // let currentActivityList;//活动列表
          // let isJoin = "0";//是否参加活动
          // if(spActivities&&spActivities.length>0) {
          //   spActivities.map((el,index) => el.barcode = result.pdSpu.barcode);
          //   currentActivityList = spActivities;
          //   isJoin = "1";
          // }
          // result.pdSpu.isJoin = isJoin;
          if(Number(pdSpu.inventory)<=0) {//判断库存
            message.error('商品库存不足');
            yield put({type: 'spinLoad/setLoading',payload:false});
            return;
          }
          let newGoodsInfo={}, currentPrice;
          if(idx=='-1'){
            newGoodsInfo= pdSpu;
            newGoodsInfo.qty='1'
            newGoodsInfo.discount='10';
            currentPrice = newGoodsInfo.toCPrice;//活动价；
            if(newGoodsInfo.isJoin=='1') {
              currentPrice = newGoodsInfo.specialPrice;
            }
          }else{
            newGoodsInfo = goodsList[idx];
            newGoodsInfo.qty=Number(newGoodsInfo.qty)+1;
            currentPrice = newGoodsInfo.toCPrice;//活动价；
              // if(goodsList[idx].isJoin=='1') {
              //   currentPrice = goodsList[idx].specialPrice;
              // }else if(currentActivityList&&currentActivityList.length>0) {//有活动，但是不参与活动，活动id设置成0
              //   selectActivityId = '0';
              // }
              goodsList.splice(idx,1); //删除当前
          }
          var zeropayPrice=NP.divide(NP.times(currentPrice, newGoodsInfo.qty,newGoodsInfo.discount),10); //计算值
          zeropayPrice = fomatNumTofixedTwo(zeropayPrice);//两位小安数，当不满足时候补零
          const editpayPrice =zeropayPrice.substring(0,zeropayPrice.indexOf(".")+3);  //截取小数后两位值
          if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
            newGoodsInfo.payPrice=NP.plus(editpayPrice, 0.01);
          }else{
            newGoodsInfo.payPrice=editpayPrice
          }
          goodsList.unshift(newGoodsInfo); //把这个元素添加到开头
          yield put({type: 'getGoodsList',payload:goodsList});
          // yield put({type: 'getActivityList',payload:{ currentActivityList, selectActivityId }});
        }else{
             message.error(result.message);
        }
        yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *memberinfo({ payload: values }, { call, put,select }) {
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,'qerp.pos.mb.card.find',values);
        if(result.code=='0'){
            const { mbCardInfo } = result;
            const ismember=true
            // const focustap = yield select(state => state.cashier.meths.focustap);
            // focustap()
            yield put({
                type: 'memberlist',
                payload:{
                  ismember,
                  memberinfo:mbCardInfo
                }
            });

        }else{
             message.error(result.message);
        }
        yield put({type: 'spinLoad/setLoading',payload:false});
    },
    *fetch2({ payload: {code,values} }, { call, put }) {
        const result=yield call(GetServerData,code,values);
    },
  },
};
