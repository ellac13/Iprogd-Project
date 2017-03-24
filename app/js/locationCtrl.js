phisancaApp.controller('LocationCtrl', function ($scope,Weather) {

	$scope.searchQuery = "";

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


	$scope.search = function(query){
		//alert("Search with query: " + query);
		//console.log($event.currentTarget);
	}


});