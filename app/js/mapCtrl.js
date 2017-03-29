phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi,Weather,$interval) {
    $scope.markers = Weather.getMarkers();
    $scope.map = Weather.getMap();
    $scope.activeWeatherData = Weather.getActiveWeatherData();

    $scope.status = "Loading map...";

    $interval(function(){
        $scope.markers = Weather.getMarkers();
    }, 100);

    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.status = "";

        
  
    }, function(){$scope.status = "Error loading map"});
});