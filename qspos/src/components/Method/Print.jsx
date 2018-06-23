import React from 'react';
import { message} from 'antd';
import {getJsessionId} from '../../utils/post'

var LODOP;
var CreatedOKLodop7766=null;
let hostAddress  = window.location.host;
var imgSrc ="http://"+hostAddress+'/static/print_logo.png';

// var imgSrc = require('../../static/print_logo.png');

//====判断是否需要安装CLodop云打印服务器:====
function needCLodop(){
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
	if ((verTrident==null)&&(verIE==null)&&(x64!==null))
		return true; else
	if ( verFF !== null) {
		verFF = verFF[0].match(/\d+/);
		if ((verFF[0]>= 42)||(x64!==null)) return true;
	} else if ( verOPR !== null) {
		verOPR = verOPR[0].match(/\d+/);
		if ( verOPR[0] >= 32 ) return true;
	} else
	if ((verTrident==null)&&(verIE==null)) {
		var verChrome=ua.match(/Chrome\D?\d+/i);
		if ( verChrome !== null ) {
			verChrome = verChrome[0].match(/\d+/);
			if (verChrome[0]>=42) return true;
		}
	}
        return false;
    } catch(err) {return true;}
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
 	console.log(123)
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
        	console.log('ww')
            try{ LODOP=getCLodop();} catch(err) {}
	    if (!LODOP && document.readyState!=='complete') {alert('C-Lodop没准备好，请稍后再试！'); return;};
            if (!LODOP) {
		 if (isIE) document.write(strCLodopInstall); else
		 // document.documentElement.innerHTML=strCLodopInstall+document.documentElement.innerHTML;
		 alert('打印控件未安装，请先下载打印机控件')
		 console.log('ww1')
                 return;
            } else {

	         if (CLODOP.CVERSION<'2.1.3.0') {
	         	console.log('ww2')
			if (isIE) document.write(strCLodopUpdate); else
			 document.documentElement.innerHTML=strCLodopUpdate+document.documentElement.innerHTML;
			 alert('CLodop云打印服务需升级!')
		 }
		 if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
		 if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
	    }
        } else {
        	console.log('www')
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
            	console.log('w')


                 if (navigator.userAgent.indexOf('Chrome')>=0)
                     document.documentElement.innerHTML=strHtmChrome+document.documentElement.innerHTML;
                 if (navigator.userAgent.indexOf('Firefox')>=0)
                     document.documentElement.innerHTML=strHtmFireFox+document.documentElement.innerHTML;
                 if (is64IE) document.write(strHtm64_Install); else
                 if (isIE)   document.write(strHtmInstall);    else
                     document.documentElement.innerHTML=strHtmInstall+document.documentElement.innerHTML;
                 return LODOP;
            }
        }
        if (LODOP.VERSION<'6.2.1.8') {
            if (!needCLodop()){
            	if (is64IE) document.write(strHtm64_Update); else
            	if (isIE) document.write(strHtmUpdate); else
            	document.documentElement.innerHTML=strHtmUpdate+document.documentElement.innerHTML;
	    }
            return LODOP;
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
        LODOP.SET_LICENSES("北京中电亿商网络技术有限责任公司", "653726081798577778794959892839", "", "");
        //===========================================================
        return LODOP;
    } catch(err) {alert('getLodop出错:'+err);
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
		//LODOP.SET_PRINT_PAGESIZE(3,'100%','70%');
		// ADD_PRINT_HTM("0","0","RightMargin:0","BottomMargin:30");
		//LODOP.SET_PRINT_PAGESIZE(intOrient,'1cm','90%','90%',url);
		// LODOP.SET_PRINT_STYLEA(0,'HOrient',0);
		// LODOP.SET_PRINT_STYLEA(0,'VOrient',0);
//		LODOP.SET_SHOW_MODE("MESSAGE_GETING_URL",""); //该语句隐藏进度条或修改提示信息
//		LODOP.SET_SHOW_MODE("MESSAGE_PARSING_URL","");//该语句隐藏进度条或修改提示信息
		//var	pageData = orderno+"　<span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span>"
		//LODOP.ADD_PRINT_HTM('0.5cm',450,300,100,pageData);
		//LODOP.SET_PRINT_PAGESIZE(3,550,)
		// LODOP.ADD_PRINT_IMAGE(28,49,171,153,url);
		//LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
		// LODOP.SET_PRINT_STYLEA(0,"Horient",1);	
		LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT','Auto-Width')
		// LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
		// LODOP.ADD_PRINT_HTM("0%","0%","0%","60")
		 // LODOP.PREVIEW();
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
	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,720,400,"");

	LODOP.ADD_PRINT_TEXT(0,"0mm","70mm",40,"交班结算表");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0.5);

	LODOP.ADD_PRINT_LINE(40,0,41,"70mm",2,0);

	var textWidth;
	var posi = 55;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posi,"0mm","17mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posi,"17mm","53mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		if(title[key]!="交班时间"){
			textWidth = text[key].length*11;
			posi = posi+20+(Math.ceil(textWidth/infoWidth)-1)*12;
		}else{
			posi = posi+20;
		}
	}; 

	LODOP.ADD_PRINT_LINE(posi-1,0,posi,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","17mm",20,"支付方式");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"17mm","13mm",20,"销售");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"30mm","13mm",20,"充值");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"43mm","13mm",20,"退款");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"56mm","14mm",20,"共计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(posi+27,0,posi+28,"70mm",2,0);

	let moneyInfo = [{use:"微信"},{use:"支付宝"},{use:"现金"},{use:"银联"},{use:"积分抵扣"},{use:"会员卡消费"},{use:"会员卡退款"}];

		moneyInfo[0]["sale"] = userInfoAll.userShift[0].wechatAmount?userInfoAll.userShift[0].wechatAmount:"/";

		moneyInfo[1]["sale"] = userInfoAll.userShift[0].alipayAmount?userInfoAll.userShift[0].alipayAmount:"/";
	
		moneyInfo[2]["sale"] = userInfoAll.userShift[0].cashAmount?userInfoAll.userShift[0].cashAmount:"/";

		moneyInfo[3]["sale"] = userInfoAll.userShift[0].unionpayAmount?userInfoAll.userShift[0].unionpayAmount:"/";
	
		moneyInfo[4]["sale"] = userInfoAll.userShift[0].pointAmount?userInfoAll.userShift[0].pointAmount:"/";
	
		moneyInfo[5]["sale"] = userInfoAll.userShift[0].cardConsumeAmount?userInfoAll.userShift[0].cardConsumeAmount:"/";
	
		moneyInfo[6]["sale"] = "/";

		moneyInfo[0]["tui"] = userInfoAll.userShift[1].wechatAmount?userInfoAll.userShift[1].wechatAmount:"/";

		moneyInfo[1]["tui"] = userInfoAll.userShift[1].alipayAmount?userInfoAll.userShift[1].alipayAmount:"/";

		moneyInfo[2]["tui"] = userInfoAll.userShift[1].cashAmount?userInfoAll.userShift[1].cashAmount:"/";

		moneyInfo[3]["tui"] = userInfoAll.userShift[1].unionpayAmount?userInfoAll.userShift[1].unionpayAmount:"/";

		moneyInfo[4]["tui"] = userInfoAll.userShift[1].pointAmount?userInfoAll.userShift[1].pointAmount:"/";

		moneyInfo[5]["tui"] = "/";

		moneyInfo[6]["tui"] = userInfoAll.userShift[1].cardConsumeAmount?userInfoAll.userShift[1].cardConsumeAmount:"/";

		moneyInfo[0]["chong"] = userInfoAll.userShift[2].wechatAmount?userInfoAll.userShift[2].wechatAmount:"/";

		moneyInfo[1]["chong"] = userInfoAll.userShift[2].alipayAmount?userInfoAll.userShift[2].alipayAmount:"/";

		moneyInfo[2]["chong"] = userInfoAll.userShift[2].cashAmount?userInfoAll.userShift[2].cashAmount:"/";

		moneyInfo[3]["chong"] = userInfoAll.userShift[2].unionpayAmount?userInfoAll.userShift[2].unionpayAmount:"/";
	
		moneyInfo[4]["chong"] = userInfoAll.userShift[2].pointAmount?userInfoAll.userShift[2].pointAmount:"/";

		moneyInfo[5]["chong"] = "/";

		moneyInfo[6]["chong"] = "/";

		for(var i=0;i<moneyInfo.length-2;i++){
			moneyInfo[i].count = (parseFloat(moneyInfo[i].sale) +parseFloat(moneyInfo[i].chong)-parseFloat(moneyInfo[i].tui)).toFixed(2);
		}
		moneyInfo[5].count = (parseFloat(moneyInfo[5].sale)).toFixed(2);
		moneyInfo[6].count = (parseFloat(moneyInfo[6].tui)).toFixed(2);

	var posi2 = posi+37;
	for(var i=0;i<moneyInfo.length;i++){
			LODOP.ADD_PRINT_TEXT(posi2,"0mm","17mm",20,moneyInfo[i].use);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

			LODOP.ADD_PRINT_TEXT(posi2,"17mm","13mm",20,moneyInfo[i].sale);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

			LODOP.ADD_PRINT_TEXT(posi2,"30mm","13mm",20,moneyInfo[i].chong);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

			LODOP.ADD_PRINT_TEXT(posi2,"43mm","13mm",20,moneyInfo[i].tui);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

			LODOP.ADD_PRINT_TEXT(posi2,"56mm","14mm",20,moneyInfo[i].count);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			posi2  = posi2 + 20;
	};

	LODOP.ADD_PRINT_LINE(posi2-1,0,posi2,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi2+10,"0mm","17mm",20,"店铺收货单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+10,"17mm","13mm",20,userInfoAll.receiveCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"0mm","17mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"17mm","13mm",20,userInfoAll.adjustCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(posi2+47,0,posi2+48,"70mm",2,0);

	LODOP.ADD_PRINT_IMAGE(posi2+60,"20mm",152,38,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式

	LODOP.ADD_PRINT_TEXT(posi2+105,"0mm","70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.SET_PRINT_COPIES(pri_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
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
	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_TEXT(3,"0mm","50mm",27,"交班结算表");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0.5);

	LODOP.ADD_PRINT_LINE(29,0,30,"52mm",2,0);

	var textWidth;
	var posi = 40;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posi,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posi,"15mm","35mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0.7);
		//8pt=11px
		if(title[key]!="交班时间"){
			textWidth = text[key].length*11;
			posi = posi+20+(Math.ceil(textWidth/infoWidth)-1)*11;
		}else{
			posi = posi+20;
		}
	}; 

	LODOP.ADD_PRINT_LINE(posi-3,0,posi-2,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","12mm",15,"支付方式");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6.5);

	LODOP.ADD_PRINT_TEXT(posi+10,"12mm","9mm",15,"销售");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6.5);

	LODOP.ADD_PRINT_TEXT(posi+10,"21mm","9mm",15,"充值");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6.5);

	LODOP.ADD_PRINT_TEXT(posi+10,"30mm","9mm",15,"退款");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6.5);

	LODOP.ADD_PRINT_TEXT(posi+10,"39mm","11mm",15,"共计");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6.5);

	LODOP.ADD_PRINT_LINE(posi+22,0,posi+23,"52mm",2,0);

	let moneyInfo = [{use:"微信"},{use:"支付宝"},{use:"现金"},{use:"银联"},{use:"积分抵扣"},{use:"会员卡消费"},{use:"会员卡退款"}];

		moneyInfo[0]["sale"] = userInfoAll.userShift[0].wechatAmount?userInfoAll.userShift[0].wechatAmount:"/";

		moneyInfo[1]["sale"] = userInfoAll.userShift[0].alipayAmount?userInfoAll.userShift[0].alipayAmount:"/";
	
		moneyInfo[2]["sale"] = userInfoAll.userShift[0].cashAmount?userInfoAll.userShift[0].cashAmount:"/";

		moneyInfo[3]["sale"] = userInfoAll.userShift[0].unionpayAmount?userInfoAll.userShift[0].unionpayAmount:"/";
	
		moneyInfo[4]["sale"] = userInfoAll.userShift[0].pointAmount?userInfoAll.userShift[0].pointAmount:"/";
	
		moneyInfo[5]["sale"] = userInfoAll.userShift[0].cardConsumeAmount?userInfoAll.userShift[0].cardConsumeAmount:"/";
	
		moneyInfo[6]["sale"] = "/";

		moneyInfo[0]["tui"] = userInfoAll.userShift[1].wechatAmount?userInfoAll.userShift[1].wechatAmount:"/";

		moneyInfo[1]["tui"] = userInfoAll.userShift[1].alipayAmount?userInfoAll.userShift[1].alipayAmount:"/";

		moneyInfo[2]["tui"] = userInfoAll.userShift[1].cashAmount?userInfoAll.userShift[1].cashAmount:"/";

		moneyInfo[3]["tui"] = userInfoAll.userShift[1].unionpayAmount?userInfoAll.userShift[1].unionpayAmount:"/";

		moneyInfo[4]["tui"] = userInfoAll.userShift[1].pointAmount?userInfoAll.userShift[1].pointAmount:"/";

		moneyInfo[5]["tui"] = "/";

		moneyInfo[6]["tui"] = userInfoAll.userShift[1].cardConsumeAmount?userInfoAll.userShift[1].cardConsumeAmount:"/";

		moneyInfo[0]["chong"] = userInfoAll.userShift[2].wechatAmount?userInfoAll.userShift[2].wechatAmount:"/";

		moneyInfo[1]["chong"] = userInfoAll.userShift[2].alipayAmount?userInfoAll.userShift[2].alipayAmount:"/";

		moneyInfo[2]["chong"] = userInfoAll.userShift[2].cashAmount?userInfoAll.userShift[2].cashAmount:"/";

		moneyInfo[3]["chong"] = userInfoAll.userShift[2].unionpayAmount?userInfoAll.userShift[2].unionpayAmount:"/";
	
		moneyInfo[4]["chong"] = userInfoAll.userShift[2].pointAmount?userInfoAll.userShift[2].pointAmount:"/";

		moneyInfo[5]["chong"] = "/";

		moneyInfo[6]["chong"] = "/";

		for(var i=0;i<moneyInfo.length-2;i++){
			moneyInfo[i].count = (parseFloat(moneyInfo[i].sale) +parseFloat(moneyInfo[i].chong)-parseFloat(moneyInfo[i].tui)).toFixed(2);
		}
		moneyInfo[5].count = (parseFloat(moneyInfo[5].sale)).toFixed(2);
		moneyInfo[6].count = (parseFloat(moneyInfo[6].tui)).toFixed(2);
	var posi2 = posi+35;
	for(var i=0;i<moneyInfo.length;i++){
			 LODOP.ADD_PRINT_TEXT(posi2,"0mm","12mm",20,moneyInfo[i].use);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",5.5);

			LODOP.ADD_PRINT_TEXT(posi2,"12mm","9mm",20,moneyInfo[i].sale);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",5);

			LODOP.ADD_PRINT_TEXT(posi2,"21mm","9mm",20,moneyInfo[i].chong);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",5);

			LODOP.ADD_PRINT_TEXT(posi2,"30mm","9mm",20,moneyInfo[i].tui);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",5);

			LODOP.ADD_PRINT_TEXT(posi2,"39mm","11mm",20,moneyInfo[i].count);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",5);
			posi2  = posi2 + 20;
	};

	LODOP.ADD_PRINT_LINE(posi2-3,0,posi2-2,"52mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi2+10,"0mm","17mm",20,"店铺收货单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+10,"17mm","33mm",20,userInfoAll.receiveCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"0mm","17mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"17mm","33mm",20,userInfoAll.adjustCount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(posi2+47,0,posi2+48,"52mm",2,0);

	LODOP.ADD_PRINT_IMAGE(posi2+60,"14mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式

	LODOP.ADD_PRINT_TEXT(posi2+90,"0mm","50mm",80,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	// LODOP.SET_PRINT_COPIES(pri_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
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

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");
	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(69,0,70,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","20mm",20,"充值单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(80,"20mm","50mm",20,rechargeNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"0mm","20mm",20,"充值日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"20mm","50mm",20,rechargeTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(119,0,120,"70mm",2,0);

	var posi = 130;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posi,"0mm","20mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posi,"20mm","50mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		posi = posi+20;
	}; 

	LODOP.ADD_PRINT_LINE(posi+5,0,posi+6,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+15,"0mm","20mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);



	LODOP.ADD_PRINT_TEXT(posi+15,"20mm","50mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	//添加的支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+15,"20mm","50mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);


	LODOP.ADD_PRINT_BARCODE(posi+35,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(posi+120,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+140,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+170,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
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

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"14mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(58,0,59,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(70,"0mm","15mm",20,"充值单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(70,"15mm","50mm",20,rechargeNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(90,"0mm","15mm",20,"充值日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(90,"15mm","50mm",20,rechargeTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_LINE(107,0,108,"50mm",2,0);

	var posi = 120;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posi,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posi,"15mm","50mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		posi = posi+20;
		console.log(posi);
	}; 

	LODOP.ADD_PRINT_LINE(posi-3,0,posi-2,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","15mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.ADD_PRINT_TEXT(posi+10,"15mm","50mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	//添加的支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","15mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
	
	LODOP.ADD_PRINT_BARCODE(posi+30,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(posi+115,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+130,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+150,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
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
	var totalPay = returnInfoAll.odReturn.refundAmount;
	var totalqty = returnInfoAll.odReturn.qty;

	//扣除积分
	var returnPoint = returnInfoAll.odReturn.returnPoint;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(68,0,69,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","20mm",20,"退货单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(80,"20mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"0mm","20mm",20,"退货日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"20mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(119,0,120,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"50mm","20mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"36mm","14mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"50mm","20mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi-2,0,posi-1,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,"退款金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"36mm","14mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"50mm","20mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	let position2 = posi+30;


	//添加支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);


	if(returnInfoAll.mbCard){
		console.log(1)
		LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"扣除积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"20mm","20mm",20,returnPoint);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}
	LODOP.ADD_PRINT_BARCODE(position2,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+85,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+105,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
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
	var totalPay = returnInfoAll.odReturn.refundAmount;
	var totalqty = returnInfoAll.odReturn.qty;

	//扣除积分
	var returnPoint = returnInfoAll.odReturn.returnPoint;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"14mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(57,0,58,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(70,"0mm","15mm",20,"退货单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(70,"15mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(90,"0mm","15mm",20,"退货日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(90,"15mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_LINE(107,0,108,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(120,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(120,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(120,"35mm","15mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 140;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*9;
		lineCount = Math.ceil(infoLen/lineWidth);
		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"26mm","9mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

		posi = posi+40+(lineCount-1)*12;
	};
	
	LODOP.ADD_PRINT_LINE(posi-3,0,posi-2,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,"退款金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posi+10,"26mm","9mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	let position2 = posi+30;

	//添加支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	if(returnInfoAll.mbCard){
			LODOP.ADD_PRINT_TEXT(position2,"0mm","15mm",20,"扣除积分");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	
			LODOP.ADD_PRINT_TEXT(position2,"15mm","35mm",20,returnPoint);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			position2 = position2+20;
	}


	

	LODOP.ADD_PRINT_BARCODE(position2,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+85,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+105,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+135,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
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
	let print_count = Number(printCount);
	let saleInfoAll = message;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	var printName = saleInfoAll.printName;
	// var shopName = message.odOrder
	var orderNo = saleInfoAll.odOrder.orderNo;
	var saleTime = saleInfoAll.odOrder.saleTime;
	var totalPay = saleInfoAll.odOrder.payAmount;
	var totalqty = saleInfoAll.odOrder.qty;

	//添加折扣优惠
	var discountAmount;
	if(saleInfoAll.odOrder.discountAmount && Number(saleInfoAll.odOrder.discountAmount)<0){
		discountAmount = saleInfoAll.odOrder.discountAmount;
	}

	//添加抹零优惠
	var cutAmount;
	if(saleInfoAll.odOrder.cutAmount && Number(saleInfoAll.odOrder.cutAmount)<0){
		cutAmount = saleInfoAll.odOrder.cutAmount;
	}

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");
	
	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(68,0,69,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","20mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(80,"20mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"0mm","20mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(100,"20mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(119,0,120,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"50mm","20mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"36mm","14mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"50mm","20mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

		posi = posi+40+(lineCount-1)*12;
	};
	
	LODOP.ADD_PRINT_LINE(posi-3,0,posi-2,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"36mm","14mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"50mm","20mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	let position2 = posi+30;

	//添加支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	//折扣优惠
	if(discountAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"折扣优惠");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"50mm","20mm",20,discountAmount);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}

	//抹零优惠
	if(cutAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"抹零优惠");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"50mm","20mm",20,cutAmount);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}
	
	//本次积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"20mm","20mm",20,saleInfoAll.odOrder.orderPoint);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}

	LODOP.ADD_PRINT_BARCODE(position2,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+85,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+105,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
	LODOP.PRINT();
}

function printSaleOrderSmall(message,printCount){
	let print_count = Number(printCount);
	let saleInfoAll = message;
	var moneyInfo = saleInfoAll.orderDetails;
	//门店打印名称字段
	var printName = saleInfoAll.printName;

	var orderNo = saleInfoAll.odOrder.orderNo;
	var saleTime = saleInfoAll.odOrder.saleTime;
	var totalPay = saleInfoAll.odOrder.payAmount;
	var totalqty = saleInfoAll.odOrder.qty;

	//添加折扣优惠
	var discountAmount;
	if(saleInfoAll.odOrder.discountAmount && Number(saleInfoAll.odOrder.discountAmount)<0){
		discountAmount = saleInfoAll.odOrder.discountAmount;
	}

	//添加抹零优惠
	var cutAmount;
	if(saleInfoAll.odOrder.cutAmount && Number(saleInfoAll.odOrder.cutAmount)<0){
		cutAmount = saleInfoAll.odOrder.cutAmount;
	}


	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"14mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",20,printName);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(57,0,58,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(70,"0mm","15mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(70,"15mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(90,"0mm","15mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(90,"15mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_LINE(107,0,108,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(120,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(120,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(120,"35mm","15mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 140;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*9;
		lineCount = Math.ceil(infoLen/lineWidth);

		if(moneyInfo[i].displayName){
			LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
		}else{
			LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
		}
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"26mm","9mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].payPrice);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi-3,0,posi-2,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posi+10,"26mm","9mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);

	let position2 = posi+30;

	//添加支付方式
	const payType="「微信扫码：1200.00   会员卡：31.20」"
	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,payType);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);


	//折扣优惠
	if(discountAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","15mm",20,"折扣优惠");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(position2,"35mm","15mm",20,discountAmount);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		position2 = position2+20;
	}

	//抹零优惠
	if(cutAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","15mm",20,"抹零优惠");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(position2,"35mm","15mm",20,cutAmount);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		position2 = position2+20;
	}

	//会员积分
	if(saleInfoAll.mbCard){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","15mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		LODOP.ADD_PRINT_TEXT(position2,"15mm","35mm",20,saleInfoAll.odOrder.orderPoint);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		position2 = position2+20;
	}

	LODOP.ADD_PRINT_BARCODE(position2,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+85,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+105,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+135,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.SET_PRINT_COPIES(print_count);
	// LODOP.PRINT_DESIGN();
	// LODOP.PREVIEW();
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
	console.log('wo dao l  dayin l')
	console.log(message)
	console.log(printCount)
	if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
		let print_count = Number(printCount);
		let dbInfoAll = message;
	
		//小票数据
		var printName = dbInfoAll.exchangeNos[0].outShopName; //门店名称
		var orderNo = dbInfoAll.exchangeNos[0].exchangeNo; //调拨单号
		var dbTime = dbInfoAll.exchangeNos[0].createTime;  //调拨时间
		var needsp=dbInfoAll.exchangeNos[0].inShopName;  //需求门店
		var moneyInfo = dbInfoAll.pdInfo;  //商品信息
		var totalPay = dbInfoAll.exchangeNos[0].amountSum;  //合计金额
		var totalqty = dbInfoAll.exchangeNos[0].qtySum;  //合计数量
		var remarktext1='本单全部收货后将在你的Q掌柜账户扣除合计金额增加在'
		var remarktext2='的Q掌柜账户中'
		var foot1='扫描关注Qtools官方微信公众号'
		var foot2='官方投诉电话：400-7766-999'
		var foot3='Qtools|有温度的进口母婴品牌'
		

		LODOP=getLodop();
		LODOP.PRINT_INIT('打印'+new Date());
		LODOP.SET_PRINT_PAGESIZE(3,800,40,"");
		
		LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
		LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
	
		LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,printName);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	
		LODOP.ADD_PRINT_LINE(68,0,69,"70mm",2,0);
	
	
		//调拨单号
		LODOP.ADD_PRINT_TEXT(80,"0mm","20mm",20,"调拨单号");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);



	
		LODOP.ADD_PRINT_TEXT(80,"20mm","50mm",20,orderNo);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		//条码
		// LODOP.ADD_PRINT_BARCODE(100,"20mm",200,30,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");
		LODOP.ADD_PRINT_BARCODE(100,"25mm",100,30,"128Auto",orderNo);

	
		LODOP.ADD_PRINT_TEXT(150,"0mm","20mm",20,"调拨时间");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	

		LODOP.ADD_PRINT_TEXT(150,"20mm","50mm",20,dbTime);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
	
		LODOP.ADD_PRINT_TEXT(170,"0mm","20mm",20,"需求门店");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		
		LODOP.ADD_PRINT_TEXT(170,"20mm","50mm",20,needsp);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
		LODOP.ADD_PRINT_LINE(189,0,189,"70mm",2,0);
	
	
		LODOP.ADD_PRINT_TEXT(200,"0mm","35mm",20,"商品");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
		LODOP.ADD_PRINT_TEXT(200,"35mm","15mm",20,"数量");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
		LODOP.ADD_PRINT_TEXT(200,"50mm","20mm",20,"金额");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	
	
		//70mm 1mm=3.78px
		var lineWidth = 70*3.78;
		//8pt=11px
	
		var infoLen;
		var lineCount;
		var posi = 210;
		for(var i=0;i<moneyInfo.length;i++){
			infoLen = moneyInfo[i].name.length*11;
			lineCount = Math.ceil(infoLen/lineWidth);
	
			if(moneyInfo[i].displayName){
				LODOP.ADD_PRINT_TEXT(posi+10,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
			}else{
				LODOP.ADD_PRINT_TEXT(posi+10,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
			}
			
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
			LODOP.ADD_PRINT_TEXT(posi+30+(lineCount-1)*12,"36mm","14mm",20,moneyInfo[i].qty);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
			LODOP.ADD_PRINT_TEXT(posi+30+(lineCount-1)*12,"50mm","20mm",20,moneyInfo[i].price);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	
			posi = posi+40+(lineCount-1)*12;
		};
		
		LODOP.ADD_PRINT_LINE(posi+10,0,posi+10,"70mm",2,0);
	
		LODOP.ADD_PRINT_TEXT(posi+20,"0mm","35mm",20,"合计金额");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
		LODOP.ADD_PRINT_TEXT(posi+20,"36mm","14mm",20,totalqty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	
		LODOP.ADD_PRINT_TEXT(posi+20,"50mm","20mm",20,totalPay);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	
		
		LODOP.ADD_PRINT_LINE(posi+40,0,posi+40,"70mm",2,0);
		
		var position2 = posi+30;
	
	
		LODOP.ADD_PRINT_TEXT(position2+20,0,"70mm",20,"本单全部收货后将在你的Q掌柜账户扣除合计金额增加在"+needsp+'的Q掌柜账户中');
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	

		LODOP.ADD_PRINT_BARCODE(position2+60,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");
	
		LODOP.ADD_PRINT_TEXT(position2+145,0,"70mm",20,"扫描关注Qtools官方微信公众号");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	
		LODOP.ADD_PRINT_TEXT(position2+165,0,"70mm",20,"官方投诉电话：400-7766-999");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	
		LODOP.ADD_PRINT_TEXT(position2+200,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	
		LODOP.SET_PRINT_COPIES(print_count);
		// LODOP.PRINT_DESIGN();
		// LODOP.PREVIEW();
		LODOP.PRINT();
	}
}

function printDbOrderSmall(message,printCount){
	if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
		console.log('wo dao l  dayin l')
		console.log(message)
		console.log(printCount)
		if(navigator.platform == "Windows" || navigator.platform == "Win32" || navigator.platform == "Win64"){
			let print_count = Number(printCount);
			let dbInfoAll = message;
		
			//小票数据
			var printName = dbInfoAll.exchangeNos[0].outShopName; //门店名称
			var orderNo = dbInfoAll.exchangeNos[0].exchangeNo; //调拨单号
			var dbTime = dbInfoAll.exchangeNos[0].createTime;  //调拨时间
			var needsp=dbInfoAll.exchangeNos[0].inShopName;  //需求门店
			var moneyInfo = dbInfoAll.pdInfo;  //商品信息
			var totalPay = dbInfoAll.exchangeNos[0].amountSum;  //合计金额
			var totalqty = dbInfoAll.exchangeNos[0].qtySum;  //合计数量
			var remarktext1='本单全部收货后将在你的Q掌柜账户扣除合计金额增加在'
			var remarktext2='的Q掌柜账户中'
			var foot1='扫描关注Qtools官方微信公众号'
			var foot2='官方投诉电话：400-7766-999'
			var foot3='Qtools|有温度的进口母婴品牌'
			
	
			LODOP=getLodop();
			LODOP.PRINT_INIT('打印'+new Date());
			LODOP.SET_PRINT_PAGESIZE(3,580,40,"");	
			LODOP.ADD_PRINT_IMAGE(0,"14mm",97,26,"<img border='0' src='"+imgSrc+"'/>");
			LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
			LODOP.ADD_PRINT_TEXT(40,0,"50mm",20,printName);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
			LODOP.ADD_PRINT_LINE(57,0,58,"50mm",2,0);
		
		
			//调拨单号
			LODOP.ADD_PRINT_TEXT(70,"0mm","15mm",20,"调拨单号");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	
	
	
		
			LODOP.ADD_PRINT_TEXT(70,"15mm","50mm",20,orderNo);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	
			//条码
			// LODOP.ADD_PRINT_BARCODE(100,"20mm",200,30,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");
			LODOP.ADD_PRINT_BARCODE(80,"15mm",100,30,"128Auto",orderNo);
	
		
			LODOP.ADD_PRINT_TEXT(120,"0mm","15mm",20,"调拨时间");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
	
			LODOP.ADD_PRINT_TEXT(120,"15mm","50mm",20,dbTime);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
		
			LODOP.ADD_PRINT_TEXT(140,"0mm","15mm",20,"需求门店");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			
			LODOP.ADD_PRINT_TEXT(140,"15mm","50mm",20,needsp);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
			LODOP.ADD_PRINT_LINE(159,0,159,"50mm",2,0);
		
		
			LODOP.ADD_PRINT_TEXT(180,"0mm","25mm",20,"商品");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
			LODOP.ADD_PRINT_TEXT(180,"25mm","10mm",20,"数量");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
			LODOP.ADD_PRINT_TEXT(180,"35mm","15mm",20,"金额");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		
		
			//70mm 1mm=3.78px
			var lineWidth = 70*3.78;
			//8pt=11px
		
			var infoLen;
			var lineCount;
			var posi = 190;
			for(var i=0;i<moneyInfo.length;i++){
				infoLen = moneyInfo[i].name.length*11;
				lineCount = Math.ceil(infoLen/lineWidth);
		
				if(moneyInfo[i].displayName){
					LODOP.ADD_PRINT_TEXT(posi+10,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name+'「'+moneyInfo[i].displayName+'」');
				}else{
					LODOP.ADD_PRINT_TEXT(posi+10,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
				}
				
				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
				LODOP.ADD_PRINT_TEXT(posi+30+(lineCount-1)*12,"26mm","9mm",20,moneyInfo[i].qty);
				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
		
				LODOP.ADD_PRINT_TEXT(posi+30+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].price);
				LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
				LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
				LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		
				posi = posi+40+(lineCount-1)*12;
			};
			
			LODOP.ADD_PRINT_LINE(posi+10,0,posi+10,"50mm",2,0);
		
			LODOP.ADD_PRINT_TEXT(posi+20,"0mm","25mm",20,"合计金额");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		
			LODOP.ADD_PRINT_TEXT(posi+20,"26mm","9mm",20,totalqty);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);

		
			LODOP.ADD_PRINT_TEXT(posi+20,"35mm","15mm",20,totalPay);
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
		
			
			LODOP.ADD_PRINT_LINE(posi+30,0,posi+30,"50mm",2,0);
			
			var position2 = posi+30;
		
		
			LODOP.ADD_PRINT_TEXT(position2+20,0,"50mm",20,"本单全部收货后将在你的Q掌柜账户扣除合计金额增加在"+needsp+'的Q掌柜账户中');
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		
	
			LODOP.ADD_PRINT_BARCODE(position2+60,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");
		
			LODOP.ADD_PRINT_TEXT(position2+145,0,"50mm",20,"扫描关注Qtools官方微信公众号");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
		
			LODOP.ADD_PRINT_TEXT(position2+165,0,"50mm",20,"官方投诉电话：400-7766-999");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
		
			LODOP.ADD_PRINT_TEXT(position2+200,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
			LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
			LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
			LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
		
			LODOP.SET_PRINT_COPIES(print_count);
			// LODOP.PRINT_DESIGN();
			// LODOP.PREVIEW();
			LODOP.PRINT();
		}












	}
}