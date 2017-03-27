phisancaApp.controller('LocationCtrl', function ($scope,Weather) {

	//Current query
	$scope.searchQuery = "";

	//Currently displayed locations
	$scope.favouriteLocations = Weather.getUserFavouriteLocations();
	$scope.popularLocations = Weather.getPopularLocations();
	$scope.recentLocations = Weather.getRecentSearches();


	$scope.testGeo = function() {
		Weather.testGeolocation();
	}

	$scope.favourite = function($event){
		//alert("favourited");
		//console.log($event.currentTarget);
		var address = $event.currentTarget.parentElement.parentElement.children[1].textContent
		//console.log(address);
		Weather.addFavouriteLocation(address);
	}

	$scope.unfavourite = function($event){
		//alert("unfavourited");
		//console.log($event.currentTarget);
		var address = $event.currentTarget.parentElement.parentElement.children[1].textContent
		//console.log(address);
		Weather.removeFavouriteLocation(address);
	}


	$scope.search = function(query){
		//alert("Search with query: " + query);
		//console.log($event.currentTarget);
		Weather.searchWeatherWithAddress(query, $scope);
	}


});