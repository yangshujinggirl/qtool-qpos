import { post } from '../utils/post'
import {postExport} from '../utils/postExport';

export function GetServerData(code,values) {
    const result = post('/erpQposRest/qposrest.htm',{
         'code':code,
         'data':JSON.stringify(values)
    })
    return result
}

export function GetExportData(code,values) {
    const result = postExport('/erpQposRest/qposrestExport.htm',{
         'code':code,
         'data':JSON.stringify(values)
    })
    return result
}







