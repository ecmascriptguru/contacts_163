'use strict';

let ContentScript = (function() {
	let _data = [],

		extractCompany = function(text) {
			let tempSegs = text.split("-"),
				info = tempSegs.slice(1, tempSegs.length).join("-"),
				result = {};

			info = info.trim();
			if (info.indexOf(" at ") > -1 && info.split(" at ").length > 1) {
				result = {
					company: info.split(" at ")[1].trim(),
					position: info.split(" at ")[0].trim()
				}
			} else {
				let segs = info.split(" ");
				result.position = (segs[0] + " " + segs.slice(2, segs.length).join(" ")).trim();
				result.company = segs[1];
			}

			return result;
		},

		exportData = function() {
			let _iframes = $("iframe"),
				_emailBody = null;
			for (let i = 0; i < _iframes.length; i ++) {
				let _parentDiv = _iframes.eq(i).parents(".vC0.frame-main");
				if (_parentDiv.css("display") == "block") {
					_emailBody = $($("iframe")[i].contentDocument).children().find("body > div");
				}
			}

			if (!_emailBody) {
				return false;
			}

			let _tables = _emailBody.find("table"),
				_tempValue = {},
				_flag = null;

			_data = [];

			for (let i = 0; i < _tables.length; i++) {
				let curTable = $(_tables[i])

				if (_flag != "company" && curTable.text().indexOf("#") == 0) {
					if (_flag) {
						_data.push(_tempValue);
					}
					_tempValue = extractCompany(curTable.text());
					_flag = "company";
				} else if(_flag == "company") {
					let $records = curTable.find("tr");
					for(let j = 0; j < $records.length; j++) {
						let $cols = $records.eq(j).find("td"),
							key = $cols.eq(0).text().trim(),
							val = $cols.eq(2).text().trim();

						if (key.indexOf(":") > -1) {
							key = key.split(":")[0].trim();
						}

						if (val.indexOf("+") == 0) {
							val = val.split("+")[1].trim();
						}
							
						_tempValue[key.toLowerCase()] = val;
					}
					_flag = "contacts";
				} else if(_flag == "contacts") {
					let $records = curTable.find("tr"),
						_tempRE = [];

					for (let j = 0; j < $records.length; j ++) {
						_tempRE.push($records.eq(j).text().trim());
					}
					_tempValue.relevant_experience = _tempRE.join("\n");
					_flag = "RE";
				}
			}

			if (_tempValue.name) {
				_data.push(_tempValue);
			}

			return _data;
		},
		init = function() {
			chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
				sendResponse({
					data: exportData()
				});
			});
		};
		
	return {
		init: init
	};
})();

(function(window, jQuery) {
	ContentScript.init();
})(window, $);