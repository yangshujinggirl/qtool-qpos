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