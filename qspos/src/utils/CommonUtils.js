export function fomatNumTofixedTwo(value){
   value=value.toString().split(".");
  if(value.length==1){
      value=value.toString()+".00";
  }else if(value.length>1 && value[1].length<2){
      value=value.toString()+"0";
  }
  return value;
}
