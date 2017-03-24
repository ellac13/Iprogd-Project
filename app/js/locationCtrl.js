phisancaApp.controller('LocationCtrl', function ($scope,Weather) {

	$scope.favouriteLocations = ["Stockholm", "Nyköping"];
	$scope.popularLocations = ["Göteborg", "Malmö"];
	$scope.recentLocations = ["Boden", "Jönköping"];


	$scope.testGeo = function() {
		Weather.testGeolocation();
	}

	$scope.favourite = function($event){
		//alert("favourited");
		//console.log($event.currentTarget);
	}

	$scope.unfavourite = function($event){
		//alert("unfavourited");
		//console.log($event.currentTarget);
	}


});