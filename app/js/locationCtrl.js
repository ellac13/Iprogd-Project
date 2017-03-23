phisancaApp.controller('LocationCtrl', function ($scope,Weather) {

	$scope.testGeo = function() {
		Weather.testGeolocation();
	}

	$scope.favourite = function($event){
		//alert("favorited");
		//console.log($event.currentTarget);
	}


});