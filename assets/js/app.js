function responsiveActions(){var t=Helper.getMediaQuery(),a=DarkSection.slantHeight,o="-"+a;"large"===t||"xlarge"===t?($("#about-us").css({"padding-top":a+"px","padding-bottom":"0","margin-top":o+"px","margin-bottom":"0"}),$("footer .slant-outer").css({"margin-bottom":o+"px"}),$("footer .footer-logo").attr("src","/assets/imgs/hbgi_logo_white.svg"),$("main.site-inner").css({"padding-bottom":a+"px","margin-bottom":o+"px"})):($("#about-us").css({"padding-top":a+"px","padding-bottom":a+"px","margin-top":o+"px","margin-bottom":o+"px"}),$("footer .footer-logo").attr("src","/assets/imgs/hbgi_logo.svg"))}var Debug={isDebug:!0,"function":function(t,a){this.isDebug&&("undefined"===a?console.log(t+" has been called. Function has no return"):console.log(t+" has been called. Returned: "+a))},value:function(t,a){if(this.isDebug){console.log("Within "+t+":");for(var o in a)console.log(o,"is: ",a[o])}}},Helper={toRadians:function(t){var a=t*Math.PI/180;return a},getMediaQuery:function(){var t=$(window).width()/parseFloat($("html").css("font-size"));console.log("value for check is:",t);var a=0,o=["small","medium","large","xlarge"];t>40&&a++,t>60&&a++,t>90&&a++,console.log("value of i is:",a);var n=o[a];return n}},DarkSection={config:{rotationRatio:.375,minRotation:8,maxRotation:18,minWidth:320,maxWidth:1440},rotation:{},numWrappers:0,slantHeight:"",init:function(){var t=$(window).width();this.addClassesToHTML(),this.injectWrappersToHTML(),this.setRotations(t),this.setPaddings(t)},onResize:function(){var t=$(window).width();DarkSection.addClassesToHTML(),DarkSection.removeWrappersfromHTML(),DarkSection.injectWrappersToHTML(),DarkSection.setRotations(t),DarkSection.setPaddings(t)},addClassesToHTML:function(){var t=Helper.getMediaQuery();$("[data-darksection]").addClass("dark"),"small"===t&&($('[data-darksection="medium-down"]').addClass("dark").removeClass("dark-off"),$('[data-darksection="large-up"]').addClass("dark-off").removeClass("dark")),"medium"===t&&($('[data-darksection="medium-down"]').addClass("dark").removeClass("dark-off"),$('[data-darksection="large-up"]').addClass("dark-off").removeClass("dark")),"large"===t&&($('[data-darksection="medium-down"]').addClass("dark-off").removeClass("dark"),$('[data-darksection="large-up"]').addClass("dark").removeClass("dark-off")),"xlarge"===t&&($('[data-darksection="medium-down"]').addClass("dark-off").removeClass("dark"),$('[data-darksection="large-up"]').addClass("dark").removeClass("dark-off"))},injectWrappersToHTML:function(){$(".dark:has(.content)")&&($(".dark").not(":has(.slant-wrapper)").children(".content").wrap(function(t){DarkSection.numWrappers++;var a=DarkSection.numWrappers,o=['<div class="slant-wrapper" data-slantwrapper="'+a+'">','<div class="slant-outer">','<div class="slant-inner">','<div class="content-wrapper">',"</div></div></div></div>"],n=o.join("");return n}),Debug["function"]("addWrappersToHTML",this.numWrappers))},removeWrappersfromHTML:function(){$(".dark-off");$(".dark-off:has(.slant-wrapper .slant-outer .slant-inner .content-wrapper)").not(".dark")&&$(".dark-off:has(.slant-wrapper .slant-outer .slant-inner .content-wrapper) .content").unwrap().unwrap().unwrap().unwrap()},modifyHTML:function(){this.addClassesToHTML()},getRotation:function(t){var a,o=(this.config.maxRotation-this.config.minRotation)/(this.config.maxWidth-this.config.minWidth);a=t<=this.config.minWidth?this.config.maxRotation:t>=this.config.maxWidth?this.config.minRotation:this.config.maxRotation-(t-this.config.minWidth)*o;var n=Helper.toRadians(a);this.rotation={outer:a,outerRadian:n,inner:a*this.config.rotationRatio,content:a-a*this.config.rotationRatio}},getOuterSlantPadding:function(t){var a=this.rotation.outer,o=a-a*(1-this.config.rotationRatio),n=this.rotation.outerRadian,i=Helper.toRadians(o),r=Math.tan(i)*(Math.cos(n)*(t/2));return r},getOuterSlantWidth:function(t,a){var o=this.rotation.outerRadian,n=Math.cos(o)*t,i=Math.cos(o)*(Math.sin(o)*a),r=n+i+i;return Debug.value("getOuterSlantWidth",{visibleWidth:n,widthToAdd:i,trueWidth:r}),r},getSectionPadding:function(t,a){var o=this.rotation.outerRadian,n=this.getOuterSlantWidth(t,a),i=n*Math.sin(o),r=i+a*Math.cos(o),e=(r-a)/2;return this.slantHeight=i,e},setRotations:function(t){this.getRotation(t);var a=this.rotation;$(".slant-outer").css("transform","rotate("+a.outer+"deg)"),$(".slant-inner").css("transform","rotate(-"+a.inner+"deg)"),$(".content-wrapper").css("transform","rotate(-"+a.content+"deg)")},setPaddings:function(t){var a=this.getOuterSlantPadding(t);$(".slant-outer").css({"padding-top":a,"padding-bottom":a});for(var o=0;o<this.numWrappers;o++){var n=o+1,i='[data-slantwrapper="'+n+'"]',r=$(i).height(),e=this.getSectionPadding(t,r);$(i).css({"padding-top":e,"padding-bottom":e})}}};$(document).ready(function(){DarkSection.init(),responsiveActions();var t=$(window).width();$(window).resize(function(){$(window).width()!=t&&(t=$(window).width(),DarkSection.onResize(),responsiveActions())})});
//# sourceMappingURL=app.js.map
