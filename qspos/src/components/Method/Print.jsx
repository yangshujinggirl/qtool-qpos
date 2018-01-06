import { message} from 'antd';

import {getJsessionId} from '../../utils/post'

var LODOP;
var CreatedOKLodop7766=null;
var imgSrc = require('../../images/print_logo.png');

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
	var title = {
		"shopName":"店铺名称",
		"time":"打印时间",
		"name":"收营员",
		"orderNum":"订单数",
		"money":"净收款",
		"sale":"销售额"
	};
	var text = {
		"shopName":"哈哈哈店铺哈哈",
		"time":"2017/08/09",
		"name":"李易峰",
		"orderNum":"1000单",
		"money":"￥90875.00",
		"sale":"￥1067899.00"
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
		textWidth = text[key].length*12;
		posi = posi+20+(Math.ceil(textWidth/infoWidth)-1)*12;
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

	var moneyInfo = [{
		"use":"微信",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"支付宝",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"现金",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"银联",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"积分抵扣",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"6543",
		"count":"6543"
	},
	{
		"use":"会员卡消费",
		"sale":"/",
		"chong":"/",
		"tui":"/",
		"count":"/"
	},
	{
		"use":"会员卡退款",
		"sale":"/",
		"chong":"/",
		"tui":"/",
		"count":"/"
	}
	];
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

	LODOP.ADD_PRINT_TEXT(posi2+10,"17mm","13mm",20,"1");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"0mm","17mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"17mm","13mm",20,"1");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(posi2+47,0,posi2+48,"70mm",2,0);

	LODOP.ADD_PRINT_IMAGE(posi2+60,"20mm",152,38,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式

	LODOP.ADD_PRINT_TEXT(posi2+105,"0mm","70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.SET_PRINT_COPIES(pri_count);
	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

function printShiftInfoSmall(userSales,urUser,printCount){
	let pri_count = Number(printCount);
	var title = {
		"shopName":"店铺名称",
		"time":"打印时间",
		"name":"收营员",
		"orderNum":"订单数",
		"money":"净收款",
		"sale":"销售额"
	};
	var text = {
		"shopName":"哈哈哈店铺哈哈哈哈哈店哈",
		"time":"2017/08/09",
		"name":"李易峰",
		"orderNum":"1000单",
		"money":"￥90875.00",
		"sale":"￥1067899.00"
	};
	var infoWidth = 35*3.78;
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
		textWidth = text[key].length*11;

		posi = posi+20+(Math.ceil(textWidth/infoWidth)-1)*11;
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

	var moneyInfo = [{
		"use":"微信",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"支付宝",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"现金",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"银联",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"65423.00",
		"count":"65423.00"
	},
	{
		"use":"积分抵扣",
		"sale":"65423.00",
		"chong":"65423.00",
		"tui":"6543",
		"count":"6543"
	},
	{
		"use":"会员卡消费",
		"sale":"/",
		"chong":"/",
		"tui":"/",
		"count":"/"
	},
	{
		"use":"会员卡退款",
		"sale":"/",
		"chong":"/",
		"tui":"/",
		"count":"/"
	}
	];
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

	LODOP.ADD_PRINT_TEXT(posi2+10,"17mm","33mm",20,"1");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"0mm","17mm",20,"店铺损益单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi2+30,"17mm","33mm",20,"1");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(posi2+47,0,posi2+48,"52mm",2,0);

	LODOP.ADD_PRINT_IMAGE(posi2+60,"14mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式

	LODOP.ADD_PRINT_TEXT(posi2+90,"0mm","50mm",80,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	// LODOP.SET_PRINT_COPIES(pri_count);
	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

//充值订单打印
export function getRechargeOrderInfo(message,size){
	if(size == "80"){
		printRechargeOrder(message);
	}else{
		printRechargeOrderSmall(message);
	}
}

function printRechargeOrder(message){
	console.log(message);
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
		"vipName":info.cardMoneyChargeInfo.nickname,
		"vipCardNo":info.mbCard.cardNo,
		"vipMobile":info.mbCard.mobile,
		"vipBeforeMoney":info.cardMoneyChargeInfo.beforeAmount,
		"money":info.cardMoneyChargeInfo.amount,
		"vipAfterMoney":info.cardMoneyChargeInfo.afterAmount
	};
	var rechargeNo = info.cardMoneyChargeInfo.chargeNo;
	var rechargeTime = info.cardMoneyChargeInfo.createTime;
	var payAmount = info.cardMoneyChargeInfo.amount;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"70mm",2,0);

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

	LODOP.ADD_PRINT_LINE(120,0,121,"70mm",2,0);

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
		console.log(posi);
	}; 

	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","20mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.ADD_PRINT_TEXT(posi+10,"20mm","50mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
	
	LODOP.ADD_PRINT_BARCODE(posi+30,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(posi+130,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+150,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+170,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

function printRechargeOrderSmall(message){
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
		"vipName":info.cardMoneyChargeInfo.nickname,
		"vipCardNo":info.mbCard.cardNo,
		"vipMobile":info.mbCard.mobile,
		"vipBeforeMoney":info.cardMoneyChargeInfo.beforeAmount,
		"money":info.cardMoneyChargeInfo.amount,
		"vipAfterMoney":info.cardMoneyChargeInfo.afterAmount
	};
	var rechargeNo = info.cardMoneyChargeInfo.chargeNo;
	var rechargeTime = info.cardMoneyChargeInfo.createTime;
	var payAmount = info.cardMoneyChargeInfo.amount;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"15mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","15mm",20,"充值单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(80,"15mm","50mm",20,rechargeNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(100,"0mm","15mm",20,"充值日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(100,"15mm","50mm",20,rechargeTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_LINE(120,0,121,"50mm",2,0);

	var posi = 130;
	for(var key in text){
		LODOP.ADD_PRINT_TEXT(posi,"0mm","15mm",20,title[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		LODOP.ADD_PRINT_TEXT(posi,"15mm","50mm",20,text[key]);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
		LODOP.SET_PRINT_STYLEA(0,"Bold",0);

		posi = posi+20;
		console.log(posi);
	}; 

	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","15mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);

	LODOP.ADD_PRINT_TEXT(posi+10,"15mm","50mm",20,payAmount);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",1);
	LODOP.SET_PRINT_STYLEA(0,"Bold",0);
	
	LODOP.ADD_PRINT_BARCODE(posi+30,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(posi+130,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+150,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(posi+170,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

//退货订单打印
export function getReturnOrderInfo(message,size){
	if(size == "80"){
		printReturnOrder(message);
	}else{
		printReturnOrderSmall(message);
	}
}

function printReturnOrder(message){
	console.log(message);
	let returnInfoAll = message;
	var moneyInfo = returnInfoAll.returnOrderDetails;
	// //缺少门店打印名称字段
	// var shopName = message.odOrder
	var orderNo = returnInfoAll.odReturn.returnNo;
	var saleTime = returnInfoAll.odReturn.createTime;
	var totalPay = returnInfoAll.odReturn.amount;
	var totalqty = returnInfoAll.odReturn.qty;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"70mm",2,0);

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

	LODOP.ADD_PRINT_LINE(120,0,121,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"50mm","20mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"50mm","20mm",20,moneyInfo[i].price);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,"退款金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"50mm","20mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	let position2 = posi+30;
	// if(saleInfoAll.odOrder.cardAmount){
	// 	LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"本次积分");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	// 	LODOP.ADD_PRINT_TEXT(position2,"20mm","20mm",20,"500分");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	// 	position2 = position2+20;
	// }

	LODOP.ADD_PRINT_BARCODE(position2,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+100,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+120,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

function printReturnOrderSmall(message){
	console.log(message);
	let returnInfoAll = message;
	var moneyInfo = returnInfoAll.returnOrderDetails;
	// //缺少门店打印名称字段
	// var shopName = message.odOrder
	var orderNo = returnInfoAll.odReturn.returnNo;
	var saleTime = returnInfoAll.odReturn.createTime;
	var totalPay = returnInfoAll.odReturn.amount;
	var totalqty = returnInfoAll.odReturn.qty;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"15mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","15mm",20,"退货单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(80,"15mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"0mm","15mm",20,"退货日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(100,"15mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_LINE(120,0,121,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"25mm","10mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].price);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,"退款金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(posi+10,"25mm","10mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	let position2 = posi+30;
	// if(saleInfoAll.odOrder.cardAmount){
	// 	LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"本次积分");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	// 	LODOP.ADD_PRINT_TEXT(position2,"20mm","20mm",20,"500分");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	// 	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	// 	position2 = position2+20;
	// }

	LODOP.ADD_PRINT_BARCODE(position2,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+100,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+120,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

//打印销售订单
export function getSaleOrderInfo(message,size){
	if(size == "80"){
		printSaleOrder(message);
	}else{
		printSaleOrderSmall(message);
	}
}

function printSaleOrder(message){
	console.log(message);
	let saleInfoAll = message;
	console.log(saleInfoAll);
	console.log(saleInfoAll.odOrder);
	var moneyInfo = saleInfoAll.orderDetails;
	//缺少门店打印名称字段
	// var shopName = message.odOrder
	var orderNo = saleInfoAll.odOrder.orderNo;
	var saleTime = saleInfoAll.odOrder.saleTime;
	var totalPay = saleInfoAll.odOrder.amount;
	var totalqty = saleInfoAll.odOrder.qty;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,800,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"25mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"70mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"70mm",2,0);

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

	LODOP.ADD_PRINT_LINE(120,0,121,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","35mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(130,"50mm","20mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		LODOP.ADD_PRINT_TEXT(posi,"0mm","70mm",20+(lineCount-1)*12,moneyInfo[i].name);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"50mm","20mm",20,moneyInfo[i].price);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","35mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	LODOP.ADD_PRINT_TEXT(posi+10,"50mm","20mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

	let position2 = posi+30;
	if(saleInfoAll.odOrder.cardAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","20mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"20mm","20mm",20,"500分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}

	LODOP.ADD_PRINT_BARCODE(position2,"25mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+100,0,"70mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+120,0,"70mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"70mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
}

function printSaleOrderSmall(message){
	let saleInfoAll = message;
	console.log(saleInfoAll);
	console.log(saleInfoAll.odOrder);
	var moneyInfo = saleInfoAll.orderDetails;
	//缺少门店打印名称字段
	// var shopName = message.odOrder
	var orderNo = saleInfoAll.odOrder.orderNo;
	var saleTime = saleInfoAll.odOrder.saleTime;
	var totalPay = saleInfoAll.odOrder.amount;
	var totalqty = saleInfoAll.odOrder.qty;

	LODOP=getLodop();
	LODOP.PRINT_INIT('打印'+new Date());
	LODOP.SET_PRINT_PAGESIZE(3,580,40,"");

	LODOP.ADD_PRINT_IMAGE(0,"15mm",97,26,"<img border='0' src="+imgSrc+"/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);

	LODOP.ADD_PRINT_TEXT(40,0,"50mm",27,"朝阳soho门店");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_LINE(70,0,71,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(80,"0mm","15mm",20,"销售单号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(80,"15mm","50mm",20,orderNo);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(100,"0mm","15mm",20,"销售日期");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(100,"15mm","50mm",20,saleTime);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_LINE(120,0,121,"50mm",2,0);

	LODOP.ADD_PRINT_TEXT(130,"0mm","25mm",20,"商品");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(130,"25mm","10mm",20,"数量");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(130,"35mm","15mm",20,"金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	//70mm 1mm=3.78px
	var lineWidth = 70*3.78;
	//8pt=11px

	var infoLen;
	var lineCount;
	var posi = 150;
	for(var i=0;i<moneyInfo.length;i++){
		infoLen = moneyInfo[i].name.length*11;
		lineCount = Math.ceil(infoLen/lineWidth);

		LODOP.ADD_PRINT_TEXT(posi,"0mm","50mm",20+(lineCount-1)*12,moneyInfo[i].name);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"25mm","10mm",20,moneyInfo[i].qty);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		LODOP.ADD_PRINT_TEXT(posi+20+(lineCount-1)*12,"35mm","15mm",20,moneyInfo[i].price);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

		posi = posi+40+(lineCount-1)*12;
		console.log(posi);
	};
	
	LODOP.ADD_PRINT_LINE(posi,0,posi+1,"70mm",2,0);

	LODOP.ADD_PRINT_TEXT(posi+10,"0mm","25mm",20,"实付金额");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(posi+10,"25mm","10mm",20,totalqty);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	LODOP.ADD_PRINT_TEXT(posi+10,"35mm","15mm",20,totalPay);
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);

	let position2 = posi+30;
	if(saleInfoAll.odOrder.cardAmount){
		LODOP.ADD_PRINT_TEXT(position2,"0mm","15mm",20,"本次积分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);

		LODOP.ADD_PRINT_TEXT(position2,"15mm","35mm",20,"500分");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		position2 = position2+20;
	}

	LODOP.ADD_PRINT_BARCODE(position2,"15mm",100,100,"QRCode","http://weixin.qq.com/r/wkgRCTjEM2VMrXxq9x3Q");

	LODOP.ADD_PRINT_TEXT(position2+100,0,"50mm",20,"扫描关注Qtools官方微信公众号");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+120,0,"50mm",20,"官方投诉电话：400-7766-999");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	LODOP.ADD_PRINT_TEXT(position2+140,0,"50mm",20,"Qtools | 有温度的进口母婴品牌");
	LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

	// LODOP.PRINT_DESIGN();
	LODOP.PREVIEW();
	// LODOP.PRINT();
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

