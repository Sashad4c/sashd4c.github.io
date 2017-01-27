// MT Banner Fullscreen v.5.0

function _MT_RichMediaFs(o)
{
	// Ссылка с баннера
	var link = o.link;
	
	// Путь ко всем материалам
	var _MT_assetsPath = o.assetsPath;
	
	// Задержка перед возможностью закрытия
	var _MT_closeDelay = o.closeDelay;
	
	// Задержка перед показом баннера
	var _MT_openDelay = o.openDelay;

	// Задержка перед активацией клика
	var _MT_clickDelay = o.clickDelay;
	
	// Отключение звука по умолчанию
	var _MT_muted = o.muted;


	// Добавляем основной контейнер
	var parentElem = document.body;
	var htmlCont = document.createElement('div');
	htmlCont.id = o.bannerFsId;

	parentElem.insertBefore(htmlCont, parentElem.firstChild);
	
	var elem = document.getElementById(o.bannerFsId);

	// Добавляем стили к основному контейнеру
	//elem.style.display = "none";
	elem.style.position = "fixed";
	//elem.style.visibility = "hidden";
	elem.style.opacity = 0;
	
	elem.style.width = "100%";
	elem.style.height = "100%";
	elem.style.background = "#000";
	elem.style.zIndex = "10000000";

	var htmlStr = "\
	<a href='javascript://' class='mt-fs-close' style='background-image: url("+_MT_assetsPath+"close.png)'></a>\
	<div class='mt-fs-1' style='background-image: url("+_MT_assetsPath+"bg.jpg)'></div>\
	<div class='mt-fs-2' style='background-image: url("+_MT_assetsPath+"logo.png)'></div>\
	<a href='javascript://' class='mt-fs-button' style='background-image: url("+_MT_assetsPath+"btn.png)'></a>\
	<a href='javascript://' class='mt-fs-click'></a>\
	<div class='mt-fs-vblock'>\
		<a href='javascript://' class='mt-fs-click-2'></a>\
		<div class='mt-fs-vc'>\
			<div class='mt-fs-mute'></div>\
			<div class='mt-fs-msg'></div>\
			<a href='javascript://' class='mt-fs-play' style='background-image: url("+_MT_assetsPath+"0.gif)'></a>\
			<video class='mt-fs-video' id='mtv1' src='"+_MT_assetsPath+"video.mp4' poster='"+_MT_assetsPath+"poster.jpg' webkit-playsinline='webkit-playsinline'></video>\
		</div>\
	</div>\
	"
	var closeBtn, clickBtn, clickBtn2, btn, closeBtnWidth, closeBtnHeight, sizesArray, scrollPos, bannerH, bannerW;
	var creativeStarted = false;

	var mobile = device.mobile();
	var tablet = device.tablet();

	//Запуск баннера
	setTimeout(function() {
		init();
	}, _MT_openDelay);

	var video, videoContainer, videoPlayBtn, videoBlock, videoMuteBtn, videoMsg;
	var videoWidth = 640;
	var videoHeight = 360;
	var videoProportion = videoWidth/videoHeight;
	var isRestart = 0;

	//Запуск баннера
	function init()
	{
		if (mobile==true || tablet==true) { bannerMode = "mobile"; } else { bannerMode = "desktop"; }

		switch (bannerMode) {
		  case "mobile":
			//initMobile();
			initDesktop();
			break
		  case "desktop":
			initDesktop();
			break
		  default:
			initDesktop();
		}
	}

	function initDesktop()
	{
		
		elem.innerHTML = htmlStr; 

		video = document.getElementById('mtv1');
		videoPlayBtn = elem.getElementsByClassName("mt-fs-play")[0];

		clickBtn = elem.getElementsByClassName("mt-fs-click")[0];
		clickBtn2 = elem.getElementsByClassName("mt-fs-click-2")[0];
		closeBtn = elem.getElementsByClassName("mt-fs-close")[0];
		btn = elem.getElementsByClassName("mt-fs-button")[0];
		
		videoBlock = elem.getElementsByClassName("mt-fs-vblock")[0];
		videoContainer = elem.getElementsByClassName("mt-fs-vc")[0];
		video = elem.getElementsByClassName('mt-fs-video')[0];
		videoMuteBtn = elem.getElementsByClassName("mt-fs-mute")[0];
		videoMsg = elem.getElementsByClassName("mt-fs-msg")[0];
		

		elem.style.display='block';
		closeBtn.style.display='none';
		

		//События	
		window.addEventListener("resize", getSizeElements, false);
		window.addEventListener("scroll", getSizeElements, false);
		window.addEventListener("orientationchange", getSizeElements, false);

		// Video Events
		video.addEventListener("ended", completeVideo, false);
		video.addEventListener("timeupdate", playProgress, false);
		videoPlayBtn.addEventListener("click", playVideo, false);

		setTimeout(function() {
			getSizeElements();
		}, 100);
		
		initVideo();
		addEvents();
		}

	var ss = _MT_getPageSizeCross();

	//Определение размеров элементов
	function getSizeElements()
	{
		ss = _MT_getPageSizeCross();
		sizesArray = _MT_getPageSize();

		//bannerW =  ss.winWidth;
		//bannerH =  ss.winHeight;
		
		bannerW =  sizesArray[2];
		bannerH =  sizesArray[3];

		setTimeout(function() {
			resizeElements();
		}, 100);
	}

	//Масштабирование
	function resizeElements()
	{
		elem.style.width = Math.ceil(bannerW)  + "px";
		elem.style.height = Math.ceil(bannerH) + "px";

		videoHeight = Math.floor(videoBlock.offsetHeight);
		videoWidth = Math.floor(videoHeight*videoProportion);
		
		videoContainer.style.height = videoHeight + "px";
		videoContainer.style.width =  videoWidth + "px";
		
		setTimeout(function() {
			alignElements();
		}, 100);
	}

	//Выравнивание
	function alignElements() {
		topPos = Math.ceil(ss.winScrollTop);	
		leftPos =  Math.ceil(ss.winScrollLeft);

		elem.style.left = leftPos + "px";
		elem.style.top = topPos + "px";
		videoContainer.style.left =  Math.ceil((videoBlock.offsetWidth/2)-(videoWidth/2)) + "px";
	}

	function addEvents() {
		document.body.addEventListener("click", showAndStart, false);
		document.body.addEventListener("scroll", showAndStart, false);
		document.body.addEventListener("touchstart", showAndStart, false);
		document.body.addEventListener("touchend", showAndStart, false);
	}
	
	function showAndStart() {
		if (creativeStarted==false)
		{
			creativeStarted=true;


			closeBtn.addEventListener("click", closeBanner, false);
			clickBtn && clickBtn.addEventListener("click",  goTo, false);
			clickBtn2 && clickBtn2.addEventListener("click",  goTo, false);
			btn && btn.addEventListener("click",  goTo, false);
			
			document.body.addEventListener("touchmove", disableScroll, false);

			document.body.removeEventListener("click", showAndStart, false);
			document.body.removeEventListener("scroll", showAndStart, false);
			document.body.removeEventListener("touchstart", showAndStart, false);
			document.body.removeEventListener("touchend", showAndStart, false);

			sendEvent('ready');

			elem.style.position = "absolute";
			elem.style.opacity = 1;
			clickBtn.style.zIndex = 100;
			
			document.body.style.overflow = 'hidden';
			
			if (_MT_muted == 0) 
			{
				muteVideo();
			} else
			{
				unmuteVideo();
			}
			
			playVideo();

			setTimeout(showCloseButton, _MT_closeDelay);
			setTimeout(activateClickButton, _MT_clickDelay);
		}
	}

	function showCloseButton()
	{
		closeBtn.style.display='block';
	}

	function activateClickButton()
	{
		btn.addEventListener("click",  goTo, false);
	}


	function endVideoMsg(count)
	{
		var vMsg = "До конца видео осталось: " + count;
		if (count<=0) {	vMsg=""	}
		videoMsg.innerHTML = vMsg; 
	}


	//Закрытие баннера
	function closeBanner()
	{
		closeBtn && closeBtn.removeEventListener("click", closeBanner, false);
		clickBtn && clickBtn.removeEventListener("click",  goTo, false);
		btn.removeEventListener("click",  goTo, false);

		window.removeEventListener("resize", getSizeElements, false);
		window.removeEventListener("scroll", getSizeElements, false);
		window.removeEventListener("orientationchange", getSizeElements, false);
		document.body.removeEventListener("touchmove", disableScroll, false);

		document.body.style.overflow = 'auto';

		if (elem) elem.parentNode.removeChild(elem);
		
		sendEvent('close');
	}

	//Переход по основной ссылке
	function goTo()
	{
		closeBtn && closeBtn.removeEventListener("click", closeBanner, false);
		clickBtn && clickBtn.removeEventListener("click",  goTo, false);
		clickBtn2 && clickBtn2.removeEventListener("click",  goTo, false);
		
		window.removeEventListener("resize", getSizeElements, false);
		window.removeEventListener("scroll", getSizeElements, false);
		window.removeEventListener("orientationchange", getSizeElements, false);
		document.body.removeEventListener("touchmove", disableScroll, false);
		
		document.body.style.overflow = 'auto';
		
		window.open(link);

		if (elem) elem.parentNode.removeChild(elem);
	}

	// Video Player
	var isQuarter, isHalf, isThreeQuarters, timePercent;
	
	function initVideo()
	{
		isQuarter = false;
		isHalf = false;
		isThreeQuarters = false;
		video.volume = 0.0;
		//video.volume = 0; //----
		videoPlayBtn.style.backgroundImage = "url("+_MT_assetsPath+"play.png)";
		videoPlayBtn.addEventListener("click", playVideo, false);
	}

	
	function playVideo()
	{
		//videoPlayBtn.removeEventListener("click", playVideo, false);
		videoPlayBtn.style.backgroundImage = "url("+_MT_assetsPath+"0.gif)";
		//videoPlayBtn.addEventListener("click", pauseVideo, false);
		
		video.play();
		if (isRestart==1)
		{
			sendEvent('replay');
			isRestart=2;
		}
	}
	
	function pauseVideo()
	{
		videoPlayBtn.removeEventListener("click", pauseVideo, false);
		videoPlayBtn.style.backgroundImage = "url("+_MT_assetsPath+"play.png)";
		videoPlayBtn.addEventListener("click", playVideo, false);
		video.pause();
	}

	function muteVideo()
	{
		videoMuteBtn.removeEventListener("click", muteVideo, false);
		videoMuteBtn.style.backgroundImage = "url("+_MT_assetsPath+"mute.png)";
		videoMuteBtn.addEventListener("click", unmuteVideo, false);
		video.muted = true;
		video.volume = 0.0;
	}
	
	function unmuteVideo()
	{
		videoMuteBtn.removeEventListener("click", unmuteVideo, false);
		videoMuteBtn.style.backgroundImage = "url("+_MT_assetsPath+"unmute.png)";
		videoMuteBtn.addEventListener("click", muteVideo, false);
		video.muted = false;
		video.volume = 0.9;
	}


	function completeVideo()
	{
		pauseVideo();
		isRestart++;
		sendEvent('complete');
	}

	function playProgress()
	{
		timePercent = Math.floor((video.currentTime / video.duration) * 100);

		var endCount =  Math.floor((video.duration - video.currentTime));

		if (timePercent >= 25) 
		{
			if (isQuarter == false)
			{
				sendEvent('quarter');
				isQuarter = true;
			}
			
		}
		if (timePercent >= 50)
		{
			if (isHalf == false)
			{
				sendEvent('half');
				isHalf = true;
			}
		}
		if (timePercent >= 75)
		{
			if (isThreeQuarters == false)
			{
				sendEvent('threequarters');
				isThreeQuarters = true;
			}
		}
		
		endVideoMsg(endCount)

		//console.log(timePercent);
		//videoProgressPlay.style.width = timePercent + "%";
	}

	function sendEvent(eventType)
	{
		o.statScript && eval(o.statScript.replace('{event}', eventType));
	}
	
	var disableScroll = function (e) {
		e.preventDefault();
	};

}

/*! device.js 0.1.57 */
(function(){var a,b,c,d,e,f,g,h,i;window.device={},b=window.document.documentElement,i=window.navigator.userAgent.toLowerCase(),device.ios=function(){return device.iphone()||device.ipod()||device.ipad()},device.iphone=function(){return c("iphone")},device.ipod=function(){return c("ipod")},device.ipad=function(){return c("ipad")},device.android=function(){return c("android")},device.androidPhone=function(){return device.android()&&c("mobile")},device.androidTablet=function(){return device.android()&&!c("mobile")},device.blackberry=function(){return c("blackberry")||c("bb10")||c("rim")},device.blackberryPhone=function(){return device.blackberry()&&!c("tablet")},device.blackberryTablet=function(){return device.blackberry()&&c("tablet")},device.windows=function(){return c("windows")},device.windowsPhone=function(){return device.windows()&&c("phone")},device.windowsTablet=function(){return device.windows()&&c("touch")},device.fxos=function(){return c("(mobile; rv:")||c("(tablet; rv:")},device.fxosPhone=function(){return device.fxos()&&c("mobile")},device.fxosTablet=function(){return device.fxos()&&c("tablet")},device.mobile=function(){return device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()||device.fxosPhone()},device.tablet=function(){return device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()||device.fxosTablet()},device.portrait=function(){return 90!==Math.abs(window.orientation)},device.landscape=function(){return 90===Math.abs(window.orientation)},c=function(a){return-1!==i.indexOf(a)},e=function(a){var c;return c=new RegExp(a,"i"),b.className.match(c)},a=function(a){return e(a)?void 0:b.className+=" "+a},g=function(a){return e(a)?b.className=b.className.replace(a,""):void 0},device.ios()?device.ipad()?a("ios ipad tablet"):device.iphone()?a("ios iphone mobile"):device.ipod()&&a("ios ipod mobile"):device.android()?device.androidTablet()?a("android tablet"):a("android mobile"):device.blackberry()?device.blackberryTablet()?a("blackberry tablet"):a("blackberry mobile"):device.windows()?device.windowsTablet()?a("windows tablet"):device.windowsPhone()?a("windows mobile"):a("desktop"):device.fxos()?device.fxosTablet()?a("fxos tablet"):a("fxos mobile"):a("desktop"),d=function(){return device.landscape()?(g("portrait"),a("landscape")):(g("landscape"),a("portrait"))},h="onorientationchange"in window,f=h?"orientationchange":"resize",window.addEventListener?window.addEventListener(f,d,!1):window.attachEvent?window.attachEvent(f,d):window[f]=d,d()}).call(this);

// Определение размера окна
function _MT_getPageSize(){
	var xScroll, yScroll, pageWidth, pageHeight, windowWidth, windowHeight;

	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
		xScroll = document.documentElement.scrollWidth;
		yScroll = document.documentElement.scrollHeight;
	} else { // Explorer Mac, Mozilla, Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	if (self.innerHeight) { // Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // страрые Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	
	// для небольших страниц с общей высотой менее высоты окна просмотра
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else {
		pageHeight = yScroll;
	}
	
	// для небольших страниц с общей шириной менее ширины окна просмотра
	if(xScroll < windowWidth){
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}
	
	return [pageWidth,pageHeight,windowWidth,windowHeight,xScroll,yScroll];
}

function _MT_getPageSizeCross(){
	var w=document.documentElement; var d=document.body;
	var tww = document.compatMode=='CSS1Compat' && !window.opera?w.clientWidth:d.clientWidth;
	var twh = document.compatMode=='CSS1Compat' && !window.opera?w.clientHeight:d.clientHeight;
	var sl = (window.scrollX)?window.scrollX:(w.scrollLeft)?w.scrollLeft:d.scrollLeft;
    var st = (window.scrollY)?window.scrollY:(w.scrollTop)?w.scrollTop:d.scrollTop;
	var wW1 = (window.innerHeight && window.scrollMaxY)?d.scrollWidth:(d.scrollHeight > d.offsetHeight)?d.scrollWidth:(w && w.scrollHeight > w.offsetHeight)?w.scrollWidth:d.offsetWidth;
	var wH1 = (window.innerHeight && window.scrollMaxY)?d.scrollHeight:(d.scrollHeight > d.offsetHeight)?d.scrollHeight:(w && w.scrollHeight > w.offsetHeight)?w.scrollHeight:d.offsetHeight;
	var wW2 = (self.innerHeight)?self.innerWidth:(w && w.clientHeight)?w.clientWidth:d.clientWidth; var pW = (wW1 < wW2)?wW2:wW1;
	var wH2 = (self.innerHeight)?self.innerHeight:(w && w.clientHeight)?w.clientHeight:d.clientHeight; var pH = (wH1 < wH2)?wH2:wH1;
	pW = (!-[1,])?pW:Math.max(w.scrollWidth, w.clientWidth, d.scrollWidth, d.offsetWidth);
	pH = (!-[1,])?pH:Math.max(w.scrollHeight, w.clientHeight, d.scrollHeight, d.offsetHeight);
	if (window.opera){ tww = (d.scrollWidth==d.clientWidth)?w.clientWidth:tww; twh = (d.scrollHeight==d.clientHeight)?w.clientHeight:twh;}
	return { 
		winWidth:tww, 
		winHeight: twh, 
		winScrollLeft: sl, 
		winScrollTop: st, 
		pageWidth: pW, 
		pageHeight: pH
	} 
}