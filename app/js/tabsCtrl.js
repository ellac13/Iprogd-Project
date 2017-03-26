
phisancaApp.controller('TabsCtrl', function ($scope) {
	
	$scope.tabs = [{title: 'maps'}, {title: 'hourly'}, {title: 'daily'}];
	
	$scope.tab = 0;

	$scope.setTab = function (tabId) {
		$scope.tab = tabId;
	};

	$scope.isSet = function (tabId) {
		for(var i = 0; i < $scope.tabs.length; i++){
			if(tabId === $scope.tab){	
				return $scope.tabs[tabId];
			}
		}
	};
});