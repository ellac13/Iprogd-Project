phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi,Weather,$interval) {
    $scope.markers = Weather.getMarkers();
    $scope.weatherData = Weather.getWeatherData();
    $scope.map = Weather.getMap();
    $scope.activeWeatherData = Weather.getActiveWeatherData();

    $scope.status = "Loading map...";

    $interval(function(){
        $scope.markers = Weather.getMarkers();
    }, 100);

    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.status = "";

        for(var i = 0; i < $scope.weatherData.length; i++){
            var markerData = [$scope.weatherData[i][0], $scope.weatherData[i][1], $scope.weatherData[i][2], $scope.weatherData[i][3]]
            //Weather.addMarker(markerData);
        }
  
    }, function(){$scope.status = "Error loading map"});
});