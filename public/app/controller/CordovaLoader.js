
Ext.define('testing.controller.CordovaLoader', {
    extend: 'Ext.app.Controller',
	launch: function() {
	   this.removeJsFile('cordova');
	   var head= document.getElementsByTagName('head')[0];
	   var script= document.createElement('script');
	   script.type= 'text/javascript';
	   script.src= Ext.os.is('Android') ? 'cordova-2.1.0.js' : 'cordova_2_4_0_ios.js';
	   var app = this.getApplication();
	   script.onreadystatechange= function () {
	      if (this.readyState == 'complete') {
	      	app.fireEvent('cordovaLoaded');
	      }
	   }
  	   script.onload= function() {
      		app.fireEvent('cordovaLoaded');
  	   }
	   head.appendChild(script);
	},
	
	removeJsFile: function(filename){
		 var targetelement = "script";
		 var targetattr= "src";
		 var allsuspects=document.getElementsByTagName(targetelement);
		 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
		   if (allsuspects[i] === undefined) {
		   	continue;
		   }
		   if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
		   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
		 }
	}
});