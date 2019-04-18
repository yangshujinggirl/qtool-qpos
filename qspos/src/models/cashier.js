import {GetServerData} from '../services/services';
import {message} from 'antd';
import {isInArray} from '../components/Method/Method';
import { routerRedux } from 'dva/router';
import NP from 'number-precision'

export default {
  namespace: 'cashier',
  state: {
        datasouce:[], //收银数据表
        totolnumber:'0',//总数量
        totolamount:'0',//总金额,
        thispoint:null,//本次积分
        onbule:false,
        meths:{},
        ismember:false,
        payvisible:false,
        meth1:{},
        paytotolamount:'0.00',//实际支付金额（抹零后金额）
        themeindex:0,
        barcode:null,
        cardNoMobile:null,
        checkPrint:false,
        recheckPrint:false,
        //支付弹窗数据转移
        amountlist:[{   //左边栏展示数组
            name:'微信',
            value:null,
            type:'1'
        }],
        paytypelisy:[  //右边按钮区展示数组
            {name:'微信',check:false,disabled:false,type:'1'},
            {name:'支付宝',check:false,disabled:false,type:'2'},
            {name:'银联',check:false,disabled:false,type:'3'},
            {name:'现金',check:false,disabled:false,type:'4'},
            {name:'会员卡',check:false,disabled:false,type:'5'},
            {name:'积分',check:false,disabled:false,type:'6'}
        ],
        group:false,
        cutAmount:'0',
        point:null,
        amount:null,
        //充值数据迁移
        rechargevisible:false,
        reamount:null,
        typeclick1:true,
        typeclick2:false,
        typeclick3:false,
        typeclick4:false,
        rechargetype:1,
        memberinfo:{isLocalShop:true},
        currentActivityList:[],//活动列表
        selectActivityId:'all'
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
      // selectActivity(state, { payload: activityId}) {
      //   const currentActivityList = state.currentActivityList;
      //   let datasouce = state.datasouce;
      //   let currentActivityItem;//当前选中的活动
      //   const barcode = currentActivityList[0].barcode;//当前活动商品;
      //   if(activityId !== "0") {
      //     currentActivityItem = currentActivityList.find((value, index, arr) => {
      //       return value.activityId == activityId;
      //     })
      //   }
      //   //重新计算payPrice
      //   datasouce.map((el,idx) => {
      //     if(el.barcode == barcode) {
      //       el.activityId = activityId;
      //       if(currentActivityItem) {
      //         el.activityName = currentActivityItem.name;
      //         el.isJoin = "1";
      //         el.payPrice = NP.times(el.specialPrice,el.qty)
      //       } else {
      //         el.activityName = '';
      //         el.isJoin = "0";
      //         el.discount = "10";
      //         el.payPrice = NP.times(el.toCPrice,el.qty);
      //       }
      //     }
      //     return el;
      //   })
      //   datasouce = [...datasouce];
      //   return {...state, datasouce, selectActivityId: activityId }
      // },
      getActivityList(state, { payload: { currentActivityList, selectActivityId} }){
        return {...state,currentActivityList, selectActivityId}
      },
	    datasouce(state, { payload: datasouce}) {
          var totolnumber=0
          var totolamount=0
          var thispoint=0
          for(var i=0;i<datasouce.length;i++){
              datasouce[i].key=String((Number(i)+1));
              totolnumber=NP.plus(totolnumber,datasouce[i].qty)
              totolamount=NP.plus(totolamount,datasouce[i].payPrice)
              thispoint=Math.round(totolamount)
              datasouce[i].price=datasouce[i].toCPrice
          }

          var toxsd=totolamount.toString().split(".");
          if(toxsd.length==1){
              totolamount=totolamount.toString()+".00";
          }
          if(toxsd.length>1 && toxsd[1].length<2){
              totolamount=totolamount.toString()+"0";
          }

          const paytotolamount=totolamount

         return {...state,datasouce,totolnumber,totolamount,thispoint,paytotolamount}

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
    *barfetch({ payload: {code,values} }, { call, put ,select}) {
        yield put({type: 'spinLoad/setLoading',payload:true});
        const result=yield call(GetServerData,code,values);
        if(result.code=='0'){
          const initdatasouce = yield select(state => state.cashier.datasouce);
          const datasouce=initdatasouce.slice(0)
          const i=isInArray(datasouce,result.pdSpu.barcode);
          let { activityId, spActivities } = result.pdSpu;
          let selectActivityId = activityId;//默认活动id
          let currentActivityList = spActivities;//活动列表
          let isJoin = "0";//是否参加活动
          if(currentActivityList&&currentActivityList.length>0) {
            currentActivityList.map((el,index) => el.barcode = result.pdSpu.barcode);
            isJoin = "1";
          }
          result.pdSpu.isJoin = isJoin;
          if(i==='-1'){
              //不存在，判断库存
              if(Number(result.pdSpu.inventory)>0){
                  const objects=result.pdSpu
                  objects.qty='1'
                  objects.discount='10';
                  //活动价；
                  let currentPrice = objects.toCPrice;
                  if(objects.isJoin=='1') {
                    currentPrice = objects.specialPrice;
                  }
                  // var zeropayPrice=String(NP.divide(NP.times(objects.toCPrice, objects.qty,objects.discount),10)); //计算值
                  var zeropayPrice=String(NP.divide(NP.times(currentPrice, objects.qty,objects.discount),10)); //计算值
                  //判断是否有小数点，及小数点时候有两位，当不满足时候补零
                  var xsd=zeropayPrice.toString().split(".");
                  if(xsd.length==1){
                      zeropayPrice=zeropayPrice.toString()+".00";
                  }
                  if(xsd.length>1 && xsd[1].length<2){
                      zeropayPrice=zeropayPrice.toString()+"0";
                  }

                  const editpayPrice =zeropayPrice.substring(0,zeropayPrice.indexOf(".")+3);  //截取小数后两位值
                  if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
                      objects.payPrice=String(NP.plus(editpayPrice, 0.01))
                  }else{
                      objects.payPrice=editpayPrice
                  }
                  datasouce.unshift(objects)
              }else{
                  message.error('商品库存不足');
                  yield put({type: 'spinLoad/setLoading',payload:false});
                  return
              }
          }else{
              //存在,库存判断是否大于0
              if(Number(datasouce[i].qty)==Number(datasouce[i].inventory)){
                  message.error('商品库存不足');
                  yield put({type: 'spinLoad/setLoading',payload:false});
                  return
              }
              datasouce[i].qty=String(Number(datasouce[i].qty)+1)
              var zeropayPrice=String(NP.divide(NP.times(datasouce[i].toCPrice, datasouce[i].qty,datasouce[i].discount),10)); //计算值
              //判断是否有小数点，及小数点时候有两位，当不满足时候补零
              var xsd=zeropayPrice.toString().split(".");
              if(xsd.length==1){
                  zeropayPrice=zeropayPrice.toString()+".00";
              }
              if(xsd.length>1 && xsd[1].length<2){
                  zeropayPrice=zeropayPrice.toString()+"0";
              }
              const editpayPrice =zeropayPrice.substring(0,zeropayPrice.indexOf(".")+3);  //截取小数后两位值
              if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
                  datasouce[i].payPrice=String(NP.plus(editpayPrice, 0.01));

              }else{
                  datasouce[i].payPrice=editpayPrice
              }
              const str=datasouce.splice(i,1); //删除当前
              datasouce.unshift(str[0]); //把这个元素添加到开头
          }
          yield put({type: 'datasouce',payload:datasouce});
          yield put({type: 'getActivityList',payload:{ currentActivityList, selectActivityId }});
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
  subscriptions: {
      setup({ dispatch, history }) {
          return history.listen(({ pathname, query }) => {
              if (pathname === '/cashier' && (!query.backinit)) {
                  dispatch({ type: 'initstate', payload:[]})
              }else if(pathname === '/cashier' && (query.backinit)) {
                  dispatch({ type: 'fetch2', payload: {code:'qerp.web.qpos.od.scan.cancel',values:JSON.parse(localStorage.getItem("payCancelValues"))}});
              }
          });
      },
  },
};
