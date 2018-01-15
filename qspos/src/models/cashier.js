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
          name:null,
          levelStr:null,
          point:null,
          amount:null,
          cardNo:null,
          mbCardId:null,
          isBirthMonth:null,
          ismember:false,
          payvisible:false,
          meth1:{},
          paytotolamount:'0.00',//实际支付金额（抹零后金额）
          themeindex:0,
          barcode:null,
          cardNoMobile:null,
          checkPrint:false

    },
    reducers: {
        initstate(state, { payload: {}}) {
			const datasouce=[]
            const totolnumber='0'
            const totolamount='0'
            const thispoint=null
            const onbule=false
            const name=null
            const levelStr=null
            const point=null
            const amount=null
            const cardNo=null
            const mbCardId=null
            const isBirthMonth=null
            const ismember=false
            const payvisible=false
            const paytotolamount='0.00'
            const themeindex=0
            const barcode=null
            const cardNoMobile=null
			return {...state,datasouce,totolnumber,totolamount,thispoint,onbule,name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember,payvisible,paytotolamount,themeindex,barcode,cardNoMobile}
		},
  	    datasouce(state, { payload: datasouce}) {
            var totolnumber=0
            var totolamount=0
            var thispoint=0
            for(var i=0;i<datasouce.length;i++){
                datasouce[i].key=String((Number(i)+1))
                totolnumber=Number(totolnumber)+Number(datasouce[i].qty)
                totolamount=Number(totolamount)+Number(datasouce[i].payPrice)
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
        barcode(state, { payload: barcode}) {
            return {...state,barcode}
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
        memberlist(state, { payload: {name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember}}) {
            return {...state,name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember}
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
       
    },
    effects: {
  	    *barfetch({ payload: {code,values} }, { call, put ,select}) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                console.log(values)
                const initdatasouce = yield select(state => state.cashier.datasouce);
                const datasouce=initdatasouce.slice(0)
                const i=isInArray(datasouce,values.barCode)
                if(i==='-1'){
                    //不存在，判断库存
                    if(Number(result.pdSpu.inventory)>0){
                        const objects=result.pdSpu
                        objects.qty='1'
                        objects.discount='10'
                        var zeropayPrice=String(NP.divide(NP.times(objects.toCPrice, objects.qty,objects.discount),10)); //计算值
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
                            objects.payPrice=String(parseFloat(editpayPrice)+0.01)
                        }else{
                            objects.payPrice=editpayPrice
                        }
                        datasouce.unshift(objects)
                    }else{
                        message.error('商品库存不足')
                        return
                    }
                }else{
                    //存在,库存判断是否大于0
                    if(Number(datasouce[i].qty)==Number(datasouce[i].inventory)){
                        message.error('商品库存不足')
                        return
                    }else{
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
                            datasouce[i].payPrice=String(parseFloat(editpayPrice)+0.01)
                        }else{
                            datasouce[i].payPrice=editpayPrice
                        }
                        const str=datasouce.splice(i,1); //删除当前
                        console.log(str)
                        datasouce.unshift(str[0]); //把这个元素添加到开头
                    }
                }
                yield put({type: 'datasouce',payload:datasouce});
            }else{
                 message.error(result.message);
            }   
        },
        *memberinfo({ payload: {code,values} }, { call, put,select }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                const name=result.mbCardInfo.name
                const levelStr=result.mbCardInfo.levelStr
                const point=result.mbCardInfo.point
                const amount=result.mbCardInfo.amount
                const cardNo=result.mbCardInfo.cardNo
                const mbCardId=result.mbCardInfo.mbCardId
                const isBirthMonth=result.mbCardInfo.isBirthMonth
                const ismember=true
                const focustap = yield select(state => state.cashier.meths.focustap);
                focustap()
                yield put({type: 'memberlist',payload:{name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember}});

            }else{
                 message.error(result.message);
            }   
        }, 
        *membercharge({ payload: {code,values} }, { call, put,select }) {
            const result=yield call(GetServerData,code,values);
            console.log(result)
            if(result.code=='0'){
                // const name=result.mbCardInfo.name
                // const levelStr=result.mbCardInfo.levelStr
                // const point=result.mbCardInfo.point
                // const amount=result.mbCardInfo.amount
                // const cardNo=result.mbCardInfo.cardNo
                // const mbCardId=result.mbCardInfo.mbCardId
                // const isBirthMonth=result.mbCardInfo.isBirthMonth
                // const ismember=true
                // const focustap = yield select(state => state.cashier.meths.focustap);
                // focustap()
                // yield put({type: 'memberlist',payload:{name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember}});

            }else{
                 message.error(result.message);
            }   
        },


    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/cashier') {
                      dispatch({ type: 'initstate', payload:[]})
                }
            });
        },
    },
};

