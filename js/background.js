'use strict';

var SixDegrees = (function() {
	var init = function() {
		//
	};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	SixDegrees.init();
	console.log("Background is working...");
})(window, $);

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    var url = info.url || tab.url;
    if(url && (url.indexOf('http://mailhz.qiye.163.com/js6/') == 0))
        chrome.pageAction.show(tabId);
    else
        chrome.pageAction.hide(tabId);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	
})