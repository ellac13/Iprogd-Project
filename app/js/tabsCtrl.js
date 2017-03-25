
phisancaApp.controller('TabsCtrl', function ($scope) {
	$scope.tab = 1;

	$scope.setTab = function (tabId) {
		$scope.tab = tabId;
	};

	$scope.isSet = function (tabId) {
		return $scope.tab === tabId;
	};
});