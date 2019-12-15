import { message } from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../services/services';
import {
  getSaleOrderInfo,
  getShiftInfo,
  getRechargeOrderInfo,
  getReturnOrderInfo
} from '../../components/Method/Print';

export function Messagesuccess(values, time, call) {
   message.success(values, time, call);
}

export function isInArray(arr,value) {
    for(var i = 0; i < arr.length; i++){
        if(value == arr[i].barcode){
            return i;
        }
    }
    return '-1';
 }

 //打印销售订单
 export function printSaleOrder(checkPrint,orderid) {
    if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
        if(checkPrint){
            //判断打印纸大小
            const result=GetServerData('qerp.pos.sy.config.info')
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code == "0"){
                    //判断是打印大的还是小的
                    if(json.config.paperSize=='80'){
                        let valueData =  {type:"1",outId:orderid};
                        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                        result.then((res) => {
                            return res;
                        }).then((data) => {
                            if(data.code == "0"){
                                getSaleOrderInfo(data,"80",json.config.submitPrintNum);
                            }else{
                                message.error(data.message);
                            }
                        });
                    }else{
                        let valueData =  {type:"1",outId:orderid};
                        const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                        result.then((res) => {
                            return res;
                        }).then((data) => {
                            if(data.code == "0"){
                                getSaleOrderInfo(data,"58",json.config.submitPrintNum);
                            }else{
                                message.error(data.message);
                            }
                        });
                    }
                }else{
                    message.warning('打印失败')
                }
            })
        }
    }else{
        message.warning('请在win系统下操作打印')
    }
 }

 //打印充值订单
export function printRechargeOrder(checkPrint,orderid) {
        if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
        //判断打印
            if(checkPrint){
                const result=GetServerData('qerp.pos.sy.config.info')
                result.then((res) => {
                    return res;
                }).then((json) => {
                    if(json.code == "0"){
                        if(json.config.rechargePrint=='1'){
                            //判断是打印大的还是小的
                            if(json.config.paperSize=='80'){
                                let valueData =  {type:"2",outId:orderid};
                                const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                result.then((res) => {
                                    return res;
                                }).then((data) => {
                                    if(data.code == "0"){
                                        getRechargeOrderInfo(data,"80",json.config.rechargePrintNum);
                                    }else{
                                        message.error(data.message);
                                    }
                                });
                            }else{
                                let valueData =  {type:"2",outId:orderid};
                                const result=GetServerData('qerp.web.qpos.st.sale.order.detail',valueData);
                                result.then((res) => {
                                    return res;
                                }).then((data) => {
                                    if(data.code == "0"){
                                        getRechargeOrderInfo(data,"58",json.config.rechargePrintNum);
                                    }else{
                                        message.error(data.message);
                                    }
                                });
                            }
                        }
                    }else{
                        message.warning('打印失败')
                    }
                })
            }
    }else{
        message.warning('请在win系统下操作打印')
    }
 }

 //打印退货订单
export function printReturnOrder(checkPrint,orderid) {
        if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
        //判断打印
            if(checkPrint){
                GetServerData('qerp.pos.sy.config.info')
                .then((json) => {
                    if(json.code == "0"){
                      //判断是打印大的还是小的
                      let valueData =  {type:"3",outId:orderid};
                      let size = json.config.paperSize;

                      GetServerData('qerp.web.qpos.st.sale.order.detail',valueData)
                      .then((data) => {
                        if(data.code == "0"){
                          getReturnOrderInfo(data,size,json.config.submitPrintNum);
                        }else{
                          message.error(data.message);
                        }
                      });
                    }else{
                        message.warning('打印失败')
                    }
                })
            }
    }else{
        message.warning('请在win系统下操作打印')
    }
 }
