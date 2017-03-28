phisancaApp.controller('pageOpenCtrl', function ($scope,$routeParams,Weather,uiGmapGoogleMapApi) {

	var validCoordinates = function(lat, lng){
		if (isNaN(lat) || isNaN(lng)) {
			return false;
		}else if (lat < -90 || lat > 90) {
			return false;
		}else if (lng < -180 || lng > 180) {
			return false;
		};
		return true;
	}

	uiGmapGoogleMapApi.then(function(){  	

		if ($routeParams.lat && $routeParams.lng && validCoordinates($routeParams.lat, $routeParams.lng)) {
			//Specific coordinates were specified
			Weather.updateLocationWithCoordinates(parseFloat($routeParams.lat), parseFloat($routeParams.lng), $scope);
		}else if($routeParams.search){
			//Specific search term was specified
			Weather.updateLocationWithAddress($routeParams.search, $scope);
		}else if ("geolocation" in navigator) {
			// Get current location coordinates if supported by browser
			// otherwise default to kth borggården
	    	// Get gurrent position / prompt for access
	        navigator.geolocation.getCurrentPosition(function(position) {
	            Weather.updateLocationWithCoordinates(position.coords.latitude, position.coords.longitude, $scope);
	        }, function(error){
	        	Weather.updateLocationWithCoordinates(59.347361, 18.073711, $scope);	
	        });
	    } else {
	    	//Default to kth borggården
	        Weather.updateLocationWithCoordinates(59.347361, 18.073711, $scope);
	    }

    });

});