import { post } from '../utils/post'
import request from '../utils/request';

export function GetServerData(code,values) {
    const result = post('/erpWebRest/webrest.htm',{
         'code':code,
         'data':JSON.stringify(values)
    })
    return result
}


export function GetServerDatas(code,values) {
	let value={
		code:code,
		data:values
	}
  return request('/erpWebRest/webrest.htm', {
    method: 'POST',
    body: JSON.stringify(value),
  });
}
