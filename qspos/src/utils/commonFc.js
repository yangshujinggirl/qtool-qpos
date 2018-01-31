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

export function timeForMats (count) {
    // 拼接时间
    let time1 = new Date()
       time1.setTime(time1.getTime())
       let Y1 = time1.getFullYear()
    let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
    let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
    let timer1 = Y1 + '-' + M1 + '-' + D1; // 当前时间
    let time2 = new Date()
    time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * (count-1)))
    let Y2 = time2.getFullYear()
    let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
    let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
    let timer2 = Y2 + '-' + M2 + '-' + D2; // 之前的7天或者30天
    return {
         t1: timer1,
         t2: timer2
    }
}