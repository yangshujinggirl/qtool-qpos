import { post } from '../utils/post'

export function GetServerData(code,values) {
    const result = post('/erpQposRest/qposrest.htm',{
         'code':code,
         'data':JSON.stringify(values)
    })
    return result
}





