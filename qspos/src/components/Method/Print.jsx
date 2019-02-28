import React from 'react';
import { message} from 'antd';
import {getJsessionId} from '../../utils/post'

var LODOP;
var CreatedOKLodop7766=null;
let hostAddress  = window.location.host;
var imgSrc ="http://"+hostAddress+'/static/top_logo.png';
var logoImgBig ="http://"+hostAddress+'/static/print/top_logo.png';
var logoImgLittle ="http://"+hostAddress+'/static/print/top_logo_litle.png';
var wxCodeUrl ='http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q';
var appCodeUrl ='http://a.app.qq.com/o/simple.jsp?pkgname=qtools.customer.android';
var isOpenApp = '';//是否开通C端App
var isOpenAliPay = '';//是否开通非常付宝
var isOpenWechat = '';//是否开通微信
var footerText;//页脚
var codeUrl;//二维码
var footerContent = {
  scanText:'',
  serverText:'官方服务热线：400-7766-999',
  tipsTextOne:'',
  tipsTextTwo:'',
  codeUrl:''
}
//====判断是否需要安装CLodop云打印服务器:====
function needCLodop(){
  // if(true) alert('123');else
  // // alert('打印控件未安装，请先下载打印机控件')
  // if(true) alert('456');
  // if(true) {
  //   alert('11111')
  // } else if(true) {
  //   alert('44444')
  // }
    try{
    	var ua=navigator.userAgent;
    	if (ua.match(/Windows\sPhone/i) !=null) return true;
    	if (ua.match(/iPhone|iPod/i) != null) return true;
    	if (ua.match(/Android/i) != null) return true;
    	if (ua.match(/Edge\D?\d+/i) != null) return true;

    	var verTrident=ua.match(/Trident\D?\d+/i);
    	var verIE=ua.match(/MSIE\D?\d+/i);
    	var verOPR=ua.match(/OPR\D?\d+/i);
    	var verFF=ua.match(/Firefox\D?\d+/i);
    	var x64=ua.match(/x64/i);
    	if ((verTrident==null)&&(verIE==null)&&(x64!==null)){
    		return true;
      } else if ( verFF !== null) {
    		verFF = verFF[0].match(/\d+/);
    		if ((verFF[0]>= 42)||(x64!==null)) return true;
    	} else if ( verOPR !== null) {
    		verOPR = verOPR[0].match(/\d+/);
    		if ( verOPR[0] >= 32 ) return true;
    	} else if ((verTrident==null)&&(verIE==null)) {
    		var verChrome=ua.match(/Chrome\D?\d+/i);
    		if ( verChrome !== null ) {
    			verChrome = verChrome[0].match(/\d+/);
    			if (verChrome[0]>=42) return true;
    		}
    	}
      return false;
    } catch(err) {
      return true;
    }
}
//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
	var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
	var oscript = document.createElement('script');
	oscript.src ='http://localhost:8000/CLodopfuncs.js?priority=1';
	head.insertBefore( oscript,head.firstChild );

	//引用双端口(8000和18000）避免其中某个被占用：
	oscript = document.createElement('script');
	oscript.src ='http://localhost:18000/CLodopfuncs.js?priority=0';
	head.insertBefore( oscript,head.firstChild );
}
//====获取LODOP对象的主过程：====
function getLodop(oOBJECT,oEMBED){

    isOpenApp = sessionStorage.getItem('openApp');

    if(isOpenApp == '1') {
      footerContent = {
        scanText:'下载Qtools官方APP 畅领600元红包大礼',
        tipsTextOne:'时尚潮妈购物新姿势',
        tipsTextTwo:'发现好物  |  随时下单  |  到店体验',
        serverText:'官方服务热线：400-7766-999',
        codeUrl:appCodeUrl
      }
    } else {
      footerContent = {
        scanText:'扫码关注Qtools官方微信公号',
        serverText:'官方服务热线：400-7766-999',
        codeUrl:wxCodeUrl,
        tipsTextOne:'',
        tipsTextTwo:'',
      }
    }

    var strHtmInstall="<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='/static/install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='/static/install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install="<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='/static/install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='/static/install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox="<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome="<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var strCLodopInstall="<font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>"
    var strCLodopUpdate="<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
    var LODOP;
    try{
        var isIE = (navigator.userAgent.indexOf('MSIE')>=0) || (navigator.userAgent.indexOf('Trident')>=0);
        if (needCLodop()) {
            try{
              LODOP=getCLodop();
            } catch(err) {

            }
    	    if (!LODOP && document.readyState!=='complete') {
            alert('C-Lodop没准备好，请稍后再试！');
            return;
          };
          if (!LODOP) {
        		 if (isIE) {
               document.write(strCLodopInstall);
             } else {
               alert('打印控件未安装，请先下载打印机控件')
               return;
             }
          } else {
             if (CLODOP.CVERSION<'2.1.3.0') {
          			if (isIE) {
                  document.write(strCLodopUpdate);
                } else {
                  document.documentElement.innerHTML=strCLodopUpdate+document.documentElement.innerHTML;
          		    alert('CLodop云打印服务需升级!')
                }
        		 }
        		 if (oEMBED && oEMBED.parentNode) {
               oEMBED.parentNode.removeChild(oEMBED)
             };
        		 if (oOBJECT && oOBJECT.parentNode) {
               oOBJECT.parentNode.removeChild(oOBJECT);
             }
    	    }
        } else {
            var is64IE  = isIE && (navigator.userAgent.indexOf('x64')>=0);
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT!=undefined || oEMBED!=undefined) {
                if (isIE) LODOP=oOBJECT; else  LODOP=oEMBED;
            } else if (CreatedOKLodop7766==null){
                LODOP=document.createElement('object');
                LODOP.setAttribute('width',0);
                LODOP.setAttribute('height',0);
                LODOP.setAttribute('style','position:absolute;left:0px;top:-100px;width:0px;height:0px;');
                if (isIE) LODOP.setAttribute('classid','clsid:2105C259-1E0C-4534-8141-A753534CB4CA');
                else LODOP.setAttribute('type','application/x-print-lodop');
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766=LODOP;
             } else LODOP=CreatedOKLodop7766;
            //=====Lodop插件未安装时提示下载地址:==========
            if ((LODOP==null)||(typeof(LODOP.VERSION)=='undefined')) {
                 if (navigator.userAgent.indexOf('Chrome')>=0){
                     document.documentElement.innerHTML=strHtmChrome+document.documentElement.innerHTML;
                 }
                 if (navigator.userAgent.indexOf('Firefox')>=0){
                     document.documentElement.innerHTML=strHtmFireFox+document.documentElement.innerHTML;
                 }
                 if (is64IE) {
                   document.write(strHtm64_Install);
                 } else if (isIE)   {
                   document.write(strHtmInstall);
                 } else{
                   document.documentElement.innerHTML=strHtmInstall+document.documentElement.innerHTML;
                   return LODOP;
                 }
            }
        }
        if (LODOP.VERSION<'6.2.1.8') {
            if (!needCLodop()){
            	if (is64IE) {
                document.write(strHtm64_Update);
              } else if (isIE) {
                document.write(strHtmUpdate);
              } else{
          	    document.documentElement.innerHTML=strHtmUpdate+document.documentElement.innerHTML;
              }
           }
          return LODOP;
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
        LODOP.SET_LICENSES("北京中电亿商网络技术有限责任公司", "653726081798577778794959892839", "", "");
        return LODOP;
    } catch(err) {
      alert('getLodop出错:'+err);
    }
}

function PrintOneURL(url,orderno){
		console.log(url)
		console.log(orderno)
		if(orderno == undefined){
			orderno = "";
		}
		LODOP=getLodop();
		LODOP.PRINT_INIT('printJob'+new Date());
		LODOP.ADD_PRINT_URL('0%','0%','90%','70%',url);
		LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT','Auto-Width')
		LODOP.PRINT();
}

//交班打印
export function getShiftInfo(message1,message2,size,printCount){
	if(size == "80"){
		printShiftInfo(message1,message2,printCount);
	}else{
		printShiftInfoSmall(message1,message2,printCount);
	}
}

function printShiftInfo(userSales,urUser,printCount){
	let pri_count = Number(printCount);
	let userInfoAll = userSales;
	var title = {
		"shopName":"店铺名称",
		"time":"交班时间",
		"name":"收营员",
		"orderNum":"订单数",
		"money":"净收款",
		"sale":"销售额"
	};
	var text = {
		"shopName":userInfoAll.spShopName,
		"time":userInfoAll.printDate,
		"name":userInfoAll.userSales.nickname,
		"orderNum":userInfoAll.userSales.orderQty,
		"money":userInfoAll.userSales.icAmount,
		"sale":userInfoAll.userSales.amount
	};
	var infoWidth = 53*3.78;

  let posiTopNum = 0;
  var titleFz = 16;
  var contentFz = 8;
  var contentTwoFz = 7;

  isOpenAliPay = sessionStorage.getItem('openAlipay');
  isOpenWechat = sessionStorage.getItem('openWechat');

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,720,400,"");

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","63mm",40,"交班结算表");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0.5);
  posiTopNum = posiTopNum+40;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"63mm",3,0);
  posiTopNum = posiTopNum+15;

	var textWidth;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","48mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		if(title[key]!="交班时间"){
			textWidth = text[key].length*11;
			posiTopNum = posiTopNum+20+(Math.ceil(textWidth/infoWidth)-1)*12;
		}else{
			posiTopNum = posiTopNum+20;
		}
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"63mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","17mm",20,"支付方式");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"17mm","13mm",20,"销售");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"30mm","13mm",20,"充值");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"43mm","13mm",20,"退款");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"56mm","13mm",20,"共计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+17;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"63mm",3,0);
  posiTopNum = posiTopNum+10;

	let moneyInfo = [{
                    use:"微信",
                    key:'001'
                  },
                  {
                    use:"微信扫码",
                    key:'002'
                  },
                  {
                    use:"支付宝",
                    key:'003'
                  },
                  {
                    use:"支付宝扫码",
                    key:'004'
                  },
                  {
                    use:"App支付",
                    key:'005'
                  },
                  {
                    use:"现金",
                    key:'006'
                  },
                  {
                    use:"银联",
                    key:'007'
                  },
                  {
                    use:"积分抵扣",
                    key:'008'
                  },
                  {
                    use:"会员卡消费",
                    key:'009'
                  },
                  {
                    use:"会员卡退款",
                    key:'010'
                  }];
  moneyInfo.map((el,index) => {
    if(el.key == '001') {
      el.sale = userInfoAll.userShift[0].wechatAmount?userInfoAll.userShift[0].wechatAmount:"/";
      el.tui = userInfoAll.userShift[1].wechatAmount?userInfoAll.userShift[1].wechatAmount:"/";
      el.chong = userInfoAll.userShift[2].wechatAmount?userInfoAll.userShift[2].wechatAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '002') {
      el.sale = userInfoAll.userShift[0].scanWechatAmount?userInfoAll.userShift[0].scanWechatAmount:"/";
      el.tui = userInfoAll.userShift[1].scanWechatAmount?userInfoAll.userShift[1].scanWechatAmount:"/";
      el.chong = userInfoAll.userShift[2].scanWechatAmount?userInfoAll.userShift[2].scanWechatAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '003') {
      el.sale = userInfoAll.userShift[0].alipayAmount?userInfoAll.userShift[0].alipayAmount:"/";
      el.tui = userInfoAll.userShift[1].alipayAmount?userInfoAll.userShift[1].alipayAmount:"/";
      el.chong = userInfoAll.userShift[2].alipayAmount?userInfoAll.userShift[2].alipayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '004') {
      el.sale = userInfoAll.userShift[0].scanAlipayAmount?userInfoAll.userShift[0].scanAlipayAmount:"/";
      el.tui = userInfoAll.userShift[1].scanAlipayAmount?userInfoAll.userShift[1].scanAlipayAmount:"/";
      el.chong = userInfoAll.userShift[2].scanAlipayAmount?userInfoAll.userShift[2].scanAlipayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '005') {
      el.sale = userInfoAll.userShift[0].appPay?userInfoAll.userShift[0].appPay:"/";
      el.tui = userInfoAll.userShift[1].appPay?userInfoAll.userShift[1].appPay:"/";
      el.chong = userInfoAll.userShift[2].appPay?userInfoAll.userShift[2].appPay:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '006') {
      el.sale = userInfoAll.userShift[0].cashAmount?userInfoAll.userShift[0].cashAmount:"/";
      el.tui = userInfoAll.userShift[1].cashAmount?userInfoAll.userShift[1].cashAmount:"/";
      el.chong = userInfoAll.userShift[2].cashAmount?userInfoAll.userShift[2].cashAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '007') {
      el.sale = userInfoAll.userShift[0].unionpayAmount?userInfoAll.userShift[0].unionpayAmount:"/";
      el.tui = userInfoAll.userShift[1].unionpayAmount?userInfoAll.userShift[1].unionpayAmount:"/";
      el.chong = userInfoAll.userShift[2].unionpayAmount?userInfoAll.userShift[2].unionpayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '008') {
      el.sale = userInfoAll.userShift[0].pointAmount?userInfoAll.userShift[0].pointAmount:"/";
      el.tui = userInfoAll.userShift[1].pointAmount?userInfoAll.userShift[1].pointAmount:"/";
      el.chong = userInfoAll.userShift[2].pointAmount?userInfoAll.userShift[2].pointAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '009') {
      el.sale = userInfoAll.userShift[0].cardConsumeAmount?userInfoAll.userShift[0].cardConsumeAmount:"/";
      el.tui = "/";
      el.chong = "/";
      el.count = (parseFloat(el.sale)).toFixed(2);
    } else if(el.key == '010') {
      el.sale = "/";
      el.tui = userInfoAll.userShift[1].cardConsumeAmount?userInfoAll.userShift[1].cardConsumeAmount:"/";
      el.chong = "/";
      el.count = (parseFloat(el.tui)).toFixed(2);
    }
    return el;
  })
  //当支付宝扫码，微信扫码，App支付不为0时，把开关打开为1
  moneyInfo.map((el,index) => {
      if(el.count != 0) {
        if(el.key == '004') {
          isOpenAliPay = 1;
        }  else if (el.key == '002') {
          isOpenWechat = 1;
        } else if (el.key == '005') {
          isOpenApp = 1;
        }
      }
      return el;
  })
  //过滤是否开通扫码支付
  if(isOpenAliPay == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '004';
    })
    moneyInfo.splice(index,1)
  }
  if(isOpenWechat == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '002';
    })
    moneyInfo.splice(index,1)
  }
  if(isOpenApp == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '005';
    })
    moneyInfo.splice(index,1)
  }
  for(var i=0;i<moneyInfo.length;i++){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","17mm",20,moneyInfo[i].use);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"17mm","13mm",20,moneyInfo[i].sale);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"30mm","13mm",20,moneyInfo[i].chong);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"43mm","13mm",20,moneyInfo[i].tui);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"56mm","13mm",20,moneyInfo[i].count);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
			posiTopNum  = posiTopNum + 20;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"63mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"店铺收货单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","43mm",20,userInfoAll.receiveCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","43mm",20,userInfoAll.adjustCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum=posiTopNum+17;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"63mm",3,0);
  posiTopNum = posiTopNum+20;

  LODOP.ADD_PRINT_IMAGE(posiTopNum,"15mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+60;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.SET_PRINT_COPIES(pri_count);
	LODOP.PRINT();
}

function printShiftInfoSmall(userSales,urUser,printCount){
	let pri_count = Number(printCount);
	let userInfoAll = userSales;
	var title = {
		"shopName":"店铺名称",
		"time":"交班时间",
		"name":"收营员",
		"orderNum":"订单数",
		"money":"净收款",
		"sale":"销售额"
	};
	var text = {
		"shopName":userInfoAll.spShopName,
		"time":userInfoAll.printDate,
		"name":userInfoAll.userSales.nickname,
		"orderNum":userInfoAll.userSales.orderQty,
		"money":userInfoAll.userSales.icAmount,
		"sale":userInfoAll.userSales.amount
	};
	var infoWidth = 34*3.78;
  let posiTopNum = 3;
  var titleFz = 13;
  var contentFz = 7;
  var contentTwoFz = 6;

  isOpenAliPay = sessionStorage.getItem('openAlipay');
  isOpenWechat = sessionStorage.getItem('openWechat');

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",27,"交班结算表");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0.5);
  posiTopNum = posiTopNum+26;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	var textWidth;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0.7);
		//8pt=11px
		// if(title[key]!="交班时间"){
		// 	textWidth = text[key].length*11;
		// 	posiTopNum = posiTopNum+15+(Math.ceil(textWidth/infoWidth)-1)*11;
		// }else{
		// 	posiTopNum = posiTopNum+15;
		// }
    posiTopNum = posiTopNum+15;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","12mm",15,"支付方式");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"12mm","9mm",15,"销售");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"21mm","9mm",15,"充值");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"30mm","8mm",15,"退款");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"38mm","10mm",15,"共计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+12;

  let moneyInfo = [{
                    use:"微信",
                    key:'001'
                  },
                  {
                    use:"微信扫码",
                    key:'002'
                  },
                  {
                    use:"支付宝",
                    key:'003'
                  },
                  {
                    use:"支付宝扫码",
                    key:'004'
                  },
                  {
                    use:"App支付",
                    key:'005'
                  },
                  {
                    use:"现金",
                    key:'006'
                  },
                  {
                    use:"银联",
                    key:'007'
                  },
                  {
                    use:"积分抵扣",
                    key:'008'
                  },
                  {
                    use:"会员卡消费",
                    key:'009'
                  },
                  {
                    use:"会员卡退款",
                    key:'010'
                  }];
  moneyInfo.map((el,index) => {
    if(el.key == '001') {
      el.sale = userInfoAll.userShift[0].wechatAmount?userInfoAll.userShift[0].wechatAmount:"/";
      el.tui = userInfoAll.userShift[1].wechatAmount?userInfoAll.userShift[1].wechatAmount:"/";
      el.chong = userInfoAll.userShift[2].wechatAmount?userInfoAll.userShift[2].wechatAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '002') {
      el.sale = userInfoAll.userShift[0].scanWechatAmount?userInfoAll.userShift[0].scanWechatAmount:"/";
      el.tui = userInfoAll.userShift[1].scanWechatAmount?userInfoAll.userShift[1].scanWechatAmount:"/";
      el.chong = userInfoAll.userShift[2].scanWechatAmount?userInfoAll.userShift[2].scanWechatAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '003') {
      el.sale = userInfoAll.userShift[0].alipayAmount?userInfoAll.userShift[0].alipayAmount:"/";
      el.tui = userInfoAll.userShift[1].alipayAmount?userInfoAll.userShift[1].alipayAmount:"/";
      el.chong = userInfoAll.userShift[2].alipayAmount?userInfoAll.userShift[2].alipayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '004') {
      el.sale = userInfoAll.userShift[0].scanAlipayAmount?userInfoAll.userShift[0].scanAlipayAmount:"/";
      el.tui = userInfoAll.userShift[1].scanAlipayAmount?userInfoAll.userShift[1].scanAlipayAmount:"/";
      el.chong = userInfoAll.userShift[2].scanAlipayAmount?userInfoAll.userShift[2].scanAlipayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '005') {
      el.sale = userInfoAll.userShift[0].appPay?userInfoAll.userShift[0].appPay:"/";
      el.tui = userInfoAll.userShift[1].appPay?userInfoAll.userShift[1].appPay:"/";
      el.chong = userInfoAll.userShift[2].appPay?userInfoAll.userShift[2].appPay:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '006') {
      el.sale = userInfoAll.userShift[0].cashAmount?userInfoAll.userShift[0].cashAmount:"/";
      el.tui = userInfoAll.userShift[1].cashAmount?userInfoAll.userShift[1].cashAmount:"/";
      el.chong = userInfoAll.userShift[2].cashAmount?userInfoAll.userShift[2].cashAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '007') {
      el.sale = userInfoAll.userShift[0].unionpayAmount?userInfoAll.userShift[0].unionpayAmount:"/";
      el.tui = userInfoAll.userShift[1].unionpayAmount?userInfoAll.userShift[1].unionpayAmount:"/";
      el.chong = userInfoAll.userShift[2].unionpayAmount?userInfoAll.userShift[2].unionpayAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '008') {
      el.sale = userInfoAll.userShift[0].pointAmount?userInfoAll.userShift[0].pointAmount:"/";
      el.tui = userInfoAll.userShift[1].pointAmount?userInfoAll.userShift[1].pointAmount:"/";
      el.chong = userInfoAll.userShift[2].pointAmount?userInfoAll.userShift[2].pointAmount:"/";
      el.count = (parseFloat(el.sale) +parseFloat(el.chong)-parseFloat(el.tui)).toFixed(2);
    } else if(el.key == '009') {
      el.sale = userInfoAll.userShift[0].cardConsumeAmount?userInfoAll.userShift[0].cardConsumeAmount:"/";
      el.tui = "/";
      el.chong = "/";
      el.count = (parseFloat(el.sale)).toFixed(2);
    } else if(el.key == '010') {
      el.sale = "/";
      el.tui = userInfoAll.userShift[1].cardConsumeAmount?userInfoAll.userShift[1].cardConsumeAmount:"/";
      el.chong = "/";
      el.count = (parseFloat(el.tui)).toFixed(2);
    }
    return el;
  })
  //当支付宝扫码，微信扫码，App支付不为0时，把开关打开为1
  moneyInfo.map((el,index) => {
      if(el.count != 0) {
        if(el.key == '004') {
          isOpenAliPay = 1;
        }  else if (el.key == '002') {
          isOpenWechat = 1;
        } else if (el.key == '005') {
          isOpenApp = 1;
        }
      }
      return el;
  })
  if(isOpenAliPay == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '004';
    })
    moneyInfo.splice(index,1)
  }
  if(isOpenWechat == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '002';
    })
    moneyInfo.splice(index,1)
  }
  if(isOpenApp == 0) {
    let index = moneyInfo.findIndex(function(value, index, arr) {
      return value.key == '005';
    })
    moneyInfo.splice(index,1)
  }

	for(var i=0;i<moneyInfo.length;i++){
			 LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","12mm",20,moneyInfo[i].use);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"12mm","9mm",20,moneyInfo[i].sale);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
      LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"21mm","9mm",20,moneyInfo[i].chong);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
      LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"30mm","8mm",20,moneyInfo[i].tui);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
      LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"38mm","10mm",20,moneyInfo[i].count);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
      LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
			posiTopNum  = posiTopNum + 20;
	};

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","17mm",20,"店铺收货单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"17mm","32mm",20,userInfoAll.receiveCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","17mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"17mm","32mm",20,userInfoAll.adjustCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式
  posiTopNum = posiTopNum+35;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","50mm",80,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.PRINT();
}

//充值订单打印
export function getRechargeOrderInfo(message,size,printCount){
	if(size == "80"){
		printRechargeOrder(message,printCount);
	}else{
		printRechargeOrderSmall(message,printCount);
	}
}

function printRechargeOrder(message,printCount){
	console.log(message)
	let print_count =Number(printCount);
	let info = message;
	var title = {
		"vipName":"会员姓名",
		"vipCardNo":"会员卡号",
		"vipMobile":"会员手机",
		"vipBeforeMoney":"充值前余额",
		"money":"充值金额",
		"vipAfterMoney":"充值后余额"
	};
	var text = {
		"vipName":info.mbCard.printName,
		"vipCardNo":info.mbCard.printCardNo,
		"vipMobile":info.mbCard.printMobile,
		"vipBeforeMoney":info.cardMoneyChargeInfo.beforeAmount,
		"money":info.cardMoneyChargeInfo.amount,
		"vipAfterMoney":info.cardMoneyChargeInfo.afterAmount
	};
	var rechargeNo = info.cardMoneyChargeInfo.chargeNo;
	var rechargeTime = info.cardMoneyChargeInfo.createTime;
	var payAmount = info.cardMoneyChargeInfo.amount;

	var printName = info.printName;
	var payType="「 "+ info.cardMoneyChargeInfo.typeStr +"」";

  let posiTopNum = 0;
  var titleFz = 10;
  var contentFz = 8;
	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"18mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+50;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+25;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"充值单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,rechargeNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"充值日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,rechargeTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		posiTopNum = posiTopNum+18;
	};
	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;
	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
  posiTopNum = posiTopNum+16;
	//添加的支付方式
	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
  posiTopNum = posiTopNum+18;

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+30;

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"15mm",160,160,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+170;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+20;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextOne);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+16;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextTwo);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+20;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
  // LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
	LODOP.PRINT();
}

function printRechargeOrderSmall(message,printCount){
	let print_count =Number(printCount);
	let info = message;
	var title = {
		"vipName":"会员姓名",
		"vipCardNo":"会员卡号",
		"vipMobile":"会员手机",
		"vipBeforeMoney":"充值前余额",
		"money":"充值金额",
		"vipAfterMoney":"充值后余额"
	};
	var text = {
		"vipName":info.mbCard.printName,
		"vipCardNo":info.mbCard.printCardNo,
		"vipMobile":info.mbCard.printMobile,
		"vipBeforeMoney":info.cardMoneyChargeInfo.beforeAmount,
		"money":info.cardMoneyChargeInfo.amount,
		"vipAfterMoney":info.cardMoneyChargeInfo.afterAmount
	};
	var rechargeNo = info.cardMoneyChargeInfo.chargeNo;
	var rechargeTime = info.cardMoneyChargeInfo.createTime;
	var payAmount = info.cardMoneyChargeInfo.amount;

	var printName = info.printName;
	var payType="「 "+ info.cardMoneyChargeInfo.typeStr +"」"

  let posiTopNum = 0;
  var titleFz = 8;
  var contentFz = 7;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+40;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"充值单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,rechargeNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"充值日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,rechargeTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);
		posiTopNum = posiTopNum+15;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
  posiTopNum = posiTopNum+12;
	//添加的支付方式
	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
  posiTopNum = posiTopNum+15;

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+30;

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"10mm",120,120,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+124

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"50mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+15;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextOne);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+11;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextTwo);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+15;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
	LODOP.PRINT();
}

//退货订单打印
export function getReturnOrderInfo(message,size,printCount){
	if(size == "80"){
		printReturnOrder(message,printCount);
	}else{
		printReturnOrderSmall(message,printCount);
	}
}

function printReturnOrder(message,printCount){
	let print_count = Number(printCount);
	let returnInfoAll = message;
	var moneyInfo = returnInfoAll.returnOrderDetails;
	//门店打印名称字段
	var printName = returnInfoAll.printName;
	var orderNo = returnInfoAll.odReturn.returnNo;
	var saleTime = returnInfoAll.odReturn.createTime;
	var totalPay = returnInfoAll.odReturn.amount;//退款合计
	var totalqty = returnInfoAll.odReturn.qty;//
  var cutAmount = returnInfoAll.odReturn.cutAmount?returnInfoAll.odReturn.cutAmount:0;
	var stTotalPay = returnInfoAll.odReturn.realRefundTotalAmount;//实退金额
	var payType="「 "+returnInfoAll.odReturn.typeStr +"」";

	//扣除积分
	var returnPoint = returnInfoAll.mbCard.point;
  let posiTopNum = 0;
  var titleFz = 10;
  var contentFz = 8;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"18mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+50;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+25;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"退货单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"退货日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px
	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"36mm","14mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+20+(lineCount-1)*12;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"退款合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"36mm","14mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;

  if(cutAmount != 0) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,'抹零金额');
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,cutAmount);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+18;
  }

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,'实退金额');
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,stTotalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;

  if(returnInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"扣除积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,returnPoint);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+18;
	}

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+30;

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"15mm",160,160,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+170;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+20;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+16;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+20;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}

function printReturnOrderSmall(message,printCount){
	let print_count =Number(printCount);
	let returnInfoAll = message;
	var moneyInfo = returnInfoAll.returnOrderDetails;
	//门店打印名称字段
	var printName = returnInfoAll.printName;
	var orderNo = returnInfoAll.odReturn.returnNo;
	var saleTime = returnInfoAll.odReturn.createTime;
	var totalPay = returnInfoAll.odReturn.amount;//退款合计
	var totalqty = returnInfoAll.odReturn.qty;
  var cutAmount = returnInfoAll.odReturn.cutAmount?returnInfoAll.odReturn.cutAmount:0;
	// var stTotalPay = totalPay-cutAmount;//实退金额
	var stTotalPay = returnInfoAll.odReturn.realRefundTotalAmount;//实退金额
	var payType="「 "+returnInfoAll.odReturn.typeStr +" 」"
	//扣除积分
	var returnPoint = returnInfoAll.mbCard.point;
  let posiTopNum = 0;
  var titleFz = 8;
  var contentFz = 7;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+40;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"退货单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"退货日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px
	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*9;
		lineCount = Math.ceil(infoLen/lineWidth);
		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+15+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+15+(lineCount-1)*12;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"退款合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

  if(cutAmount != 0) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,'抹零金额');
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,cutAmount);
  	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+15;
  }

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"实退金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,stTotalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","50mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	if(returnInfoAll.mbCard){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"扣除积分");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,returnPoint);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
			posiTopNum = posiTopNum+15;
	}

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+30;

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"10mm",120,120,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+124;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+15;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+11;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+15;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}



//打印销售订单
export function getSaleOrderInfo(message,size,printCount){
	if(size == "80"){
		printSaleOrder(message,printCount);
	}else{
		printSaleOrderSmall(message,printCount);
	}
}

function printSaleOrder(message,printCount){
  console.log(message)
	let print_count = Number(printCount);
	let saleInfoAll = message;
  const { odOrder, orOrderPay } =saleInfoAll;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	var printName = saleInfoAll.printName;
	// var shopName = message.odOrder
	var orderNo = odOrder.orderNo;
	var saleTime = odOrder.saleTime;
	var totalPay = odOrder.payAmount;
	var totalqty = odOrder.qty;
	var payType=orOrderPay.length>1?"「 "+ orOrderPay[0].typeStr+ orOrderPay[0].amount +';'+ orOrderPay[1].typeStr+ orOrderPay[1].amount +" 」":  "「 "+ orOrderPay[0].typeStr+" 」"
	var cutAmount = odOrder.cutAmount?odOrder.cutAmount:0;//添加抹零优惠
	var discountAmount = odOrder.discountAmount?odOrder.discountAmount:0;//添加折扣优惠

  let posiTopNum = 0;
  var titleFz = 10;
  var contentFz = 8;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"18mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+50;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+25;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px
	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+20+(lineCount-1)*12;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,odOrder.amount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	// //抹零优惠
	// if(cutAmount != 0){
	// 	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"抹零优惠");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  //
	// 	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,cutAmount);
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  //   LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  //   posiTopNum = posiTopNum+18;
	// }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,odOrder.payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
  //添加支付方式
	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	//本次积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,saleInfoAll.mbCard.point);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+18
	}
	//折扣优惠
	if(discountAmount&&discountAmount<0){
    discountAmount = discountAmount.split('-');
    discountAmount = discountAmount[1]
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"折扣优惠");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,discountAmount);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+18
	}
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+30;

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"15mm",160,160,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+170;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+20;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+16;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+20;
  }

  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}

function printSaleOrderSmall(message,printCount){
	let print_count = Number(printCount);
	let saleInfoAll = message;
  const { orOrderPay, odOrder } =saleInfoAll;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	var payType=orOrderPay.length>1?"「 "+ orOrderPay[0].typeStr+orOrderPay[0].amount +';'+ orOrderPay[1].typeStr+ orOrderPay[1].amount +" 」":  "「 "+ orOrderPay[0].typeStr+" 」"
	var printName = saleInfoAll.printName;

	var orderNo = odOrder.orderNo;
	var saleTime = odOrder.saleTime;
	var totalPay = odOrder.payAmount;
	var totalqty = odOrder.qty;
  var cutAmount = odOrder.cutAmount?odOrder.cutAmount:0;//添加抹零优惠
  var discountAmount = odOrder.discountAmount?odOrder.discountAmount:0;//添加抹零优惠

  let posiTopNum = 0;
  var titleFz = 8;
  var contentFz = 7;
  //70mm 1mm=3.78px
	var lineWidth = 50*3.78;
	//8pt=11px

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(posiTopNum,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+40;

  // let titleLen = printName.length*10;
  // let titleNum = Math.ceil(titleLen/lineWidth);
  // titlHeight = (titleNum-1)*10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px
	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*9;
		lineCount = Math.ceil(infoLen/lineWidth);
		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    posiTopNum = posiTopNum+15+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","14mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+15+(lineCount-1)*12;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,odOrder.amount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
	// //抹零优惠
	// if(cutAmount !=0){
	// 	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"抹零优惠");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  //
	// 	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","14mm",20,cutAmount);
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  //   LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	// 	posiTopNum = posiTopNum+15;
	// }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"实付金额");
  LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

  LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,odOrder.payAmount);
  LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum =posiTopNum+12;

  // let payLen = payType.length*10;
  // let payNum = Math.ceil(payLen/lineWidth);
  // payHeight = (payNum-1)*10;
  //添加支付方式
  LODOP.ADD_PRINT_TEXT(posiTopNum,"0","50mm",20,payType);
  LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	//会员积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,saleInfoAll.mbCard.point);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+15;
	}
  //折扣优惠
  if(discountAmount&&discountAmount<0){
    discountAmount = discountAmount.split('-');
    discountAmount = discountAmount[1]
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"折扣优惠");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","28mm",20,discountAmount);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+18
  }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+30

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"10mm",120,120,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+124;

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+15;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+11;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+15;
  }
  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}
//打印C端销售订单
export function getCDSaleOrderInfo(message,size,printCount){
	if(size == "80"){
		printCDSaleOrder(message,printCount);
	}else{
		printCDSaleOrderSmall(message,printCount);
	}
}
function printCDSaleOrder(message,printCount){
	let print_count = Number(printCount);
	let saleInfoAll = message;
  const { odOrder, orOrderPay } =saleInfoAll;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	var printName = saleInfoAll.printName;
	// var shopName = message.odOrder
	var orderNo = odOrder.orderNo;
	var saleTime = odOrder.createTime;
	var totalPay = odOrder.payAmount;
	var totalqty = odOrder.qty;
	var payType="「 App支付"+" 」";
  // var actuallyPay=saleInfoAll.orOrderPay[0].amount;//实付
  var actuallyPay= odOrder.payAmount;//实付
  var discountAmount = odOrder.memberDiscount?Number(odOrder.memberDiscount):0;//添加折扣优惠
  var deliveryType = odOrder.deliveryType;//配送方式1自提，2同城配送，3：快递
  var coupon = 0;//优惠券
  if(orOrderPay.length>1) {
    coupon = orOrderPay[1].amount;
  } else {
    coupon = 0;
  }

  let posiTopNum = 0;
  var titleFz = 10;
  var BigTitle = 12;
  var contentFz = 8;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

  LODOP.ADD_PRINT_IMAGE(posiTopNum,"18mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+50;

  //订单序号 1：门店自提不显示，2：同城配送，3：快递
  if(deliveryType&&deliveryType==2) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0","70mm",20,'序号：'+odOrder.orderNum);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",BigTitle);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+26;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+25;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+20;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px
	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+20+(lineCount-1)*12;
	};

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","15mm",20,odOrder.qty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,odOrder.amount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
  //配送费
  if(deliveryType&&deliveryType!=1) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"配送费用");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,odOrder.deliveryCost);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+18;
  }
  //优惠券
  if(coupon != 0) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"优惠券");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,'-'+coupon);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+18;
  }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+12;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","19mm",20,actuallyPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
  //添加支付方式
	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+18;
	//本次积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","49mm",20,saleInfoAll.mbCard.point);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+18;
	}
  //折扣优惠
  if(discountAmount>0){
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"折扣优惠");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,discountAmount);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+18
  }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
  posiTopNum = posiTopNum+15;
  //配送信息，同城配送才显示
  if(deliveryType&&deliveryType==2) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"收件人");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,odOrder.receiver);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+20;
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"电话");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,odOrder.phoneNo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+20;

    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"地址");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,odOrder.address);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+20;

    LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
    posiTopNum = posiTopNum+20
  }


	LODOP.ADD_PRINT_BARCODE(posiTopNum,"15mm",160,160,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+170;

  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+20;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+16;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+20;
  }

  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}

function printCDSaleOrderSmall(message,printCount){
	let print_count = Number(printCount);
	let saleInfoAll = message;
  const { odOrder, orOrderPay } =saleInfoAll;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	// var payType=saleInfoAll.orOrderPay.length>1?"「 "+ saleInfoAll.orOrderPay[0].typeStr+saleInfoAll.orOrderPay[0].amount +'/'+ saleInfoAll.orOrderPay[1].typeStr+saleInfoAll.orOrderPay[1].amount +" 」":  "「 "+saleInfoAll.orOrderPay[0].typeStr+saleInfoAll.orOrderPay[0].amount+" 」"
	var printName = saleInfoAll.printName;
  var payType="「 App支付"+" 」"

	var orderNo = odOrder.orderNo;
	var saleTime = odOrder.createTime;
	var totalPay = odOrder.payAmount;
	var totalqty = odOrder.qty;
  // var actuallyPay=saleInfoAll.orOrderPay[0].amount;//实付
  var actuallyPay= odOrder.payAmount;//实付
  var discountAmount = odOrder.memberDiscount?Number(odOrder.memberDiscount):0;//添加折扣优惠
  var deliveryType = odOrder.deliveryType;//配送方式：1自提，2同城配送，3：快递
  var coupon = 0;//优惠券
  if(orOrderPay.length>1) {
    coupon = orOrderPay[1].amount;
  } else {
    coupon = 0;
  }
  let posiTopNum = 0;
  var titleFz = 8;
  var BigTitle = 10;
  var contentFz = 7;
  //70mm 1mm=3.78px
	var lineWidth = 50*3.78;
	//8pt=11px

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

  LODOP.ADD_PRINT_IMAGE(posiTopNum,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
  posiTopNum = posiTopNum+40;

  // let titleLen = printName.length*10;
  // let titleNum = Math.ceil(titleLen/lineWidth);
  // titlHeight = (titleNum-1)*10;
  //订单序号 1：门店自提不显示，2：同城配送，3：快递
  if(deliveryType&&deliveryType==2) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0","50mm",20,'序号：'+odOrder.orderNum);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",BigTitle);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+26;
  }

	LODOP.ADD_PRINT_TEXT(posiTopNum,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+18;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  posiTopNum = posiTopNum+15;

	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;

	var infoLen;
	var lineCount;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*9;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+15+(lineCount-1)*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"26mm","9mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+15+(lineCount-1)*12;
	};
	LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

	LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品合计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"26mm","9mm",20,odOrder.qty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,odOrder.amount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
  //配送费
  if(deliveryType&&deliveryType!=1) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"配送费用");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","28mm",20,odOrder.deliveryCost);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+15;
  }
  //优惠券
  if(coupon != 0) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"优惠券");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","28mm",20,'-'+coupon);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+15;
  }
  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+10;

  LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

	LODOP.ADD_PRINT_TEXT(posiTopNum,"35mm","13mm",20,actuallyPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+12;
  //
  // let payLen = payType.length*10;
  // let payNum = Math.ceil(payLen/lineWidth);
  // payHeight = (payNum-1)*10;
  //添加支付方式
	LODOP.ADD_PRINT_TEXT(posiTopNum,"0","50mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
  posiTopNum = posiTopNum+15;
	//会员积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","28mm",20,saleInfoAll.mbCard.point);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		posiTopNum = posiTopNum+15;
	}
  //折扣优惠
  if(discountAmount>0){
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"折扣优惠");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","28mm",20,discountAmount);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+15
  }

  LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
  posiTopNum = posiTopNum+15
  //配送方式
  if(deliveryType&&deliveryType==2) {
    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","12mm",20,"收件人:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"12mm","36mm",20,odOrder.receiver);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+15;

    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","12mm",20,"电话:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"12mm","36mm",20,odOrder.phoneNo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+15;

    LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","12mm",20,"地址:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

    LODOP.ADD_PRINT_TEXT(posiTopNum,"12mm","36mm",20,odOrder.address);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+20;

    LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
    posiTopNum = posiTopNum+20
  }

	LODOP.ADD_PRINT_BARCODE(posiTopNum,"10mm",120,120,"QRCode",footerContent.codeUrl);
  posiTopNum = posiTopNum+124;

  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.scanText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  posiTopNum = posiTopNum+15;

  if(isOpenApp == '1') {
    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextOne);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+11;

    LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.tipsTextTwo);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+15;
  }
  LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,footerContent.serverText);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	LODOP.PRINT();
}


export function GetLodop(id,type,orderno,size) {
	 var Url=window.location.host
	const jsessionid = getJsessionId();
	  if(size){
	 	Url='http://'+Url+'/erpQposRest/print.htm;jsessionid='+jsessionid+'?type='+type+'&id='+id+'&size=B'
	 }else{
	 	Url='http://'+Url+'/erpQposRest/print.htm;jsessionid='+jsessionid+'?type='+type+'&id='+id
	 }

	 console.log(Url)
	PrintOneURL(Url,orderno)

}

// ——————————————————————————————————————————————————————————————————————————————————————————————————————————

//打印调拨订单


export function getDbOrderInfo(message,size,printCount){
	if(size == "80"){
		printDbOrder(message,printCount);
	}else{
		printDbOrderSmall(message,printCount);
	}
}

function printDbOrder(message,printCount){
	if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
		let print_count = Number(printCount);
		let dbInfoAll = message;

		//小票数据
		var printName = dbInfoAll.exchangeNos[0].outShopName; //门店名称
		var orderNo = dbInfoAll.exchangeNos[0].exchangeNo; //调拨单号
		var dbTime = dbInfoAll.exchangeNos[0].createTime;  //调拨时间
		var needsp=dbInfoAll.exchangeNos[0].inShopName;  //需求门店
		var needspFooter=dbInfoAll.exchangeNos[0].outShopName;  //需求门店
		var moneyInfo = dbInfoAll.pdInfo;  //商品信息
		var totalPay = dbInfoAll.exchangeNos[0].amountSum;  //合计金额
		var totalqty = dbInfoAll.exchangeNos[0].qtySum;  //合计数量

    let posiTopNum = 10;
    var titleFz = 12;
    var contentFz = 10.5;
    var contentTwoFz = 9;

		LODOP=getLodop();
		LODOP.PRINT_INIT('打印'+new Date());
		LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",27,printName);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+28;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",35,'***请将小票随调拨商品一起寄往需求门店***');
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
    posiTopNum = posiTopNum+12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"调拨单号");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,orderNo);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_BARCODE(posiTopNum,"10mm",215,54,"128Auto",orderNo);
		LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    posiTopNum = posiTopNum+70;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"调拨时间");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,dbTime);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","20mm",20,"需求门店");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"20mm","50mm",20,needsp);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
    posiTopNum = posiTopNum+12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"商品");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"36mm","14mm",20,"数量");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,"金额");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+25;
		//70mm 1mm=3.78px
		var lineWidth = 70*3.78;
		//8pt=11px
		var infoLen;
		var lineCount;
		for(var i=0;i<moneyInfo.length;i++){
			infoLen = moneyInfo[i].name.length*14;
			lineCount = Math.ceil(infoLen/lineWidth);
      let contentHeight = (lineCount-1)*14;

			if(moneyInfo[i].displayName){
				LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",contentHeight,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
			}else{
				LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","70mm",contentHeight,moneyInfo[i].name);
			}
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
      posiTopNum = posiTopNum+30+contentHeight;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"36mm","14mm",20,moneyInfo[i].qty);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,moneyInfo[i].price);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
      posiTopNum = posiTopNum+25+contentHeight;
		};

		LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
    posiTopNum = posiTopNum+12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","35mm",20,"合计金额");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"36mm","14mm",20,totalqty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

		LODOP.ADD_PRINT_TEXT(posiTopNum,"50mm","20mm",20,totalPay);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"70mm",3,0);
    posiTopNum = posiTopNum+18;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,'需求门店须知:');
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+20;

    let dbInfoOne = `1.请扫码小票条形码进行收货`;
    let dbInfoTWo = `2.收货完成后，调拨金额${totalPay}元将自动从您的Q掌柜账户转至${needspFooter}Q掌柜账户中`;
    let dbInfoThr = `3.为保障调拨双方权益，请勿通过微信、支付宝、现金等方式支付调拨金额`;

    let tipsLen = dbInfoTWo.length*12;
    let lineNum = Math.ceil(tipsLen/lineWidth);
    let textHeight = lineNum*12;
    let tipsLenThr = dbInfoThr.length*12;
    let lineNumThr = Math.ceil(tipsLenThr/lineWidth);
    let textHeightThr = lineNumThr*12;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,dbInfoOne);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+20;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",textHeight,dbInfoTWo);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+20+textHeight;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",textHeightThr,dbInfoThr);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentTwoFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
    posiTopNum = posiTopNum+60;

    LODOP.ADD_PRINT_IMAGE(posiTopNum,"15mm",155,45,"<img border='0' src='"+logoImgBig+"'/>");
  	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
    posiTopNum = posiTopNum+60;

		LODOP.ADD_PRINT_TEXT(posiTopNum,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

		LODOP.SET_PRINT_COPIES(print_count);
		LODOP.PRINT();
	}
}

function printDbOrderSmall(message,printCount){
	if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
		if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
			let print_count = Number(printCount);
			let dbInfoAll = message;

			//小票数据
			var printName = dbInfoAll.exchangeNos[0].outShopName; //门店名称
			var orderNo = dbInfoAll.exchangeNos[0].exchangeNo; //调拨单号
			var dbTime = dbInfoAll.exchangeNos[0].createTime;  //调拨时间
			var needsp=dbInfoAll.exchangeNos[0].inShopName;  //需求门店
			var needspFooter=dbInfoAll.exchangeNos[0].outShopName;  //需求门店
			var moneyInfo = dbInfoAll.pdInfo;  //商品信息
			var totalPay = dbInfoAll.exchangeNos[0].amountSum;  //合计金额
			var totalqty = dbInfoAll.exchangeNos[0].qtySum;  //合计数量

      let posiTopNum = 10;
      var titleFz = 9;
      var contentFz = 7;

			LODOP=getLodop();
			LODOP.PRINT_INIT('打印'+new Date());
			LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,printName);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
      posiTopNum = posiTopNum+20;

      LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",35,'***请将小票随调拨商品一起寄往需求门店***');
  		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
  		LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
  		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
      posiTopNum = posiTopNum+17;

			LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
      posiTopNum = posiTopNum+10;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"调拨单号");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,orderNo);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_BARCODE(posiTopNum,"7mm",164,41,"128Auto",orderNo);
			LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
      posiTopNum = posiTopNum+50;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"调拨时间");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,dbTime);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","15mm",20,"需求门店");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"15mm","33mm",20,needsp);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
      posiTopNum = posiTopNum+10;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"商品");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","9mm",20,"数量");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"34mm","14mm",20,"金额");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
      posiTopNum = posiTopNum+25;
			//70mm 1mm=3.78px
			var lineWidth = 50*3.78;
			//8pt=11px
			var infoLen;
			var lineCount;
			for(var i=0;i<moneyInfo.length;i++){
				infoLen = moneyInfo[i].name.length*10;
				lineCount = Math.ceil(infoLen/lineWidth);
        let contentHeight = lineCount*10;
				if(moneyInfo[i].displayName){
					LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",contentHeight,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
				}else{
					LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","48mm",contentHeight,moneyInfo[i].name);
				}

				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
        posiTopNum = posiTopNum+10+contentHeight;

				LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","9mm",20,moneyInfo[i].qty);
				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

				LODOP.ADD_PRINT_TEXT(posiTopNum,"34mm","14mm",20,moneyInfo[i].price);
				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
				LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

				posiTopNum = posiTopNum+10+contentHeight;
			};

			LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
      posiTopNum = posiTopNum+10;

			LODOP.ADD_PRINT_TEXT(posiTopNum,"0mm","25mm",20,"合计金额");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);

			LODOP.ADD_PRINT_TEXT(posiTopNum,"25mm","9mm",20,totalqty);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);


			LODOP.ADD_PRINT_TEXT(posiTopNum,"34mm","14mm",20,totalPay);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_LINE(posiTopNum,0,posiTopNum,"48mm",3,0);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,'需求门店须知:');
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
      posiTopNum = posiTopNum+20;

      let dbInfoOne = `1.请扫码小票条形码进行收货`;
      let dbInfoTWo = `2.收货完成后，调拨金额${totalPay}元将自动从您的Q掌柜账户转至${needspFooter}Q掌柜账户中,`;
      let dbInfoThr = `3.为保障调拨双方权益，请勿通过微信、支付宝、现金等方式支付调拨金额`;
      let tipsLen = dbInfoTWo.length*10;
      let tipsLenThr = dbInfoThr.length*10;
      let lineNum = Math.ceil(tipsLen/lineWidth);
      let lineNumThr = Math.ceil(tipsLenThr/lineWidth);
      let textHeight = lineNum*10;
      let textHeightThr = lineNumThr*10;

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,dbInfoOne);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
      posiTopNum = posiTopNum+15;

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",textHeight,dbInfoTWo);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
      posiTopNum = posiTopNum+10+textHeight;

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",textHeightThr,dbInfoThr);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",contentFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
      posiTopNum = posiTopNum+40;

      LODOP.ADD_PRINT_IMAGE(posiTopNum,"12mm",101,29,"<img border='0' src='"+logoImgLittle+"'/>");
    	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式
      posiTopNum = posiTopNum+35;

			LODOP.ADD_PRINT_TEXT(posiTopNum,0,"48mm",20,"Qtools | 有温度的进口母婴品牌");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",titleFz);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

			LODOP.SET_PRINT_COPIES(print_count);
			LODOP.PRINT();
		}












	}
}
