phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi,Weather,$interval,$location) {
    Weather.setMap(
        {
            center: {
                latitude: 59.332469,
                longitude: 18.065134
                },
            zoom: 8,
            options:{
                streetViewControl: false,
                mapTypeControl: false,
                disableDoubleClickZoom: true
                },
            events: {
                dblclick: function(mapModel, eventName, originalEventArgs, $rootScope) {
                        var clickedLat = originalEventArgs[0].latLng.lat();
                        var clickedLon = originalEventArgs[0].latLng.lng();
                        Weather.updateLocationWithCoordinates(clickedLat, clickedLon, $scope);
                        var tempMap = Weather.getMap();
                        tempMap.zoom = 8;
                        Weather.setMap(tempMap);
                    }
                }
        }
    );

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