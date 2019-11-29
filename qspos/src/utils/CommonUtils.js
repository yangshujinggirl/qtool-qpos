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
