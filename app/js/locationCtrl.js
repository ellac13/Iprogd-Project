phisancaApp.controller('LocationCtrl', function ($scope,$location,Weather) {

	//Current query
	$scope.searchQuery = "";

	//Currently displayed locations
	$scope.favouriteLocations = Weather.getUserFavouriteLocations();
	$scope.popularLocations = Weather.getPopularLocations();
	$scope.recentLocations = Weather.getRecentSearches();

	$scope.user = Weather.getUser();


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

	$scope.isLoggedIn = function(){
		if (Weather.getUser()) {
			return true;
		}else{
			return false;
		}
	}

	$scope.dropOnFavourite = function(e, ui){
		//console.log('dropOnFavourite');
		//console.log(e);
		//console.log(ui.draggable["0"].innerText);
		var address = ui.draggable["0"].innerText;
		$scope.toggleFavourite(address);
	}

	$scope.dropOnSearch = function(e, ui){
		//console.log('dropOnSearch');
		//console.log(e);
		//console.log(ui.draggable["0"].innerText);
		var address = ui.draggable["0"].innerText;
		$location.url('/?search=' + address);
	}

});