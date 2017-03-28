phisancaApp.controller('LocationCtrl', function ($scope,$location,Weather) {

	//Current query
	$scope.searchQuery = "";

	//Currently displayed locations
	$scope.favouriteLocations = Weather.getUserFavouriteLocations();
	$scope.popularLocations = Weather.getPopularLocations();
	$scope.recentLocations = Weather.getRecentSearches();


	$scope.testGeo = function() {
		Weather.testGeolocation();
	}

	$scope.toggleFavourite = function(address){
		//alert("favourited");
		//console.log($event.currentTarget);
		//var address = $event.currentTarget.parentElement.parentElement.children[1].textContent
		//console.log(address);
		Weather.toggleFavouriteLocation(address);
	}


	$scope.search = function(query){
		//alert("Search with query: " + query);
		//console.log($event.currentTarget);
		$location.url('/?search=' + query);
		//Weather.updateLocationWithAddress(query, $scope);
	}

});