phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi, Weather) {
    $scope.markers = Weather.getMarkers();
    $scope.weatherData = Weather.getWeatherData();
    $scope.map = Weather.getMap();

    $scope.status = "Loading map...";

    $scope.addMarker = function(markerData) {
        Weather.addMarker(markerData);
    }
    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.status = "";

        for(var i = 0; i < $scope.weatherData.length; i++){
            var markerData = [$scope.weatherData[i][0], $scope.weatherData[i][1], $scope.weatherData[i][2], $scope.weatherData[i][3]]
            Weather.addMarker(markerData);
        }
  
    }, function(){$scope.status = "Error loading map"});
});