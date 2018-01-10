'use strict';
// import 'whatwg-fetch'
// import 'es6-promise'
import fetch from 'dva/fetch';
import { message } from 'antd';
// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
function obj2params(obj) {
    var result = '';
    var item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item]);
    }

    if (result) {
        result = result.slice(1);
    }

    return result;
}
var jsessionid = '';
export function getJsessionId(){
    return jsessionid
}
// 发送 post 请求
export function post(url, paramsObj) {
    var result = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: obj2params(paramsObj)
    }).then((res) => {
        if (res.status !== 200) {            
            return {message:'错误代码：'+res.status};                   
         }
         return res.json();
    }).then((json) => {
        if(json.code=='E_300'){
             window.location.href= '/';
        }
        jsessionid = json.sessionId;
        return json;
    }).catch(function(err) {      
        return {message:'网络错误'};      
     });

    return result;
}


// function _post(url, paramsObj) {
//     var _result = fetch(url, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: obj2params(paramsObj)
//     }).then((res) => {
//         console.log(res)
//         if (res.status !== 200) {                 
//             return {message:'错误代码：'+res.status};       
//          }
//             return res.json();
//         }).catch(function(err) {
//             console.log('Fetch Error : %S', err);  
//             message.error('网络错误')
//             return
//         });
    
//      return _result;
// }

// export function post(url, paramsObj) {
//     _post(url,paramsObj).then((json)=>{
//         console.log(result)
//         console.log(json)
//         if(json.code=='E_300'){
//                 window.location.href= '/';
//         }
//         jsessionid = result.sessionId;
       
//         return
//     })
//     var result =_post(url,paramsObj)
//     return result;

       
// }