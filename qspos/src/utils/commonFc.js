export function cloneObj(obj) {
    var newObj = {}
    for(var prop in obj) {
      newObj[prop] = obj[prop]
    }
    return newObj
}

//深拷贝
export function deepcCloneObj(obj){
  var str, newobj = obj.constructor === Array ? [] : {};
  if(typeof obj !== 'object'){
      return;
  } else if(window.JSON){
      str = JSON.stringify(obj), //系列化对象
      newobj = JSON.parse(str); //还原
  } else {
      for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ? 
          cloneObj(obj[i]) : obj[i]; 
      }
  }
  return newobj;
};


export function dataedit(a){
    var xsd=a.toString().split(".");
    if(xsd.length==1){
        a=a.toString()+".00";
    }
    if(xsd.length>1 && xsd[1].length<2){
        a=a.toString()+"0";
    }
    const value =a.substring(0,a.indexOf(".")+3);  //截取小数后两位值
    return value
}