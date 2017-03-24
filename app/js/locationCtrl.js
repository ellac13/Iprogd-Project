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