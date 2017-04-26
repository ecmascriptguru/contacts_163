let Popup = (function() {
	let _exportButton = $("#btn_export"),

		onExport = function(event) {
			event.preventDefault();
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					from: "popup",
					action: "get_data"
				}, function(response) {
					downloadCSV(response.data);
				});
			})
		},

		downloadCSV = function(rows) {
			var content = [['Name', 'Position', 'Company', 'Email', 'Phone', 'Rate', 'Relevant Experience']];

			for (var i = 0; i < rows.length; i ++) {
				var tempRow = [
					rows[i].name || "",
					rows[i].position || "",
					rows[i].company || "",
					rows[i].email || "",
					rows[i].phone || "",
					rows[i].rate || "",
					rows[i].relevant_experience || ""
				]
				content.push(tempRow);
			}

			var finalVal = '';

			for (var i = 0; i < content.length; i++) {
				var value = content[i];

				for (var j = 0; j < value.length; j++) {
					var innerValue =  value[j]===null?'':value[j].toString();
					var result = innerValue.replace(/"/g, '""');
					if (result.search(/("|,|\n)/g) >= 0)
						result = '"' + result + '"';
					if (j > 0)
						finalVal += ',';
					finalVal += result;
				}

				finalVal += '\n';
			}

			// console.log(finalVal);

			var pom = document.createElement('a');
			var blob = new Blob([finalVal],{type: 'text/csv;charset=utf-8;'});
			var url = URL.createObjectURL(blob);
			pom.href = url;
			pom.setAttribute('download', 'export.csv');
			pom.click();
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