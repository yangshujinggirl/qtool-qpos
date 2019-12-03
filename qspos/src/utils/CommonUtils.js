import NP from 'number-precision';

export function fomatNumTofixedTwo(value){
  let newVal = value.toString().split(".");
  if(value.length==1){
    value=newVal.toString()+".00";
  }else if(value.length>1 && value[1].length<2){
    value=newVal.toString()+"0";
  }
  value = String(value);
  return value;
}
export function fomatNumAddFloat(value){
  let newVal;
  let editVal =value.substring(0,value.indexOf(".")+3);
  if(parseFloat(value)-parseFloat(editVal)>0){//3位小数，直接进0.01
    newVal= NP.plus(editVal, 0.01);
  }else{
    newVal = editVal
  }
  return newVal;
}
