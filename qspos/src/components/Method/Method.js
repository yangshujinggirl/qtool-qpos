import { message } from 'antd';
import ReactDOM from 'react-dom';

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













