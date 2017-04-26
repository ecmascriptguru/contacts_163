let Popup = (function() {
	let _exportButton = $("#btn_export"),

		onExport = function() {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					from: "popup",
					action: "get_data"
				}, function(response) {
					console.log(response);
				});
			})
		},

		init = function() {
			_exportButton.click(onExport);
		};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Popup.init();
})(window, $);