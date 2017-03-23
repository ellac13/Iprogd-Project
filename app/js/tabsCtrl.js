
phisancaApp.controller('TabsCtrl', function ($scope) {
	this.tab = 1;

	this.setTab = function (tabId) {
		this.tab = tabId;
	};

	this.isSet = function (tabId) {
		return this.tab === tabId;
	};
});